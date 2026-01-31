#!/usr/bin/env python3
from __future__ import annotations

import argparse
import math
from dataclasses import dataclass


@dataclass(frozen=True)
class Point:
    x: float
    y: float


def polygon_area(points: list[Point]) -> float:
    area = 0.0
    for p1, p2 in zip(points, points[1:] + points[:1]):
        area += p1.x * p2.y - p2.x * p1.y
    return abs(area) / 2.0


def ellipse_point(cx: float, cy: float, a: float, b: float, t: float) -> Point:
    return Point(cx + a * math.cos(t), cy + b * math.sin(t))


def wedge_area(
    focus: Point,
    cx: float,
    cy: float,
    a: float,
    b: float,
    t1: float,
    t2: float,
    steps: int = 240,
) -> float:
    points = [focus]
    for i in range(steps + 1):
        t = t1 + (t2 - t1) * i / steps
        points.append(ellipse_point(cx, cy, a, b, t))
    return polygon_area(points)


def solve_beta_for_equal_area(
    *,
    focus: Point,
    cx: float,
    cy: float,
    a: float,
    b: float,
    alpha: float,
    steps: int,
) -> tuple[float, float]:
    # Perihelion is at t = pi for a focus offset to the left (cx - e*a).
    target_area = wedge_area(focus, cx, cy, a, b, math.pi - alpha, math.pi + alpha, steps=steps)

    def area_at_beta(beta: float) -> float:
        return wedge_area(focus, cx, cy, a, b, -beta, beta, steps=steps)

    lo, hi = 1e-6, math.pi - 1e-6
    for _ in range(80):
        mid = (lo + hi) / 2.0
        if area_at_beta(mid) < target_area:
            lo = mid
        else:
            hi = mid

    beta = (lo + hi) / 2.0
    return beta, target_area


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Compute equal-area sector parameters for Kepler II wedge diagrams on an ellipse with a focus offset."
    )
    parser.add_argument("--e", type=float, default=0.4, help="Eccentricity (0<e<1). Default: 0.4")
    parser.add_argument("--a", type=float, default=320.0, help="Semimajor axis in SVG units. Default: 320")
    parser.add_argument("--b", type=float, default=180.0, help="Semiminor axis in SVG units. Default: 180")
    parser.add_argument("--cx", type=float, default=480.0, help="Ellipse center x. Default: 480")
    parser.add_argument("--cy", type=float, default=300.0, help="Ellipse center y. Default: 300")
    parser.add_argument("--alpha", type=float, default=0.9, help="Half-width (radians) of perihelion sector around t=pi. Default: 0.9")
    parser.add_argument("--steps", type=int, default=300, help="Polygon steps for numeric area. Default: 300")
    args = parser.parse_args()

    if not (0.0 < args.e < 1.0):
        raise SystemExit("--e must be between 0 and 1 (exclusive).")
    if args.a <= 0 or args.b <= 0:
        raise SystemExit("--a and --b must be positive.")
    if args.alpha <= 0 or args.alpha >= math.pi:
        raise SystemExit("--alpha must be in (0, pi).")

    focus = Point(args.cx - args.e * args.a, args.cy)

    beta, target_area = solve_beta_for_equal_area(
        focus=focus, cx=args.cx, cy=args.cy, a=args.a, b=args.b, alpha=args.alpha, steps=args.steps
    )

    # Key points for SVG paths
    peri1 = ellipse_point(args.cx, args.cy, args.a, args.b, math.pi - args.alpha)
    peri2 = ellipse_point(args.cx, args.cy, args.a, args.b, math.pi + args.alpha)
    aph1 = ellipse_point(args.cx, args.cy, args.a, args.b, -beta)
    aph2 = ellipse_point(args.cx, args.cy, args.a, args.b, beta)

    # Sanity check
    area_peri = wedge_area(focus, args.cx, args.cy, args.a, args.b, math.pi - args.alpha, math.pi + args.alpha, steps=args.steps)
    area_aph = wedge_area(focus, args.cx, args.cy, args.a, args.b, -beta, beta, steps=args.steps)

    print("Inputs:")
    print(f"  e={args.e:.4f}  a={args.a:.2f}  b={args.b:.2f}  center=({args.cx:.2f},{args.cy:.2f})")
    print(f"  alpha={args.alpha:.6f} rad (perihelion sector half-width)")
    print("")
    print("Solved:")
    print(f"  beta={beta:.6f} rad (aphelion sector half-width giving equal area)")
    print("")
    print("Equal-area check (numeric):")
    print(f"  area_peri={area_peri:.6f}")
    print(f"  area_aph ={area_aph:.6f}")
    print(f"  rel_diff={(area_aph-area_peri)/target_area:+.3e}")
    print("")
    print("SVG points (x,y):")
    print(f"  focus = ({focus.x:.3f}, {focus.y:.3f})")
    print(f"  peri_start = ({peri1.x:.3f}, {peri1.y:.3f})  [t=pi-alpha]")
    print(f"  peri_end   = ({peri2.x:.3f}, {peri2.y:.3f})  [t=pi+alpha]")
    print(f"  aph_start  = ({aph1.x:.3f}, {aph1.y:.3f})  [t=-beta]")
    print(f"  aph_end    = ({aph2.x:.3f}, {aph2.y:.3f})  [t=+beta]")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

