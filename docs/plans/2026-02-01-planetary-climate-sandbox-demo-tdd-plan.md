# Planetary Climate Sandbox (L12) Implementation Plan (TDD)

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Build a new student-facing climate sandbox demo for Lecture 12 that lets students manipulate a simple, honest energy-balance model (plus a calibratable greenhouse parameter) and practice Predict → Play → Explain reasoning.

**Architecture:** Keep the demo static (HTML/CSS/JS) under `demos/` with all physics in a pure, testable UMD model module under `demos/_assets/`. Presets and any band data live as JSON with provenance fields; UI renders a single stage with compact readouts below.

**Tech Stack:** Static Quarto site + static demos; browser-only JS (no runtime deps); Node built-in test runner (`node --test`) for unit tests; conda `astro` env for repo tooling (`scripts/check_demo_polish.py`, `make render`).

**Primary spec:** `docs/specs/demos/planetary_climate_sandbox_demo_spec_narrative.md`

**Lecture alignment reference:** `modules/module-01/readings/lecture-12-climates-exoplanets-reading.qmd`

---

## Brainstorming notes (design decisions to confirm)

This spec supports two “nice but not required” extensions. You selected **Option C**, so v1 includes both extensions:

- **v1 includes:**
  - Energy balance → $T_{eq}$
  - Greenhouse mapping via $\tau_{IR}$ → $T_{surf}$
  - Solar System presets (Venus/Earth/Mars) + at least one “unknown/assumed” exoplanet preset
  - Predict → Play → Explain missions
  - **Redistribution toggle:** “full redistribution” vs “dayside emission”
  - **Spectral greenhouse view:** blackbody emission curve + broad molecular absorption bands (centers sourced; shapes illustrative)

Implementation note: keep each extension as an isolated task block so it cannot destabilize the core energy-balance behavior.

---

## Hard constraints (repo + teaching invariants)

- No build step and no runtime deps: opening `demos/<name>/index.html` must work as a local file.
- One stage + compact readouts below (avoid big side panels).
- Predict → Play → Explain loop is explicit in the UI (missions and “commit to answer” prompts).
- Do not invent constants or reference values. Use the spec’s stated constants and preset table, and store their provenance in JSON.

---

## Data + provenance approach

Create a small climate presets dataset with provenance fields, similar in spirit to the spectra data contract:

- `verified: true|false`
- `sources: [{ name, url?, citation?, accessed?, notes? }]`

For v1, it is acceptable to cite the course reading/spec as the provenance source:

- `modules/module-01/readings/lecture-12-climates-exoplanets-reading.qmd` (Venus/Earth/Mars table)
- `docs/specs/demos/planetary_climate_sandbox_demo_spec_narrative.md` (constants + toy greenhouse model)

UI rule:

- If a parameter is not known (common for exoplanets), display it as an **assumption** (and optionally badge `VERIFY`).

---

## Test strategy (TDD)

1. Unit-test the physics model in Node (pure functions).
2. Add a smoke test that the demo’s HTML wires the shared model module(s).
3. Add the demo to `demos/polish-manifest.json` and keep `scripts/check_demo_polish.py` passing.

---

### Task 1: Create unit tests for the climate model (fails first)

**Files:**
- Create: `tests/planetary-climate-model.test.js`

**Step 1: Write the failing tests**

Write tests that define the public API we want. Example skeleton:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/planetary-climate-model.js');

test('equilibriumTempK matches Earth baseline (~255 K) with L=Lsun, d=1 AU, A=0.30', () => {
  const T = Model.equilibriumTempK({ LStarW: Model.CONST.L_SUN_W, dM: Model.CONST.AU_M, albedo: 0.30 });
  assert.ok(Math.abs(T - 255) < 1);
});
```

Add tests for:

- `stellarFluxWm2({ LStarW, dM })`
- `absorbedFluxWm2({ fluxWm2, albedo, redistribution })` where:
  - `redistribution: "global"` uses division by 4 (full redistribution)
  - `redistribution: "dayside"` uses division by 2 (dayside-only emission)
- `equilibriumTempK({ LStarW, dM, albedo })`
- `epsilonOutFromTauIR({ tauIR })` equals `Math.exp(-tauIR)`
- `surfaceTempK({ TeqK, tauIR })` equals `TeqK * Math.exp(tauIR / 4)`
- `tauIRFromTemps({ TeqK, TsurfK })` equals `4 * ln(Tsurf/Teq)`

Redistribution sanity tests (required for v1):

- For the same inputs, `T_eq_dayside / T_eq_global ≈ 2^(1/4)`.

Preset regression tests:

- Venus: $T_{eq}\approx230$ K; $T_{surf}\approx735$ K; $\tau_{IR}\approx4.65$
- Earth: $T_{eq}\approx255$ K; $T_{surf}\approx288$ K; $\tau_{IR}\approx0.49$
- Mars: $T_{eq}\approx210$ K; $T_{surf}\approx218$ K; $\tau_{IR}\approx0.15$

Use tolerances that match rounding in the spec (e.g., `±1 K` for temperatures, `±0.02` for tau).

**Step 2: Run tests to confirm failure**

Run: `node --test tests/planetary-climate-model.test.js`

Expected: FAIL (module not found).

---

### Task 2: Implement the pure climate model module (make tests pass)

**Files:**
- Create: `demos/_assets/planetary-climate-model.js`

**Step 1: Implement minimal UMD module**

Implement as UMD (Node `require()` + browser global), mirroring other demo models:

```js
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.PlanetaryClimateModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const CONST = { /* sigma, Lsun, AU */ };
  function stellarFluxWm2(/*...*/) { /*...*/ }
  return { CONST, stellarFluxWm2 /* ... */ };
});
```

Hard-code the constants exactly as in the spec (SI units):

- $\sigma = 5.670374419\times10^{-8}\ \mathrm{W\,m^{-2}\,K^{-4}}$
- $L_\odot = 3.828\times10^{26}\ \mathrm{W}$
- $1\,\mathrm{AU} = 1.495978707\times10^{11}\ \mathrm{m}$

Implement redistribution explicitly:

- `absorbedFluxWm2({ fluxWm2, albedo, redistribution })` returns:
  - global: `(1 - A) * fluxWm2 / 4`
  - dayside: `(1 - A) * fluxWm2 / 2`

`equilibriumTempK` should compute from the closed-form formula *or* from flux form; either is fine as long as it matches the spec and tests.

**Step 2: Run the unit tests**

Run: `node --test tests/planetary-climate-model.test.js`

Expected: PASS.

---

### Task 3: Add the presets dataset (with provenance)

**Files:**
- Create: `demos/_assets/climate/planet-presets.v1.json`
- Create: `demos/_assets/climate/planet-presets.v1.js` (UMD, committed; avoids fetch for local-file use)
- Create: `tests/planetary-climate-presets.test.js`

**Step 1: Write failing test for dataset shape and required fields**

Define a minimal contract in test code (no new runtime deps). Example checks:

- `schema_version`, `dataset_id`, non-empty `presets[]`
- each preset has `id`, `label`, `kind` (`solar_system` | `exoplanet`), and provenance fields (`verified`, `sources[]`)
- Venus/Earth/Mars include `d_au`, `bond_albedo`, and either `tau_ir` or `t_surf_k`

**Step 2: Create the JSON**

Include Solar System presets from the spec table:

- Venus: `d_au: 0.72`, `bond_albedo: 0.76`, `t_eq_k: 230`, `t_surf_k: 735`, `tau_ir: 4.65`
- Earth: `d_au: 1.00`, `bond_albedo: 0.30`, `t_eq_k: 255`, `t_surf_k: 288`, `tau_ir: 0.49`
- Mars: `d_au: 1.52`, `bond_albedo: 0.25`, `t_eq_k: 210`, `t_surf_k: 218`, `tau_ir: 0.15`

For each, set `verified: true` and include a `sources[]` entry pointing to:

- `modules/module-01/readings/lecture-12-climates-exoplanets-reading.qmd` (table values)
- `docs/specs/demos/planetary_climate_sandbox_demo_spec_narrative.md` (tau formula used)

Add 1–2 exoplanet presets with **unknown albedo/greenhouse**:

- store `bond_albedo_assumed: true` and `tau_ir_assumed: true` flags (or leave as `null` and force UI to label unknown)
- set `verified: false` for assumed values unless you have a real source

**Step 2b: Create a browser-friendly UMD bundle**

Create `demos/_assets/climate/planet-presets.v1.js` that exports the same JSON object as `window.ClimatePresetsV1` (and as `module.exports` in Node). Keep it fully mechanical (no derived math) so it can be checked against the JSON in tests.

**Step 3: Run the dataset tests**

Run: `node --test tests/planetary-climate-presets.test.js`

Expected: PASS.

---

### Task 4: Create the student-facing demo shell (HTML/CSS) with “missions”

**Files:**
- Create: `demos/planetary-climate-sandbox/index.html`
- Create: `demos/planetary-climate-sandbox/planetary-climate-sandbox.css`
- Create: `demos/planetary-climate-sandbox/README.md`

**Step 1: Start with HTML skeleton**

Requirements (from spec + shared demo principles):

- Single stage (energy budget visualization)
- Readouts below stage:
  - $L_\star$ (as multiple of $L_\odot$)
  - $d$ (AU)
  - $A$ (Bond)
  - absorbed flux (W/m²)
  - $T_{eq}$ (K)
  - $\tau_{IR}$ (dimensionless)
  - $\varepsilon_{out}$ (effective to-space emissivity)
  - $T_{surf}$ (K) and $\Delta T = T_{surf}-T_{eq}$
- Controls:
  - preset selector (Venus/Earth/Mars + exoplanets)
  - $L_\star$ slider (in $L_\odot$)
  - $d$ slider (AU)
  - $A$ slider (0–1)
  - greenhouse strength slider ($\tau_{IR}$)
  - **redistribution toggle:** full redistribution vs dayside emission
- Predict → Play → Explain missions:
  - prompt text + “My prediction” input or revealable prompt
  - a “Check” button that compares prediction to model direction (e.g., “albedo up → Teq down”)

Load shared demo chrome used elsewhere (if applicable in this repo):

- `../_assets/demo-modes.css`, `../_assets/demo-modes.js`
- `../_assets/demo-polish.js`

**Step 2: Add CSS for compact, readable layout**

Copy styling patterns from recent demos (single stage + readouts below). Keep it simple and keyboard-friendly.

---

### Task 5: Implement the demo UI logic (JS) using the shared model + JSON presets

**Files:**
- Create: `demos/planetary-climate-sandbox/planetary-climate-sandbox.js`
- Modify (if needed): `demos/_assets/demo-polish.js` (only if there’s a clear shared improvement; otherwise leave alone)

**Step 1: Write an HTML smoke test (fails first)**

Add a smoke test that verifies model wiring:

- Create: `tests/demo-html-smoke-planetary-climate.test.js`

Example:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Planetary Climate Sandbox loads PlanetaryClimateModel', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'demos', 'planetary-climate-sandbox', 'index.html'), 'utf8');
  assert.match(html, /_assets\\/planetary-climate-model\\.js/);
});
```

Run: `node --test tests/demo-html-smoke-planetary-climate.test.js`

Expected: FAIL until the script tags exist.

**Step 2: Implement the JS**

Key responsibilities:

- Load presets JSON:
  - For v1, prefer the committed presets bundle: `demos/_assets/climate/planet-presets.v1.js`.
- Bind sliders and recompute readouts on `input`.
- Compute:
  - `F = L / (4πd²)`
  - absorbed flux using redistribution mode:
    - global: `F_abs = (1-A) * F / 4`
    - dayside: `F_abs = (1-A) * F / 2`
  - `T_eq` from the spec formula
  - `ε_out = e^{-τ}`
  - `T_surf = T_eq * e^{τ/4}`
- Render a simple energy-budget diagram:
  - incoming arrow (scaled by flux)
  - reflected arrow (scaled by A)
  - outgoing IR arrow (scaled by σT_eq⁴)
  - “escape fraction” annotation driven by `ε_out`
- Label assumptions:
  - if a preset’s albedo or greenhouse is unknown/assumed, show an “ASSUMPTION” badge (and optionally `VERIFY`).

**Step 3: Make smoke test pass**

Update `demos/planetary-climate-sandbox/index.html` to load:

- `../_assets/planetary-climate-model.js`
- `../_assets/blackbody-model.js` (for spectral view curve shape; relative units OK)
- `../_assets/spectra/spectra-data.v1.js` (for molecular band centers)
- `../_assets/climate/planet-presets.v1.js`
- `planetary-climate-sandbox.js`

Run: `node --test tests/demo-html-smoke-planetary-climate.test.js`

Expected: PASS.

---

### Task 6: Add station card content (6–8 minutes)

**Files:**
- Create: `demos/_assets/station-cards/planetary-climate-sandbox.qmd`
- Create: `demos/planetary-climate-sandbox/planetary-climate-sandbox-station-card.qmd`

Follow the established pattern:

- wrapper QMD includes `_student-header.qmd`
- include file provides the station prompts (controls → observables → governing relationship → sanity check)

Acceptance checks:

- Station card focuses on 1–2 missions (albedo vs greenhouse contrast).
- Includes a sanity check (“A → 1 implies Teq → 0” qualitative limit).

---

### Task 7: Add instructor-facing guide pages (teach-first)

**Files:**
- Create: `demos/_instructor/planetary-climate-sandbox/index.qmd`
- Create: `demos/_instructor/planetary-climate-sandbox/model.qmd`
- Create: `demos/_instructor/planetary-climate-sandbox/activities.qmd`
- Create: `demos/_instructor/planetary-climate-sandbox/assessment.qmd`
- Create: `demos/_instructor/planetary-climate-sandbox/backlog.qmd`

Minimum content:

- Short why/throughline
- 10–15 minute teach script (Venus paradox workflow from spec)
- Activity protocols (MW quick, MW short, station)
- Assessment bank (2 clickers + 1 short answer)
- Model page that states the toy greenhouse mapping clearly and honestly

---

### Task 8: Polish gates + demo registry

**Files:**
- Modify: `demos/polish-manifest.json`
- Modify: `tests/demo-html-smoke.test.js` (optional: fold the new smoke test into the existing file, if preferred)

**Step 1: Add the demo folder to the polish manifest**

Run: `conda run -n astro python scripts/check_demo_polish.py`

Expected: PASS.

**Step 2: Verify full test suite**

Run: `node --test`

Expected: PASS.

**Step 3: (Optional) Verify site render**

If you are touching Quarto content beyond demos/instructor pages:

Run: `conda run -n astro make render`

Expected: PASS.

---

## Optional extension tasks (only if you explicitly choose them for v1)

### Extension A (INCLUDED in v1): “Dayside emission vs full redistribution” toggle

Add a control that switches emitting area assumption:

- Full redistribution: absorbed average uses division by 4 (default)
- Dayside emission: use division by 2 and explain “less emitting area → higher temperature”

Add unit tests that dayside $T_{eq}$ is higher by factor $2^{1/4}$ at fixed inputs.

### Extension B (INCLUDED in v1): “Spectral greenhouse view”

Use a simplified spectral plot:

- blackbody curve at $T_{surf}$
- overlay broad absorption band dips for greenhouse gases (band centers only, explicitly illustrative)

Prefer reusing the existing verified molecular bands dataset:

- `demos/_assets/spectra/molecular-bands.v1.json`

Add a clear label: band centers are sourced; shapes are illustrative (not line-by-line HITRAN).

Implementation detail to make the view feel connected:

- Map $\tau_{IR}$ to an “IR opacity” visualization parameter (monotonic with $\tau_{IR}$) that controls dip depth/width.
- Add a unit test for this mapping: increasing $\tau_{IR}$ must not decrease the visual opacity parameter.
