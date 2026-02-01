#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import re
import subprocess
import tempfile
import sys
from pathlib import Path


_VIEWBOX_RE = re.compile(r"viewBox=(?P<q>['\"])(?P<v>[^'\"]+)(?P=q)")
_DEFS_RE = re.compile(r"<defs>.*?</defs>", flags=re.S)
_PAGE_RE = re.compile(r"<g[^>]*\bid=(?P<q>['\"])page1(?P=q)[^>]*>.*?</g>", flags=re.S)


def _run(cmd: list[str], *, cwd: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, cwd=str(cwd), check=False, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def _require_ok(result: subprocess.CompletedProcess[str], *, label: str) -> None:
    if result.returncode == 0:
        return
    raise SystemExit(
        "\n".join(
            [
                f"{label} failed (exit {result.returncode}).",
                "",
                "STDOUT:",
                result.stdout.strip() or "(empty)",
                "",
                "STDERR:",
                result.stderr.strip() or "(empty)",
            ]
        )
    )


def normalize_latex_backslashes(text: str) -> str:
    """
    Normalize common CLI-escaped LaTeX like ``\\alpha`` → ``\alpha``.

    Rule: collapse a pair of backslashes only when the next character is
    NOT whitespace, not end-of-string, and not another backslash. That keeps
    true LaTeX line breaks ``\\\\`` (typically followed by whitespace/newline)
    intact.
    """

    normalized = text
    for _ in range(8):
        updated = re.sub(r"\\\\(?=[^\\s\\\\])", r"\\", normalized)
        if updated == normalized:
            return normalized
        normalized = updated
    return normalized


def _latex_document(expr: str, *, display: bool, raw: bool, extra_preamble: list[str]) -> str:
    if raw:
        body = expr.rstrip() + "\n"
    elif display:
        body = "\\[\n" + expr.rstrip() + "\n\\]\n"
    else:
        body = "$" + expr.strip() + "$\n"

    preamble = "\n".join(extra_preamble).rstrip()
    if preamble:
        preamble = "\n" + preamble + "\n"

    return (
        "\\documentclass[preview]{standalone}\n"
        "\\usepackage{amsmath}\n"
        "\\usepackage{amssymb}\n"
        f"{preamble}"
        "\\begin{document}\n"
        f"{body}"
        "\\end{document}\n"
    )


def _parse_viewbox(svg_text: str) -> tuple[float, float, float, float, str]:
    m = _VIEWBOX_RE.search(svg_text)
    if not m:
        raise SystemExit("Could not find viewBox in dvisvgm SVG output.")
    view_box_raw = m.group("v").strip()
    parts = view_box_raw.replace(",", " ").split()
    if len(parts) != 4:
        raise SystemExit(f"Unexpected viewBox format: {view_box_raw!r}")
    min_x, min_y, w, h = (float(p) for p in parts)
    return min_x, min_y, w, h, view_box_raw


def _as_group_snippet(svg_text: str, *, group_id: str, latex: str, color_css: str) -> str:
    # dvisvgm emits xlink:href (SVG 1.1). For embeddable snippets inside another SVG,
    # prefer SVG2-compatible href to avoid requiring xmlns:xlink on the parent document.
    svg_text = svg_text.replace("xlink:href", "href")

    defs = _DEFS_RE.search(svg_text)
    if not defs:
        raise SystemExit("Could not find <defs>…</defs> in dvisvgm SVG output.")

    page = _PAGE_RE.search(svg_text)
    if not page:
        raise SystemExit("Could not find <g id='page1'>…</g> in dvisvgm SVG output.")

    min_x, min_y, w, h, view_box_raw = _parse_viewbox(svg_text)

    page_text = page.group(0)
    # Keep the original <g id="page1"> wrapper; we control color via inherited fill.

    safe_latex = html.escape(latex, quote=True)
    safe_title = html.escape(f"LaTeX: {latex}", quote=False)

    # Translate so the snippet's bounding box is approximately (0,0) → (w,h).
    # Users should still position/scale it with a transform on this outer group.
    tx = -min_x
    ty = -min_y

    group = (
        f'<g id="{group_id}" data-latex="{safe_latex}" data-viewBox="{view_box_raw}" '
        f'role="img" aria-label="{safe_title}" style="fill: {color_css}; color: {color_css};">\n'
        f"  <title>{safe_title}</title>\n"
        f"  <desc>Converted from LaTeX to SVG paths with dvisvgm. Intrinsic size: {w:.3f} × {h:.3f} (viewBox units).</desc>\n"
        f"  {defs.group(0)}\n"
        f'  <g transform="translate({tx:.6g} {ty:.6g})">\n'
        f"    {page_text}\n"
        f"  </g>\n"
        f"</g>\n"
    )
    # Make it self-contained and previewable by default: wrap in a minimal <svg>.
    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        "<svg xmlns=\"http://www.w3.org/2000/svg\" "
        f"viewBox=\"0 0 {w:.6g} {h:.6g}\" role=\"img\" aria-labelledby=\"title desc\">\n"
        f"  <title id=\"title\">{safe_title}</title>\n"
        f"  <desc id=\"desc\">Converted from LaTeX to SVG paths with dvisvgm. Original viewBox: {view_box_raw}.</desc>\n"
        f"  {group}\n"
        "</svg>\n"
    )


def _as_standalone_svg(svg_text: str, *, title: str, latex: str, color_css: str) -> str:
    # dvisvgm emits xlink:href (SVG 1.1). Prefer SVG2 href.
    svg_text = svg_text.replace("xlink:href", "href")

    defs = _DEFS_RE.search(svg_text)
    if not defs:
        raise SystemExit("Could not find <defs>…</defs> in dvisvgm SVG output.")

    page = _PAGE_RE.search(svg_text)
    if not page:
        raise SystemExit("Could not find <g id='page1'>…</g> in dvisvgm SVG output.")

    min_x, min_y, w, h, view_box_raw = _parse_viewbox(svg_text)
    page_text = page.group(0)
    # Control color via inherited fill on the wrapper <g>.

    safe_title = html.escape(title, quote=False)
    safe_desc = html.escape(
        f"Converted from LaTeX to SVG paths with dvisvgm. Original viewBox: {view_box_raw}.", quote=False
    )

    tx = -min_x
    ty = -min_y

    # Use viewBox units as the canvas; callers can scale arbitrarily.
    return (
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        "<svg xmlns=\"http://www.w3.org/2000/svg\" "
        f"viewBox=\"0 0 {w:.6g} {h:.6g}\" role=\"img\" aria-labelledby=\"title desc\">\n"
        f"  <title id=\"title\">{safe_title}</title>\n"
        f"  <desc id=\"desc\">{safe_desc}</desc>\n"
        f"  {defs.group(0)}\n"
        f"  <g style=\"fill: {html.escape(color_css, quote=True)}; color: {html.escape(color_css, quote=True)};\" transform=\"translate({tx:.6g} {ty:.6g})\">\n"
        f"    {page_text}\n"
        "  </g>\n"
        "</svg>\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Convert a LaTeX math snippet into an embeddable SVG <g> (paths, no fonts) via latex + dvisvgm."
    )
    parser.add_argument("latex", help="LaTeX math content (default wraps in $...$).")
    parser.add_argument("--display", action="store_true", help="Wrap in display math (\\[ ... \\]) instead of inline $...$.")
    parser.add_argument(
        "--raw",
        action="store_true",
        help="Treat input as raw LaTeX body (no wrapping). You are responsible for providing math delimiters/environments.",
    )
    parser.add_argument(
        "--preamble",
        action="append",
        default=[],
        help="Extra LaTeX preamble line(s), e.g. --preamble='\\usepackage{bm}'. Can be repeated.",
    )
    parser.add_argument(
        "--id",
        default="latex-math",
        help="id attribute for the output <g> (default: latex-math).",
    )
    parser.add_argument(
        "--format",
        choices=["group", "svg"],
        default="group",
        help="Output format: 'group' for embedding into another SVG, or 'svg' for a standalone previewable SVG (default: group).",
    )
    parser.add_argument(
        "--no-normalize-backslashes",
        action="store_true",
        help="Disable input normalization of common CLI-escaped LaTeX (\\\\alpha → \\alpha).",
    )
    parser.add_argument(
        "--color",
        default="var(--fg)",
        help="CSS color used for currentColor in the snippet (default: var(--fg)).",
    )
    parser.add_argument(
        "--out",
        type=Path,
        help="Write the snippet to this path instead of stdout (recommended extension: .svg).",
    )
    parser.add_argument(
        "--keep-temp",
        action="store_true",
        help="Keep the temp directory (prints its path) for debugging.",
    )
    args = parser.parse_args()

    latex_expr: str = args.latex
    extra_preamble: list[str] = list(args.preamble)
    if not args.no_normalize_backslashes:
        latex_expr = normalize_latex_backslashes(latex_expr)
        extra_preamble = [normalize_latex_backslashes(line) for line in extra_preamble]

    tmp_path: Path | None = None
    tmp_ctx = None
    if args.keep_temp:
        tmp_path = Path(tempfile.mkdtemp(prefix="latex-svg-"))
    else:
        tmp_ctx = tempfile.TemporaryDirectory(prefix="latex-svg-")
        tmp_path = Path(tmp_ctx.__enter__())

    try:
        tex_path = tmp_path / "math.tex"
        tex_path.write_text(
            _latex_document(latex_expr, display=args.display, raw=args.raw, extra_preamble=extra_preamble),
            encoding="utf-8",
        )

        latex_res = _run(
            ["latex", "-interaction=nonstopmode", "-halt-on-error", "-file-line-error", tex_path.name], cwd=tmp_path
        )
        _require_ok(latex_res, label="latex")

        dvi_path = tmp_path / "math.dvi"
        if not dvi_path.exists():
            raise SystemExit("latex succeeded but math.dvi was not produced.")

        svg_out_path = tmp_path / "math.svg"
        dvisvgm_res = _run(["dvisvgm", "--no-fonts", "-n", "-o", svg_out_path.name, dvi_path.name], cwd=tmp_path)
        _require_ok(dvisvgm_res, label="dvisvgm")

        svg_text = svg_out_path.read_text(encoding="utf-8")
        if args.format == "svg":
            snippet = _as_standalone_svg(svg_text, title=f"LaTeX: {latex_expr}", latex=latex_expr, color_css=args.color)
        else:
            snippet = _as_group_snippet(svg_text, group_id=args.id, latex=latex_expr, color_css=args.color)

        if args.out:
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(snippet, encoding="utf-8")
        else:
            print(snippet, end="")

        if args.keep_temp:
            print(f"\n# tempdir kept: {tmp_path}\n", file=sys.stderr)

        # dvisvgm can emit useful warnings (e.g. Ghostscript missing). Surface them non-fatally.
        # Warnings go to stderr so stdout can be piped cleanly.
        if dvisvgm_res.stderr.strip():
            print("\n# dvisvgm warnings:\n" + dvisvgm_res.stderr.strip(), file=sys.stderr)
    finally:
        if tmp_ctx is not None:
            tmp_ctx.__exit__(None, None, None)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
