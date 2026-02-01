# Lectures 7–10 Demos Implementation Plan (TDD)

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make Lectures 7–10 demo support publish-ready by (1) fixing the binary-orbits instructor unit error, (2) adding student-facing practice demos for spectral fingerprints (L9) and Doppler shifts (L10), and (3) upgrading the binary-orbits demo with an RV-curve overlay plus a synchronized “spectral line inset” so RV feels like “measuring spectra over time,” not abstract graphing.

**Architecture:** Keep demos as standalone HTML/CSS/JS in `demos/` (no build step). Put all “physics / math / data transforms” in pure, testable UMD modules under `demos/_assets/` and cover them with Node’s built-in unit tests (`node --test`). Treat spectra datasets as a first-class contract: store canonical JSON under `demos/_assets/spectra/`, and ship a browser-friendly UMD bundle that is mechanically verified against that JSON. UI behavior is verified via (a) HTML smoke tests (`tests/demo-html-smoke.test.js`), (b) demo polish checks (`conda run -n astro python scripts/check_demo_polish.py`), and (c) manual QA in the browser.

**Tech Stack:** Quarto site + static demos; Node’s built-in test runner; conda `astro` env for repo tooling; no npm dependencies.

**Source audit:** `docs/audits/2026-02-01-module-01-lectures-07-10-audit.md` (Demos section starts at line 217).

---

## 0) Protocol compliance (condensed)

### Task classification
- **Dominant:** Documentation / explanation + numerical / physical correctness + feature work (new demos + RV overlay)
- **Also:** UX/accessibility hardening (polish + station cards) + regression prevention (tests)

### Project strategy (teach-first → museum later)
- **Phase 1 (this repo):** build and polish the demos here first for teaching-first iteration (tight loop with readings, station cards, and instructor scripts).
- **Phase 2 (future migration):** migrate the finished demos into the official Cosmic Playground site (self-contained “demo museum” at scale). Keep the current demos’ architecture intentionally simple (static, no build step) so pedagogy is validated before museum infrastructure.
- **Migration constraint:** design the spectra data contract and models so they can be lifted into Cosmic Playground with minimal translation (ideally: same JSON datasets + same conceptual APIs).

### Where specs/contracts live (repo policy)
- **Any new demo specs:** `docs/specs/` (prefer a `docs/specs/demos/` subfolder).
- **Any new data or behavior contracts:** `docs/contracts/` (these are invariants; demos must not “drift” from them).
- This file (`docs/plans/...`) is for **execution steps** (TDD task list), not the canonical spec text.

### Hard invariants (must not change)
- **No deleting/moving/renaming files** without explicit, prior approval (AGENTS.md).
- **No new runtime dependencies** (no npm packages, no build system).
- Demos remain **standalone**: opening `demos/<name>/index.html` in a browser must work.
- **Sign convention invariant (L10):** $\Delta\lambda = \lambda_{\text{obs}} - \lambda_0$ and **positive** means **redshift** and **receding** (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:126-139`).
- **Data integrity invariant:** every atomic line and molecular band record must carry `verified`, `source`, and `source_ref`. Anything not sourced is explicitly `verified: false` and is displayed with a “VERIFY” badge. Unverified items are excluded from graded “Check Match” scoring unless an instructor enables “include unverified.”

### Known underspecified decisions (VERIFY before locking UI)
- **Naming:** choose final folder names for the two new demos (`spectral-lines-lab` vs `stellar-spectrum-lab`, etc.). This plan assumes:
  - `demos/spectral-lines-lab/`
  - `demos/doppler-shift-spectrometer/`
- **Spectral dataset scope:** which elements/lines are included in v1 beyond Hydrogen + Sodium + Calcium (L9 already mentions Ca at ~393/397 nm). Keep v1 small and expand only with verified sources.

---

## 1) Current state (review)

### Existing, lecture-linked student demos (good baseline)
- L7: EM spectrum — `demos/em-spectrum/` (model: `demos/_assets/em-spectrum-model.js`, test: `tests/em-spectrum-model.test.js`)
- L8: Blackbody radiation — `demos/blackbody-radiation/` (model: `demos/_assets/blackbody-model.js`, test: `tests/blackbody-model.test.js`)
- L10: Telescope resolution — `demos/telescope-resolution/` (model: `demos/_assets/telescope-resolution-model.js`, test: `tests/telescope-resolution-model.test.js`)

### Existing “bridge” demo (not linked from L10 yet)
- Binary orbits — `demos/binary-orbits/` (model: `demos/_assets/binary-orbits-model.js`, test: `tests/binary-orbits-physics.test.js`)

### Instructor materials exist for all four above
`demos/_instructor/{em-spectrum,blackbody-radiation,telescope-resolution,binary-orbits}/` plus the “Light & Telescopes” suite guide in `demos/_instructor/light-and-telescopes/`.

### Automated checks already in place (we should extend them)
- Demo polish manifest: `demos/polish-manifest.json` + `conda run -n astro python scripts/check_demo_polish.py`
- HTML smoke tests: `tests/demo-html-smoke.test.js`
- Node unit tests: `tests/*.test.js` runnable via `node --test`

### Known issues / gaps (from audit and repo scan)
- **Critical correctness issue:** `demos/_instructor/binary-orbits/activities.qmd:114` says “13 km/s” but should be ~12–13 m/s (matches L10 reading at `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:315`).
- **No student-facing demo for L9 spectral fingerprints:** no `/demos/` link in `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`.
- **No student-facing demo for L10 Doppler shifting of spectra:** L10 has Doppler content but only links the telescope-resolution demo.
- **Binary-orbits RV curve overlay not implemented:** backlog item exists (`demos/_instructor/binary-orbits/backlog.qmd:35-61`), but `demos/binary-orbits/binary-orbits.js` has no RV plotting yet.

---

## 2) Acceptance criteria (“done means done”)

### Shared design principles (implementation contract)
- **Predict → Play → Explain loop:** each demo starts with a short “mission” question, then manipulation, then a commit-to-answer check.
- **Single stage + compact readouts:** no big side panels; readouts below stage.
- **Instrument realism (pedagogically simplified):**
  - Provide an “instrument resolution / broadening” control (students learn spectra aren’t razor lines).
  - Keep line intensities illustrative until transition probabilities are added and sourced.
- **Data integrity contract:**
  - every line/band record includes `source`, `source_ref`, and `verified`
  - anything `verified: false` shows a visible “VERIFY” badge
  - `verified: false` is excluded from graded matching unless instructor enables inclusion
 - **Layered mechanism views (deep dive, optional):**
   - Default: “Fingerprint mode” (pattern matching, broadening, overlays).
   - Optional: “Mechanism mode” that explains *why* spectra have lines/bands (quantization) without becoming a HITRAN simulator.

### Correctness
- `demos/_instructor/binary-orbits/activities.qmd` states the Sun’s wobble due to Jupiter as **~12 m/s** (or ~13 m/s) — not km/s — and remains consistent with the L10 reading.
- Doppler demos enforce the L10 sign convention: positive $v$ and positive $\Delta\lambda$ correspond to **receding**/**redshift**.
- The RV curve overlay matches the orbit animation phase and has the correct qualitative behavior:
  - circular orbit → sinusoidal RV
  - face-on (i = 0°) → RV amplitude 0
  - edge-on (i = 90°) → max amplitude
 - The RV overlay includes a synchronized “spectral line inset” showing a single absorption line shifting left/right in lockstep with the RV curve marker.

### Coverage / regression prevention
- New pure-model code is covered by Node unit tests.
- New demo HTML is covered by at least one smoke test (script/style includes + required model script tags).
- `conda run -n astro python scripts/check_demo_polish.py` passes after adding new demos to `demos/polish-manifest.json`.

### Course integration
- L9 reading links to the new spectral-lines demo.
- L10 reading links to the new Doppler demo and directly links to binary-orbits as the RV-method visual support (in addition to telescope resolution).
- `demos/index.qmd` and `demos/_instructor/index.qmd` list the new demos.

### Spec-pack acceptance tests (done-definition)

**Spectral Lines Lab**
- Switching setups correctly flips between continuous/emission/absorption.
- Absorption dips occur at the same wavelengths as emission peaks for the same selected species.
- “Unknown spectrum” matches are correct for:
  - Hydrogen-only (Balmer set)
  - Sodium-only (D doublet)
  - Hydrogen + Sodium mixture

**Doppler Shift Spectrometer**
- At $v_r = 0$, rest and observed coincide.
- At $v_r > 0$ (receding), wavelengths increase (redshift); at $v_r < 0$, decrease (blueshift).
- In “transverse” mode, wavelengths do not change.

**Molecular IR mode (if enabled in Spectral Lines Lab)**
- CO₂ shows bands at ~4.3 µm and ~15 µm; H₂O near ~6.3 µm; CH₄ near ~3.3 µm; CO near ~4.67 µm (band centers sourced; shapes illustrative).

---

## 3) Preflight (do once per branch)

### Task 0: Branch + baseline evidence

**Files:** none

**Step 1: Create a branch**

```bash
git switch -c lectures-07-10-demos
```

**Step 2: Run unit tests (baseline)**

```bash
node --test
```

Expected: PASS.

**Step 3: Run demo polish checks (baseline)**

```bash
conda run -n astro python scripts/check_demo_polish.py
```

Expected: PASS.

**Step 4: Optional — start a local server for manual QA**

```bash
conda run -n astro python -m http.server 8000 --bind 127.0.0.1
```

Open:
- `http://127.0.0.1:8000/demos/em-spectrum/`
- `http://127.0.0.1:8000/demos/blackbody-radiation/`
- `http://127.0.0.1:8000/demos/telescope-resolution/`
- `http://127.0.0.1:8000/demos/binary-orbits/`

---

## 3.5) Write specs and contracts first (no implementation yet)

### Task 0.5: Create the canonical spec docs for the three demos + spectra data contract

**Files:**
- Create: `docs/contracts/spectra-data-contract.md`
- Create: `docs/specs/demos/spectral-lines-lab-spec.md`
- Create: `docs/specs/demos/doppler-shift-spectrometer-spec.md`
- Create: `docs/specs/demos/binary-orbits-rv-curve-overlay-spec.md`
- (Optional roadmap) Create: `docs/specs/demos/rotation-curve-demo-spec.md`

**Step 1: Write the specs**
- Copy the “spec pack” requirements verbatim where appropriate (learning goals, core interactions, readouts, missions, acceptance tests).
- Include the “teach-first → museum later” migration notes in each spec (one short paragraph).

**Step 2: Write the spectra data contract**
- Formalize required fields: `kind`, `id`, `label`, `verified`, `sources` (or `source`/`source_ref`), and explicit units (nm/um/cm⁻¹, air/vacuum where relevant).
- Formalize the VERIFY workflow and the “exclude from scoring unless enabled” rule.

**Step 3: Commit (optional)**

```bash
git add docs/specs docs/contracts
git commit -m "docs(specs): add spectra/Doppler/RV demo specs and data contract"
```

---

## 4) Fix: binary-orbits instructor unit error (with regression test)

### Task 1: Add a failing test that catches the km/s mistake

**Files:**
- Create: `tests/binary-orbits-instructor-copy.test.js`

**Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Binary orbits instructor script: Sun wobble is m/s, not km/s', () => {
  const filePath = path.join(__dirname, '..', 'demos', '_instructor', 'binary-orbits', 'activities.qmd');
  const text = fs.readFileSync(filePath, 'utf8');

  // Guardrail: the incorrect unit must not appear.
  assert.doesNotMatch(text, /\\b13\\s*km\\/s\\b/i);

  // Positive assertion: ensure the corrected magnitude is present.
  assert.match(text, /\\b(12|13)\\s*m\\/s\\b/i);
});
```

**Step 2: Run the test to verify it fails**

```bash
node --test tests/binary-orbits-instructor-copy.test.js
```

Expected: FAIL (because the file currently contains “13 km/s”).

**Step 3: Commit**

```bash
git add tests/binary-orbits-instructor-copy.test.js
git commit -m "test(demos): prevent binary-orbits instructor unit regression"
```

---

### Task 2: Fix the unit error (minimal edit)

**Files:**
- Modify: `demos/_instructor/binary-orbits/activities.qmd:114`
- Test: `tests/binary-orbits-instructor-copy.test.js`

**Step 1: Make the copy consistent with L10**
- Change “13 km/s” → “~12 m/s” (preferred, matches `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:315`).

**Step 2: Run the unit test**

```bash
node --test tests/binary-orbits-instructor-copy.test.js
```

Expected: PASS.

**Step 3: (Optional) Render just the instructor page to ensure no Quarto errors**

```bash
conda run -n astro quarto render demos/_instructor/binary-orbits/activities.qmd
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/_instructor/binary-orbits/activities.qmd
git commit -m "fix(demos): correct Sun-Jupiter wobble units in instructor script"
```

---

## 5) Shared spectra data contract (verified seed datasets + VERIFY workflow)

### Spec pack — verified seed dataset (v1)

**Atomic line seed values are from NIST “strong lines” tables (air wavelengths).** Store in nm by dividing Å by 10.

- Hydrogen Balmer (air): Hδ 4101.74 Å, Hγ 4340.462 Å, Hβ ~4861.28 Å, Hα ~6562.71–6562.85 Å
- Sodium D (air): 5889.950 Å and 5895.924 Å
- Calcium (air): Ca II K 3933.6614 Å, Ca II H 3968.4673 Å; optional Ca I 4226.727 Å

**Optional IR “molecules mode” starter (band centers):**
- CO₂: ~4.3 µm and ~15 µm
- H₂O: ~6.2–6.3 µm
- CH₄: ~3.3 µm
- CO: ~4.67 µm

### Data integrity and VERIFY UI rules (implementation contract)
- Every record has:
  - `verified: true|false`
  - `source` and `source_ref`
  - explicit wavelength units (`wavelength_nm_air` or `center_um`)
- If `verified: false`:
  - display a visible “VERIFY” badge in the UI
  - exclude from graded “Check Match” scoring unless instructor enables “include unverified”

### Future: shared “Spectra Data Contract” schema (Cosmic Playground migration)

**Why:** In this repo, the demos are intentionally buildless. In Cosmic Playground, you will have a full TS toolchain, so the same datasets should be validated with a single shared schema at build time (and optionally in dev-mode runtime).

**Target (Cosmic Playground) file layout (proposal):**
- Schema: `src/lib/spectra/spectraSchema.ts` (Zod)
- Validation script: `src/scripts/validateSpectraData.ts` (Node script run in CI)
- Data: `src/data/spectra/spectra.v1.json` (single library file) or split files imported and merged

**Important implementation detail:**
- Keep Zod **build-time** for the museum site; do not bundle Zod into student-facing demos unless explicitly needed.

### Task 3: Add failing tests for the spectra data contract (red)

**Files:**
- Create: `tests/spectra-data-contract.test.js`

**Step 1: Write failing tests (module/data missing)**

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const SpectraData = require('../demos/_assets/spectra/spectra-data.v1.js');

function assertNonEmptyString(x) {
  assert.equal(typeof x, 'string');
  assert.ok(x.length > 0);
}

test('spectra data: all records carry verified + source + source_ref', () => {
  for (const line of SpectraData.atomicLines) {
    assert.equal(typeof line.verified, 'boolean');
    assertNonEmptyString(line.source);
    assertNonEmptyString(line.source_ref);
  }
  for (const band of SpectraData.molecularBands) {
    assert.equal(typeof band.verified, 'boolean');
    assertNonEmptyString(band.source);
    assertNonEmptyString(band.source_ref);
  }
});

test('spectra data: atomic line wavelengths are numeric nm_air', () => {
  for (const line of SpectraData.atomicLines) {
    assert.ok(Number.isFinite(line.wavelength_nm_air));
  }
});

test('spectra data: molecular band centers are numeric um', () => {
  for (const band of SpectraData.molecularBands) {
    assert.ok(Number.isFinite(band.center_um));
  }
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/spectra-data-contract.test.js
```

Expected: FAIL (module not found).

**Step 3: Commit**

```bash
git add tests/spectra-data-contract.test.js
git commit -m "test(demos): enforce spectra data integrity contract"
```

---

### Task 4: Implement the canonical spectra data bundle (green)

**Files:**
- Create: `demos/_assets/spectra/spectra-data.v1.js`
- Create: `demos/_assets/spectra/atomic-lines.v1.json`
- Create: `demos/_assets/spectra/molecular-bands.v1.json`
- Test: `tests/spectra-data-contract.test.js`

**Step 1: Add the canonical JSON files**
- Store the seed dataset with required fields and explicit units.
- Use `verified: true` for the provided sourced values; any future additions must default to `verified: false`.

**Step 2: Add `spectra-data.v1.js` (UMD)**
- Export two arrays:
  - `atomicLines` (records with `wavelength_nm_air`)
  - `molecularBands` (records with `center_um`)
- The JS file should be mechanically derived from JSON (author-time script optional), but it must be committed so the demos work when opened directly in a browser.

**Step 3: Run tests**

```bash
node --test tests/spectra-data-contract.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add demos/_assets/spectra/spectra-data.v1.js demos/_assets/spectra/atomic-lines.v1.json demos/_assets/spectra/molecular-bands.v1.json
git commit -m "feat(demos): add verified spectra seed datasets + data contract fields"
```

---

## 6) New shared model: Doppler shift math (pure + tested)

### Task 3: Add failing tests for Doppler sign convention + invertibility

**Files:**
- Create: `tests/doppler-shift-model.test.js`

**Step 1: Write failing tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const DopplerShiftModel = require('../demos/_assets/doppler-shift-model.js');

test('dopplerShiftNm: v = 0 → no shift', () => {
  assert.equal(DopplerShiftModel.dopplerShiftNm({ lambda0Nm: 656.28, vKms: 0 }), 656.28);
});

test('dopplerShiftNm: positive v (receding) → positive Δλ (redshift)', () => {
  const lambda0 = 500;
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: 100 });
  assert.ok(lambdaObs > lambda0);
  assert.ok(DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs }) > 0);
});

test('dopplerShiftNm: negative v (approaching) → negative Δλ (blueshift)', () => {
  const lambda0 = 500;
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: -100 });
  assert.ok(lambdaObs < lambda0);
  assert.ok(DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs }) < 0);
});

test('velocityFromShiftKms: inverts dopplerShiftNm (v << c)', () => {
  const lambda0 = 589.0;
  const v = 30; // km/s
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: v });
  const vBack = DopplerShiftModel.velocityFromShiftKms({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs });
  assert.ok(Math.abs(vBack - v) < 1e-9);
});
```

**Step 2: Run to verify it fails (module missing)**

```bash
node --test tests/doppler-shift-model.test.js
```

Expected: FAIL with module-not-found for `../demos/_assets/doppler-shift-model.js`.

**Step 3: Commit**

```bash
git add tests/doppler-shift-model.test.js
git commit -m "test(demos): specify Doppler sign convention + inversion"
```

---

### Task 4: Implement `DopplerShiftModel` (minimal functions to pass)

**Files:**
- Create: `demos/_assets/doppler-shift-model.js`
- Test: `tests/doppler-shift-model.test.js`

**Step 1: Implement minimal UMD module**

```js
/* Doppler shift utilities (non-relativistic; v << c).
 *
 * Sign convention (must match L10 reading):
 *   Δλ = λ_obs - λ0
 *   v > 0 (receding) → Δλ > 0 (redshift)
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.DopplerShiftModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Exact speed of light in km/s.
  const C_KM_S = 299792.458;

  function dopplerShiftNm({ lambda0Nm, vKms }) {
    return lambda0Nm * (1 + vKms / C_KM_S);
  }

  function deltaLambdaNm({ lambda0Nm, lambdaObsNm }) {
    return lambdaObsNm - lambda0Nm;
  }

  function velocityFromShiftKms({ lambda0Nm, lambdaObsNm }) {
    const d = deltaLambdaNm({ lambda0Nm, lambdaObsNm });
    return (d / lambda0Nm) * C_KM_S;
  }

  return { C_KM_S, dopplerShiftNm, deltaLambdaNm, velocityFromShiftKms };
});
```

**Step 2: Run tests**

```bash
node --test tests/doppler-shift-model.test.js
```

Expected: PASS.

**Step 3: Commit**

```bash
git add demos/_assets/doppler-shift-model.js
git commit -m "feat(demos): add DopplerShiftModel (tested sign convention)"
```

---

## 7) New shared model: spectral line rendering + matching (pure + tested)

### Task 5: Add failing tests for matching behavior (dataset comes from spectra-data.v1) (red)

**Files:**
- Create: `tests/spectral-lines-model.test.js`

**Step 1: Write failing tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const SpectralLinesModel = require('../demos/_assets/spectral-lines-model.js');

test('normalizeLinesNm: returns sorted unique numeric values', () => {
  const out = SpectralLinesModel.normalizeLinesNm([589.6, 589.0, 589.0, 589.6, 486.13]);
  assert.deepEqual(out, [486.13, 589.0, 589.6]);
});

test('matchByLines: exact match identifies the element', () => {
  const lines = [656.28, 486.128, 434.0462];
  const best = SpectralLinesModel.matchByLines({
    unknownLinesNm: lines,
    candidates: ['H_I_Balmer', 'Na_I_D', 'Ca_II_HK'],
    verifiedOnly: true,
  });
  assert.equal(best.id, 'H_I_Balmer');
});
```

**Step 2: Run to verify it fails (module missing)**

```bash
node --test tests/spectral-lines-model.test.js
```

Expected: FAIL with module-not-found for `../demos/_assets/spectral-lines-model.js`.

**Step 3: Commit**

```bash
git add tests/spectral-lines-model.test.js
git commit -m "test(demos): define spectral-line dataset + matching behavior"
```

---

### Task 6: Implement `SpectralLinesModel` using the shared spectra dataset (green)

**Files:**
- Create: `demos/_assets/spectral-lines-model.js`
- Test: `tests/spectral-lines-model.test.js`

**Step 1: Implement minimal UMD module**

```js
/* Spectral line utilities for ASTR 101 demos.
 *
 * Data policy:
 * - All records carry verified/source/source_ref.
 * - Units: nm_air for atomic lines; IR molecules are band centers (um) with illustrative shapes.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./spectra/spectra-data.v1.js'));
  } else {
    root.SpectralLinesModel = factory(root.SpectraDataV1);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeLinesNm(linesNm) {
    const nums = (linesNm ?? []).filter((x) => Number.isFinite(x));
    nums.sort((a, b) => a - b);
    const out = [];
    for (const x of nums) {
      if (out.length === 0 || Math.abs(out[out.length - 1] - x) > 1e-12) out.push(x);
    }
    return out;
  }

  // Build “element cards” from spectra seed dataset.
  function buildElementCards({ verifiedOnly = true } = {}) {
    const cards = {};
    for (const line of SpectraData.atomicLines ?? []) {
      if (verifiedOnly && !line.verified) continue;
      const cardId = line.group_id; // e.g. "H_I_Balmer"
      if (!cards[cardId]) {
        cards[cardId] = {
          id: cardId,
          species: line.species,
          name: line.group_name,
          verified: line.verified,
          source: line.source,
          source_ref: line.source_ref,
          linesNm: [],
        };
      }
      cards[cardId].linesNm.push(line.wavelength_nm_air);
    }
    for (const id of Object.keys(cards)) {
      cards[id].linesNm = normalizeLinesNm(cards[id].linesNm);
    }
    return cards;
  }

  function _scoreOverlap({ a, b, tolNm = 0.2 }) {
    // Simple overlap: count lines that match within tol.
    const A = normalizeLinesNm(a);
    const B = normalizeLinesNm(b);
    let i = 0;
    let j = 0;
    let matches = 0;
    while (i < A.length && j < B.length) {
      const da = A[i];
      const db = B[j];
      const diff = da - db;
      if (Math.abs(diff) <= tolNm) {
        matches += 1;
        i += 1;
        j += 1;
      } else if (diff < 0) {
        i += 1;
      } else {
        j += 1;
      }
    }
    return { matches, aCount: A.length, bCount: B.length };
  }

  function matchByLines({ unknownLinesNm, candidates, verifiedOnly = true }) {
    const cards = buildElementCards({ verifiedOnly });
    const ids = candidates?.length ? candidates : Object.keys(cards);
    let best = null;
    for (const id of ids) {
      const card = cards[id];
      if (!card) continue;
      const score = _scoreOverlap({ a: unknownLinesNm, b: card.linesNm });
      const frac = score.aCount ? score.matches / score.aCount : 0;
      const candidate = { id, ...score, frac };
      if (!best || candidate.matches > best.matches || (candidate.matches === best.matches && candidate.frac > best.frac)) {
        best = candidate;
      }
    }
    return best;
  }

  return { normalizeLinesNm, buildElementCards, matchByLines };
});
```

**Step 2: Run tests**

```bash
node --test tests/spectral-lines-model.test.js
```

Expected: PASS.

**Step 3: Commit**

```bash
git add demos/_assets/spectral-lines-model.js
git commit -m "feat(demos): add SpectralLinesModel dataset + matching (tested)"
```

---

## 8) New student demo: Spectral Lines Lab (L9)

### Task 7: Add an HTML smoke test for the new demo (red)

**Files:**
- Modify: `tests/demo-html-smoke.test.js`

**Step 1: Add a failing smoke test**

```js
test('Spectral Lines Lab loads shared models', () => {
  const html = readText('demos', 'spectral-lines-lab', 'index.html');
  assert.match(html, /_assets\\/spectral-lines-model\\.js/);
  assert.match(html, /_assets\\/doppler-shift-model\\.js/);
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL (missing file `demos/spectral-lines-lab/index.html`).

**Step 3: Commit**

```bash
git add tests/demo-html-smoke.test.js
git commit -m "test(demos): require spectral-lines-lab to load shared models"
```

---

### Task 8: Create the demo skeleton + wire to shared assets (green)

**Files:**
- Create: `demos/spectral-lines-lab/index.html`
- Create: `demos/spectral-lines-lab/spectral-lines-lab.css`
- Create: `demos/spectral-lines-lab/spectral-lines-lab.js`
- Create: `demos/spectral-lines-lab/README.md`
- Create: `demos/spectral-lines-lab/spectral-lines-lab-station-card.qmd`
- Create: `demos/_assets/station-cards/spectral-lines-lab.qmd`
- Modify: `demos/polish-manifest.json`

**Step 1: Add minimal `index.html` that passes polish checks**
- Must include required CSS:
  - `../_assets/astro-theme.css`
  - `../_assets/demo-shell.css`
  - `../_assets/demo-legacy.css`
- Must include required scripts:
  - `../_assets/astro-utils.js`
  - `../_assets/demo-polish.js`
  - `../_assets/starfield.js`
- Must include shared models:
  - `../_assets/spectral-lines-model.js`
  - `../_assets/doppler-shift-model.js`
- Must include a station card PDF link:
  - `./spectral-lines-lab-station-card.pdf`

**Step 2: Add a minimal `spectral-lines-lab.js`**
- Render a static “rest spectrum” using `SpectralLinesModel.DATA`.
- No interactivity required yet — just enough to prove wiring works.

**Step 3: Run smoke + polish checks**

```bash
node --test tests/demo-html-smoke.test.js
conda run -n astro python scripts/check_demo_polish.py
```

Expected: PASS for smoke test; polish check still PASS after adding the demo to `demos/polish-manifest.json`.

**Step 4: Add station card content**
- Add `demos/_assets/station-cards/spectral-lines-lab.qmd` in the same pattern as existing station cards (6–8 minute artifact + word bank + sanity checks).
- Add wrapper `demos/spectral-lines-lab/spectral-lines-lab-station-card.qmd` (PDF format) mirroring other demos’ station card wrappers.

**Step 5: Render station card PDF**

```bash
conda run -n astro quarto render demos/spectral-lines-lab/spectral-lines-lab-station-card.qmd
```

Expected: `demos/spectral-lines-lab/spectral-lines-lab-station-card.pdf` exists and opens.

**Step 6: Commit**

```bash
git add demos/spectral-lines-lab/index.html demos/spectral-lines-lab/spectral-lines-lab.css demos/spectral-lines-lab/spectral-lines-lab.js demos/spectral-lines-lab/README.md
git add demos/spectral-lines-lab/spectral-lines-lab-station-card.qmd demos/_assets/station-cards/spectral-lines-lab.qmd
git add demos/polish-manifest.json
git commit -m "feat(demos): add spectral-lines-lab skeleton + station card"
```

---

### Task 9: Implement the v1 interactions (manual QA-focused)

**Files:**
- Modify: `demos/spectral-lines-lab/index.html`
- Modify: `demos/spectral-lines-lab/spectral-lines-lab.js`
- Modify: `demos/spectral-lines-lab/spectral-lines-lab.css`

**UI requirements (spec pack)**
- Toggle spectrum type: continuous vs emission vs absorption.
- Choose element(s) and display their line pattern.
- Overlay an “unknown spectrum” and let students check matches.

**Additional must-haves (spec pack)**
- Setup selector (Kirchhoff mode):
  - `HotDense` → continuous spectrum
  - `HotThinGas` → emission lines
  - `CoolGasInFront` → absorption lines on a continuum
- Multi-select element “cards” (1–3 elements).
- “Show Unknown Spectrum” overlay + “Check Match” button that returns a 0–100% score.
- “Instrument resolution / broadening” slider that visibly widens lines / dips.

**Implementation notes (keep v1 small)**
- Use the shared spectra dataset only (Hydrogen Balmer, Sodium D, Calcium H/K).
- Represent a spectrum as:
  - a wavelength axis (nm)
  - vertical line markers at each line wavelength
  - absorption as “dark lines” on a bright/gradient continuum; emission as colored lines on dark background (but keep non-color cues too: thickness/labels).
- Intensities are illustrative (use `relative_strength` for visual hierarchy only).

**Optional extension: Molecules in IR mode (only with sourced band centers)**
- Add a mode toggle “Visible lines / IR molecules.”
- IR mode uses `SpectraDataV1.molecularBands` and shows broad dips at band centers.
- UI banner: “Band centers are sourced; shapes are illustrative (not HITRAN line-by-line).”

**Optional extension: Mechanism mode (deep dive)**
- Add a “Deep Dive: Mechanism” toggle with two subviews:
  - **Atom mechanism (Bohr-like):** show a simple energy-level ladder; clicking a transition highlights the matching visible line in the spectrum (Hydrogen first; other species can remain “fingerprint only”).
  - **Molecule mechanism (vib/rot):** show a simple vib ladder with rotational sublevels to justify why IR looks like a band; temperature widens the envelope. Keep this explicitly labeled as a toy model.

**Manual QA checklist**
- Keyboard: all controls reachable by Tab; labels announced.
- “Unknown spectrum” toggles clearly between states; “Check match” feedback is readable and not color-only.
- No console errors.

**Commit**

```bash
git add demos/spectral-lines-lab/index.html demos/spectral-lines-lab/spectral-lines-lab.js demos/spectral-lines-lab/spectral-lines-lab.css
git commit -m "feat(demos): implement spectral-lines-lab v1 interactions"
```

---

## 9) New student demo: Doppler Shift Spectrometer (L10)

### Task 10: Add an HTML smoke test for the Doppler demo (red)

**Files:**
- Modify: `tests/demo-html-smoke.test.js`

**Step 1: Add a failing smoke test**

```js
test('Doppler Shift Spectrometer loads DopplerShiftModel', () => {
  const html = readText('demos', 'doppler-shift-spectrometer', 'index.html');
  assert.match(html, /_assets\\/doppler-shift-model\\.js/);
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL (missing file `demos/doppler-shift-spectrometer/index.html`).

**Step 3: Commit**

```bash
git add tests/demo-html-smoke.test.js
git commit -m "test(demos): require doppler-shift-spectrometer wiring"
```

---

### Task 11: Create Doppler demo skeleton + station card (green)

**Files:**
- Create: `demos/doppler-shift-spectrometer/index.html`
- Create: `demos/doppler-shift-spectrometer/doppler-shift-spectrometer.css`
- Create: `demos/doppler-shift-spectrometer/doppler-shift-spectrometer.js`
- Create: `demos/doppler-shift-spectrometer/README.md`
- Create: `demos/doppler-shift-spectrometer/doppler-shift-spectrometer-station-card.qmd`
- Create: `demos/_assets/station-cards/doppler-shift-spectrometer.qmd`
- Modify: `demos/polish-manifest.json`

**Step 1: Minimal UI**
- Slider: radial velocity $v$ (default units km/s, but include an m/s readout or unit toggle).
- Overlay: rest spectrum (line positions at $\lambda_0$) and observed spectrum (shifted).
- Readouts:
  - $\lambda_0$
  - $\lambda_{\text{obs}}$
  - $\Delta\lambda$
  - computed $v$ using $\Delta\lambda/\lambda_0 = v/c$ (same sign convention as L10).
- Toggle: “radial vs transverse” (transverse forces $v_r = 0$; no shift).
- Broadening/resolution slider (lines are not razor-thin).
- Cursor/marker to pick a line and see $\lambda_0$ and $\lambda_{\text{obs}}$.

**Step 2: Run smoke + polish checks**

```bash
node --test tests/demo-html-smoke.test.js
conda run -n astro python scripts/check_demo_polish.py
```

Expected: PASS.

**Step 3: Add station card + render PDF**

```bash
conda run -n astro quarto render demos/doppler-shift-spectrometer/doppler-shift-spectrometer-station-card.qmd
```

**Step 4: Commit**

```bash
git add demos/doppler-shift-spectrometer/index.html demos/doppler-shift-spectrometer/doppler-shift-spectrometer.css demos/doppler-shift-spectrometer/doppler-shift-spectrometer.js
git add demos/doppler-shift-spectrometer/README.md demos/doppler-shift-spectrometer/doppler-shift-spectrometer-station-card.qmd
git add demos/_assets/station-cards/doppler-shift-spectrometer.qmd demos/polish-manifest.json
git commit -m "feat(demos): add doppler-shift-spectrometer skeleton + station card"
```

---

### Task 12: Add the “check your sign” interaction (small, no framework)

**Files:**
- Modify: `demos/doppler-shift-spectrometer/index.html`
- Modify: `demos/doppler-shift-spectrometer/doppler-shift-spectrometer.js`

**Behavior**
- When $v$ is set, show a prompt:
  - “Is this a redshift or blueshift?”
  - “Is the object approaching or receding?”
- Student selects an answer; the demo checks using the sign of $\Delta\lambda$.

**Manual QA**
- Works for positive, negative, and zero velocity.
- Feedback is text-based (not color-only).

**Commit**

```bash
git add demos/doppler-shift-spectrometer/index.html demos/doppler-shift-spectrometer/doppler-shift-spectrometer.js
git commit -m "feat(demos): add Doppler sign-check interaction"
```

---

## 10) Upgrade: Binary Orbits RV curve overlay + spectral inset (L10 support)

### Task 13: Add failing unit tests for a radial-velocity helper (red)

**Why:** RV plotting should be driven by a pure function so we can test sign + limiting cases.

**Files:**
- Modify: `tests/binary-orbits-physics.test.js`

**Step 1: Add a failing test**

```js
test('radial velocity: face-on (sin i = 0) produces zero RV', () => {
  const { radialVelocityKms } = BinaryOrbitsModel;
  const rv = radialVelocityKms({
    vxKms: 10,
    vyKms: 0,
    lineOfSightUnit: { x: 1, y: 0 },
    sinI: 0,
  });
  assert.equal(rv, 0);
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/binary-orbits-physics.test.js
```

Expected: FAIL because `radialVelocityKms` does not exist yet.

**Step 3: Commit**

```bash
git add tests/binary-orbits-physics.test.js
git commit -m "test(demos): specify RV helper behavior for binary-orbits"
```

---

### Task 14: Implement minimal RV helper in the shared model (green)

**Files:**
- Modify: `demos/_assets/binary-orbits-model.js` (export a new pure helper)
- Test: `tests/binary-orbits-physics.test.js`

**Step 1: Add function**
- Add a small pure helper:
  - `radialVelocityKms({ vxKms, vyKms, lineOfSightUnit, sinI })`
  - Compute: `v_r = (vx * los.x + vy * los.y) * sinI`
  - (Then define the sign convention in a docstring that matches the Doppler demo and L10: positive means receding — choose LOS direction accordingly in the UI.)

**Step 2: Run test**

```bash
node --test tests/binary-orbits-physics.test.js
```

Expected: PASS.

**Step 3: Commit**

```bash
git add demos/_assets/binary-orbits-model.js
git commit -m "feat(demos): add BinaryOrbitsModel radialVelocityKms helper"
```

---

### Task 15: Add the RV plot UI (manual QA-focused)

**Files:**
- Modify: `demos/binary-orbits/index.html` (add an RV plot container + toggle)
- Modify: `demos/binary-orbits/binary-orbits.js` (compute and render curve)
- Modify: `demos/binary-orbits/binary-orbits.css` (layout + legend styling)

**Behavior**
- Add a toggle “Show radial velocity curve”.
- Render an RV vs time (phase) plot that updates as parameters change.
- Sync a moving marker on the curve to the orbit animation phase.
- Add an inclination slider (0°–90°) that scales RV amplitude by $\sin i$ (v1 “projection-only” approach — no 3D rendering required).
- Add a tiny “spectral line inset” (single absorption line) that shifts left/right using the current star RV via `DopplerShiftModel` (reuse the same sign convention and math from the Doppler demo).
- Highlight the same moment in the RV plot and orbit view (one shared “phase” cursor).

**Manual QA checklist**
- For e = 0: RV curve is sinusoidal and centered on 0.
- For i = 0°: RV curve is flat at 0.
- For star+planet presets (Sun+Jupiter, 51 Peg b): star RV amplitude is plausibly in m/s scale and consistent order-of-magnitude with the reading’s narrative.
- No visual clutter: default view keeps RV plot collapsed/off.

**Commit**

```bash
git add demos/binary-orbits/index.html demos/binary-orbits/binary-orbits.js demos/binary-orbits/binary-orbits.css
git commit -m "feat(demos): add RV curve overlay to binary-orbits"
```

---

## 11) Instructor materials for the two new demos

### Task 16: Add instructor folders and minimal pages

**Files:**
- Create: `demos/_instructor/spectral-lines-lab/index.qmd`
- Create: `demos/_instructor/spectral-lines-lab/model.qmd`
- Create: `demos/_instructor/spectral-lines-lab/activities.qmd`
- Create: `demos/_instructor/spectral-lines-lab/assessment.qmd`
- Create: `demos/_instructor/spectral-lines-lab/backlog.qmd`
- Create: `demos/_instructor/doppler-shift-spectrometer/index.qmd`
- Create: `demos/_instructor/doppler-shift-spectrometer/model.qmd`
- Create: `demos/_instructor/doppler-shift-spectrometer/activities.qmd`
- Create: `demos/_instructor/doppler-shift-spectrometer/assessment.qmd`
- Create: `demos/_instructor/doppler-shift-spectrometer/backlog.qmd`

**Content requirements**
- Teach-first “what to say while projecting”
- Common misconceptions and how the demo confronts them
- A station-mode version that references the PDF station card
- Clear sign conventions (copy/paste the L10 convention verbatim)

**Verification**

```bash
conda run -n astro quarto render demos/_instructor/spectral-lines-lab/index.qmd
conda run -n astro quarto render demos/_instructor/doppler-shift-spectrometer/index.qmd
```

**Commit**

```bash
git add demos/_instructor/spectral-lines-lab demos/_instructor/doppler-shift-spectrometer
git commit -m "docs(demos): add instructor guides for new spectra/Doppler demos"
```

---

## 12) Wire demos into the course (readings + hub pages)

### Task 17: Add a link-check unit test for lecture demo links (red → green)

**Files:**
- Create: `tests/lecture-demo-links.test.js`

**Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(rel) {
  return fs.readFileSync(path.join(__dirname, '..', rel), 'utf8');
}

test('L7 links EM spectrum demo', () => {
  assert.match(read('modules/module-01/readings/lecture-07-light-information-reading.qmd'), /\\/demos\\/em-spectrum\\//);
});

test('L8 links blackbody demo', () => {
  assert.match(read('modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd'), /\\/demos\\/blackbody-radiation\\//);
});

test('L9 links spectral-lines demo (to be added)', () => {
  assert.match(read('modules/module-01/readings/lecture-09-spectral-lines-reading.qmd'), /\\/demos\\/spectral-lines-lab\\//);
});

test('L10 links telescope + Doppler + binary-orbits demos (to be added)', () => {
  const t = read('modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd');
  assert.match(t, /\\/demos\\/telescope-resolution\\//);
  assert.match(t, /\\/demos\\/doppler-shift-spectrometer\\//);
  assert.match(t, /\\/demos\\/binary-orbits\\//);
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/lecture-demo-links.test.js
```

Expected: FAIL (L9 and L10 don’t have the new links yet).

**Step 3: Commit**

```bash
git add tests/lecture-demo-links.test.js
git commit -m "test(course): require L7–L10 readings to link required demos"
```

---

### Task 18: Add the lecture links (green)

**Files:**
- Modify: `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd` (add a “Demo Exploration” block)
- Modify: `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd` (add demo callouts/links for Doppler + binary-orbits)
- Test: `tests/lecture-demo-links.test.js`

**Step 1: Add L9 demo link**
- Add a callout similar in style to L7/L8:
  - “Open the Spectral Lines Lab demo: `/demos/spectral-lines-lab/`”
  - Provide 2–3 guided prompts (predict → check).

**Step 2: Add L10 demo links**
- Add a demo callout near the Doppler formula section:
  - “Open Doppler Shift Spectrometer: `/demos/doppler-shift-spectrometer/`”
- Add a short callout near the exoplanet RV section:
  - “Binary Orbits demo: `/demos/binary-orbits/` (RV curve overlay)”

**Step 3: Run the link test**

```bash
node --test tests/lecture-demo-links.test.js
```

Expected: PASS.

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-09-spectral-lines-reading.qmd modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd
git commit -m "docs(course): link L9/L10 readings to new demos + RV overlay"
```

---

### Task 19: Add the new demo cards to hub pages

**Files:**
- Modify: `demos/index.qmd` (add cards under “Light & Spectra”)
- Modify: `demos/_instructor/index.qmd` (add cards under “Light & measurement demos”)
- Modify: `demos/_instructor/light-and-telescopes/index.qmd` (add the two new demos to the navigation + throughline)

**Verification**

```bash
conda run -n astro quarto render demos/index.qmd
conda run -n astro quarto render demos/_instructor/index.qmd
conda run -n astro quarto render demos/_instructor/light-and-telescopes/index.qmd
```

**Commit**

```bash
git add demos/index.qmd demos/_instructor/index.qmd demos/_instructor/light-and-telescopes/index.qmd
git commit -m "docs(demos): surface new spectra/Doppler demos in hub pages"
```

---

## 13) Final verification (before calling it “done”)

---

## 14) Future roadmap (beyond L7–L10)

### Rotation curve demo (roadmap spec stub)

**Purpose:** a high-payoff “physics transfer” demo that unifies Keplerian expectations, Doppler measurement, and the flat rotation-curve surprise (dark matter inference).

**Planned modes (v1):**
- “Solar system” expectation: central mass → $v(r) \propto r^{-1/2}$
- “Galaxy” measurement story:
  - visible matter only → falling curve
  - visible + halo → flat-ish curve

**Measurement layer (must-have):**
- Show Doppler shifts being used to infer rotation speed (reuse Doppler UI patterns and the same fractional-shift logic).

**Spec discipline:**
- Write a standalone spec doc for this demo before implementing (same template as the spectra demos).

### Task 20: Run full checks

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro quarto render
```

Expected: all PASS.

### Task 21: Manual QA sweep (minimum)

Serve locally:

```bash
conda run -n astro python -m http.server 8000 --bind 127.0.0.1
```

Check:
- `http://127.0.0.1:8000/demos/spectral-lines-lab/`
- `http://127.0.0.1:8000/demos/doppler-shift-spectrometer/`
- `http://127.0.0.1:8000/demos/binary-orbits/` (RV overlay)
- `http://127.0.0.1:8000/modules/module-01/readings/lecture-09-spectral-lines-reading/`
- `http://127.0.0.1:8000/modules/module-01/readings/lecture-10-doppler-telescopes-reading/`

Minimum expectations:
- No console errors.
- Links work.
- “Sign convention” is consistent in copy and behavior.
- Station card PDF links open.
