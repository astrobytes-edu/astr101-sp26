# Demo Audit: `demos/keplers-laws/`

**Date:** 2026-01-29  
**Audience:** ASTR 201 (also usable for ASTR 101 with “Kepler Mode”)  
**Overall:** **Needs Work** (1 physics/visualization blocker in Newton mode)

## Throughline (what this demo is trying to teach)

This demo has a strong conceptual arc: first, students explore the *patterns* (Kepler’s laws), then they switch to Newton mode to see the *mechanism* (inverse‑square gravity) that generates those patterns. That “what we observe → why it must be true” structure is exactly right for ASTR 201.

## Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Scientific correctness | ⚠️ | Core scalars ($r$, $P$, $v$, $a$) look correct; **Newton velocity vector direction appears inconsistent with the plotted orbit**. |
| Math grammar | ⚠️ | KaTeX is integrated and readable; dynamic Newton equations are not unit-aware for 201 mode. |
| UX / cognitive load | ✅ | Mode toggle + overlays + presets are well-structured; sliders have adaptive precision. |
| Accessibility | ✅ | Keyboard support + ARIA slider + live region are present. |
| Performance | ⚠️ | KaTeX re-renders on every `update()` in Newton mode; may be janky during animation. |
| Verification | ✅ | Repo gates passed (`node --test`, demo polish/static checks, `conda run -n astro make render`). |

## Critical Issues (must fix before teaching ASTR 201)

1. **Newton-mode velocity vector direction is inconsistent with the orbit geometry** (`demos/keplers-laws/keplers-laws.js:294` and `demos/keplers-laws/keplers-laws.js:431`).

   The orbit is drawn using `orbitalToSvg()` with an x-reflection (`x_orb = -r*cos(theta)`), which flips the handedness of the parameterization. The velocity direction, however, is computed as if the mapping were not reflected (`return theta + π/2 + γ`). This will generally point the velocity arrow the wrong way except at special points where $\gamma=0$ (perihelion/aphelion). In Newton mode, that’s a conceptual blocker: students will correctly expect $\vec v$ to be tangent to the path (with a small radial component for $e>0$).

   - **Where:** `velocityAngle()` returns `theta + Math.PI / 2 + gamma` (`demos/keplers-laws/keplers-laws.js:298`), and `updateVectors()` uses it directly (`demos/keplers-laws/keplers-laws.js:441–452`).
   - **Fix (mechanical):** compute the velocity direction in the *same* coordinate convention used by `orbitalToSvg()` (account for the x-reflection), and verify with the circular-orbit limiting case ($e=0$) that the velocity arrow is tangent everywhere.

## Major Issues (should fix soon for ASTR 201)

1. **Newton-mode dynamic KaTeX equations ignore the 101/201 unit toggle** (`demos/keplers-laws/keplers-laws.js:530–542`).

   In 201 mode the readouts switch to CGS (cm/s, cm/s²), but the KaTeX strings hard-code `km/s` and `m/s^2` and use the unconverted values. This creates a “two answers on screen” inconsistency during lecture and undermines unit discipline.

   - **Fix (mechanical):** branch the KaTeX render strings on `state.units` and render values/units that match the readouts (or explicitly label the KaTeX block as SI-only and keep readouts SI-only too).

2. **Potential performance/jank risk: KaTeX re-renders every frame in Newton mode** (`demos/keplers-laws/keplers-laws.js:530–542` via `update()` calls).

   Rendering math on every animation frame is costly. If this stutters on student laptops, Newton mode will feel “broken” even when the physics is correct.

   - **Fix (mechanical):** throttle KaTeX renders (e.g., only when numeric values change beyond a tolerance, or at ~10 Hz), or render as plain text during animation and upgrade to KaTeX on pause/drag end.

3. **The “Speed” control is not anchored to an explicit time unit** (`demos/keplers-laws/index.html:321–331`, `demos/keplers-laws/keplers-laws.js:794–803`).

   The code advances `state.t` (years) by `dt` (seconds) times a dimensionless multiplier, which implicitly means “~1 year per real second at 1×.” That’s fine pedagogically, but it should be stated (otherwise students think “1× means real time”).

   - **Fix (mechanical):** label the control as something like “Speed (years/sec)” or add a one-line model note that states the baseline mapping.

## Minor / Polish (nice-to-have)

1. **Quadrant handling in `trueToMeanAnomaly()` is fragile for angles outside $[-\pi, \pi]$** (`demos/keplers-laws/keplers-laws.js:259–266`).

   The `tan(θ/2)` formula with `atan()` is standard, but using `atan2`-based forms is more robust for continuity and avoids subtle wrap discontinuities during interaction.

2. **README math could be tightened for ASTR 201** (`demos/keplers-laws/README.md`).

   The period line reads as the dimensional form ($P = 2π\sqrt{a^3/GM}$), while the code uses the solar-unit simplification ($P^2 = a^3/M$ with $a$ in AU and $P$ in years). Both are valid in context, but mixing them without an explicit “unit system” sentence invites confusion.

## Recommendation: production readiness verdict

- **ASTR 101 use (Kepler mode, no vectors):** *likely OK* once you add a short “model note” about scaling and assumptions.  
- **ASTR 201 use (Newton mode with vectors):** **not yet production ready** until the velocity vector direction issue is fixed and the Newton equations are made unit-consistent (or unit-simplified).

## Suggested next steps (fastest path to “teach on Friday”)

1) Fix the Newton velocity vector direction and sanity-check it in the $e=0$ limit (tangent everywhere).  
2) Make the KaTeX Newton readout unit-consistent with 101/201 mode and throttle math rendering during animation.  
3) Add a one-line “model note” (2-body, planar, planet mass negligible; scaling to fit) and clarify the speed unit mapping.

