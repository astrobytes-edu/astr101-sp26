# Demos Physics/Units Ecosystem — Design Notes (AstroConstants + Mechanics Library)

**Date:** 2026-01-29  
**Goal:** Establish a clean, DRY, testable shared physics ecosystem for many current and future demos (ASTR 101/201 + COMP 536 integrators), with **CGS-canonical** core and **astro-unit wrappers** for teaching-oriented demos.

---

## 1) Current state (what exists today)

Under `demos/_assets/`, we already have a strong pattern: “model” modules are UMD and testable in Node via `node:test`.

Existing model modules:
- `angular-size-model.js` (km-based internal quantities)
- `moon-phases-model.js` (dimensionless geometry)
- `eclipse-geometry-model.js` (km + degrees; includes shadow geometry helpers)
- `seasons-model.js` (days-of-year and a tropical-year-like year length parameter)
- `keplers-laws-model.js` (AU geometry + km/s + m/s² formatting helpers)
- `binary-orbits-model.js` (AU/yr/M☉-style mechanics with local constants)

What’s missing:
- A **single source of truth** for constants, conversions, and “time scale definitions”
- A consistent place for “core mechanics” code that multiple demos can share (exact two-body + integrators + diagnostics)

---

## 2) Proposed architecture (clean separation)

### 2.1 Shared physics library folder

Add:

```
demos/_assets/physics/
  astro-constants.js
  units.js
  two-body-analytic.js
  integrators.js
  diagnostics.js
  nbody.js                  # later
```

### 2.2 What lives where

- `astro-constants.js` (exports `window.AstroConstants`):
  - CGS canonical constants + definitional conversions
  - explicit time-scale constants (Julian year exact; others named mean values)
- `units.js`:
  - conversion functions and formatting helpers built on `AstroConstants`
- `two-body-analytic.js`:
  - exact/analytic two-body relations (Kepler geometry, anomalies, vis-viva, invariants)
  - CGS core + AU/yr/M☉ wrappers (conversion-only wrappers)
- `integrators.js`:
  - Euler, RK4, and symplectic steppers in CGS (state is cm/g/s)
- `diagnostics.js`:
  - energy, momentum, angular momentum; drift metrics for comparing integrators vs exact

### 2.3 Why CGS-canonical + wrappers (decision)

- The “mechanics ecosystem” (integrators, N-body, cluster sims) needs one canonical unit system for reproducible diagnostics.
- Teaching demos benefit from AU/yr/M☉ APIs (readable, matches common astronomical scaling laws).
- Wrappers keep demo code readable without duplicating formulas.

---

## 3) Time scale policy (avoid ambiguous “year”)

We adopt:
- `JULIAN_YEAR_S = 31557600` (exact; **default** mechanics year)
- `YEAR_S = JULIAN_YEAR_S` (alias; used widely by mechanics demos)

We also provide explicitly named *mean* values as needed:
- `MEAN_TROPICAL_YEAR_S` (seasons/calendar alignment)
- lunar months: `MEAN_SYNODIC_MONTH_S`, `MEAN_DRACONIC_MONTH_S`, etc.

**Rule:** demos must not use an ambiguous `MONTH_S` or rely on “365.25” without naming which year is intended.

---

## 4) Specs + contracts (how we keep it clean)

We add repo-level norms:
- Spec: `docs/specs/demos-physics-library-spec.md`
- Contract: `docs/contracts/demos-physics-library-contract.md`

The contract enforces:
- no duplicated constants
- unit-bearing names
- pure functions for shared physics
- explicit time-scale naming
- required tests and verification gates

---

## 5) Migration plan (incremental, low-risk)

1) Introduce `AstroConstants` + `units.js` and unit-test conversions.
2) Migrate “mechanics demos” first:
   - `keplers-laws-model.js` stops owning AU/year/G conversions; uses wrappers.
   - `binary-orbits-model.js` stops owning AU/year conversions; uses wrappers.
3) Migrate other demos as they evolve:
   - `seasons-model.js` uses `MEAN_TROPICAL_YEAR_S` via helpers (or explicitly documents its `tropicalYearDays` parameter).
   - `eclipse-geometry-model.js` can remain km-based for now, but any use of AU/Sun radius should route through constants for consistency.
   - `angular-size-model.js` stays km internally (fine pedagogically), but should use shared conversion helpers if/when it needs AU or cm.

---

## 6) Open questions / TODOs

- Choose provenance for measured constants (e.g., `G_CGS`) and document them in code.
- Decide if we want a standard “state object” for integrators (2D vs 3D, single body vs N-body arrays).
- Decide if we want a minimal “precision policy” for displayed numbers (significant figures, rounding).

