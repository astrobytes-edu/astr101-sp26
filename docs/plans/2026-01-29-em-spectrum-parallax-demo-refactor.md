# EM Spectrum + Parallax Distance Demo Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Refactor `demos/em-spectrum` and `demos/parallax-distance` to match the `demos/_assets/*-model.js` pattern, add Node tests for the physics invariants, and remove leftover debug-only behavior.

**Architecture:** Extract pure “model” logic into UMD modules under `demos/_assets/` (usable in browser via `window.*` and in Node via `require()`), then make each demo’s UI script delegate to the model. Keep demo HTML structure/IDs stable, and keep changes minimal and test-driven.

**Tech Stack:** Vanilla HTML/CSS/JS demos, Node built-in test runner (`node --test`), Quarto site build (`conda run -n astro make render`), demo polish gate (`conda run -n astro python scripts/check_demo_polish.py`).

---

## Task Classification (docs/llm-lab-protocol.md)

- Dominant: **Refactor / restructuring**
- Also: **Numerical / physical correctness** (unit conversions, parallax geometry), **Documentation / explanation**

## Invariants (must not change)

- **Physics identities**
  - EM spectrum: `c = λν`, `E = hν = hc/λ` (with consistent unit conversions)
  - Parallax: `p(") = 1 / d(pc)`; near-star apparent shift is opposite Earth position in the simple 1D model
- **UI contract**
  - Keep existing element IDs/classes used by JS and CSS.
  - Preserve demo polish requirements (required scripts/styles in `index.html`).
- **Public-ish demo APIs**
  - If any demo currently exposes debug helpers on `window`, replace with a stable model export rather than removing entirely.

## Known Issues (evidence to re-check while implementing)

- `demos/em-spectrum/README.md` is out of sync with actual files and current band boundaries.
- `demos/em-spectrum/em-spectrum.js` contains physics + formatting logic that is not testable in Node; wavelength↔position mapping appears to have inconsistent clamp bounds.
- `demos/parallax-distance/README.md` is out of sync with the actual UI and file list.
- `demos/parallax-distance/parallax.js` logs validation output to console and runs validation on every page load.
- `demos/parallax-distance/star-data.js` attaches `STAR_DATA` to `window` but is not `require()`-able for Node tests.

---

## P0 — Make models testable (no behavior changes unless tests justify)

### Task 1: Create `EMSpectrumModel` UMD module

**Files:**
- Create: `demos/_assets/em-spectrum-model.js`
- Modify: `demos/em-spectrum/index.html` (load the model before `em-spectrum.js`)
- Modify: `demos/em-spectrum/em-spectrum.js` (delegate to model; remove `console.log`)
- Test: `tests/em-spectrum-model.test.js`
- Test: `tests/demo-html-smoke.test.js` (ensure model is loaded)

**Step 1: Write failing model tests**

Create `tests/em-spectrum-model.test.js` that asserts:
- `wavelengthToFrequency(λ) * λ ≈ c` for representative λ.
- `wavelengthToEnergy(λ) ≈ h*c/λ`.
- Unit conversions are inverses (cm ↔ nm, Hz ↔ THz, erg ↔ eV).
- `positionToWavelength(wavelengthToPosition(λ))` round-trips for in-range λ.

Run: `node --test tests/em-spectrum-model.test.js`
Expected: FAIL (module missing).

**Step 2: Implement minimal model**

Create `demos/_assets/em-spectrum-model.js` exporting:
- constants (c, h, energy conversions)
- bands definition
- pure conversion + formatting helpers currently embedded in `em-spectrum.js`

**Step 3: Verify tests now pass**

Run: `node --test tests/em-spectrum-model.test.js`
Expected: PASS.

**Step 4: Wire demo UI to the model**

- Add `<script src="../_assets/em-spectrum-model.js"></script>` before `em-spectrum.js`.
- Replace local physics helpers in `em-spectrum.js` with `const Model = window.EMSpectrumModel;` delegates.
- Remove `console.log(...)`.

**Step 5: Smoke verify HTML loads the model**

Add smoke test:
- `tests/demo-html-smoke.test.js`: assert `demos/em-spectrum/index.html` contains `_assets/em-spectrum-model.js`.

Run: `node --test tests/demo-html-smoke.test.js`
Expected: PASS.

**Rollback:** Revert to prior standalone `em-spectrum.js` implementation; remove the new model script include.

---

### Task 2: Make Parallax data + model testable

**Files:**
- Create: `demos/_assets/parallax-distance-model.js`
- Modify: `demos/parallax-distance/index.html` (load the model before `parallax.js`)
- Modify: `demos/parallax-distance/parallax.js` (delegate to model; remove always-on console validation)
- Modify: `demos/parallax-distance/star-data.js` (UMD export for Node tests)
- Test: `tests/parallax-distance-model.test.js`
- Test: `tests/parallax-star-data.test.js`
- Test: `tests/demo-html-smoke.test.js` (ensure model is loaded)

**Step 1: Write failing tests**

Create:
- `tests/parallax-distance-model.test.js` covering:
  - `parallaxFromDistance(d) ≈ 1/d`
  - `distanceFromParallax(p) ≈ 1/p`
  - January vs July Earth x-position sign and apparent shift direction
- `tests/parallax-star-data.test.js` covering:
  - For entries with finite parallax, `abs(d_pc * p - 1) < tolerance`.
  - `getMeasurability()` returns stable classes at representative thresholds.

Run:
- `node --test tests/parallax-distance-model.test.js`
- `node --test tests/parallax-star-data.test.js`
Expected: FAIL (modules not exportable yet).

**Step 2: Implement minimal model**

Create `demos/_assets/parallax-distance-model.js` exporting the pure geometry/math helpers currently embedded in `parallax.js`:
- `parallaxFromDistance(dPc)`
- `distanceFromParallax(pArcsec)`
- `earthPosition(yearFraction)`
- `apparentShift(yearFraction, pArcsec)`

**Step 3: Export `STAR_DATA` for Node tests**

Convert `demos/parallax-distance/star-data.js` to a small UMD wrapper:
- Browser: keep `window.STAR_DATA = ...`
- Node: `module.exports = STAR_DATA`

**Step 4: Update demo UI to delegate**

- Add `<script src="../_assets/parallax-distance-model.js"></script>` before `parallax.js`.
- In `parallax.js`, use `window.ParallaxDistanceModel.*` for those helpers (remove duplicates).
- Remove or gate the current `validatePhysics()` console spam (e.g., behind a query param or a `window.__DEMO_DEBUG__` flag).

**Step 5: Verify tests**

Run:
- `node --test tests/parallax-distance-model.test.js`
- `node --test tests/parallax-star-data.test.js`
Expected: PASS.

**Rollback:** Keep `parallax.js` standalone; remove model include; revert `star-data.js` export changes.

---

## P1 — Correctness + doc sync (only after tests lock behavior)

### Task 3: Fix EM-spectrum mapping bounds and document band boundary conventions

**Files:**
- Modify: `demos/_assets/em-spectrum-model.js`
- Modify: `demos/em-spectrum/index.html` (tick label if needed)
- Modify: `demos/em-spectrum/README.md`
- Test: `tests/em-spectrum-model.test.js` (add regression expectations)

**Test/Verification:**
- Add a test that selection marker mapping stays within `[0,100]` for clamped range.
- Add a test for microwave vs radio boundary behavior (explicit convention).

**Change:**
- Align `wavelengthToPosition()` and `positionToWavelength()` to use the same min/max (and match the UI tick labels).
- Update README to match the chosen band boundary convention (explicitly “approximate; conventions vary”).

**Rollback:** Revert mapping/band changes; keep model refactor.

---

### Task 4: Update README files to match reality

**Files:**
- Modify: `demos/em-spectrum/README.md`
- Modify: `demos/parallax-distance/README.md`

**Verification:**
- Spot-check that file lists, UI features, and controls match current `index.html`.

**Rollback:** Revert doc edits only.

---

## Acceptance Gates (whole batch)

Run:
- `node --test`
- `conda run -n astro python scripts/check_demo_polish.py`
- `conda run -n astro make render`

Expected:
- All commands exit 0.

