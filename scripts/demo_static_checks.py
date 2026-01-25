#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

TARGETS = [
    Path("demos/seasons/index.html"),
    Path("demos/angular-size/index.html"),
    Path("demos/eclipse-geometry/index.html"),
]

RANGE_INPUT_RE = re.compile(
    r'<input\b[^>]*\btype\s*=\s*["\']range["\'][^>]*>',
    re.IGNORECASE,
)
ATTR_RE = re.compile(r"(\w[\w-]*)\s*=\s*([\"'])(.*?)\2")
LABEL_FOR_RE = re.compile(r'<label\b[^>]*\bfor\s*=\s*["\'](.*?)["\'][^>]*>', re.IGNORECASE)


def attrs(tag: str) -> dict[str, str]:
    return {k.lower(): v for (k, _, v) in ATTR_RE.findall(tag)}


def main() -> int:
    failed: list[str] = []

    for path in TARGETS:
        html = path.read_text(encoding="utf-8")
        label_fors = set(LABEL_FOR_RE.findall(html))

        for match in RANGE_INPUT_RE.finditer(html):
            tag = match.group(0)
            tag_attrs = attrs(tag)
            input_id = tag_attrs.get("id", "")
            ok = bool(tag_attrs.get("aria-label") or tag_attrs.get("aria-labelledby") or tag_attrs.get("title")) or (
                input_id and input_id in label_fors
            )
            if not ok:
                failed.append(f"{path}: unlabeled range input {input_id or tag}")

    if failed:
        print("\n".join(failed))
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
