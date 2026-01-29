# Demo Audit: `demos/keplers-laws/`

**Date:** 2026-01-29  
**Audience:** ASTR 201 (also usable for ASTR 101 with “Kepler Mode”)  
**Overall:** **Pass** (production-ready for teaching; see remaining polish)

## Throughline (what this demo is trying to teach)

This demo has a strong conceptual arc: first, students explore the *patterns* (Kepler’s laws), then they switch to Newton mode to see the *mechanism* (inverse‑square gravity) that generates those patterns. That “what we observe → why it must be true” structure is exactly right for ASTR 201.

## Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Scientific correctness | ✅ | Orbit geometry and Newton vectors now share a single coordinate convention (velocity is tangent; force points to the star). |
| Math grammar | ✅ | KaTeX is integrated; Newton-mode equations now respect the 101/201 unit toggle. |
| UX / cognitive load | ✅ | Mode toggle + overlays + presets are well-structured; sliders have adaptive precision. |
| Accessibility | ✅ | Keyboard support + ARIA slider + live region are present. |
| Performance | ✅ | KaTeX updates are throttled during animation (reduced jank risk). |
| Verification | ✅ | `node --test`, `conda run -n astro python scripts/check_demo_polish.py`, `conda run -n astro python scripts/demo_static_checks.py`, `conda run -n astro make render`. |

## Resolved (implemented on 2026-01-29)

1. **Newton-mode velocity vector direction is now consistent with the orbit geometry**.

   We introduced a shared, testable orbital model module and compute the velocity direction from the curve’s tangent in the **same** coordinate convention used to draw the orbit.

   - Model: `demos/_assets/keplers-laws-model.js` (`KeplersLawsModel.orbitTangentAngleRad`)
   - Demo wiring: `demos/keplers-laws/keplers-laws.js#L409` (now uses `Model.orbitTangentAngleRad(...)`)
   - Tests: `tests/keplers-laws-model.test.js` (circular limit + numerical-derivative check)

2. **Newton-mode KaTeX values are now unit-consistent with the 101/201 toggle**.

   The readout panel and the Newton-mode KaTeX block use the same unit conversion function:

   - Model helper: `KeplersLawsModel.formatNewtonReadouts(...)` in `demos/_assets/keplers-laws-model.js`
   - Tests: `tests/keplers-laws-model.test.js` (101 vs 201 conversion)
   - Demo usage: `demos/keplers-laws/keplers-laws.js#L485` (readouts + KaTeX derive from `fmt`)

3. **KaTeX re-rendering is now throttled during animation**.

   We avoid expensive re-renders on every animation frame by throttling KaTeX updates while playing (and caching when paused):

   - `demos/keplers-laws/keplers-laws.js#L482` (`NEWTON_KATEX_MIN_INTERVAL_MS` + cache)

4. **The speed control is now labeled with its intended meaning**.

   - UI: `demos/keplers-laws/index.html` now labels the control `Speed (years/sec)`.
   - Smoke test: `tests/demo-html-smoke.test.js` asserts the label exists.

## Minor / Polish (nice-to-have)

1. **Add an explicit “model note” box in the student demo UI** (optional but recommended).

   The demo is an intentionally simplified, planar, 2-body model (planet mass negligible; no perturbations; teaching-scale time). Stating this explicitly helps prevent “is this a real ephemeris?” confusion in ASTR 201.

2. **Tighten README unit-system language** (`demos/keplers-laws/README.md`).

   The demo mixes “solar units” (AU, years, $M_\odot$) with SI/CGS readouts. It’s correct, but worth a single sentence so students don’t treat it as inconsistent math.

## Recommendation: production readiness verdict

- **ASTR 101 use (Kepler mode, minimal overlays):** ✅ appropriate and stable.  
- **ASTR 201 use (Newton mode + vectors + units toggle):** ✅ appropriate and stable.

## Suggested next steps (fastest path to “teach on Friday”)

1) Add a short model note (planar 2-body; teaching-scale time) directly in the student demo UI.  
2) Use the instructor docs to run a 10–15 minute Kepler→Newton throughline on the projector, then a 20–30 minute Friday lab with “equal areas” as the group deliverable.  

