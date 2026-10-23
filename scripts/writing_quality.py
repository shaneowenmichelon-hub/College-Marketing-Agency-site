#!/usr/bin/env python3
"""Writing-quality gate for new Collegiate Agency articles.

Adapted from the MIT-licensed mentionstack skill pack by Dylan Ander
(Copyright (c) 2026 Dylan Ander; Copyright (c) 2026 Toprank Contributors,
nowork-studio/toprank). See THIRD_PARTY_NOTICES.md.

The checker flags banned phrases, em dashes, and an opening paragraph longer
than three sentences in the article body. It does not publish an article and
it does not make network calls.

Usage:
  python3 scripts/writing_quality.py --report content/blog
  python3 scripts/writing_quality.py content/blog/example.mdx
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

EM_DASH = "\u2014"
OPENING_SENTENCE_LIMIT = 3

REQUIRED_BRIEF_SECTIONS = (
    "Primary query",
    "Hypothesis",
    "Target AI engines and prompts",
    "Competitor pages",
    "CTA path",
    "Expected outcome",
    "30-day check",
    "60-day check",
)
FILLED_BRIEF_SECTIONS = (
    "Primary query",
    "Hypothesis",
    "Target AI engines and prompts",
    "Competitor pages",
    "Expected outcome",
)
BRIEF_CHECK_SECTIONS = ("30-day check", "60-day check")
BRIEF_SIGNALS = (
    "GA4 sessions",
    "cta_click",
    "generate_lead",
    "Search Console clicks",
    "Search Console impressions",
)
CTA_PATHS = ("/contact", "/build-a-campaign")

_FRONTMATTER = re.compile(r"\A---\n.*?\n---\n(.*)\Z", re.S)
_ABBREV = re.compile(
    r"\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|vs|etc|e\.g|i\.e|U\.S|U\.K|Inc|Ltd)\.",
    re.I,
)


class Violation:
    def __init__(self, kind: str, term: str, line: int, detail: str) -> None:
        self.kind = kind
        self.term = term
        self.line = line
        self.detail = detail


def load_banned_phrases(path: Path) -> list[str]:
    if not path.is_file():
        raise ValueError(f"writing-quality: banned phrase list missing at {path}")
    phrases = []
    for line in path.read_text().splitlines():
        stripped = line.strip()
        if stripped and not stripped.startswith("#"):
            phrases.append(stripped)
    if not phrases:
        raise ValueError(f"writing-quality: banned phrase list is empty at {path}")
    return phrases


def normalize_quotes(text: str) -> str:
    return (
        text.replace("\u2019", "'")
        .replace("\u2018", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )


def _spaces(match: re.Match[str]) -> str:
    return re.sub(r"[^\n]", " ", match.group(0))


def mask_code_and_urls(text: str) -> str:
    """Hide inline code, fenced code, bare URLs, and markdown link targets.

    Replacements keep the same length, so line numbers stay put. Matching uses
    these plain substitutions and nothing else.
    """
    text = re.sub(r"```.*?```", _spaces, text, flags=re.S)
    text = re.sub(r"`[^`\n]*`", _spaces, text)
    text = re.sub(r"https?://[^\s<>)\]]+", _spaces, text)
    text = re.sub(r"\]\([^)\s]+\)", _spaces, text)
    return text


def split_frontmatter(text: str) -> str:
    match = _FRONTMATTER.match(text)
    return match.group(1) if match else text


def _line_of(text: str, index: int) -> int:
    return text[:index].count("\n") + 1


def _preview(lines: list[str], line: int) -> str:
    if line < 1 or line > len(lines):
        return ""
    ctx = lines[line - 1].strip()
    return ctx[:120] + "..." if len(ctx) > 120 else ctx


def find_banned_phrases(text: str, phrases: list[str]) -> list[Violation]:
    scanned = mask_code_and_urls(normalize_quotes(text))
    lines = text.splitlines()
    found: list[Violation] = []
    seen: set[tuple[str, int, int]] = set()
    for term in phrases:
        pattern = re.compile(rf"\b{re.escape(term)}\b", re.IGNORECASE)
        for match in pattern.finditer(scanned):
            key = (term.casefold(), match.start(), match.end())
            if key in seen:
                continue
            seen.add(key)
            line = _line_of(text, match.start())
            found.append(Violation("banned-phrase", term, line, _preview(lines, line)))
    return found


def find_em_dashes(text: str) -> list[Violation]:
    scanned = mask_code_and_urls(text)
    lines = text.splitlines()
    found = []
    for match in re.finditer(EM_DASH, scanned):
        line = _line_of(text, match.start())
        found.append(Violation("em-dash", EM_DASH, line, _preview(lines, line)))
    return found


def first_prose_paragraph(body: str) -> str:
    for block in re.split(r"\n\s*\n", body.strip()):
        lines = [line for line in block.splitlines() if line.strip()]
        if not lines:
            continue
        first = lines[0].lstrip()
        lowered = first.lower()
        if first.startswith("#") or first.startswith("![") or first.startswith("|"):
            continue
        if lowered.startswith("caption:") or lowered.startswith("table:"):
            continue
        if first.startswith("```") or first.startswith("~~~"):
            continue
        if re.match(r"[-*+]\s", first) or re.match(r"\d+\.\s", first):
            continue
        return block.strip()
    return ""


def sentence_count(paragraph: str) -> int:
    text = mask_code_and_urls(normalize_quotes(paragraph))
    text = _ABBREV.sub(lambda match: match.group(0).replace(".", ""), text)
    text = re.sub(r"(\d)\.(?=\d)", r"\1", text)
    return len([part for part in re.split(r"[.!?]+", text) if re.search(r"[A-Za-z0-9]", part)])


def check_body(body: str, phrases: list[str]) -> list[Violation]:
    violations = find_banned_phrases(body, phrases)
    violations.extend(find_em_dashes(body))
    opening = first_prose_paragraph(body)
    count = sentence_count(opening) if opening else 0
    if count > OPENING_SENTENCE_LIMIT:
        preview = re.sub(r"\s+", " ", opening).strip()
        preview = preview[:120] + "..." if len(preview) > 120 else preview
        violations.append(Violation("opening-length", str(count), 1, preview))
    return violations


def format_violations(violations: list[Violation]) -> str:
    lines = [f"writing-quality: {len(violations)} violation(s)"]
    shown = violations[:12]
    for item in shown:
        if item.kind == "banned-phrase":
            lines.append(f"  banned phrase '{item.term}' at line {item.line}: {item.detail}")
        elif item.kind == "em-dash":
            lines.append(f"  em dash at line {item.line}: {item.detail}")
        else:
            lines.append(
                f"  opening paragraph has {item.term} sentences; keep the answer-first opening to 3 or fewer"
            )
    extra = len(violations) - len(shown)
    if extra:
        lines.append(f"  ... and {extra} more")
    return "\n".join(lines)


def section_body(text: str, heading: str) -> str:
    match = re.search(rf"(?ms)^##\s+{re.escape(heading)}\s*\n(.*?)(?=^##\s+|\Z)", text)
    return match.group(1).strip() if match else ""


def assert_brief(path: Path, slug: str) -> None:
    """Require the pre-article brief for this slug. Raise ValueError when it is not ready."""
    rel = f"content/seo/briefs/{slug}.md"
    if not path.is_file():
        raise ValueError(
            f"missing-brief: write {rel} from content/seo/briefs/_template.md before drafting the article"
        )
    text = path.read_text()
    missing = [
        heading for heading in REQUIRED_BRIEF_SECTIONS
        if not re.search(rf"(?m)^##\s+{re.escape(heading)}\s*$", text)
    ]
    if missing:
        raise ValueError(f"brief-sections: {rel} is missing " + "; ".join(missing))
    for heading in FILLED_BRIEF_SECTIONS:
        body = section_body(text, heading)
        if not body or re.fullmatch(r"(?is)\s*TODO\s*", body):
            raise ValueError(f"brief-unfilled: {rel} section '{heading}' is still blank")
    cta = section_body(text, "CTA path")
    if not any(path_value in cta for path_value in CTA_PATHS):
        raise ValueError(f"brief-cta: {rel} CTA path must be /contact or /build-a-campaign")
    token = f"?article={slug}"
    for heading in BRIEF_CHECK_SECTIONS:
        body = section_body(text, heading)
        problems = [name for name in BRIEF_SIGNALS if name not in body]
        if token not in body:
            problems.append(token)
        if problems:
            raise ValueError(f"brief-check: {rel} '{heading}' must include " + ", ".join(problems))


def scan_path(path: Path, phrases: list[str]) -> list[tuple[Path, list[Violation]]]:
    if path.is_dir():
        files = sorted(item for item in path.glob("*.mdx") if item.is_file())
    else:
        files = [path]
    return [(item, check_body(split_frontmatter(item.read_text()), phrases)) for item in files]


def default_phrase_list() -> Path:
    return Path(__file__).resolve().parents[1] / "content" / "seo" / "banned-phrases.txt"


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    report = False
    paths: list[Path] = []
    for arg in args:
        if arg == "--report":
            report = True
        else:
            paths.append(Path(arg))
    if not paths:
        sys.stderr.write("Usage: writing_quality.py [--report] <article.mdx | directory>\n")
        return 2
    phrases = load_banned_phrases(default_phrase_list())
    total = 0
    articles = 0
    dirty = 0
    kind_counts = {"banned-phrase": 0, "em-dash": 0, "opening-length": 0}
    for path in paths:
        for article, violations in scan_path(path, phrases):
            articles += 1
            if not violations:
                continue
            dirty += 1
            total += len(violations)
            for item in violations:
                kind_counts[item.kind] = kind_counts.get(item.kind, 0) + 1
            print(f"{article}: {len(violations)} violation(s)")
            if not report:
                print(format_violations(violations))
    print(f"scanned {articles} article(s); {dirty} with violations; {total} violation(s)")
    print(
        "banned phrases: {banned-phrase}; em dashes: {em-dash}; long openings: {opening-length}".format(
            **kind_counts
        )
    )
    if report:
        return 0
    return 1 if total else 0


if __name__ == "__main__":
    raise SystemExit(main())
