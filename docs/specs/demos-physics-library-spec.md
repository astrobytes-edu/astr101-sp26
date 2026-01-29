# Demos Physics Library Spec

*A design/spec contract for shared physics utilities across interactive demos (ASTR 101/201 + future COMP 536 mechanics demos).*  
Version: v0.1 • Status: Proposed → Active upon adoption

---

## 1) Purpose

We are building an expanding ecosystem of browser-based astronomy/physics demos under `demos/`. Many demos share:

- physical constants (AU, M☉, G, year/day, etc.)
- unit conversions and display formatting
- “core mechanics” math (two-body analytic relations, energy, angular momentum)
- numerical integrators (Euler / RK4 / symplectic) and diagnostics

This spec defines a **single source of truth** for constants/units and a clean shared library structure so demos remain:

1) scientifically correct within their stated model assumptions  
2) reproducible (no drift from duplicated constants)  
3) testable (pure functions in shared modules)  
4) easy to extend (new demos reuse shared pieces)

---

## 2) Non‑Negotiable Principles

1) **CGS-canonical core**: shared physics functions are defined in CGS base units (cm, g, s).  
2) **First-class astro-unit wrappers**: convenience wrappers in AU/yr/M☉ exist for teaching demos, but they only convert units and call the CGS core (no duplicated physics).  
3) **Explicit time scales**: no ambiguous “year” or “month” in physics APIs; time constants must be named (Julian year vs tropical year vs synodic month, etc.).  
4) **Pure functions**: shared physics modules are DOM-free and deterministic; inputs → outputs only.  
5) **Unit-bearing identifiers**: exported functions and state fields include units in names (`*_Cm`, `*_Cms`, `*_S`, `*_Au`, `*_Yr`, `*_SolarMass`, etc.).  

---

## 3) Module Layout (canonical)

Create a physics sub-library:

```
demos/_assets/physics/
  astro-constants.js         # UMD export: window.AstroConstants (CGS canonical)
  units.js                  # conversions + formatting built on AstroConstants
  two-body-analytic.js       # Kepler/vis-viva/anomalies + invariants (CGS + wrappers)
  integrators.js             # Euler/RK4/leapfrog steppers (CGS)
  diagnostics.js             # energy/momentum/L checks (CGS)
  nbody.js                   # (future) N-body accel + bookkeeping (CGS)
```

Demo-specific model modules remain, but should **import** physics utilities rather than redefining constants:

```
demos/_assets/keplers-laws-model.js        # thin adapter (UI conventions, formatting)
demos/_assets/binary-orbits-model.js      # thin adapter
...
```

---

## 4) Export pattern (UMD)

Shared modules must work in:
- browser (`window.*`)
- Node tests (`require()` / `module.exports`)

Pattern (example):
- `astro-constants.js` exports to `window.AstroConstants` and `module.exports`.

---

## 5) `AstroConstants` API (required minimum)

### 5.1 Structure

`AstroConstants` must export a single object with nested groups (names are normative):

- `AstroConstants.TIME`
- `AstroConstants.LENGTH`
- `AstroConstants.MASS`
- `AstroConstants.GRAV`

### 5.2 Time scales

Requirements:
- `DAY_S = 86400` (exact)
- `JULIAN_YEAR_S = 31557600` (exact)
- `YEAR_S = JULIAN_YEAR_S` (alias; mechanics default)

Also include “astronomy time scales” (values are *mean* unless explicitly exact):
- `MEAN_TROPICAL_YEAR_S` (for seasons/calendar alignment)
- `MEAN_SIDEREAL_YEAR_S` (optional)
- `MEAN_SYNODIC_MONTH_S` (phases)
- `MEAN_SIDEREAL_MONTH_S`
- `MEAN_DRACONIC_MONTH_S` (eclipses)
- `MEAN_ANOMALISTIC_MONTH_S`

**Documentation requirement:** every non-exact constant must include:
- a short description (“mean …”)
- a provenance note (e.g., “mean value; epoch-dependent; verify source”)

### 5.3 Length and mass

Define canonical conversions sufficient for demos:
- `CM_PER_M` (exact)
- `M_PER_AU` (exact, by IAU definition) and derived `CM_PER_AU`
- `G_PER_SOLAR_MASS` and derived `GRAM_PER_SOLAR_MASS`

### 5.4 Gravity

Provide:
- `G_CGS` in `cm^3 g^-1 s^-2` (measured; not exact)
- Derived standard gravitational parameter helpers must live in `two-body-analytic.js`, not in constants.

---

## 6) Unit conversions and wrappers

### 6.1 Rule

- Core functions: CGS only.
- Wrappers: convert → call core → convert back.

Examples of allowed wrappers:
- `orbitalPeriodYrFromAuSolar({ aAu, massSolar })`
- `orbitalSpeedKmsFromAuSolar({ rAu, aAu, massSolar })`

The wrapper layer must be unit-tested against scaling laws and round-trip conversions.

---

## 7) Testing requirements

Every shared physics module must have `node:test` coverage for:
- dimensional sanity checks (units implied by naming)
- scaling laws (e.g., `P ∝ a^(3/2) / sqrt(M)`)
- integrator invariants (energy/L drift comparisons)

Demos should add “HTML smoke tests” only for critical UI invariants (e.g., model note presence).

---

## 8) Migration and adoption

Adoption is incremental:
1) Introduce `AstroConstants` + minimal wrappers without changing behavior.
2) Migrate `keplers-laws-model.js` and `binary-orbits-model.js` to remove duplicated constants.
3) Update other demos as they evolve (prioritize “mechanics” demos first).

