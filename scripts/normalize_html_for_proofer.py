#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
from pathlib import Path


IMG_TAG_RE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
# Important: don't treat `data-src` as `src` (word-boundary regex would match).
SRC_ATTR_RE = re.compile(r"\ssrc\s*=", re.IGNORECASE)
DATA_SRC_ATTR_RE = re.compile(r"\sdata-src\s*=\s*(\"[^\"]*\"|'[^']*')", re.IGNORECASE)


def _inject_src_from_data_src(img_tag: str) -> str:
    if SRC_ATTR_RE.search(img_tag):
        return img_tag
    match = DATA_SRC_ATTR_RE.search(img_tag)
    if not match:
        return img_tag

    data_src_value = match.group(1)  # includes quotes
    # Insert immediately after the "<img" token so we don't have to reason about ordering.
    return img_tag.replace("<img", f"<img src={data_src_value}", 1)


def normalize_html(contents: str) -> tuple[str, int]:
    replacements = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal replacements
        original = match.group(0)
        updated = _inject_src_from_data_src(original)
        if updated != original:
            replacements += 1
        return updated

    updated_contents = IMG_TAG_RE.sub(repl, contents)
    return updated_contents, replacements


def iter_html_files(root: Path) -> list[Path]:
    return [p for p in root.rglob("*.html") if p.is_file()]


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Normalize generated HTML so HTML-Proofer can statically validate RevealJS decks.\n\n"
            "RevealJS decks often lazy-load images using <img data-src=...> (no src). "
            "HTML-Proofer flags these as broken even though RevealJS hydrates them at runtime. "
            "This script injects a real src= attribute from data-src when src is missing."
        )
    )
    parser.add_argument("site_dir", help="Rendered site directory (e.g. _site)")
    args = parser.parse_args()

    site_dir = Path(args.site_dir)
    if not site_dir.exists() or not site_dir.is_dir():
        raise SystemExit(f"Not a directory: {site_dir}")

    total_files = 0
    total_injected = 0

    for path in iter_html_files(site_dir):
        total_files += 1
        original = path.read_text(encoding="utf-8", errors="replace")
        updated, injected = normalize_html(original)
        if injected:
            path.write_text(updated, encoding="utf-8")
            total_injected += injected

    print(
        f"normalize_html_for_proofer: scanned {total_files} HTML files; "
        f"injected src= into {total_injected} <img> tags."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
