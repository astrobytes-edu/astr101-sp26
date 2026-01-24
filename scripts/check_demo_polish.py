#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DEMOS_DIR = REPO_ROOT / "demos"
MANIFEST_PATH = DEMOS_DIR / "polish-manifest.json"


REQUIRED_LINK_HREFS = [
    "../_assets/astro-theme.css",
    "../_assets/demo-shell.css",
    "../_assets/demo-legacy.css",
]

REQUIRED_SCRIPT_SRCS = [
    "../_assets/astro-utils.js",
    "../_assets/demo-polish.js",
    "../_assets/starfield.js",
]


FORBIDDEN_INLINE_CSS_SNIPPETS = [
    ".preset-btn {",
    ".readout-label {",
    ".readout-value {",
]


FORBIDDEN_INLINE_CSS_FONT_SIZE_RE = re.compile(
    r"""
    \.(preset-btn|readout-label|readout-value)\s*\{   # selector
    [^}]*?                                            # body
    font-size:\s*(0\.7rem|0\.75rem)\s*;                # too-small sizes
    """,
    re.IGNORECASE | re.VERBOSE | re.DOTALL,
)


def _load_manifest() -> dict:
    if not MANIFEST_PATH.exists():
        raise FileNotFoundError(f"Missing manifest: {MANIFEST_PATH}")
    with MANIFEST_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _assert_contains_all(html: str, required: list[str], kind: str, demo: str) -> list[str]:
    errors: list[str] = []
    for item in required:
        if item not in html:
            errors.append(f"{demo}: missing required {kind}: {item}")
    return errors


def _check_demo(demo: str) -> list[str]:
    errors: list[str] = []
    index_path = DEMOS_DIR / demo / "index.html"
    if not index_path.exists():
        return [f"{demo}: missing {index_path}"]

    html = _read_text(index_path)

    errors.extend(_assert_contains_all(html, REQUIRED_LINK_HREFS, "stylesheet href", demo))
    errors.extend(_assert_contains_all(html, REQUIRED_SCRIPT_SRCS, "script src", demo))

    for snippet in FORBIDDEN_INLINE_CSS_SNIPPETS:
        if snippet in html:
            errors.append(
                f"{demo}: contains forbidden inline CSS snippet {snippet!r} (should rely on shared theme/legacy bridge)"
            )

    if FORBIDDEN_INLINE_CSS_FONT_SIZE_RE.search(html):
        errors.append(f"{demo}: contains legacy too-small font sizes (0.7rem/0.75rem) inside forbidden selectors")

    return errors


def _collect_demo_dirs() -> list[str]:
    if not DEMOS_DIR.exists():
        return []
    demos: list[str] = []
    for child in sorted(DEMOS_DIR.iterdir()):
        if not child.is_dir():
            continue
        if child.name.startswith("_"):
            continue
        if child.name in {"README.md", "CHANGELOG.md"}:
            continue
        if (child / "index.html").exists():
            demos.append(child.name)
    return demos


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify demo visual-polish migration status.")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Report status for all demos (does not fail on non-polished demos).",
    )
    args = parser.parse_args()

    manifest = _load_manifest()
    polished = manifest.get("polished")
    if not isinstance(polished, list) or not all(isinstance(x, str) for x in polished):
        print("Manifest format error: expected {\"polished\": [\"demo-name\", ...]}", file=sys.stderr)
        return 2

    if args.all:
        demos = _collect_demo_dirs()
        print(f"Found {len(demos)} demos with index.html.")
        print(f"Manifest marks {len(polished)} demos as polished.")
        return 0

    errors: list[str] = []
    for demo in polished:
        errors.extend(_check_demo(demo))

    if errors:
        for err in errors:
            print(err, file=sys.stderr)
        print(f"FAIL: {len(errors)} issue(s) across {len(polished)} polished demo(s).", file=sys.stderr)
        return 1

    print(f"PASS: {len(polished)} polished demo(s) checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

