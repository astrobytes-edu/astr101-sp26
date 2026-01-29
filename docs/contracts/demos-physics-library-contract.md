# Demos Physics Library Contract

*A durable, enforceable quality bar for shared physics utilities used by interactive demos.*  
Version: v0.1 • Status: Proposed → Active upon adoption • Owner: Instructor

---

## 0) Scope

This contract applies to:
- shared physics code under `demos/_assets/physics/`
- demo model modules under `demos/_assets/*-model.js` when they implement physics (not UI)
- tests under `tests/` that validate shared physics

It does **not** apply to:
- CSS/theme assets
- purely pedagogical “toy” models *unless* they export physics functions (then the same unit/validation rules apply)

---

## 1) Truth and uncertainty (no fabrication)

### 1.1 Constants provenance

- Any **non-definitional** physical constant (e.g., `G`) must be documented in code with:
  - the chosen value
  - units
  - a short provenance note (source + date/epoch) or `VERIFY` marker with concrete steps

### 1.2 Time-scale honesty

- If a constant is a **mean value** (tropical year, synodic month, etc.), label it `MEAN_*` and note that it is epoch-dependent.
- Never expose an ambiguous `MONTH_S` or `YEAR_S` without a clearly documented definition.

---

## 2) Unit invariants (single source of truth)

### 2.1 CGS canonical core

- Shared physics functions are defined in CGS base units: **cm, g, s**.
- Core functions must never assume “km”, “AU”, or “years” unless explicitly declared in the function name.

### 2.2 Unit-bearing names

- Public functions and public state fields include units in their names:
  - `xCm`, `vxCms`, `tS`, `massG`, `muCgs`, etc.
  - wrappers: `aAu`, `massSolar`, `periodYr`, etc.

### 2.3 Conversions live in one place

- Definitional conversions and time scales live in `demos/_assets/physics/astro-constants.js` (`AstroConstants`).
- All conversion helper functions must be implemented in `demos/_assets/physics/units.js` (built on `AstroConstants`).
- Demos must not re-define AU/year constants in ad-hoc ways.

---

## 3) Design invariants (DRY + testability)

### 3.1 Pure functions only

- No DOM references, no global demo state, no random numbers, no I/O in shared physics modules.
- All shared physics code must be deterministic and side-effect free.

### 3.2 Wrappers must not duplicate physics

- AU/yr/M☉ wrappers may only:
  1) convert inputs to CGS
  2) call the CGS core function
  3) convert outputs back
- Wrappers must not re-implement the formula “in astro units” separately.

### 3.3 “Toy model” labeling

If a demo uses a simplified approximation (e.g., linear recession, circular-orbit approximation, uniform L(t) seasons model):
- code must label it explicitly as `toy`/`approx`
- UI must include a short “model note” (collapsible is fine)

---

## 4) Verification gates (required before claiming “done”)

Before declaring changes complete:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## 5) Required tests (minimum viable)

Shared physics modules must include unit tests covering:
- scaling laws (Kepler period scaling; inverse-square acceleration scaling)
- conservation laws (energy and angular momentum diagnostics for integrators)
- wrapper round-trips (AU/yr/M☉ ↔ CGS conversions)

---

## 6) Backwards compatibility and adoption

Adoption should be incremental:
- introduce `AstroConstants` first
- migrate one demo at a time
- avoid large refactors that mix unrelated demo changes in one commit
