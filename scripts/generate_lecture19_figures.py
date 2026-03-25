#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/mplconfig")

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch, Rectangle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "images" / "module-02"

BG = "#fbfbff"
PANEL = "#f3f5fb"
TEXT = "#182033"
MUTED = "#53607a"
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
STAR_HOT = "#6aa7ff"
STAR_WARM = "#f5f1da"
STAR_COOL = "#ef9152"
STAR_COOL_DARK = "#c96c31"
STAR_WHITE_DWARF = "#c9e8ff"


def configure_matplotlib() -> None:
    mpl.rcParams.update(
        {
            "figure.facecolor": BG,
            "axes.facecolor": BG,
            "savefig.facecolor": BG,
            "font.family": "DejaVu Sans",
            "font.size": 12,
            "axes.edgecolor": GRID_STRONG,
            "axes.labelcolor": TEXT,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "text.color": TEXT,
            "axes.titlecolor": TEXT,
        }
    )


def temp_to_color(temp: np.ndarray | float) -> np.ndarray:
    cmap = LinearSegmentedColormap.from_list(
        "stellar_temp",
        [(0.0, STAR_COOL), (0.5, STAR_WARM), (1.0, STAR_HOT)],
    )
    temps = np.asarray(temp, dtype=float)
    scaled = np.clip((temps - 3500.0) / (20000.0 - 3500.0), 0.0, 1.0)
    return cmap(scaled)


def add_card(ax, x: float, y: float, w: float, h: float, accent: str, title: str, subtitle: str) -> None:
    shadow = FancyBboxPatch(
        (x + 0.7, y - 0.7),
        w,
        h,
        boxstyle="round,pad=0.012,rounding_size=4.0",
        linewidth=0,
        facecolor="#d6dced",
        alpha=0.35,
        zorder=1,
    )
    card = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.012,rounding_size=4.0",
        linewidth=1.4,
        edgecolor=GRID_STRONG,
        facecolor="white",
        zorder=2,
    )
    header = FancyBboxPatch(
        (x + 1.2, y + h - 11.5),
        w - 2.4,
        8.2,
        boxstyle="round,pad=0.01,rounding_size=2.5",
        linewidth=0,
        facecolor=accent,
        zorder=3,
    )
    ax.add_patch(shadow)
    ax.add_patch(card)
    ax.add_patch(header)
    ax.text(x + 3, y + h - 7.3, title, fontsize=15, fontweight="bold", color="white", zorder=4)
    ax.text(x + 3, y + h - 15.6, subtitle, fontsize=9.8, color=MUTED, zorder=4)


def add_arrow(ax, start: tuple[float, float], end: tuple[float, float], color: str) -> None:
    arrow = FancyArrowPatch(
        start,
        end,
        arrowstyle="-|>",
        mutation_scale=22,
        linewidth=2.6,
        color=color,
        zorder=4,
        shrinkA=0,
        shrinkB=0,
    )
    ax.add_patch(arrow)


def add_section_title(fig, title: str, subtitle: str) -> None:
    fig.text(0.05, 0.95, title, fontsize=24, fontweight="bold", color=TEXT)
    fig.text(0.05, 0.91, subtitle, fontsize=12.5, color=MUTED)


def draw_star_icon(ax, x: float, y: float, radius: float, color: str, halo: str, z: int = 5) -> None:
    ax.add_patch(Circle((x, y), radius * 1.5, facecolor=halo, edgecolor="none", alpha=0.28, zorder=z))
    ax.add_patch(Circle((x, y), radius, facecolor=color, edgecolor="white", linewidth=1.0, zorder=z + 1))


def generate_inference_flow(output_path: Path, preview_dir: Path | None) -> None:
    fig = plt.figure(figsize=(12.8, 7.2), dpi=180)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    add_section_title(
        fig,
        "How Astronomers Know Stars Evolve",
        "Astronomy compares many stars at different stages, then uses physics to connect those snapshots into one life story.",
    )

    add_card(ax, 4.5, 20, 27.5, 61, TEAL, "Observable", "Many stars in many phases")
    add_card(ax, 36.5, 20, 27.5, 61, VIOLET, "Model", "Patterns become physics")
    add_card(ax, 68.5, 20, 27.5, 61, PINK, "Inference", "Snapshots become a life story")

    add_arrow(ax, (32.4, 50.5), (35.0, 50.5), VIOLET)
    add_arrow(ax, (64.4, 50.5), (67.0, 50.5), PINK)

    # Observable card icons
    draw_star_icon(ax, 12, 59, 2.0, STAR_HOT, TEAL_PALE)
    draw_star_icon(ax, 15, 56.5, 1.4, STAR_WARM, TEAL_PALE)
    draw_star_icon(ax, 17.4, 60.6, 1.1, STAR_WHITE_DWARF, TEAL_PALE)
    ax.text(9.4, 51.7, "Young clusters", fontsize=10.5, fontweight="bold")
    ax.text(9.4, 48.8, "Born together", fontsize=9.4, color=MUTED)

    temps = np.linspace(17000, 3800, 6)
    xs = np.linspace(10.5, 18.2, 6)
    ys = np.linspace(41.5, 37.2, 6)
    for x, y, t, r in zip(xs, ys, temps, np.linspace(1.7, 1.0, 6)):
        draw_star_icon(ax, x, y, r, temp_to_color(t), TEAL_PALE, z=5)
    ax.text(9.4, 31.8, "Main sequence", fontsize=10.5, fontweight="bold")
    ax.text(9.4, 28.9, "Same phase, different masses", fontsize=9.4, color=MUTED)

    draw_star_icon(ax, 23.8, 59, 3.0, STAR_COOL, TEAL_PALE)
    draw_star_icon(ax, 27.6, 56.3, 2.4, STAR_COOL_DARK, TEAL_PALE)
    ax.text(21.0, 51.7, "Red giants", fontsize=10.5, fontweight="bold")
    ax.text(21.0, 48.8, "Cool, huge, bright", fontsize=9.4, color=MUTED)

    draw_star_icon(ax, 24.5, 39.5, 0.95, STAR_WHITE_DWARF, TEAL_PALE)
    draw_star_icon(ax, 28.0, 37.0, 0.82, STAR_WHITE_DWARF, TEAL_PALE)
    ax.text(21.0, 31.8, "White dwarfs", fontsize=10.5, fontweight="bold")
    ax.text(21.0, 28.9, "Hot compact remnants", fontsize=9.4, color=MUTED)

    # Model card: mini H-R diagram
    hr = fig.add_axes([0.405, 0.31, 0.17, 0.31])
    hr.set_facecolor(PANEL)
    hr.spines[["top", "right"]].set_visible(False)
    hr.spines["left"].set_color(GRID_STRONG)
    hr.spines["bottom"].set_color(GRID_STRONG)
    hr.grid(True, color=GRID, linewidth=0.8, alpha=0.65)
    t = np.linspace(18000, 3400, 60)
    log_l = np.interp(np.log10(t), [np.log10(3400), np.log10(18000)], [-1.0, 3.0])
    hr.scatter(t, 10 ** log_l, s=25, c=temp_to_color(t), edgecolor="white", linewidth=0.4, zorder=3)
    giant_t = np.array([5200, 4700, 4300])
    giant_l = np.array([60, 180, 420])
    hr.scatter(giant_t, giant_l, s=40, c=temp_to_color(giant_t), edgecolor="white", linewidth=0.5, zorder=4)
    hr.set_xlim(19000, 3200)
    hr.set_ylim(0.07, 800)
    hr.set_yscale("log")
    hr.set_xticks([15000, 8000, 4000])
    hr.set_yticks([0.1, 1, 10, 100])
    hr.get_yaxis().set_major_formatter(mpl.ticker.FormatStrFormatter("%g"))
    hr.tick_params(labelsize=8)
    hr.set_xlabel("Temperature (K)", fontsize=8.5)
    hr.set_ylabel("Luminosity", fontsize=8.5)
    hr.text(0.06, 0.92, "H-R diagram", transform=hr.transAxes, fontsize=8.8, fontweight="bold", color=TEXT)

    chips = [
        (39.6, 25.5, 6.7, 3.7, TEAL_PALE, "equilibrium"),
        (47.5, 25.5, 5.8, 3.7, VIOLET_PALE, "fusion"),
        (54.4, 25.5, 5.1, 3.7, GOLD_PALE, "mass"),
    ]
    for x, y, w, h, fill, label in chips:
        chip = FancyBboxPatch(
            (x, y),
            w,
            h,
            boxstyle="round,pad=0.01,rounding_size=1.6",
            linewidth=0,
            facecolor=fill,
            zorder=4,
        )
        ax.add_patch(chip)
        ax.text(x + w / 2, y + h / 2, label, ha="center", va="center", fontsize=8.4, color=TEXT, zorder=5)

    # Inference card
    ax.text(71.5, 57.8, "One life story emerges:", fontsize=10.0, fontweight="bold")
    nodes = [
        (74.0, 46.0, 2.0, STAR_WARM, "Main\nsequence"),
        (82.4, 46.0, 3.2, STAR_COOL, "Red\ngiant"),
        (90.4, 52.0, 0.95, STAR_WHITE_DWARF, "White\ndwarf"),
        (90.4, 38.0, 1.9, STAR_HOT, "Supernova\nremnant"),
    ]
    for x, y, r, color, label in nodes:
        draw_star_icon(ax, x, y, r, color, PINK_PALE)
        ax.text(x, y - 6.2, label, ha="center", va="top", fontsize=9.2, fontweight="bold")
    add_arrow(ax, (76.6, 46.0), (79.2, 46.0), GOLD)
    add_arrow(ax, (85.3, 47.4), (88.2, 50.9), PINK)
    add_arrow(ax, (85.1, 44.6), (88.0, 39.7), PINK)
    ax.text(86.7, 54.4, "lower mass", fontsize=8.1, color=MUTED, ha="center")
    ax.text(85.9, 31.3, "higher mass", fontsize=8.1, color=MUTED, ha="center")

    footer = FancyBboxPatch(
        (5, 6.5),
        91,
        8.3,
        boxstyle="round,pad=0.012,rounding_size=3",
        linewidth=0,
        facecolor=GOLD_PALE,
        zorder=2,
    )
    ax.add_patch(footer)
    ax.text(
        50.5,
        10.6,
        "Key idea: astronomers infer stellar evolution by comparing populations and connecting them with physics — not by waiting for one star to age in front of us.",
        fontsize=10.6,
        ha="center",
        va="center",
        color=TEXT,
        fontweight="bold",
    )

    save_figure(fig, output_path, preview_dir)


def generate_same_temp_radius(output_path: Path, preview_dir: Path | None) -> None:
    fig = plt.figure(figsize=(12.8, 7.2), dpi=180)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")

    add_section_title(
        fig,
        "Same Temperature, Different Luminosity Means Different Radius",
        "If two stars have the same surface temperature, the more luminous one must have the larger radius.",
    )

    main_panel = FancyBboxPatch(
        (4.5, 12),
        91,
        70,
        boxstyle="round,pad=0.012,rounding_size=4.2",
        linewidth=1.3,
        edgecolor=GRID_STRONG,
        facecolor="white",
        zorder=1,
    )
    ax.add_patch(main_panel)

    ax.add_patch(Rectangle((6.7, 18), 54.5, 58, facecolor=PANEL, edgecolor="none", zorder=1))
    ax.add_patch(Rectangle((63.5, 18), 29.8, 58, facecolor=VIOLET_PALE, edgecolor="none", zorder=1))

    ax.text(11.0, 71.0, "Hold temperature fixed", fontsize=16, fontweight="bold")
    ax.text(11.0, 66.7, "Both stars below have the same surface color and the same temperature: 4,500 K.", fontsize=10.9, color=MUTED)

    # Stars
    left_x, right_x = 24.0, 48.2
    y = 45.5
    draw_star_icon(ax, left_x, y, 5.2, STAR_COOL, GOLD_PALE, z=4)
    draw_star_icon(ax, right_x, y, 10.2, STAR_COOL, GOLD_PALE, z=4)

    ax.text(left_x, 28.8, "smaller radius", ha="center", fontsize=11.4, fontweight="bold")
    ax.text(left_x, 25.0, "lower luminosity", ha="center", fontsize=10.1, color=MUTED)
    ax.text(left_x, 21.8, "same 4,500 K surface", ha="center", fontsize=9.2, color=MUTED)

    ax.text(right_x, 28.8, "larger radius", ha="center", fontsize=11.4, fontweight="bold")
    ax.text(right_x, 25.0, "higher luminosity", ha="center", fontsize=10.1, color=MUTED)
    ax.text(right_x, 21.8, "same 4,500 K surface", ha="center", fontsize=9.2, color=MUTED)

    ax.add_patch(FancyArrowPatch((30.8, 45.5), (37.8, 45.5), arrowstyle="-|>", mutation_scale=22, linewidth=3.0, color=GOLD))
    ax.text(34.5, 49.4, "more surface area", ha="center", fontsize=10.1, color=MUTED)

    equation_box = FancyBboxPatch(
        (19.4, 57.2),
        33.8,
        10.0,
        boxstyle="round,pad=0.012,rounding_size=3",
        linewidth=1.0,
        edgecolor="#edd39a",
        facecolor=GOLD_PALE,
        zorder=3,
    )
    ax.add_patch(equation_box)
    ax.text(36.3, 62.4, r"$L = 4\pi R^2 \sigma T^4$", ha="center", va="center", fontsize=16, fontweight="bold")
    ax.text(36.3, 58.8, r"At fixed $T$:  luminosity rises as radius squared.", ha="center", va="center", fontsize=10.2, color=MUTED)

    # Mini H-R panel
    hr = fig.add_axes([0.675, 0.27, 0.22, 0.43])
    hr.set_facecolor("white")
    hr.spines[["top", "right"]].set_visible(False)
    hr.spines["left"].set_color(GRID_STRONG)
    hr.spines["bottom"].set_color(GRID_STRONG)
    hr.grid(True, color=GRID, linewidth=0.8, alpha=0.7)
    hr.set_xlim(9000, 3200)
    hr.set_ylim(0.1, 400)
    hr.set_yscale("log")
    hr.set_xticks([8000, 6000, 4000])
    hr.set_yticks([0.1, 1, 10, 100])
    hr.get_yaxis().set_major_formatter(mpl.ticker.FormatStrFormatter("%g"))
    hr.tick_params(labelsize=8.5)
    hr.set_xlabel("Temperature (K)", fontsize=8.8)
    hr.set_ylabel("Luminosity", fontsize=8.8)
    hr.text(0.08, 0.92, "H-R reading", transform=hr.transAxes, fontsize=10, fontweight="bold")

    x_temp = 4500
    hr.plot([x_temp, x_temp], [0.4, 90], linestyle="--", color=VIOLET, linewidth=1.8, alpha=0.9)
    hr.scatter([x_temp, x_temp], [0.8, 55], s=[70, 170], color=STAR_COOL, edgecolor="white", linewidth=0.8, zorder=4)
    hr.annotate(
        "same temperature",
        xy=(x_temp, 120),
        xytext=(6100, 170),
        fontsize=9.3,
        color=MUTED,
        arrowprops=dict(arrowstyle="-|>", color=VIOLET, linewidth=1.4),
    )
    hr.annotate(
        "giant: same T,\nmuch higher L",
        xy=(x_temp, 55),
        xytext=(7600, 40),
        fontsize=9.1,
        color=MUTED,
        arrowprops=dict(arrowstyle="-|>", color=PINK, linewidth=1.4),
    )
    hr.annotate(
        "smaller star",
        xy=(x_temp, 0.8),
        xytext=(7600, 1.7),
        fontsize=9.1,
        color=MUTED,
        arrowprops=dict(arrowstyle="-|>", color=TEAL, linewidth=1.4),
    )

    footer = FancyBboxPatch(
        (9, 7.0),
        82,
        7.6,
        boxstyle="round,pad=0.012,rounding_size=3",
        linewidth=0,
        facecolor=PINK_PALE,
        zorder=2,
    )
    ax.add_patch(footer)
    ax.text(
        50,
        10.8,
        "What to notice: a star can be cool and bright if its radius is huge. That is why red giants sit in the upper-right part of the H-R diagram.",
        ha="center",
        va="center",
        fontsize=10.5,
        fontweight="bold",
    )

    save_figure(fig, output_path, preview_dir)


def cluster_main_sequence(masses: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    lum = masses ** 3.5
    log_t = np.interp(np.log10(masses), [np.log10(0.6), np.log10(6.0)], [3.56, 4.20])
    temp = 10 ** log_t
    return temp, lum


def generate_cluster_turnoff(output_path: Path, preview_dir: Path | None) -> None:
    fig, axes = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=180)
    fig.patch.set_facecolor(BG)
    plt.subplots_adjust(left=0.08, right=0.96, top=0.78, bottom=0.19, wspace=0.18)
    add_section_title(
        fig,
        "Cluster Turnoff as a Clock",
        "As a cluster ages, the hottest short-lived stars disappear first, so the turnoff moves downward and to the right.",
    )

    for ax in axes:
        ax.set_facecolor("white")
        ax.spines[["top", "right"]].set_visible(False)
        ax.spines["left"].set_color(GRID_STRONG)
        ax.spines["bottom"].set_color(GRID_STRONG)
        ax.grid(True, color=GRID, linewidth=0.8, alpha=0.75)
        ax.set_xlim(20000, 3200)
        ax.set_ylim(0.03, 3000)
        ax.set_yscale("log")
        ax.set_xticks([18000, 10000, 6000, 4000])
        ax.set_yticks([0.1, 1, 10, 100, 1000])
        ax.get_yaxis().set_major_formatter(mpl.ticker.FormatStrFormatter("%g"))
        ax.tick_params(labelsize=9)
        ax.set_xlabel("Surface temperature (K)", fontsize=10)

    axes[0].set_ylabel(r"Luminosity ($L_\odot$)", fontsize=10)

    # Young cluster
    rng = np.random.default_rng(19)
    young_m = np.linspace(0.65, 5.2, 42)
    young_t, young_l = cluster_main_sequence(young_m)
    young_t *= 10 ** rng.normal(0, 0.012, young_t.size)
    young_l *= 10 ** rng.normal(0, 0.05, young_l.size)
    young_sizes = np.interp(young_l, [young_l.min(), young_l.max()], [30, 120])
    axes[0].scatter(young_t, young_l, s=young_sizes, c=temp_to_color(young_t), edgecolor="white", linewidth=0.6, zorder=3)
    young_giant_t = np.array([8300, 7200, 6100, 5000])
    young_giant_l = np.array([90, 180, 360, 650])
    axes[0].scatter(
        young_giant_t,
        young_giant_l,
        s=[130, 150, 170, 190],
        c=temp_to_color(young_giant_t),
        edgecolor="white",
        linewidth=0.7,
        zorder=4,
    )
    y_turn_t, y_turn_l = cluster_main_sequence(np.array([5.2]))
    y_turn_t_scalar = float(y_turn_t[0])
    y_turn_l_scalar = float(y_turn_l[0])
    axes[0].scatter([y_turn_t_scalar], [y_turn_l_scalar], s=210, facecolor="none", edgecolor=GOLD, linewidth=2.4, zorder=5)
    axes[0].annotate(
        "Turnoff\nhigh and blue",
        xy=(y_turn_t_scalar, y_turn_l_scalar),
        xytext=(13300, 1200),
        fontsize=10,
        fontweight="bold",
        color=TEXT,
        arrowprops=dict(arrowstyle="-|>", color=GOLD, linewidth=1.8),
        ha="center",
    )
    axes[0].set_title("Young cluster", fontsize=14, fontweight="bold", pad=12)
    axes[0].text(0.03, 0.92, "Massive hot stars are\nstill on the main sequence.", transform=axes[0].transAxes, fontsize=10, color=MUTED)

    # Old cluster
    old_m = np.linspace(0.65, 1.4, 34)
    old_t, old_l = cluster_main_sequence(old_m)
    old_t *= 10 ** rng.normal(0, 0.01, old_t.size)
    old_l *= 10 ** rng.normal(0, 0.035, old_l.size)
    old_sizes = np.interp(old_l, [old_l.min(), old_l.max()], [26, 90])
    axes[1].scatter(old_t, old_l, s=old_sizes, c=temp_to_color(old_t), edgecolor="white", linewidth=0.6, zorder=3)
    old_giant_t = np.array([5600, 5100, 4700, 4300, 4100])
    old_giant_l = np.array([12, 26, 55, 110, 190])
    axes[1].scatter(
        old_giant_t,
        old_giant_l,
        s=[110, 125, 145, 165, 175],
        c=temp_to_color(old_giant_t),
        edgecolor="white",
        linewidth=0.7,
        zorder=4,
    )
    o_turn_t, o_turn_l = cluster_main_sequence(np.array([1.4]))
    o_turn_t_scalar = float(o_turn_t[0])
    o_turn_l_scalar = float(o_turn_l[0])
    axes[1].scatter([o_turn_t_scalar], [o_turn_l_scalar], s=180, facecolor="none", edgecolor=GOLD, linewidth=2.4, zorder=5)
    axes[1].annotate(
        "Turnoff\nlower and redder",
        xy=(o_turn_t_scalar, o_turn_l_scalar),
        xytext=(10300, 45),
        fontsize=10,
        fontweight="bold",
        color=TEXT,
        arrowprops=dict(arrowstyle="-|>", color=GOLD, linewidth=1.8),
        ha="center",
    )
    axes[1].set_title("Older cluster", fontsize=14, fontweight="bold", pad=12)
    axes[1].text(0.03, 0.92, "Only less-massive stars remain\non the main sequence.", transform=axes[1].transAxes, fontsize=10, color=MUTED)

    # Figure-level callout
    fig.text(
        0.5,
        0.11,
        "What to notice: the turnoff point acts like a clock because the most massive stars leave the main sequence first.",
        ha="center",
        va="center",
        fontsize=11,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.6", facecolor=TEAL_PALE, edgecolor="none"),
        color=TEXT,
    )

    fig.text(0.5, 0.15, "Cluster age increases  →", ha="center", va="center", fontsize=11, color=MUTED)

    save_figure(fig, output_path, preview_dir)


def save_figure(fig: plt.Figure, output_path: Path, preview_dir: Path | None) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, format="svg", bbox_inches="tight")
    if preview_dir is not None:
        preview_dir.mkdir(parents=True, exist_ok=True)
        fig.savefig(preview_dir / f"{output_path.stem}.png", dpi=180, bbox_inches="tight")
    plt.close(fig)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate polished Python figures for Lecture 19.")
    parser.add_argument(
        "--preview-dir",
        type=Path,
        default=None,
        help="Optional directory for PNG previews.",
    )
    args = parser.parse_args()

    configure_matplotlib()

    generate_inference_flow(OUTPUT_DIR / "stellar-evolution-inference-flow.svg", args.preview_dir)
    generate_same_temp_radius(OUTPUT_DIR / "same-temperature-different-luminosity-radius.svg", args.preview_dir)
    generate_cluster_turnoff(OUTPUT_DIR / "cluster-turnoff-clock.svg", args.preview_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
