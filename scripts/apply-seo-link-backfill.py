#!/usr/bin/env python3
"""Apply the reviewed two-link-per-article migration; refuse drift, safely rerun."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def apply_entry(source, entry):
    if entry['source_constant']:
        marker = 'const ' + entry['source_constant'] + ':'
        if marker not in source:
            raise ValueError('missing-article-constant')
        start = source.index(marker)
        end = source.index('\n];', start) + 3
    else:
        if '\n---\n' not in source:
            raise ValueError('missing-frontmatter')
        start = source.index('\n---\n') + 5
        end = len(source)
    body = source[start:end]
    for edit in entry['edits']:
        if edit['new'] in body:
            continue
        if body.count(edit['old']) != 1:
            raise ValueError('article-drift: ' + entry['path'])
        body = body.replace(edit['old'], edit['new'], 1)
    return source[:start] + body + source[end:]

def main():
    plan = json.loads((ROOT/'content/seo/link-backfill-20260921.json').read_text())
    files = {}
    for entry in plan['entries']:
        path = ROOT/entry['source_file']
        files[path] = apply_entry(files.get(path, path.read_text()), entry)
    # Validate the entire plan before writing any article.
    changed = 0
    for path, text in files.items():
        if path.read_text() != text:
            path.write_text(text)
            changed += 1
    print(json.dumps({'articles':len(plan['entries']), 'changed_files':changed}))

if __name__ == '__main__': main()
