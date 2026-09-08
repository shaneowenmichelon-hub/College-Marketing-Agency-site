#!/usr/bin/env python3
"""Watchdog for Collegiate Agency SEO blog publishing.

Runs silently unless an article is published or a publish attempt fails.
Maintains a run counter in content/seo/publish-log.md and publishes on a
36-hour cadence tracked in profile-local state, migrated read-only from the repo.
"""
from __future__ import annotations

import hashlib
import fcntl
import difflib
import json
import os
import re
import subprocess
import time
from datetime import datetime, timedelta
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
    dt = base + timedelta(hours=INTERVAL_HOURS)
    state.update({
        "next_run_at": dt.isoformat(),
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
Work ONLY in {worktree}. Read content/blog and content/seo/keyword-map.md first.
Write exactly one NEW content/blog/<keyword-kebab-case>.mdx; do not edit existing files.
Do NOT commit, push, deploy, schedule, run agents, or modify Hermes settings/skills.
Choose a distinct high-intent buyer keyword not used in any existing article or the
60-day keyword lockout. Prefer agency selection, campus events, ambassador programs,
or product placement. No near-duplicate topics, catch-up posts, or invented research.
Follow the existing frontmatter schema plus REQUIRED image, imageAlt, imageCredit,
imageSource and imageLicense fields. Use ONLY a relevant existing, locally downloaded
licensed/owned photograph documented in content/seo/public-photo-library.md, not SVG
art. Never imply stock photos depict a Collegiate campaign, client or endorsement.
Write 1200-1800 words, 4-6 H2s, direct second-person advice, an actionable checklist,
short title including the keyword, metaTitle <60 chars and metaDescription <155 chars.
Include at least 2 service links (events, brand-ambassadors, or product-placement)
and /contact. Valid ctaService: events, brand-ambassadors, product-placement.
Do not use the removed /services/influencers URL. Banned: leverage, synergy,
in today's fast-paced world. Do not invent statistics, clients, quotes, outcomes,
pricing or company claims. Avoid em dashes. Give practical recommendations, not hype.
Use today's date in America/Chicago. Only write the article. Return its path.
"""
    return subprocess.run(
        [HERMES, "-p", "nik", "chat", "-Q", "-q", prompt,
         "--toolsets", "file,web", "--max-turns", "30", "--run-budget", "480"],
        cwd=worktree, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        timeout=540,
    )


def command(args: list[str], cwd: Path, timeout: int = 120) -> str:
    result = subprocess.run(args, cwd=cwd, text=True, stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT, timeout=timeout)
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


def validate_article(path: Path, worktree: Path) -> dict:
    data, body = frontmatter(path)
    required = "slug title metaTitle metaDescription primaryKeyword category services excerpt date ctaService image imageAlt imageCredit imageSource imageLicense".split()
    if any(not data.get(k) for k in required):
        raise ValueError("required-fields")
    slug = data["slug"]
    keyword = data["primaryKeyword"].casefold()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or path.stem != slug:
        raise ValueError("slug")
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
    if body.count("](/services/") < 2 or "](/contact)" not in body or not re.search(r"^[-\d].*", body, re.M):
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
    if any(data[k] not in library for k in ("image", "imageSource", "imageLicense")):
        raise ValueError("photo-license-provenance")
    if any(not data[k].startswith("https://") for k in ("imageSource", "imageLicense")):
        raise ValueError("photo-credit-url")
    return {**data, "word_count": count,
            "article_sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
            "image_sha256": hashlib.sha256(photo.read_bytes()).hexdigest(),
            "body_sentinel": re.sub(r"\s+", " ", body.split("\n\n")[0]).strip()[:100]}


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
        if prep.get("generation_started"):
            # A timed-out/crashed agent may have failed before writing. Require explicit
            # operator recovery rather than silently minting a second artifact.
            raise RuntimeError("generation-incomplete")
        prep["generation_started"] = True
        save_state(state)
        publish_with_hermes(prep["run_no"], worktree)  # Exit 0 is not a publication receipt.
        articles = [p for p in (worktree / "content/blog").glob("*.mdx") if str(p.relative_to(worktree)) not in baseline]
    if len(articles) != 1:
        raise RuntimeError("expected-one-article")
    if git(worktree, "diff", "--name-only", prep["base"]):
        raise RuntimeError("generator-edited-existing-files")
    artifact = validate_article(articles[0], worktree)
    return {**artifact, **{k: prep[k] for k in ("worktree", "base", "run_no")}}


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
        keywords.write_text(keywords.read_text() + f"\n- {n:%Y-%m-%d} - `{artifact['primaryKeyword']}` - `/insights/{artifact['slug']}`\n")
        git(worktree, "add", "--", article, "content/seo/publish-log.md", "content/seo/keyword-map.md")
        git(worktree, "commit", "-m", f"blog: {artifact['slug']}")
    allowed = {article, "content/seo/publish-log.md", "content/seo/keyword-map.md"}
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
    artifact["commit"] = git(worktree, "rev-parse", "HEAD")
    git(worktree, "push", "origin", f"HEAD:{BRANCH}")
    git(worktree, "fetch", "origin", BRANCH)
    git(worktree, "merge-base", "--is-ancestor", artifact["commit"], f"origin/{BRANCH}")


def verify_live(artifact: dict) -> bool:
    worktree = Path(artifact["worktree"])
    deadline = time.monotonic() + 300
    while time.monotonic() < deadline:
        try:
            result = subprocess.run(["node", "scripts/verify-seo-live.mjs", LIVE_BASE],
                                    cwd=worktree, input=json.dumps(artifact), text=True,
                                    stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                    timeout=min(90, max(1, deadline - time.monotonic())))
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
    run_no = int(state.get("retry_run_no") or (max(log_run_numbers(), default=0) + 1))
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
        schedule_next_interval(state, now_ct())
        print(f"SEO article verified live: {LIVE_BASE}/insights/{artifact['slug']}")
    except Exception:
        # Never relay child stdout, exception messages, URLs with tokens, or credentials.
        count = int(state.get("retry_count") or 0) + 1
        retry_at = n + (timedelta(minutes=30) if count == 1 else timedelta(hours=INTERVAL_HOURS))
        state.update(retry_run_no=run_no, retry_count=count, retry_at=retry_at.isoformat(), last_error_phase=phase)
        save_state(state)
        print(f"SEO run {run_no}: {phase} failed; pending work retained, no new article on retry. Retry {retry_at:%Y-%m-%d %H:%M %Z}.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
