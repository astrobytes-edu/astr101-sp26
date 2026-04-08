#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path
from textwrap import dedent

os.environ.setdefault("MPLCONFIGDIR", "/tmp/mplconfig")

import matplotlib as mpl


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "images" / "module-02" / "lecture-20"
PREVIEW_DIR = OUTPUT_DIR / "_previews"

# White-background defaults so every exported figure reads like a textbook asset.
BG = "#ffffff"
PANEL = "#f4f6fb"
TEXT = "#182033"
MUTED = "#5a647b"
GRID = "#d9deee"
GRID_STRONG = "#b9c3da"
TEAL = "#028391"
TEAL_PALE = "#d4eef1"
PINK = "#be5a83"
PINK_PALE = "#f3dbe5"
VIOLET = "#7077a1"
VIOLET_PALE = "#e4e6f3"
GOLD = "#d39a2e"
GOLD_PALE = "#f8ecd0"

FIGURE_KEYS = (
    "mass-fate",
    "white-dwarf-compare",
    "onion-timescales",
    "energy-budget",
    "supernova-evidence",
    "all",
)


def configure_matplotlib() -> None:
    """Set textbook-style defaults for the Lecture 20 figure suite."""

    mpl.rcParams.update(
        {
            "figure.facecolor": BG,
            "figure.edgecolor": BG,
            "savefig.facecolor": BG,
            "savefig.edgecolor": BG,
            "axes.facecolor": BG,
            "axes.edgecolor": GRID_STRONG,
            "axes.labelcolor": TEXT,
            "axes.titlecolor": TEXT,
            "axes.grid": True,
            "axes.axisbelow": True,
            "axes.prop_cycle": mpl.cycler(color=[TEAL, VIOLET, PINK, GOLD]),
            "axes.linewidth": 1.2,
            "grid.color": GRID,
            "grid.linestyle": "-",
            "grid.linewidth": 0.9,
            "grid.alpha": 0.8,
            "font.family": ["DejaVu Sans"],
            "font.size": 12,
            "axes.titlesize": 18,
            "axes.labelsize": 13,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "xtick.labelsize": 11,
            "ytick.labelsize": 11,
            "legend.frameon": False,
            "legend.fontsize": 11,
            "lines.linewidth": 2.4,
            "lines.markersize": 7,
            "patch.edgecolor": BG,
            "patch.force_edgecolor": False,
            "text.color": TEXT,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
        }
    )


def ensure_output_dirs() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)


def placeholder_svg(title: str, summary: str, accent: str) -> str:
    return dedent(
        f"""\
        <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
          <title id="title">{title}</title>
          <desc id="desc">{summary}</desc>
          <rect x="0" y="0" width="1600" height="900" fill="{BG}"/>
          <rect x="80" y="80" width="1440" height="740" rx="28" fill="{PANEL}" stroke="{GRID_STRONG}" stroke-width="4"/>
          <rect x="80" y="80" width="1440" height="84" rx="28" fill="{accent}"/>
          <text x="130" y="134" fill="#ffffff" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="38" font-weight="700">{title}</text>
          <text x="130" y="246" fill="{TEXT}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="54" font-weight="700">Figure scaffold</text>
          <text x="130" y="326" fill="{MUTED}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="30">This asset is a placeholder for the Lecture 20 textbook-quality figure.</text>
          <text x="130" y="382" fill="{MUTED}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="30">The final version will be rendered in a white-background export pipeline.</text>
          <rect x="130" y="460" width="1340" height="10" rx="5" fill="{GRID}"/>
          <rect x="130" y="460" width="820" height="10" rx="5" fill="{accent}"/>
          <text x="130" y="560" fill="{TEXT}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="34" font-weight="600">What to notice: {summary}</text>
          <text x="130" y="620" fill="{MUTED}" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="28">Replace this scaffold with the finalized infographic, chart, or schematic.</text>
        </svg>
        """
    )


def write_svg(name: str, svg_text: str) -> Path:
    ensure_output_dirs()
    out_path = OUTPUT_DIR / f"lecture-20-{name}.svg"
    out_path.write_text(svg_text, encoding="utf-8")
    return out_path


def build_mass_fate() -> Path:
    return write_svg(
        "mass-determines-fate",
        placeholder_svg(
            "Lecture 20: Mass Determines Stellar Fate",
            "initial mass determines which endpoint a star reaches",
            TEAL,
        ),
    )


def build_white_dwarf_compare() -> Path:
    return write_svg(
        "white-dwarf-hot-but-dim",
        placeholder_svg(
            "Lecture 20: White Dwarfs Are Hot but Dim",
            "tiny surface area beats high temperature in luminosity",
            VIOLET,
        ),
    )


def build_onion_timescales() -> Path:
    return write_svg(
        "onion-burning-timescales",
        placeholder_svg(
            "Lecture 20: Massive-Star Burning Timescales",
            "late burning stages accelerate dramatically toward collapse",
            GOLD,
        ),
    )


def build_energy_budget() -> Path:
    return write_svg(
        "core-collapse-energy-budget",
        placeholder_svg(
            "Lecture 20: Core-Collapse Energy Budget",
            "neutrinos dominate the energy ledger while visible light remains tiny",
            PINK,
        ),
    )


def build_supernova_evidence() -> Path:
    return write_svg(
        "typeia-vs-typeii-evidence",
        placeholder_svg(
            "Lecture 20: Type Ia vs Type II Evidence",
            "observable evidence distinguishes the explosion mechanisms",
            TEAL,
        ),
    )


def build_figure(key: str) -> list[Path]:
    if key == "mass-fate":
        return [build_mass_fate()]
    if key == "white-dwarf-compare":
        return [build_white_dwarf_compare()]
    if key == "onion-timescales":
        return [build_onion_timescales()]
    if key == "energy-budget":
        return [build_energy_budget()]
    if key == "supernova-evidence":
        return [build_supernova_evidence()]
    if key == "all":
        return [
            build_mass_fate(),
            build_white_dwarf_compare(),
            build_onion_timescales(),
            build_energy_budget(),
            build_supernova_evidence(),
        ]
    raise ValueError(f"Unknown figure key: {key}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate scaffold figures for Lecture 20.")
    parser.add_argument(
        "--figure",
        choices=FIGURE_KEYS,
        default="all",
        help="Figure to generate (default: all scaffold figures).",
    )
    args = parser.parse_args()

    configure_matplotlib()
    outputs = build_figure(args.figure)

    for path in outputs:
        print(path)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
