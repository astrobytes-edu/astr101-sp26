#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


def render_svg_to_png(svg_path: Path, png_path: Path, width: int | None) -> None:
    import gi  # type: ignore

    gi.require_version("Rsvg", "2.0")
    from gi.repository import Rsvg  # type: ignore

    import cairo  # type: ignore

    handle = Rsvg.Handle.new_from_file(str(svg_path))

    has_px, w_px, h_px = handle.get_intrinsic_size_in_pixels()
    if not has_px or w_px <= 0 or h_px <= 0:
        dims = handle.get_dimensions()
        w_px = int(dims.width)
        h_px = int(dims.height)
        if w_px <= 0 or h_px <= 0:
            raise RuntimeError(f"Could not determine SVG size for {svg_path}")

    if width is None:
        scale = 1.0
        out_w, out_h = int(w_px), int(h_px)
    else:
        scale = width / float(w_px)
        out_w = int(round(w_px * scale))
        out_h = int(round(h_px * scale))

    png_path.parent.mkdir(parents=True, exist_ok=True)

    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, out_w, out_h)
    ctx = cairo.Context(surface)
    ctx.scale(scale, scale)

    viewport = Rsvg.Rectangle()
    viewport.x = 0
    viewport.y = 0
    viewport.width = float(w_px)
    viewport.height = float(h_px)

    handle.render_document(ctx, viewport)
    surface.write_to_png(str(png_path))


def main() -> int:
    parser = argparse.ArgumentParser(description="Render an SVG to a PNG using librsvg (via gi) and cairo.")
    parser.add_argument("svg", type=Path)
    parser.add_argument("png", type=Path)
    parser.add_argument("--width", type=int, default=1600, help="Output width in pixels (default: 1600).")
    args = parser.parse_args()

    svg_path: Path = args.svg
    png_path: Path = args.png

    if not svg_path.exists():
        raise SystemExit(f"SVG not found: {svg_path}")

    width = args.width if args.width and args.width > 0 else None
    render_svg_to_png(svg_path, png_path, width)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

