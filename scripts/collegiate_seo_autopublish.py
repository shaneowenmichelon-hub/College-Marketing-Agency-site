#!/usr/bin/env python3
"""Watchdog for Collegiate Agency SEO blog publishing.

Runs silently unless an article is published or a publish attempt fails.
Maintains a run counter in content/seo/publish-log.md and publishes on a
36-hour cadence tracked in profile-local state, migrated read-only from the repo.
"""
from __future__ import annotations

import sys
import hashlib
import fcntl
import difflib
import importlib.util
import json
import os
import random
import re
import subprocess
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

REPO = Path("/Users/jamesmadison/Jus College/College-Marketing-Agency-site")
BRANCH = "claude/campus-marketing-agency-site-kfznbi"
LIVE_BASE = "https://collegiateagency.com"
OPS = Path("/Users/jamesmadison/.hermes/profiles/nik/state/collegiate-seo")
LOCK = OPS / "publisher.lock"
LOG = REPO / "content" / "seo" / "publish-log.md"
LEGACY_STATE = REPO / "content" / "seo" / "autopublish-state.json"
STATE = OPS / "autopublish-state.json"
HERMES = "/Users/jamesmadison/.hermes/hermes-agent/venv/bin/hermes"
TZ = ZoneInfo("America/Chicago")
INTERVAL_HOURS = 36
# The 36-hour publisher starts requiring two inline photos at this instant.
# Existing articles are not republished; only a validation that runs at or
# after this time rejects a new article that does not carry them.
INLINE_PHOTO_REQUIRED_AT = datetime(2026, 10, 25, 4, 30, tzinfo=ZoneInfo("America/New_York"))
LEDGER_PATH = "content/seo/photo-usage.json"
# Preferred caps from publisher-operations.md. The hard caps exist because
# 15 owned photos cannot cover 32 articles at a strict 2-hero / 6-appearance
# ceiling (30 hero slots, 90 appearance slots, 96 uses). A new article may
# use a third hero only when every suitable photo is already a hero twice,
# and may not push any photo past 7 articles or a fourth hero use.
HERO_PREFERRED_CAP = 2
HERO_HARD_CAP = 3
APPEARANCE_TARGET = 6
APPEARANCE_HARD_CAP = 7
PHOTO_SRC = re.compile(r"^/images/(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$")
FIGURE_LINE = re.compile(r'^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$')

def now_ct() -> datetime:
    return datetime.now(TZ)


def load_state() -> dict:
    if STATE.exists():
        return json.loads(STATE.read_text())
    if LEGACY_STATE.exists():
        return json.loads(LEGACY_STATE.read_text())
    return {}


def save_state(state: dict) -> None:
    STATE.parent.mkdir(parents=True, exist_ok=True)
    temp = STATE.with_suffix(".tmp")
    with temp.open("w") as out:
        out.write(json.dumps(state, indent=2, sort_keys=True) + "\n")
        out.flush()
        os.fsync(out.fileno())
    os.replace(temp, STATE)


def log_run_numbers() -> list[int]:
    if not LOG.exists():
        return []
    nums = []
    for line in LOG.read_text().splitlines():
        m = re.match(r"\|\s*(\d+)\s*\|", line)
        if m:
            nums.append(int(m.group(1)))
    return nums


def schedule_next_interval(state: dict, base: datetime | None = None) -> None:
    base = base or now_ct()
    jitter_seconds = random.randint(0, 1800)
    # Elapsed hours, including across Central daylight-saving transitions.
    dt = (base.astimezone(timezone.utc) + timedelta(hours=INTERVAL_HOURS, seconds=jitter_seconds)).astimezone(TZ)
    state.update({
        "next_run_at": dt.isoformat(),
        "schedule_policy": "36 elapsed hours + uniform integer 0..1800 seconds; first watchdog tick at/after eligibility",
        "schedule_anchor": base.isoformat(),
        "schedule_jitter_seconds": jitter_seconds,
        "retry_run_no": None,
        "retry_count": 0,
        "retry_at": None,
    })
    save_state(state)


def due_run(state: dict, n: datetime) -> tuple[bool, bool]:
    retry_at = state.get("retry_at")
    if retry_at:
        return n >= datetime.fromisoformat(retry_at), True
    next_run_at = state.get("next_run_at")
    if not next_run_at:
        # First automation run after manual launch should happen one interval later, not immediately.
        schedule_next_interval(state, n)
        return False, False
    return n >= datetime.fromisoformat(next_run_at), False


def publish_with_hermes(run_no: int, worktree: Path) -> subprocess.CompletedProcess[str]:
    """Generation boundary only. The wrapper, never the agent, commits/deploys/verifies."""
    prompt = f"""Prepare ONE original Collegiate Agency SEO article for run {run_no}.
Work ONLY in {worktree}. Read content/blog, content/seo/keyword-map.md,
content/seo/writing-rules.md, and content/seo/banned-phrases.txt first.
Before drafting, write content/seo/briefs/<slug>.md from content/seo/briefs/_template.md.
Fill the primary query, the hypothesis (why this page should win the click), the target
AI engines and the prompts a buyer would type, the competitor pages this article must
beat, the CTA path (/contact or /build-a-campaign), and the expected outcome. Leave the
30-day and 60-day result cells blank. Those tables record GA4 sessions, cta_click and
generate_lead events attributed with ?article=<slug>, plus Search Console clicks and
impressions once Search Console is connected. Do not invent those numbers. Replace
<slug> with the article slug.
Then write exactly one NEW content/blog/<keyword-kebab-case>.mdx. Do not edit existing files.
Do NOT commit, push, deploy, schedule, run agents, or modify Hermes settings/skills.
Choose a distinct high-intent BRAND BUYER keyword not used in any existing article or the
60-day keyword lockout. The keyword map section "Reserved for pillar pages, never target"
is permanent. Do not use a reserved term, or a close variation of one, as the primary
keyword, title, or slug. Optimize for brand/agency-side searches from CPG, beverage,
app, retail, entertainment, field-marketing, shopper-marketing, experiential,
and growth teams buying campus reach; do not optimize for students looking for
ambassador jobs. Prefer these buyer-intent clusters, in order: campus brand
activation agency, college experiential marketing agency, campus product sampling
agency, college event marketing agency, campus field marketing agency, Gen Z brand
activation agency, campus marketing RFP, university event activation, college
consumer sampling, campus retail product placement, back-to-school campus
activation, welcome week brand activation, campus pop-up activation, college
sports tailgate activation, Greek life product placement, student organization
sponsorship for brands, campus ambassador program management, college creator
marketing agency, campus UGC program, and multi-campus brand activation. No
near-duplicate topics, catch-up posts, student-career/job-search posts, or invented research.
Follow the existing frontmatter schema plus REQUIRED image, imageAlt and imageCredit fields.
Set imageRights: owned and imageCredit: Collegiate Agency. Use only existing, locally
downloaded owned photography documented in content/seo/public-photo-library.md.
Do not use stock or generated images. Omit imageSource and imageLicense for owned photos;
never invent license URLs or source strings. Follow the exact photo's caption restrictions.
Also place exactly two inline owned photos in the body. Each one is its own line,
![Descriptive alt](/images/blog/file.jpg), followed immediately by a Caption: line.
Do not repeat a photo inside the article, including the hero. Alt text is required.
Do not caption attendees or bartenders as staff, ambassadors, or reps. The appendix
names the least-used suitable hero and two inline photos; use that trio unless a
caption would be false for the section. Keep the premiere step-and-repeat off any
slug that sells the agency directly.
Write 1200-1800 words, 4-6 H2s, direct second-person advice, an actionable checklist,
short title including the keyword, metaTitle <60 chars and metaDescription <155 chars.
Include AT LEAST THREE distinct contextual body-link destinations: >=2 internal
and >=1 credible, topic-relevant external article, guidance, video, or public social
reference. Preserve the stronger existing requirement: TWO DISTINCT service links
chosen from /services/events, /services/brand-ambassadors, /services/product-placement,
or /services#product-placement, PLUS /contact, PLUS at least one external reference
(normally >=4 destinations).
Use descriptive anchors naturally within relevant paragraphs or substantive lists,
not a boilerplate links block. Do not repeat a destination. Photo credits, image
licenses, menus, footer links, headings and bare link lists do NOT count.
Research and READ each external source with web tools before citing it; verify it
is publicly accessible, free, relevant to the surrounding claim, and not broken,
login-only or paywalled. Prefer primary/regulatory/institutional sources. Never
imply a general reference verifies unrelated Collegiate client results. Use HTTPS
and specific reference pages, not generic homepages. Keep all useful requirements.
Valid ctaService: events, brand-ambassadors, product-placement.
Do not use the removed /services/influencers URL. Link product placement to
/services/product-placement. Banned: leverage, synergy,
in today's fast-paced world, and every phrase in content/seo/banned-phrases.txt.
The article body must open with 2-3 sentences that answer the query and can be quoted
by an AI engine. Use active voice and a 10th-grade reading level. No em dashes.
Name each source with its title, publisher, date, and URL. Use natural anchor text.
Do not invent statistics, clients, quotes, outcomes, pricing, or company claims.
Give practical recommendations, not hype.
Use today's date in America/Chicago. Write the brief first, then the article. Return the article path.
"""
    prompt += "\n" + photo_prompt_guidance(worktree)
    # Cron can run under Hermes' staged runtime venv. Invoke the stable venv
    # console script directly and strip inherited venv variables so compiled
    # packages such as pydantic_core load from the matching interpreter.
    env = os.environ.copy()
    for key in ("PYTHONPATH", "PYTHONHOME", "VIRTUAL_ENV", "CONDA_PREFIX"):
        env.pop(key, None)
    venv_bin = "/Users/jamesmadison/.hermes/hermes-agent/venv/bin"
    env["PATH"] = venv_bin + ":" + env.get("PATH", "")
    return subprocess.run(
        [venv_bin + "/hermes", "-p", "nik", "chat", "-Q", "-m", "gpt-6-astra",
         "--provider", "openai-codex", "-q", prompt,
         "--toolsets", "file,web", "--max-turns", "30", "--run-budget", "480"],
        cwd=worktree, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        timeout=540, env=env,
    )


def safe_generation_summary(output: str, limit: int = 1800) -> str:
    """Keep enough generator failure evidence to debug without relaying secrets."""
    text = re.sub(r"(?i)(authorization\s*:\s*bearer[ \t]+)[A-Za-z0-9._~+/=-]+", r"\1[REDACTED]", output or "")
    text = re.sub(r"(?i)(api[_-]?key|token|secret|password|authorization)\s*[:=]\s*\S+", r"\1=[REDACTED]", text)
    text = re.sub(r"(?i)(bearer[ \t]+)[A-Za-z0-9._~+/=-]+", r"\1[REDACTED]", text)
    text = re.sub(r"\x1b\[[0-9;]*[A-Za-z]", "", text)
    lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith(("╭", "╰", "┌", "└", "│", "─")):
            continue
        lines.append(stripped)
    return "\n".join(lines)[-limit:]


def execution_env() -> dict:
    env = os.environ.copy()
    for key in ("PYTHONPATH", "PYTHONHOME", "VIRTUAL_ENV", "CONDA_PREFIX"):
        env.pop(key, None)
    env["PATH"] = "/Users/jamesmadison/.hermes/node/bin:" + env.get("PATH", "")
    return env


def command(args: list[str], cwd: Path, timeout: int = 120) -> str:
    result = subprocess.run(args, cwd=cwd, text=True, stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT, timeout=timeout, env=execution_env())
    if result.returncode:
        raise RuntimeError("command-failed")
    return result.stdout.strip()


def git(cwd: Path, *args: str) -> str:
    return command(["git", *args], cwd)


def frontmatter(path: Path) -> tuple[dict, str]:
    match = re.fullmatch(r"---\n(.*?)\n---\n(.*)", path.read_text(), re.S)
    if not match:
        raise ValueError("frontmatter")
    data = {}
    for line in match[1].splitlines():
        key, sep, value = line.partition(":")
        if sep:
            data[key.strip()] = value.strip().strip('"\'')
    return data, match[2].strip()


def validate_contextual_links(body: str) -> list[dict]:
    """Count only descriptive links embedded in rendered prose, never credits/code."""
    from urllib.parse import urlsplit
    pattern = r"(?<!!)\[([^\]\n]+)\]\(([^)\s]+)\)"
    prose = re.sub(r"```.*?```|~~~.*?~~~|`[^`]*`", "", body, flags=re.S)
    prose = "\n".join(line for line in prose.splitlines() if not line.lstrip().startswith("#"))
    links = []
    seen = set()
    for paragraph in prose.split("\n\n"):
        if re.match(r"\s*(?:photo|image|credit|license)\s*:", paragraph, re.I):
            continue
        for match in re.finditer(pattern, paragraph):
            anchor, href = match.groups()
            if len(re.findall(r"[A-Za-z]+", re.sub(pattern, "", paragraph))) < 3:
                raise ValueError("link-without-context")
            if len(anchor.strip()) < 4 or anchor.casefold() in ("here", "click here", "source", "link"):
                raise ValueError("link-anchor")
            if re.search(r'[<>"\'\\\\\s]', href) or re.search(r'%0[ad]|%22|%27|%3[ce]', href, re.I):
                raise ValueError("invalid-link")
            parsed = urlsplit(href)
            internal = href.startswith("/") and not href.startswith("//")
            if internal:
                if not re.fullmatch(r"/[a-z0-9/-]+(?:#[a-z0-9-]+)?", href) or '/services/influencers' in href:
                    raise ValueError("invalid-internal-link")
                destination = href.rstrip("/")
            else:
                host = parsed.hostname or ""
                if parsed.scheme != "https" or parsed.username or parsed.password or parsed.port not in (None, 443) or not re.fullmatch(r"[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}", host) or host.endswith((".local", ".localhost", ".internal")) or parsed.path in ("", "/"):
                    raise ValueError("invalid-external-link")
                if host in ("collegiateagency.com", "www.collegiateagency.com"):
                    raise ValueError("use-relative-internal-link")
                destination = f"https://{host}{parsed.path.rstrip('/')}"  # fragments/UTMs cannot inflate destination counts
            if destination in seen:
                raise ValueError("duplicate-link-destination")
            seen.add(destination)
            links.append({"anchor": anchor, "href": href, "kind": "internal" if internal else "external"})
    internals = {link["href"] for link in links if link["kind"] == "internal"}
    if not any(link["kind"] == "external" for link in links):
        raise ValueError("contextual-external-link")
    services = {"/services/events", "/services/brand-ambassadors", "/services#product-placement", "/services/product-placement"}
    if len(internals) < 2 or len(internals & services) < 2 or "/contact" not in internals:
        raise ValueError("contextual-internal-service-contact-links")
    if len(links) < 3:
        raise ValueError("contextual-three-destinations")
    return links


def validate_tables(body: str) -> int:
    """Tabular data must ship as a real markdown pipe table, never an image and
    never raw HTML (see the unsafe-markup gate). Returns the table count.

    Rejects the shapes that render as literal pipes on the page: a pipe row
    with no separator beneath it, ragged rows, or a header with no body."""
    lines = body.split("\n")
    tables = 0
    i = 0
    sep = re.compile(r"^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$")
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("|") and line.endswith("|"):
            if i + 1 >= len(lines) or not sep.match(lines[i + 1].strip()):
                raise ValueError("table-missing-separator")
            width = len([c for c in line.strip("|").split("|")])
            j, rows = i + 2, 0
            while j < len(lines) and lines[j].strip().startswith("|"):
                cells = len([c for c in lines[j].strip().strip("|").split("|")])
                if cells != width:
                    raise ValueError("table-ragged-rows")
                rows += 1
                j += 1
            if rows == 0:
                raise ValueError("table-no-rows")
            if width < 2:
                raise ValueError("table-single-column")
            tables += 1
            i = j
            continue
        i += 1
    return tables


STUDENT_INTENT = re.compile(
    r"(how to become\b|how do i become\b|apply to be\b|applying to be\b|"
    r"\b(ambassador|rep|campus|student)s? (job|gig|position|opening)s?\b|"
    r"\bbrand ambassador (salary|pay|salaries)\b|"
    r"how much (do|does) .{0,30}(ambassador|rep)s? (make|earn|get paid)|"
    r"\bget paid to\b|\bside hustle\b)", re.I)


def validate_brand_intent(data: dict) -> None:
    for field in ("primaryKeyword", "title", "metaTitle"):
        if STUDENT_INTENT.search(str(data.get(field, ""))):
            raise ValueError("student-intent-keyword")


def inline_photos_required(moment: datetime | None = None) -> bool:
    moment = moment or now_ct()
    return moment.astimezone(ZoneInfo("America/New_York")) >= INLINE_PHOTO_REQUIRED_AT


def is_direct_sales_slug(slug: str) -> bool:
    """A page selling Collegiate Agency as the vendor. Tactic essays are not."""
    return "agency" in (slug or "")


def parse_photo_library(library: str) -> dict[str, dict]:
    photos: dict[str, dict] = {}
    for section in re.split(r"(?m)^## ", library):
        match = re.search(r"(?m)^- Local asset: `([^`]+)`\s*$", section)
        if not match:
            continue
        src = match.group(1)
        shot = re.search(r"(?m)^- Shot: ([a-z, ]+)\s*$", section)
        roles = [part.strip() for part in shot.group(1).split(",") if part.strip()] if shot else []
        ban = re.search(r"(?m)^- Caption ban: (.+)\s*$", section)
        bans = [part.strip().casefold() for part in ban.group(1).split(",") if part.strip()] if ban else []
        alt = re.search(r"(?m)^- Suggested alt: (.+)\s*$", section)
        photos[src] = {
            "src": src,
            "owned": bool(re.search(r"(?m)^- Rights: owned\.", section)),
            "disallowed": bool(re.search(r"(?m)^- Status: disallowed\b", section)),
            "roles": roles,
            "caption_bans": bans,
            "sales_forbidden": bool(re.search(r"(?m)^- Sales pages: forbidden\s*$", section)),
            "alt": alt.group(1).strip() if alt else "",
        }
    return photos


def load_ledger(worktree: Path) -> list[dict]:
    path = worktree / LEDGER_PATH
    if not path.is_file():
        return []
    data = json.loads(path.read_text())
    uses = data.get("uses", [])
    if not isinstance(uses, list):
        raise ValueError("photo-ledger")
    return uses


def usage_excluding(uses: list[dict], slug: str) -> list[dict]:
    return [item for item in uses if item.get("slug") != slug]


def hero_count(uses: list[dict], src: str) -> int:
    return len({item["slug"] for item in uses if item.get("src") == src and item.get("role") == "hero"})


def article_count(uses: list[dict], src: str) -> int:
    return len({item["slug"] for item in uses if item.get("src") == src})


def extract_inline_photos(body: str) -> list[dict]:
    photos = []
    lines = body.split("\n")
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        match = FIGURE_LINE.match(line)
        if match:
            alt, src, title = match.group(1).strip(), match.group(2).strip(), (match.group(3) or "").strip()
            caption = title
            if index + 1 < len(lines) and re.match(r"(?i)^caption:\s+\S", lines[index + 1].strip()):
                caption = re.sub(r"(?i)^caption:\s+", "", lines[index + 1].strip()).strip()
                index += 1
            photos.append({"src": src, "alt": alt, "caption": caption})
        elif "![" in line:
            raise ValueError("inline-photo-syntax")
        index += 1
    return photos


def caption_banned(text: str, bans: list[str]) -> bool:
    folded = text.casefold()
    return any(re.search(r"\b" + re.escape(ban) + r"\b", folded) for ban in bans)


def _under_appearance_cap(uses: list[dict], src: str) -> bool:
    return article_count(uses, src) < APPEARANCE_HARD_CAP


def select_article_photos(library: str, uses: list[dict], slug: str) -> dict:
    """Least-used suitable hero plus two inline photos, mixing shot types."""
    photos = [photo for photo in parse_photo_library(library).values() if photo["owned"] and not photo["disallowed"]]
    if is_direct_sales_slug(slug):
        photos = [photo for photo in photos if not photo["sales_forbidden"]]
    chosen: list[tuple[str, dict]] = []
    pool = photos[:]
    for role in ("setup", "product", "crowd"):
        candidates = [photo for photo in pool if role in photo["roles"] and _under_appearance_cap(uses, photo["src"])]
        if not candidates:
            continue
        candidates.sort(key=lambda photo: (
            0 if article_count(uses, photo["src"]) < APPEARANCE_TARGET else 1,
            article_count(uses, photo["src"]),
            hero_count(uses, photo["src"]),
            photo["src"],
        ))
        pick = candidates[0]
        chosen.append((role, pick))
        pool = [photo for photo in pool if photo["src"] != pick["src"]]
    while len(chosen) < 3:
        candidates = [photo for photo in pool if _under_appearance_cap(uses, photo["src"])]
        if not candidates:
            raise ValueError("photo-usage-cap")
        candidates.sort(key=lambda photo: (article_count(uses, photo["src"]), photo["src"]))
        pick = candidates[0]
        chosen.append((pick["roles"][0] if pick["roles"] else "crowd", pick))
        pool = [photo for photo in pool if photo["src"] != pick["src"]]

    def hero_key(item: tuple[str, dict]) -> tuple:
        photo = item[1]
        heroes = hero_count(uses, photo["src"])
        return (
            0 if heroes < HERO_HARD_CAP else 1,
            0 if heroes < HERO_PREFERRED_CAP else 1,
            heroes,
            article_count(uses, photo["src"]),
            photo["src"],
        )

    eligible = [item for item in chosen if hero_count(uses, item[1]["src"]) < HERO_HARD_CAP]
    if not eligible:
        raise ValueError("hero-photo-cap")
    # Prefer a photo still under the 2-hero rule. A third hero use is only
    # returned when every chosen photo is already at that preferred cap.
    under_preferred = [item for item in eligible if hero_count(uses, item[1]["src"]) < HERO_PREFERRED_CAP]
    hero_item = sorted(under_preferred or eligible, key=hero_key)[0]
    return {
        "hero": hero_item[1]["src"],
        "heroAlt": hero_item[1]["alt"],
        "heroRole": hero_item[0],
        "inline": [
            {"src": item[1]["src"], "alt": item[1]["alt"], "role": item[0]}
            for item in chosen if item[1]["src"] != hero_item[1]["src"]
        ],
    }


def photo_prompt_guidance(worktree: Path) -> str:
    library_path = worktree / "content/seo/public-photo-library.md"
    if not library_path.is_file():
        return "Inline photos: library missing; do not publish."
    library = library_path.read_text()
    uses = load_ledger(worktree)
    lines = [
        "Photo usage rule: 1 hero and 2 inline photos. Prefer the least-used suitable owned photo.",
        "Each photo is a hero on at most 2 articles, and on a third only when no photo remains under 2.",
        "Each photo appears on about 6 articles and must not appear on an 8th. No repeats inside an article.",
        "Mix one crowd/people shot, one setup/staffing shot, and one product-in-hand shot when possible.",
        "Never caption attendees or bartenders as staff. The premiere step-and-repeat stays off agency-sales slugs.",
        "Current owned-photo usage:",
    ]
    for src, entry in sorted(parse_photo_library(library).items()):
        if not entry["owned"] or entry["disallowed"]:
            continue
        lines.append(
            f"- {src} roles={','.join(entry['roles']) or 'unspecified'} "
            f"hero_articles={hero_count(uses, src)} article_appearances={article_count(uses, src)} "
            f"sales_forbidden={str(entry['sales_forbidden']).lower()}"
        )
    try:
        regular = select_article_photos(library, uses, "campus-sampling-example")
        sales = select_article_photos(library, uses, "campus-marketing-agency-example")
        lines.append("Preferred trio when the slug does not contain agency: " + json.dumps(regular, sort_keys=True))
        lines.append("Preferred trio when the slug contains agency: " + json.dumps(sales, sort_keys=True))
        lines.append("Use that preferred trio. Do not pick a more-used photo when a preferred one fits the section.")
    except ValueError:
        lines.append("No legal photo trio remains under the usage caps. Stop and do not publish.")
    return "\n".join(lines)


def _mix_was_possible(photos: dict[str, dict], uses: list[dict], slug: str, chosen: set[str]) -> bool:
    """True when some other owned photo could have supplied a missing shot type."""
    covered: set[str] = set()
    for src in chosen:
        covered.update(photos.get(src, {}).get("roles") or [])
    missing = {"crowd", "setup", "product"} - covered
    if not missing or len(chosen) < 3:
        return False
    for src, entry in photos.items():
        if src in chosen or not entry["owned"] or entry["disallowed"]:
            continue
        if entry["sales_forbidden"] and is_direct_sales_slug(slug):
            continue
        if not _under_appearance_cap(uses, src):
            continue
        if missing & set(entry["roles"]):
            return True
    return False


def validate_inline_photos(body: str, data: dict, library: str, worktree: Path) -> list[dict]:
    catalog = parse_photo_library(library)
    inline = extract_inline_photos(body)
    hero = data.get("image", "")
    slug = data.get("slug", "")
    seen: set[str] = set()
    if hero:
        seen.add(hero)
    uses = usage_excluding(load_ledger(worktree), slug)
    for photo in inline:
        src, alt, caption = photo["src"], photo["alt"], photo.get("caption") or ""
        if not alt or "<" in alt or ">" in alt:
            raise ValueError("inline-photo-alt")
        if caption and ("<" in caption or ">" in caption):
            raise ValueError("inline-photo-caption")
        if not PHOTO_SRC.fullmatch(src):
            raise ValueError("inline-photo-path")
        if src in seen:
            raise ValueError("inline-photo-repeat")
        seen.add(src)
        entry = catalog.get(src)
        if not entry or not entry["owned"] or entry["disallowed"]:
            raise ValueError("inline-photo-owned")
        file = worktree / "public" / src.lstrip("/")
        if not file.is_file() or file.is_symlink():
            raise ValueError("inline-photo-file")
        if caption_banned(alt, entry["caption_bans"]) or caption_banned(caption, entry["caption_bans"]):
            raise ValueError("inline-photo-caption")
        if entry["sales_forbidden"] and is_direct_sales_slug(slug):
            raise ValueError("inline-photo-sales-page")
        if article_count(uses, src) + 1 > APPEARANCE_HARD_CAP:
            raise ValueError("inline-photo-usage-cap")
    hero_entry = catalog.get(hero) if hero else None
    if hero_entry and hero_entry["disallowed"]:
        raise ValueError("hero-photo-disallowed")
    if hero_entry and hero_entry["sales_forbidden"] and is_direct_sales_slug(slug):
        raise ValueError("hero-photo-sales-page")
    if hero and article_count(uses, hero) + 1 > APPEARANCE_HARD_CAP:
        raise ValueError("hero-photo-usage-cap")
    if hero_entry and hero_entry["owned"] and hero_count(uses, hero) + 1 > HERO_HARD_CAP:
        raise ValueError("hero-photo-cap")
    if data.get("imageAlt") and hero_entry and caption_banned(str(data["imageAlt"]), hero_entry["caption_bans"]):
        raise ValueError("hero-photo-caption")
    chosen = {hero, *(photo["src"] for photo in inline)} if hero else {photo["src"] for photo in inline}
    if hero and len(inline) == 2 and _mix_was_possible(catalog, uses, slug, chosen):
        raise ValueError("inline-photo-mix")
    if inline_photos_required() and len(inline) != 2:
        raise ValueError("inline-photos-required")
    return inline


def record_photo_usage(worktree: Path, artifact: dict) -> None:
    path = worktree / LEDGER_PATH
    if not path.is_file():
        return
    data = json.loads(path.read_text())
    uses = [item for item in data.get("uses", []) if item.get("slug") != artifact.get("slug")]
    if artifact.get("image"):
        uses.append({"slug": artifact["slug"], "src": artifact["image"], "role": "hero"})
    for photo in artifact.get("inline_photos") or []:
        uses.append({"slug": artifact["slug"], "src": photo["src"], "role": "inline"})
    data["uses"] = sorted(uses, key=lambda item: (item["slug"], item["role"], item["src"]))
    path.write_text(json.dumps(data, indent=2) + "\n")


def validate_photo_provenance(data: dict, library: str) -> None:
    # Bind rights, credit and URLs to THIS asset's section, not another photo.
    sections = re.split(r"(?m)^#{1,6} ", library)
    entries = [s for s in sections if re.search(
        r"(?m)^- Local asset: `" + re.escape(data["image"]) + r"`\s*$", s)]
    if len(entries) != 1:
        raise ValueError("photo-provenance")
    entry = entries[0]
    if data.get("imageRights", "").lower() == "owned":
        if not re.search(r"(?m)^- Rights: owned\.", entry) or data.get("imageCredit") != "Collegiate Agency":
            raise ValueError("photo-owned-provenance")
        if data.get("imageSource") or data.get("imageLicense"):
            raise ValueError("owned-photo-fake-license")
    else:
        for key, label in (("imageSource", "Source"), ("imageLicense", "License")):
            value = data.get(key, "")
            if not value.startswith("https://"):
                raise ValueError("photo-credit-url")
            if not re.search(r"(?m)^- " + label + r": " + re.escape(value) + r"\s*$", entry):
                raise ValueError("photo-license-provenance")


_KEYWORD_STOPWORDS = frozenset(
    "a an the to for of and or in on with how your our at by from as is are was were be".split()
)
_WRITING_QUALITY = None


def load_writing_quality():
    """Load the sibling checker. The installed publisher keeps this file beside itself."""
    global _WRITING_QUALITY
    if _WRITING_QUALITY is not None:
        return _WRITING_QUALITY
    path = Path(__file__).resolve().with_name("writing_quality.py")
    spec = importlib.util.spec_from_file_location("collegiate_writing_quality", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("writing-quality-module-missing")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    _WRITING_QUALITY = module
    return module


def normalize_keyword_tokens(value: str) -> tuple[str, ...]:
    """Lowercase, drop stopwords, and treat gen z / genz / generation z as one token."""
    text = (value or "").casefold().replace("\u2019", "'")
    text = re.sub(r"\bgeneration\s+z\b", "genz", text)
    text = re.sub(r"\bgen[\s-]*z\b", "genz", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return tuple(token for token in text.split() if token not in _KEYWORD_STOPWORDS)


def reserved_keyword_terms(keyword_map: str) -> list[str]:
    """Terms under the permanent reserved heading. Dated lockout rows are not terms."""
    match = re.search(r"(?m)^## Reserved for pillar pages, never target\s*$", keyword_map)
    if not match:
        raise ValueError("reserved-keyword: keyword map is missing the 'Reserved for pillar pages, never target' section")
    rest = keyword_map[match.end():]
    nxt = re.search(r"(?m)^## ", rest)
    section = rest[: nxt.start()] if nxt else rest
    terms = []
    for line in section.splitlines():
        if re.match(r"\s*-\s+\d{4}-\d{2}-\d{2}\b", line):
            continue
        bullet = re.match(r"\s*-\s+(.+?)\s*$", line)
        if not bullet:
            continue
        term = bullet.group(1).strip().strip("`")
        if term:
            terms.append(term)
    if not terms:
        raise ValueError("reserved-keyword: reserved list is empty")
    return terms


def reserved_keyword_match(value: str, terms: list[str]) -> str | None:
    """Return the reserved term when value matches it or closely varies it.

    Close variation means the same content words in any order, or the reserved
    words appearing in order inside a longer phrase. An extra word in the middle
    of the reserved phrase is a different keyword.
    """
    tokens = normalize_keyword_tokens(value)
    if not tokens:
        return None
    folded = sorted(tokens)
    for term in terms:
        reserved = normalize_keyword_tokens(term)
        if not reserved:
            continue
        if tokens == reserved or folded == sorted(reserved):
            return term
        width = len(reserved)
        if width < len(tokens) and any(tokens[i:i + width] == reserved for i in range(0, len(tokens) - width + 1)):
            return term
    return None


def assert_not_reserved_keyword(data: dict, worktree: Path) -> None:
    """New articles only. Existing pages may already use a reserved term."""
    keyword_map = worktree / "content/seo/keyword-map.md"
    if not keyword_map.is_file():
        raise ValueError("reserved-keyword: content/seo/keyword-map.md is missing")
    terms = reserved_keyword_terms(keyword_map.read_text())
    for field in ("primaryKeyword", "title", "slug"):
        value = str(data.get(field, ""))
        match = reserved_keyword_match(value, terms)
        if match:
            raise ValueError(
                f"reserved-keyword: {field} '{value}' matches reserved term '{match}'. "
                "That term is reserved for a pillar page and cannot be the target of a new article."
            )


def append_keyword_lockout(keyword_text: str, line: str) -> str:
    """Record a published keyword without moving the permanent reserved section."""
    marker = "## Reserved for pillar pages, never target\n"
    if marker in keyword_text:
        return keyword_text.replace(marker, line + marker, 1)
    return keyword_text + line


def assert_new_article_gates(path: Path, worktree: Path, data: dict) -> None:
    """Brief, writing quality, and reserved keywords. Runs before commit, for a new article only."""
    assert_not_reserved_keyword(data, worktree)
    checker = load_writing_quality()
    _front, body = frontmatter(path)
    violations = checker.check_body(body, checker.load_banned_phrases(worktree / "content" / "seo" / "banned-phrases.txt"))
    if violations:
        raise ValueError(checker.format_violations(violations))
    checker.assert_brief(worktree / "content" / "seo" / "briefs" / f"{data['slug']}.md", data["slug"])


def validate_article(path: Path, worktree: Path) -> dict:
    data, body = frontmatter(path)
    required = "slug title metaTitle metaDescription primaryKeyword category services excerpt date ctaService image imageAlt imageCredit".split()
    if any(not data.get(k) for k in required):
        raise ValueError("required-fields")
    slug = data["slug"]
    keyword = data["primaryKeyword"].casefold()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or path.stem != slug:
        raise ValueError("slug")
    # /insights/topics/<slug> is the hub path. A future article must not take it.
    if slug == "topics":
        raise ValueError("reserved-slug")
    if slug != re.sub(r"[^a-z0-9]+", "-", keyword).strip("-") or keyword not in data["title"].casefold():
        raise ValueError("keyword-title")
    if len(data["metaTitle"]) >= 60 or len(data["metaDescription"]) >= 155:
        raise ValueError("metadata-length")
    if data["ctaService"] not in ("events", "brand-ambassadors", "product-placement"):
        raise ValueError("cta-service")
    if data["category"] not in ("Campus Strategy", "Ambassadors", "Brand Ambassadors", "Events", "Product Placement"):
        raise ValueError("category")
    if re.search(r"<[!/a-z]", body, re.I) or re.search(r"\]\((?!https?://|/)[^)]+\)", body, re.I):
        raise ValueError("unsafe-markup")
    count = len(body.split())
    if not 1200 <= count <= 1800 or not 4 <= len(re.findall(r"^## ", body, re.M)) <= 6:
        raise ValueError("editorial-length")
    if re.search(r"\b(leverage|synergy)\b|in today's fast-paced world|/services/influencers", body, re.I):
        raise ValueError("banned-copy")
    validate_brand_intent(data)
    table_count = validate_tables(body)
    body_links = validate_contextual_links(body)
    if not re.search(r"^[-\d].*", body, re.M):
        raise ValueError("links-checklist")
    for prior in path.parent.glob("*.mdx"):
        if prior == path:
            continue
        old, _ = frontmatter(prior)
        if old.get("slug") == slug or old.get("primaryKeyword", "").casefold() == keyword or difflib.SequenceMatcher(None, old.get("title", "").casefold(), data["title"].casefold()).ratio() > .88:
            raise ValueError("duplicate-article")
    keyword_map = worktree / "content/seo/keyword-map.md"
    if keyword_map.exists():
        for date, prior_keyword, prior_slug in re.findall(r"- (\d{4}-\d{2}-\d{2}) - `([^`]+)` - `/insights/([^`]+)`", keyword_map.read_text()):
            if prior_keyword.casefold() == keyword and prior_slug != slug and datetime.fromisoformat(date).date() >= (now_ct() - timedelta(days=60)).date():
                raise ValueError("keyword-lockout")
    source = worktree / "src/lib/content.ts"
    if source.exists() and re.search(r'slug:\s*["\']' + re.escape(slug) + r'["\']', source.read_text()):
        raise ValueError("duplicate-hardcoded-slug")
    if not re.fullmatch(r"/images/blog/[A-Za-z0-9/_-]+\.(jpg|jpeg|webp|png)", data["image"]):
        raise ValueError("photo-path")
    photo = worktree / "public" / data["image"].lstrip("/")
    if not photo.is_file() or photo.is_symlink():
        raise ValueError("photo-file")
    library = (worktree / "content/seo/public-photo-library.md").read_text()
    validate_photo_provenance(data, library)
    inline_photos = validate_inline_photos(body, data, library, worktree)
    artifact = {**data, "word_count": count, "body_links": body_links, "tables": table_count,
            "article_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "image_sha256": hashlib.sha256(photo.read_bytes()).hexdigest(),
            "body_sentinel": re.sub(r"\s+", " ", re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", body.split("\n\n")[0]).replace("**", "")).strip()[:100]}
    if inline_photos:
        artifact["inline_photos"] = inline_photos
    return artifact


def prepare(state: dict, run_no: int) -> dict:
    if not state.get("preparing"):
        git(REPO, "fetch", "origin", BRANCH)
        base = git(REPO, "rev-parse", f"origin/{BRANCH}")
        remote_log = "content/seo/publish-log.md"
        if git(REPO, "ls-tree", "--name-only", base, remote_log):
            numbers = [int(x) for x in re.findall(r"^\|\s*(\d+)\s*\|", git(REPO, "show", f"{base}:{remote_log}"), re.M)]
            run_no = max(run_no, max(numbers, default=0) + 1)
        run_no = max(run_no, int((state.get("last_success") or {}).get("run_no", 0)) + 1)
        worktree = OPS / f"run-{run_no}-{now_ct():%Y%m%d%H%M%S%f}"
        worktree.parent.mkdir(parents=True, exist_ok=True)
        # Persist the target before any child starts, so crashes never create another draft.
        state["preparing"] = {"worktree": str(worktree), "base": base, "run_no": run_no}
        save_state(state)
    prep = state["preparing"]
    worktree = Path(prep["worktree"])
    if not worktree.exists():
        git(REPO, "worktree", "add", "--detach", str(worktree), prep["base"])
    baseline = set(git(worktree, "ls-tree", "-r", "--name-only", prep["base"], "content/blog").splitlines())
    articles = [p for p in (worktree / "content/blog").glob("*.mdx") if str(p.relative_to(worktree)) not in baseline]
    if not articles:
        prior = prep.get("generation_result") or {}
        if prep.get("generation_started") and prior.get("status") not in {"failed", "completed-no-article"}:
            # A timed-out/crashed/unknown agent may still be writing or may have
            # produced an artifact outside our detection path. Require explicit
            # operator recovery rather than silently minting a second article.
            raise RuntimeError("generation-incomplete")
        prep["generation_started"] = True
        prep["generation_attempts"] = int(prep.get("generation_attempts") or 0) + 1
        prep["generation_result"] = {"returncode": None, "status": "running", "attempt": prep["generation_attempts"]}
        save_state(state)
        try:
            result = publish_with_hermes(prep["run_no"], worktree)
        except subprocess.TimeoutExpired:
            prep["generation_result"] = {"returncode": None, "status": "timeout", "attempt": prep["generation_attempts"]}
            save_state(state)
            raise RuntimeError("generation-timeout") from None
        summary = safe_generation_summary(result.stdout)
        prep["generation_result"] = {"returncode": result.returncode,
                                     "status": "completed" if result.returncode == 0 else "failed",
                                     "attempt": prep["generation_attempts"],
                                     "summary": summary}
        save_state(state)
        if result.returncode:
            raise RuntimeError("generation-failed")
        articles = [p for p in (worktree / "content/blog").glob("*.mdx") if str(p.relative_to(worktree)) not in baseline]
        if not articles:
            prep["generation_result"] = {**prep["generation_result"], "status": "completed-no-article"}
            save_state(state)
    if len(articles) != 1:
        raise RuntimeError("expected-one-article")
    if git(worktree, "diff", "--name-only", prep["base"]):
        raise RuntimeError("generator-edited-existing-files")
    artifact = validate_article(articles[0], worktree)
    if artifact.get("imageRights") != "owned":
        raise ValueError("new-publication-requires-owned-photo")
    assert_new_article_gates(articles[0], worktree, artifact)
    return {**artifact, **{k: prep[k] for k in ("worktree", "base", "run_no")}}


def preflight_links(artifact: dict) -> None:
    result = subprocess.run(
        ["node", str(Path(__file__).with_name("verify-seo-live.mjs")), LIVE_BASE, "--targets"],
        cwd=Path(artifact["worktree"]), input=json.dumps(artifact), text=True,
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=180, env=execution_env(),
    )
    if result.returncode:
        raise ValueError("link-target-preflight")


def publish_prepared(artifact: dict) -> None:
    worktree = Path(artifact["worktree"])
    article = f"content/blog/{artifact['slug']}.mdx"
    for relative, digest in ((article, artifact["article_sha256"]),
                             ("public" + artifact["image"], artifact["image_sha256"])):
        if hashlib.sha256((worktree / relative).read_bytes()).hexdigest() != digest:
            raise ValueError("prepared-artifact-changed")
    git(worktree, "fetch", "origin", BRANCH)
    remote_files = git(worktree, "ls-tree", "-r", "--name-only", f"origin/{BRANCH}", article)
    if remote_files:
        remote_article = subprocess.run(["git", "show", f"origin/{BRANCH}:{article}"],
                                        cwd=worktree, capture_output=True, check=True).stdout
        if hashlib.sha256(remote_article).hexdigest() != artifact["article_sha256"]:
            raise ValueError("remote-slug-conflict")
        artifact["commit"] = git(worktree, "log", "-1", "--format=%H", f"origin/{BRANCH}", "--", article)
        return  # Already pushed. Verify the same artifact, never generate/commit again.
    seo = worktree / "content/seo"
    if git(worktree, "rev-parse", "HEAD") == artifact["base"]:
        # No unreviewed tracked changes may accompany the new article.
        if git(worktree, "diff", "--name-only", "HEAD"):
            raise ValueError("unexpected-tracked-change")
        log = seo / "publish-log.md"
        text = log.read_text() if log.exists() else "# SEO Publish Log\n\n| Run | Date | Time CT | Slug | Primary keyword | Word count | Status |\n| --- | --- | --- | --- | --- | ---: | --- |\n"
        n = now_ct()
        log.write_text(text + f"| {artifact['run_no']} | {n:%Y-%m-%d} | {n:%H:%M %Z} | {artifact['slug']} | {artifact['primaryKeyword']} | {artifact['word_count']} | prepared; live receipt in publisher state |\n")
        keywords = seo / "keyword-map.md"
        lockout_line = f"\n- {n:%Y-%m-%d} - `{artifact['primaryKeyword']}` - `/insights/{artifact['slug']}`\n"
        keywords.write_text(append_keyword_lockout(keywords.read_text(), lockout_line))
        record_photo_usage(worktree, artifact)
        brief_rel = f"content/seo/briefs/{artifact['slug']}.md"
        load_writing_quality().assert_brief(worktree / brief_rel, artifact["slug"])
        add_paths = [article, "content/seo/publish-log.md", "content/seo/keyword-map.md", brief_rel]
        if (worktree / LEDGER_PATH).is_file():
            add_paths.append(LEDGER_PATH)
        git(worktree, "add", "--", *add_paths)
        git(worktree, "commit", "-m", f"blog: {artifact['slug']}")
    brief_rel = f"content/seo/briefs/{artifact['slug']}.md"
    allowed = {article, "content/seo/publish-log.md", "content/seo/keyword-map.md", LEDGER_PATH, brief_rel}
    comparison_base = git(worktree, "merge-base", f"origin/{BRANCH}", "HEAD")
    if set(git(worktree, "diff", "--name-only", comparison_base, "HEAD").splitlines()) - allowed:
        raise ValueError("publication-scope")
    # Only this clean publication worktree can rebase. Never force-push or touch REPO's checkout.
    git(worktree, "rebase", f"origin/{BRANCH}")
    command(["npm", "ci"], worktree, 300)
    command(["npm", "run", "build"], worktree, 600)
    command(["npx", "playwright", "install", "chromium"], worktree, 300)
    if git(worktree, "diff", "--name-only", "HEAD"):
        raise ValueError("build-modified-tracked-files")
    if artifact.get("body_links"):
        preflight_links(artifact)
    artifact["commit"] = git(worktree, "rev-parse", "HEAD")
    git(worktree, "push", "origin", f"HEAD:{BRANCH}")
    git(worktree, "fetch", "origin", BRANCH)
    git(worktree, "merge-base", "--is-ancestor", artifact["commit"], f"origin/{BRANCH}")


def verify_live(artifact: dict) -> bool:
    worktree = Path(artifact["worktree"])
    deadline = time.monotonic() + 300
    while time.monotonic() < deadline:
        try:
            result = subprocess.run(["node", str(Path(__file__).with_name("verify-seo-live.mjs")), LIVE_BASE],
                                    cwd=worktree, input=json.dumps(artifact), text=True,
                                    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                    timeout=min(90, max(1, deadline - time.monotonic())), env=execution_env())
            if result.returncode == 0:
                return True
        except subprocess.TimeoutExpired:
            pass
        if time.monotonic() < deadline:
            time.sleep(min(15, deadline - time.monotonic()))
    return False


def main() -> int:
    LOCK.parent.mkdir(parents=True, exist_ok=True)
    with LOCK.open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return 0
        try:
            return tick()
        except Exception:
            print("SEO publisher state unavailable; no publication attempted.")
            return 1


def tick() -> int:
    state = load_state()
    n = now_ct()
    is_due, _ = due_run(state, n)
    if not is_due:
        return 0
    run_no = int((state.get("pending") or state.get("preparing") or {}).get("run_no")
                 or state.get("retry_run_no") or (max(log_run_numbers(), default=0) + 1))
    phase = "preparation"
    try:
        if not state.get("pending"):
            state["pending"] = prepare(state, run_no)
            save_state(state)
        artifact = state["pending"]
        run_no = artifact.get("run_no", run_no)
        phase = "publication"
        publish_prepared(artifact)
        phase = "verification"
        if not verify_live(artifact):
            raise RuntimeError("live-verification")
        state["last_success"] = {**artifact, "verified_at": now_ct().isoformat()}
        state["pending"] = None
        state.pop("preparing", None)
        state.pop("last_error_phase", None)
        schedule_next_interval(state, datetime.fromisoformat(state["last_success"]["verified_at"]))
        print(f"SEO article verified live: {LIVE_BASE}/insights/{artifact['slug']}")
    except Exception as exc:
        # Never relay child stdout, exception messages, URLs with tokens, or credentials.
        count = int(state.get("retry_count") or 0) + 1
        retry_at = n + (timedelta(minutes=30) if count == 1 else timedelta(hours=INTERVAL_HOURS))
        state.update(retry_run_no=run_no, retry_count=count, retry_at=retry_at.isoformat(), last_error_phase=phase)
        save_state(state)
        head = (str(exc).splitlines() or [""])[0]
        reason = ""
        for prefix in ("writing-quality", "missing-brief", "brief-sections", "brief-unfilled", "brief-cta", "brief-check", "reserved-keyword"):
            if head.startswith(prefix):
                reason = prefix
                break
        label = f" ({reason})" if reason else ""
        print(f"SEO run {run_no}: {phase} failed{label}; pending work retained, no new article on retry. Retry {retry_at:%Y-%m-%d %H:%M %Z}.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
