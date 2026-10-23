import importlib.util
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHRASES = ROOT / "content/seo/banned-phrases.txt"
MAP = ROOT / "content/seo/keyword-map.md"

spec = importlib.util.spec_from_file_location("writing_quality", ROOT / "scripts/writing_quality.py")
wq = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wq)

pub_spec = importlib.util.spec_from_file_location("publisher_gates", ROOT / "scripts/collegiate_seo_autopublish.py")
pub = importlib.util.module_from_spec(pub_spec)
pub_spec.loader.exec_module(pub)


def brief(slug):
    table = (
        "| Signal | Result |\n"
        "| --- | --- |\n"
        "| GA4 sessions | |\n"
        f"| cta_click events (`?article={slug}`) | |\n"
        f"| generate_lead events (`?article={slug}`) | |\n"
        "| Search Console clicks | |\n"
        "| Search Console impressions | |\n"
    )
    return (
        "# Brief\n\n## Primary query\n\ncampus sampling for brands\n\n"
        "## Hypothesis\n\nThe page wins the click by answering the buying question first.\n\n"
        "## Target AI engines and prompts\n\nChatGPT: how should a brand sample on campus\n\n"
        "## Competitor pages\n\nhttps://example.com/campus-sampling\n\n"
        "## CTA path\n\n/build-a-campaign\n\n"
        "## Expected outcome\n\nA brand starts a campaign brief.\n\n"
        "## 30-day check\n\n" + table + "\n"
        "## 60-day check\n\n" + table
    )


class WritingQualityTests(unittest.TestCase):
    def setUp(self):
        self.phrases = wq.load_banned_phrases(PHRASES)

    def test_phrase_list_keeps_connectors_and_ai_cliches(self):
        folded = {phrase.casefold() for phrase in self.phrases}
        for allowed in ("however", "therefore", "additionally", "also", "because"):
            self.assertNotIn(allowed, folded)
        for banned in (
            "delve",
            "tapestry",
            "game-changer",
            "unlock the power",
            "in today's fast-paced",
            "navigate the landscape",
            "navigating the landscape",
        ):
            self.assertIn(banned, folded)

    def test_flags_banned_phrase_em_dash_and_long_opening(self):
        body = (
            "Delve into the plan — then keep going. Second sentence here. "
            "Third sentence here. Fourth sentence here.\n"
        )
        violations = wq.check_body(body, self.phrases)
        kinds = {item.kind for item in violations}
        self.assertIn("banned-phrase", kinds)
        self.assertIn("em-dash", kinds)
        self.assertIn("opening-length", kinds)
        message = wq.format_violations(violations)
        self.assertIn("writing-quality:", message)
        self.assertIn("delve", message.casefold())
        self.assertIn("em dash", message)

    def test_allows_connectors_code_and_urls(self):
        body = (
            "However, a brand should sample where students already are. "
            "Therefore the plan starts with the location, also because the calendar is short.\n\n"
            "Use `delve` only inside code, and skip https://example.com/delve-today/robust for the URL.\n\n"
            "The [sampling guide](https://example.com/game-changer) names the next step.\n"
        )
        self.assertEqual(wq.check_body(body, self.phrases), [])

    def test_flags_anchor_text_and_curly_apostrophe(self):
        body = "Start with the [delve](https://example.com/clean) note.\n\nIt\u2019s important to note the handoff.\n"
        terms = {item.term.casefold() for item in wq.check_body(body, self.phrases)}
        self.assertIn("delve", terms)
        self.assertIn("it's important to note", terms)

    def test_opening_of_three_sentences_passes(self):
        body = "One clear answer. Two supporting facts. Three is the limit.\n"
        self.assertEqual(wq.check_body(body, self.phrases), [])

    def test_frontmatter_em_dash_is_not_part_of_the_body(self):
        text = "---\nmetaDescription: A guide \u2014 with a dash\n---\n\nA short answer for the buyer.\n"
        self.assertEqual(wq.check_body(wq.split_frontmatter(text), self.phrases), [])

    def test_template_is_not_a_finished_brief(self):
        with self.assertRaisesRegex(ValueError, "brief-unfilled"):
            wq.assert_brief(ROOT / "content/seo/briefs/_template.md", "campus-pilot")

    def test_filled_brief_passes_and_missing_brief_fails(self):
        folder = ROOT / "content/seo/briefs"
        missing = folder / "does-not-exist.md"
        with self.assertRaisesRegex(ValueError, "missing-brief"):
            wq.assert_brief(missing, "does-not-exist")
        target = self._brief_path()
        self.assertIsNone(wq.assert_brief(target, "campus-pilot"))

    def _brief_path(self):
        import tempfile
        folder = Path(tempfile.mkdtemp())
        path = folder / "campus-pilot.md"
        path.write_text(brief("campus-pilot"))
        self.addCleanup(lambda: path.unlink(missing_ok=True))
        return path

    def test_report_mode_does_not_fail_existing_articles(self):
        self.assertEqual(wq.main(["--report", str(ROOT / "content/blog")]), 0)

    def test_prompt_requires_brief_and_writing_rules(self):
        from unittest.mock import patch
        with patch.object(pub.subprocess, "run") as run:
            pub.publish_with_hermes(30, ROOT)
        prompt = run.call_args.args[0][run.call_args.args[0].index("-q") + 1]
        self.assertIn("content/seo/briefs/", prompt)
        self.assertIn("writing-rules.md", prompt)
        self.assertIn("Reserved for pillar pages, never target", prompt)
        self.assertIn("Do not use stock", prompt)


class ReservedKeywordTests(unittest.TestCase):
    def setUp(self):
        self.terms = pub.reserved_keyword_terms(MAP.read_text())

    def test_seeded_terms_and_close_variations_are_rejected(self):
        for value in (
            "marketing to Gen Z",
            "Gen Z marketing strategy",
            "generation z marketing",
            "genz marketing",
            "how to market to generation z",
            "college marketing agency",
            "college-marketing-agency",
        ):
            self.assertIsNotNone(pub.reserved_keyword_match(value, self.terms), value)

    def test_gen_z_experiential_marketing_is_not_reserved(self):
        for value in (
            "gen z experiential marketing",
            "Gen Z experiential marketing",
            "gen-z-experiential-marketing",
        ):
            self.assertIsNone(pub.reserved_keyword_match(value, self.terms), value)

    def test_existing_gen_z_experiential_article_still_validates(self):
        article = ROOT / "content/blog/gen-z-experiential-marketing.mdx"
        data, _body = pub.frontmatter(article)
        self.assertEqual(data["slug"], "gen-z-experiential-marketing")
        self.assertEqual(data["primaryKeyword"], "Gen Z experiential marketing")
        for field in ("primaryKeyword", "title", "slug"):
            self.assertIsNone(pub.reserved_keyword_match(data[field], self.terms), field)
        try:
            pub.validate_article(article, ROOT)
        except ValueError as exc:
            self.assertNotIn("reserved-keyword", str(exc))
            self.assertNotIn("writing-quality", str(exc))
            self.assertNotIn("missing-brief", str(exc))

    def test_existing_reserved_articles_are_not_failed_by_the_new_gate(self):
        for slug in ("gen-z-marketing", "college-marketing-agency", "gen-z-experiential-marketing"):
            article = ROOT / "content/blog" / f"{slug}.mdx"
            try:
                pub.validate_article(article, ROOT)
            except ValueError as exc:
                self.assertNotIn("reserved-keyword", str(exc))
                self.assertNotIn("writing-quality", str(exc))
                self.assertNotIn("missing-brief", str(exc))

    def test_new_article_fields_fail_with_a_clear_message(self):
        import tempfile
        folder = Path(tempfile.mkdtemp())
        seo = folder / "content/seo"
        seo.mkdir(parents=True)
        (seo / "keyword-map.md").write_text(MAP.read_text())
        for field, value in (
            ("primaryKeyword", "marketing to Gen Z"),
            ("title", "Gen Z marketing strategy"),
            ("slug", "how-to-market-to-gen-z"),
        ):
            data = {"primaryKeyword": "campus sampling ideas", "title": "Campus Sampling Ideas", "slug": "campus-sampling-ideas"}
            data[field] = value
            with self.assertRaisesRegex(ValueError, "reserved-keyword"):
                pub.assert_not_reserved_keyword(data, folder)


if __name__ == "__main__":
    unittest.main()
