import importlib.util
import json
from datetime import datetime
from pathlib import Path
from unittest.mock import patch
from zoneinfo import ZoneInfo
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("publisher", ROOT / "scripts/collegiate_seo_autopublish.py")
p = importlib.util.module_from_spec(spec)
spec.loader.exec_module(p)


def owned(src, shot, alt="Owned activation photograph", ban="", sales=False):
    lines = [
        f"## {src}",
        "",
        f"- Local asset: `{src}`",
        "- Rights: owned. Photographed at our own activation.",
        f"- Shot: {shot}",
        f"- Suggested alt: {alt}",
    ]
    if ban:
        lines.append(f"- Caption ban: {ban}")
    if sales:
        lines.append("- Sales pages: forbidden")
    return "\n".join(lines)


class PhotoRuleTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(self.id().split(".")[-1])
        # Each test uses a private directory under the system temp via TemporaryDirectory.
        import tempfile
        self.dir = tempfile.TemporaryDirectory()
        self.root = Path(self.dir.name)
        self.addCleanup(self.dir.cleanup)

    def write_photo(self, src):
        file = self.root / "public" / src.lstrip("/")
        file.parent.mkdir(parents=True, exist_ok=True)
        file.write_bytes(b"photo")

    def library(self):
        return "\n\n".join([
            owned("/images/blog/crowd.jpg", "crowd, product", ban="staff, ambassador, rep"),
            owned("/images/blog/setup.jpg", "setup", alt="Staffed merchandise table"),
            owned("/images/blog/product.jpg", "product, crowd"),
            owned("/images/blog/premiere.jpg", "crowd, product", ban="staff, ambassador, rep", sales=True),
            owned("/images/blog/busy.jpg", "crowd, product"),
        ])

    def test_selector_prefers_least_used_and_mixes_roles(self):
        uses = [{"slug": f"old-{i}", "src": "/images/blog/busy.jpg", "role": "hero"} for i in range(5)]
        uses.append({"slug": "old-setup", "src": "/images/blog/setup.jpg", "role": "hero"})
        chosen = p.select_article_photos(self.library(), uses, "campus-sampling-guide")
        srcs = {chosen["hero"], *(item["src"] for item in chosen["inline"])}
        self.assertEqual(len(srcs), 3)
        self.assertNotIn("/images/blog/busy.jpg", srcs)
        roles = {chosen["heroRole"], *(item["role"] for item in chosen["inline"])}
        self.assertEqual(roles, {"crowd", "setup", "product"})

    def test_premiere_stays_off_agency_sales_slugs(self):
        chosen = p.select_article_photos(self.library(), [], "college-marketing-agency")
        srcs = {chosen["hero"], *(item["src"] for item in chosen["inline"])}
        self.assertNotIn("/images/blog/premiere.jpg", srcs)
        editorial = p.select_article_photos(self.library(), [], "campus-influencers")
        # With an empty ledger the alphabetical least-used crowd photo may be the premiere.
        # It is legal on a non-sales slug, so the selector may use it.
        editorial_srcs = {editorial["hero"], *(item["src"] for item in editorial["inline"])}
        self.assertTrue(editorial_srcs)

    def test_inline_rules_reject_repeats_stock_staff_captions_and_missing_alt(self):
        for src in ("/images/blog/crowd.jpg", "/images/blog/setup.jpg", "/images/blog/product.jpg"):
            self.write_photo(src)
        library = self.library()
        data = {"slug": "campus-sampling-guide", "image": "/images/blog/product.jpg", "imageAlt": "Attendee holding a can"}
        body = "\n".join([
            "Intro paragraph about the sampling plan.",
            "",
            "![Attendees holding cans at the sampling table](/images/blog/crowd.jpg)",
            "Caption: Two attendees holding cans. They are attendees at the activation.",
            "",
            "![Merchandise laid out on the sampling table](/images/blog/setup.jpg)",
            "Caption: Giveaways laid out before the crowd arrives.",
        ])
        photos = p.validate_inline_photos(body, data, library, self.root)
        self.assertEqual(len(photos), 2)

        with self.assertRaisesRegex(ValueError, "inline-photo-repeat"):
            p.validate_inline_photos(body.replace("setup.jpg", "product.jpg"), data, library, self.root)
        with self.assertRaisesRegex(ValueError, "inline-photo-caption"):
            p.validate_inline_photos(body.replace("Attendees holding cans", "Staff holding cans"), data, library, self.root)
        with self.assertRaisesRegex(ValueError, "inline-photo-alt"):
            p.validate_inline_photos(body.replace("![Attendees holding cans at the sampling table]", "![]"), data, library, self.root)
        stock = library + "\n\n## stock\n\n- Local asset: `/images/blog/stock.jpg`\n- Source: https://unsplash.com/photos/example\n- License: https://unsplash.com/license\n"
        self.write_photo("/images/blog/stock.jpg")
        with self.assertRaisesRegex(ValueError, "inline-photo-owned"):
            p.validate_inline_photos(body.replace("crowd.jpg", "stock.jpg"), data, stock, self.root)
        with self.assertRaisesRegex(ValueError, "inline-photo-sales-page"):
            sales = dict(data, slug="college-marketing-agency", image="/images/blog/setup.jpg", imageAlt="Staffed merchandise table")
            self.write_photo("/images/blog/premiere.jpg")
            p.validate_inline_photos(body.replace("crowd.jpg", "premiere.jpg"), sales, library, self.root)

    def test_requirement_starts_at_the_october_cutoff(self):
        before = datetime(2026, 10, 25, 4, 29, tzinfo=ZoneInfo("America/New_York"))
        after = datetime(2026, 10, 25, 4, 30, tzinfo=ZoneInfo("America/New_York"))
        self.assertFalse(p.inline_photos_required(before))
        self.assertTrue(p.inline_photos_required(after))
        for src in ("/images/blog/crowd.jpg", "/images/blog/setup.jpg", "/images/blog/product.jpg"):
            self.write_photo(src)
        data = {"slug": "campus-sampling-guide", "image": "/images/blog/product.jpg", "imageAlt": "Attendee holding a can"}
        with patch.object(p, "inline_photos_required", return_value=True):
            with self.assertRaisesRegex(ValueError, "inline-photos-required"):
                p.validate_inline_photos("No photographs in this draft.", data, self.library(), self.root)

    def test_usage_cap_and_ledger_record_least_used_preference(self):
        for src in ("/images/blog/crowd.jpg", "/images/blog/setup.jpg", "/images/blog/product.jpg"):
            self.write_photo(src)
        uses = [{"slug": f"a-{i}", "src": "/images/blog/crowd.jpg", "role": "inline"} for i in range(7)]
        data = {"slug": "new-article", "image": "/images/blog/product.jpg", "imageAlt": "Attendee holding a can"}
        body = "\n".join([
            "![Attendees holding cans at the sampling table](/images/blog/crowd.jpg)",
            "Caption: Two attendees holding cans.",
            "",
            "![Merchandise laid out on the sampling table](/images/blog/setup.jpg)",
            "Caption: Giveaways laid out on the table.",
        ])
        ledger = self.root / "content/seo/photo-usage.json"
        ledger.parent.mkdir(parents=True)
        ledger.write_text(json.dumps({"uses": uses}))
        with self.assertRaisesRegex(ValueError, "inline-photo-usage-cap"):
            p.validate_inline_photos(body, data, self.library(), self.root)
        # Recording a publish replaces any earlier rows for the same slug.
        artifact = {"slug": "new-article", "image": "/images/blog/product.jpg", "inline_photos": [
            {"src": "/images/blog/setup.jpg", "alt": "table"},
        ]}
        p.record_photo_usage(self.root, artifact)
        recorded = json.loads(ledger.read_text())["uses"]
        self.assertIn({"slug": "new-article", "src": "/images/blog/product.jpg", "role": "hero"}, recorded)
        self.assertEqual(sum(item["slug"] == "new-article" for item in recorded), 2)

    def test_disallowed_stock_photo_cannot_be_a_hero(self):
        library = (ROOT / "content/seo/public-photo-library.md").read_text()
        data = {
            "slug": "campus-event-staffing-agency",
            "image": "/images/blog/campus-library-michael-marsh.jpg",
            "imageAlt": "Red-brick campus building behind a green lawn and trees",
        }
        with self.assertRaisesRegex(ValueError, "hero-photo-disallowed"):
            p.validate_inline_photos("A staffing guide with no inline figure.", data, library, ROOT)

    def test_every_published_article_has_two_inline_photos(self):
        library = (ROOT / "content/seo/public-photo-library.md").read_text()
        articles = sorted((ROOT / "content/blog").glob("*.mdx"))
        self.assertEqual(len(articles), 33)
        expected = []
        for path in articles:
            data, body = p.frontmatter(path)
            inline = p.validate_inline_photos(body, data, library, ROOT)
            self.assertEqual(len(inline), 2, data["slug"])
            self.assertTrue(all(item["alt"] and item["caption"] for item in inline), data["slug"])
            self.assertEqual(len({item["src"] for item in inline}), 2, data["slug"])
            expected.append({"slug": data["slug"], "src": data["image"], "role": "hero"})
            expected.extend({"slug": data["slug"], "src": item["src"], "role": "inline"} for item in inline)
        ledger = json.loads((ROOT / "content/seo/photo-usage.json").read_text())["uses"]
        self.assertEqual(ledger, sorted(expected, key=lambda item: (item["slug"], item["role"], item["src"])))

    def test_prompt_names_the_least_used_trio(self):
        library = self.root / "content/seo/public-photo-library.md"
        library.parent.mkdir(parents=True, exist_ok=True)
        (self.root / "content/seo").mkdir(parents=True, exist_ok=True)
        library.write_text(self.library())
        (self.root / "content/seo/photo-usage.json").write_text(json.dumps({"uses": [
            {"slug": "old", "src": "/images/blog/busy.jpg", "role": "hero"},
        ]}))
        text = p.photo_prompt_guidance(self.root)
        self.assertIn("least-used", text)
        self.assertIn("Preferred trio", text)
        self.assertNotIn("/images/blog/premiere.jpg", text.split("Preferred trio when the slug contains agency", 1)[1])


if __name__ == "__main__":
    unittest.main()
