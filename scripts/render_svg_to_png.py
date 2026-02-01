#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
from pathlib import Path


def _palette_vars(theme: str, palette: str) -> dict[str, str]:
    # IMPORTANT: librsvg does not reliably support CSS custom properties (var(--x)).
    # For previews/exports we bake the common vars into literal hex values.
    if theme not in {"dark", "light"}:
        raise ValueError("theme must be 'dark' or 'light'")
    if palette not in {"aurora", "deep"}:
        raise ValueError("palette must be 'aurora' or 'deep'")

    aurora = {
        "--teal": "#028391",
        "--teal-bright": "#41A2AC",
        "--teal-dim": "#02626D",
        "--teal-pale": "#A6D4D8",
        "--pink": "#BE5A83",
        "--pink-bright": "#CE83A2",
        "--pink-dim": "#8E4462",
        "--pink-pale": "#E8C5D4",
        "--violet": "#7077A1",
        "--violet-bright": "#9499B8",
        "--violet-dim": "#545979",
        "--violet-pale": "#CDCFDE",
    }
    deep = {
        "--teal": "#257180",
        "--teal-bright": "#5C94A0",
        "--teal-dim": "#1C5560",
        "--teal-pale": "#B3CDD3",
        "--pink": "#A35C7A",
        "--pink-bright": "#BA859B",
        "--pink-dim": "#7A455C",
        "--pink-pale": "#DFC6D0",
        "--violet": "#655D8A",
        "--violet-bright": "#8C86A7",
        "--violet-dim": "#4C4668",
        "--violet-pale": "#C9C6D6",
    }
    chosen = aurora if palette == "aurora" else deep

    if theme == "dark":
        neutrals = {
            "--bg": "#0b0b0f",
            "--panel": "#13162a",
            "--fg": "#eef0ff",
            "--muted": "#c9cbe5",
            "--faint": "#8f92ad",
            "--grid": "#1a1c28",
            "--grid-strong": "#24263a",
        }
    else:
        neutrals = {
            "--bg": "#ffffff",
            "--panel": "#f2f3fb",
            "--fg": "#111218",
            "--muted": "#3a3d52",
            "--faint": "#666b85",
            "--grid": "#e7e8f0",
            "--grid-strong": "#cfd1df",
        }

    return {**neutrals, **chosen}


_CSS_VAR_DEF_RE = re.compile(r"(?P<name>--[a-zA-Z0-9_-]+)\s*:\s*(?P<value>[^;]+)\s*;")
_CSS_VAR_USE_RE = re.compile(r"var\(\s*(?P<name>--[a-zA-Z0-9_-]+)\s*(?:,\s*(?P<fallback>[^)]+))?\)")


def _extract_css_vars(svg_text: str) -> dict[str, str]:
    # Best-effort extraction of CSS custom properties from embedded <style> blocks.
    # This is intentionally simple: it captures "--name: value;" anywhere in the SVG.
    vars_: dict[str, str] = {}
    for m in _CSS_VAR_DEF_RE.finditer(svg_text):
        vars_[m.group("name")] = m.group("value").strip()
    return vars_


def bake_svg_vars(svg_text: str, theme: str, palette: str) -> str:
    # librsvg does not reliably evaluate CSS custom properties. For export we:
    # 1) extract declared variables from the SVG itself (e.g., --sun, --orbitW)
    # 2) override the theme/palette variables (--bg/--fg/--grid and --teal/--pink/--violet)
    # 3) replace var(--name[, fallback]) with concrete values
    vars_ = _extract_css_vars(svg_text)
    overrides = _palette_vars(theme=theme, palette=palette)
    vars_.update(overrides)

    def repl(match: re.Match[str]) -> str:
        name = match.group("name")
        fallback = match.group("fallback")
        if name in vars_:
            return vars_[name]
        if fallback is not None:
            return fallback.strip()
        return match.group(0)

    return _CSS_VAR_USE_RE.sub(repl, svg_text)


def _load_handle_from_baked_svg(svg_path: Path, theme: str, palette: str):
    import gi  # type: ignore

    gi.require_version("Rsvg", "2.0")
    from gi.repository import Rsvg  # type: ignore

    svg_text = svg_path.read_text(encoding="utf-8")
    baked = bake_svg_vars(svg_text, theme=theme, palette=palette)
    return Rsvg.Handle.new_from_data(baked.encode("utf-8"))


def _intrinsic_size_px(handle) -> tuple[int, int]:
    has_px, w_px, h_px = handle.get_intrinsic_size_in_pixels()
    if has_px and w_px > 0 and h_px > 0:
        return int(w_px), int(h_px)

    dims = handle.get_dimensions()
    w_px = int(dims.width)
    h_px = int(dims.height)
    if w_px <= 0 or h_px <= 0:
        raise RuntimeError("Could not determine SVG intrinsic size.")
    return w_px, h_px


def render_svg(svg_path: Path, out_path: Path, *, width: int | None, fmt: str, theme: str, palette: str) -> None:
    import gi  # type: ignore

    gi.require_version("Rsvg", "2.0")
    from gi.repository import Rsvg  # type: ignore

    import cairo  # type: ignore

    handle = _load_handle_from_baked_svg(svg_path, theme=theme, palette=palette)
    w_px, h_px = _intrinsic_size_px(handle)

    if width is None:
        scale = 1.0
        out_w, out_h = int(w_px), int(h_px)
    else:
        scale = width / float(w_px)
        out_w = int(round(w_px * scale))
        out_h = int(round(h_px * scale))

    out_path.parent.mkdir(parents=True, exist_ok=True)

    if fmt == "png":
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, out_w, out_h)
        ctx = cairo.Context(surface)
        ctx.scale(scale, scale)
        viewport = Rsvg.Rectangle()
        viewport.x = 0
        viewport.y = 0
        viewport.width = float(w_px)
        viewport.height = float(h_px)
        handle.render_document(ctx, viewport)
        surface.write_to_png(str(out_path))
        return

    if fmt == "pdf":
        surface = cairo.PDFSurface(str(out_path), out_w, out_h)
        ctx = cairo.Context(surface)
        ctx.scale(scale, scale)
        viewport = Rsvg.Rectangle()
        viewport.x = 0
        viewport.y = 0
        viewport.width = float(w_px)
        viewport.height = float(h_px)
        handle.render_document(ctx, viewport)
        surface.finish()
        return

    raise ValueError("fmt must be 'png' or 'pdf'")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Render an SVG to PNG or PDF using librsvg (via gi) and cairo. Bakes common CSS variables for reliable output."
    )
    parser.add_argument("svg", type=Path)
    parser.add_argument("out", type=Path, help="Output file path (.png or .pdf).")
    parser.add_argument("--format", choices=["png", "pdf"], default="png", help="Output format (default: png).")
    parser.add_argument("--width", type=int, default=1600, help="Output width in pixels (default: 1600).")
    parser.add_argument("--theme", choices=["dark", "light"], default="dark", help="Theme for baked colors (default: dark).")
    parser.add_argument(
        "--palette",
        choices=["aurora", "deep"],
        default="aurora",
        help="Accent palette for baked colors (default: aurora).",
    )
    args = parser.parse_args()

    svg_path: Path = args.svg
    out_path: Path = args.out

    if not svg_path.exists():
        raise SystemExit(f"SVG not found: {svg_path}")

    width = args.width if args.width and args.width > 0 else None
    render_svg(svg_path, out_path, width=width, fmt=args.format, theme=args.theme, palette=args.palette)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
