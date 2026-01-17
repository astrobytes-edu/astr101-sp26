#!/usr/bin/env python3
"""
Generate SCSS tokens from _brand.yml

Usage: python scripts/brand_to_scss.py
Output: assets/theme/_tokens_generated.scss

This script is the ONLY way to update color tokens.
Edit _brand.yml, then run this script.
"""

from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).parent.parent
BRAND_FILE = PROJECT_ROOT / "_brand.yml"
OUTPUT_FILE = PROJECT_ROOT / "assets/theme/_tokens_generated.scss"

# Required palette keys (referenced by slide theme)
REQUIRED_PALETTE_KEYS = [
    "bg-light", "surface-light", "surface-2-light", "border-light", "text-light", "muted-light",
    "bg-dark", "surface-dark", "surface-2-dark", "border-dark", "text-dark", "muted-dark",
    "teal-light", "teal-dark", "indigo-light", "indigo-dark",
    "gold-light", "gold-dark", "rose-light", "rose-dark",
    "purple-light", "purple-dark", "mauve-light", "mauve-dark", "slate-light", "slate-dark",
]


def main() -> int:
    # Check PyYAML availability
    try:
        import yaml
    except ImportError:
        print("ERROR: PyYAML not installed.", file=sys.stderr)
        print("Install with: pip install pyyaml>=6.0", file=sys.stderr)
        print("Or: pip install -r scripts/requirements-dev.txt", file=sys.stderr)
        return 1

    # Read brand file
    if not BRAND_FILE.exists():
        print(f"ERROR: {BRAND_FILE} not found", file=sys.stderr)
        return 1

    with open(BRAND_FILE) as f:
        brand = yaml.safe_load(f)

    palette = brand.get("color", {}).get("palette", {})
    typography = brand.get("typography", {})

    # Validate required keys
    missing = [k for k in REQUIRED_PALETTE_KEYS if k not in palette]
    if missing:
        print("ERROR: Missing required palette keys in _brand.yml:", file=sys.stderr)
        for k in sorted(missing):
            print(f"  - {k}", file=sys.stderr)
        return 1

    # Generate SCSS (deterministic: sorted keys)
    lines = [
        "// =============================================================================",
        "// GENERATED FILE — DO NOT EDIT",
        "// =============================================================================",
        "// Source: _brand.yml",
        "// Regenerate: python scripts/brand_to_scss.py",
        "//",
        "// This file contains ONLY brand identity tokens (colors + typography).",
        "// Design tokens (radii, sizing, mixins) are in _design_tokens.scss",
        "",
    ]

    # Palette colors (sorted for determinism)
    lines.append("// ---- Palette Colors ----")
    for name in sorted(palette.keys()):
        scss_name = name  # keep hyphens as-is
        lines.append(f"${scss_name}: {palette[name]};")
    lines.append("")

    # Typography
    lines.append("// ---- Typography ----")
    base_family = typography.get("base", {}).get("family", "Inter")
    mono_family = typography.get("monospace", {}).get("family", "JetBrains Mono")

    lines.append(f'$font-sans: "{base_family}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;')
    lines.append(f'$font-mono: "{mono_family}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;')
    lines.append("")

    # Write output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        f.write("\n".join(lines))

    print(f"Generated: {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
