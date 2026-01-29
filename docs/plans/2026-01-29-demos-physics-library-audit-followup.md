# Demos Physics Library Audit Follow-up Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Verify and address each issue in `docs/audits/2026-01-29-demos-physics-library-code-review.md` via minimal, test-driven changes (no drive-by refactors).

**Architecture:** Treat `demos/_assets/physics/two-body-analytic.js` as the canonical implementation for two-body anomaly conversions and vis-viva. Add/extend Node tests to (1) verify the audit’s claims, (2) lock in invariants (units, angle conventions, safety clamps), then refactor model files to delegate to the shared physics module without changing outward behavior.

**Tech Stack:** Vanilla JS (UMD modules), Node built-in test runner (`node --test`), Quarto render (`conda run -n astro make render`), demo polish check (`conda run -n astro python scripts/check_demo_polish.py`).

---

## Required references (read before implementing)

- Protocol: `docs/llm-lab-protocol.md`
- Engineering checklist: `docs/software-engineering-playbook.md`
- Audit (source of truth): `docs/audits/2026-01-29-demos-physics-library-code-review.md`

---

## Quality gates (must be green before claiming “done”)

Run from repo root:

```bash
node --test
conda run -n astro make render
conda run -n astro python scripts/check_demo_polish.py
```

Expected: all commands exit `0`.

---

## Task classification (per `docs/llm-lab-protocol.md`)

Dominant: **Refactor / restructuring** + **Documentation / explanation**.  
Also present: **Numerical / physical correctness** (only to the extent of locking down invariants with tests; no algorithm changes unless tests force it).

---

## Invariants declaration (do not break)

### Public API / wiring invariants

- Demos continue to run with existing script load order (physics modules load before model modules). Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:182`, `docs/audits/2026-01-29-demos-physics-library-code-review.md:191`.
- Node tests continue to pass under UMD (`module.exports`) usage.

### Numerical / physics invariants

- Anomaly conversions remain mutual inverses within existing tolerances. Evidence: `tests/two-body-analytic.test.js:22`, `tests/keplers-laws-model.test.js:41`.
- Vis-viva speed never returns `NaN` due solely to a slightly-negative `v²` intermediate; current behavior clamps `v² < 0` to `0`. Evidence: `demos/_assets/physics/two-body-analytic.js:110`, `demos/_assets/binary-orbits-model.js:193`, `docs/audits/2026-01-29-demos-physics-library-code-review.md:54`.
- “Specific” quantities are per-unit-mass, so units are `[length²/time²]` (energy) and `[length²/time]` (angular momentum). Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:108`, `demos/keplers-laws/keplers-laws.js:513`, `demos/binary-orbits/binary-orbits.js:1001`.

---

## Phase A — Understanding (no solutions)

We need to convert Claude’s 2026-01-29 audit into a concrete plan that:

1. Verifies each claimed issue exists (with evidence in code + tests or explicit verification steps).
2. Fixes issues systematically and minimally (no opportunistic refactors).
3. Preserves numerical and UI invariants, with acceptance gates: `node --test`, `conda run -n astro make render`, `conda run -n astro python scripts/check_demo_polish.py`.

Audit-scoped issues to address:

1. Duplicate anomaly conversion implementations across model files and `TwoBodyAnalytic`. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:74`.
2. Standardize / confirm `v² < 0` edge-case handling across speed helpers. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:96`.
3. Add missing documentation for “specific” units + teaching-units vs CGS in readouts. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:105`.
4. Export `trueToEccentricAnomalyRad` from `TwoBodyAnalytic` (it exists internally). Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:128`, `demos/_assets/physics/two-body-analytic.js:40`, `demos/_assets/physics/two-body-analytic.js:216`.
5. Document/justify Newton iteration `maxIterations = 25`. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:121`, `demos/_assets/physics/two-body-analytic.js:64`.
6. Naming consistency: propose a convention + low-risk adoption strategy. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:135`, `demos/_assets/physics/two-body-analytic.js:82`.
7. Optional: JSDoc/types for public physics API (only if low-risk; otherwise backlog). Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:144`.

---

## Phase B — Assumption audit (surface unknowns)

**Assumptions (VERIFY in implementation):**

- The intended canonical anomaly conversion behavior is the one in `demos/_assets/physics/two-body-analytic.js` for the “math core”, while demo models may impose their own angle-wrapping conventions for UI continuity (e.g., `[0, 2π)` vs `(-π, π]`). Evidence for current ranges: `tests/two-body-analytic.test.js:8` (wrap-to-π helper), `demos/_assets/binary-orbits-model.js:281`.
- `BinaryOrbitsModel.meanToTrueAnomalyRad()` is expected (by the demo animation) to return angles compatible with continuous orbit drawing; changing its range could cause visible jumps even if positions are unchanged. Evidence: usage in `demos/binary-orbits/binary-orbits.js:128`.
- Adding exports and refactoring delegation does not change script loading order requirements; both demos already load `two-body-analytic.js` before model files. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:182`.

If any assumption is false during execution, stop and re-scope before changing behavior.

---

## Phase C — Exploration (2–3 approaches, pick one)

### Approach 1 (preferred): Test → delegate → delete duplicates (preserve behavior)

- Add tests that (a) prove equivalence where claimed, and (b) lock in angle-wrapping expectations per demo.
- Export `trueToEccentricAnomalyRad` and add direct tests.
- Refactor `keplers-laws-model.js` to **directly re-export** `TwoBodyAnalytic` anomaly helpers (so delegation is testable).
- Refactor `binary-orbits-model.js` anomaly helpers to delegate to `TwoBodyAnalytic` but keep its normalization / wrapping behavior.

**Preserves invariants:** behavior remains the same to within established tolerances; reduces maintenance burden.

### Approach 2: Keep duplicates, add tests only (no refactor)

- Lowest risk, but does not address the audit’s DRY concern; future changes still require touching multiple implementations.

### Approach 3: Expand `TwoBodyAnalytic` API with “wrapped” variants (more invasive)

- Could unify demo-specific wrapping inside the physics module, but increases API surface and risk of drive-by design changes.

**Chosen:** Approach 1.

---

## Phase D — Implementation plan (TDD-oriented)

### Priorities (P0–P3)

- **P0 — Safety + verification harness:** Add tests to verify each audit claim and lock down invariants before refactoring.
- **P1 — DRY + exports:** Remove duplication by delegation (behavior-preserving) and export `trueToEccentricAnomalyRad`.
- **P2 — Documentation + consistency:** Add targeted comments for units; confirm/standardize `v² < 0` behavior.
- **P3 — Backlog hygiene:** Naming convention proposal + optional JSDoc/types (only if low-risk).

> Note on git discipline: this plan intentionally omits `git commit` steps per session rules. Add commits only if explicitly requested.

---

## P0 Tasks — Verify claims with minimal tests

### Task P0.1: Baseline gates (confirm starting point)

**What:** Run the acceptance gates on the current branch to confirm the baseline is green before making changes.

**Why:** Prevent “fixing” pre-existing failures; keep diffs attributable to this plan.

**Evidence (file:line):**
- Audit claims baseline is green. `docs/audits/2026-01-29-demos-physics-library-code-review.md:287`

**Test/Verification:**
- Run: `node --test`
- Run: `conda run -n astro make render`
- Run: `conda run -n astro python scripts/check_demo_polish.py`
- Expected: all exit `0`.

**Change list (files):** None

**Risks/Side effects:** None

**Rollback:** None

---

### Task P0.2: Verify anomaly conversion equivalence before deleting duplicates (pre-flight)

**What:** Add characterization tests that compare anomaly conversion outputs across:

- `demos/_assets/keplers-laws-model.js`
- `demos/_assets/binary-orbits-model.js`
- `demos/_assets/physics/two-body-analytic.js` (canonical)

**Why:** The audit asserts the duplicated implementations “produce identical results”; verify this *before* refactoring to delegation so we don’t accidentally change demo behavior.

**Evidence (file:line):**
- Audit claim of identical results. `docs/audits/2026-01-29-demos-physics-library-code-review.md:80`
- Duplicated code locations. `docs/audits/2026-01-29-demos-physics-library-code-review.md:74`

**Test/Verification (characterization):**

> Rationale: this is expected to PASS today. If it fails, stop and decide whether the difference is intentional (e.g., wrapping conventions) before refactoring.

**Step 1: Create the characterization test**

Create `tests/anomaly-equivalence.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Keplers = require('../demos/_assets/keplers-laws-model.js');
const Binary = require('../demos/_assets/binary-orbits-model.js');

function wrapPi(rad) {
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('KeplersLawsModel anomaly conversions match TwoBodyAnalytic (mod 2π)', () => {
  const eValues = [0, 0.3, 0.6, 0.9];
  const degValues = [0, 20, 60, 120, 179, 240, 300];

  for (const e of eValues) {
    for (const deg of degValues) {
      const thetaRad = (deg * Math.PI) / 180;

      const M1 = Keplers.trueToMeanAnomalyRad({ thetaRad, e });
      const M2 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
      assert.ok(Math.abs(wrapPi(M1 - M2)) < 1e-10);

      const t1 = Keplers.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      const t2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      assert.ok(Math.abs(wrapPi(t1 - t2)) < 1e-10);
    }
  }
});

test('BinaryOrbitsModel anomaly conversions match TwoBodyAnalytic (mod 2π)', () => {
  const eValues = [0, 0.3, 0.6, 0.9];
  const degValues = [0, 20, 60, 120, 179, 240, 300];

  for (const e of eValues) {
    for (const deg of degValues) {
      const thetaRad = (deg * Math.PI) / 180;

      const M1 = Binary.trueToMeanAnomalyRad({ thetaRad, e });
      const M2 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
      assert.ok(Math.abs(wrapPi(M1 - M2)) < 1e-10);

      const t1 = Binary.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      const t2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      assert.ok(Math.abs(wrapPi(t1 - t2)) < 1e-10);
    }
  }
});
```

**Step 2: Run the test**

Run: `node --test tests/anomaly-equivalence.test.js`  
Expected: PASS.

**Step 3: Post-refactor verification command**

Run: `node --test tests/anomaly-equivalence.test.js`  
Expected: PASS (refactor did not change behavior).

**Change list (files):**
- Create: `tests/anomaly-equivalence.test.js`

**Risks/Side effects:**
- If this test fails for Binary Orbits due to intentional wrapping conventions, adjust the assertion to compare wrapped angles appropriately *before* refactoring.

**Rollback:**
- Remove `tests/anomaly-equivalence.test.js` if it encodes the wrong invariant.

---

### Task P0.3: Add a failing test that enforces delegation for Kepler’s model anomaly helpers

**What:** Add a Node test that asserts `KeplersLawsModel` exports `TwoBodyAnalytic`’s anomaly conversion functions (by reference equality).

**Why:** This creates a *failing* test that can only pass once duplication is removed via delegation.

**Evidence (file:line):**
- Duplicate implementations exist today. `demos/_assets/keplers-laws-model.js:55`, `demos/_assets/physics/two-body-analytic.js:50`
- Audit explicitly recommends delegation. `docs/audits/2026-01-29-demos-physics-library-code-review.md:74`

**Test/Verification (TDD):**

**Step 1: Write the failing test**

Create `tests/anomaly-delegation.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Keplers = require('../demos/_assets/keplers-laws-model.js');

test('KeplersLawsModel delegates anomaly conversions to TwoBodyAnalytic (by reference)', () => {
  assert.equal(Keplers.trueToMeanAnomalyRad, TwoBody.trueToMeanAnomalyRad);
  assert.equal(Keplers.meanToTrueAnomalyRad, TwoBody.meanToTrueAnomalyRad);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/anomaly-delegation.test.js`  
Expected: FAIL (functions are currently implemented separately).

**Step 3: Minimal code change (later, in P1)**

- Refactor `demos/_assets/keplers-laws-model.js` to re-export the functions from `TwoBodyAnalytic`.

**Step 4: Post-change verification command**

Run: `node --test tests/anomaly-delegation.test.js`  
Expected: PASS.

**Change list (files):**
- Create: `tests/anomaly-delegation.test.js`

**Risks/Side effects:**
- If Kepler’s model is intentionally *not* supposed to depend on `TwoBodyAnalytic`, this test would encode the wrong architectural choice. (Audit + existing script order suggests the dependency is intended.)

**Rollback:**
- Delete `tests/anomaly-delegation.test.js` and keep model-local functions.

---

### Task P0.4: Add a failing test that requires `trueToEccentricAnomalyRad` to be exported

**What:** Add a Node test that asserts `TwoBodyAnalytic.trueToEccentricAnomalyRad` exists and is a function.

**Why:** This matches the audit’s “missing export” item and forces the minimal export change.

**Evidence (file:line):**
- Function exists but is not exported. `demos/_assets/physics/two-body-analytic.js:40`, `demos/_assets/physics/two-body-analytic.js:216`
- Audit item. `docs/audits/2026-01-29-demos-physics-library-code-review.md:128`

**Test/Verification (TDD):**

**Step 1: Write the failing test**

Update `tests/two-body-analytic.test.js` (append near other anomaly tests):

```js
test('TwoBodyAnalytic exports trueToEccentricAnomalyRad', () => {
  assert.equal(typeof TwoBody.trueToEccentricAnomalyRad, 'function');
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: FAIL (`trueToEccentricAnomalyRad` is `undefined`).

**Step 3: Minimal code change (later, in P1)**

- Export `trueToEccentricAnomalyRad` from `demos/_assets/physics/two-body-analytic.js`.

**Step 4: Post-change verification command**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS.

**Change list (files):**
- Modify: `tests/two-body-analytic.test.js`

**Risks/Side effects:**
- Very low. Adds an export; does not change behavior for existing callers.

**Rollback:**
- Revert the export + test if the export is deemed unnecessary.

---

### Task P0.5: Add characterization tests for angle-wrapping expectations (Binary Orbits)

**What:** Add tests that document current angle conventions for Binary Orbits anomaly helpers (range and inversion, modulo `2π`).

**Why:** Binary Orbits appears to normalize mean anomaly and likely expects `[0, 2π)`-compatible outputs for smooth animation; we should lock this down before refactoring to delegate. Evidence for normalization: `demos/_assets/binary-orbits-model.js:281`.

**Evidence (file:line):**
- Binary model normalizes mean anomaly. `demos/_assets/binary-orbits-model.js:281`
- Binary demo uses these helpers in animation. `demos/binary-orbits/binary-orbits.js:128`

**Test/Verification (TDD-ish / characterization):**

> Rationale: this is a **characterization test** (it should pass today). If it fails, that’s a discovery: behavior is different than assumed and refactor must pause.

**Step 1: Add the tests**

Append to `tests/binary-orbits-physics.test.js` *or* create a new focused file `tests/binary-orbits-anomalies.test.js` (preferred to avoid noisy console output in `binary-orbits-physics.test.js`).

Suggested new file: `tests/binary-orbits-anomalies.test.js`

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/binary-orbits-model.js');

function wrap2Pi(rad) {
  const twoPi = 2 * Math.PI;
  return ((rad % twoPi) + twoPi) % twoPi;
}

test('BinaryOrbitsModel anomaly conversions invert (mod 2π) for typical e', () => {
  const e = 0.5;
  for (const deg of [0, 30, 90, 179, 240, 300, 359]) {
    const theta = (deg * Math.PI) / 180;
    const M = Model.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrap2Pi(theta2) - wrap2Pi(theta)) < 1e-8);
  }
});

test('BinaryOrbitsModel meanToTrueAnomalyRad returns a [0, 2π) angle for normalized inputs', () => {
  const e = 0.5;
  for (const deg of [0, 90, 180, 270, 359]) {
    const M = (deg * Math.PI) / 180;
    const theta = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(theta >= 0 && theta < 2 * Math.PI);
  }
});
```

**Step 2: Run tests**

Run: `node --test tests/binary-orbits-anomalies.test.js`  
Expected: PASS.

**Step 3: Post-refactor verification command**

Run: `node --test tests/binary-orbits-anomalies.test.js`  
Expected: PASS (behavior preserved).

**Change list (files):**
- Create: `tests/binary-orbits-anomalies.test.js`

**Risks/Side effects:**
- If Binary Orbits intentionally uses `(-π, π]` instead of `[0, 2π)`, the “range” test will fail and must be adjusted before refactor.

**Rollback:**
- Remove/adjust the characterization test to reflect actual observed invariant before continuing.

---

## P1 Tasks — Implement minimal fixes (export + DRY refactor)

### Task P1.1: Export `trueToEccentricAnomalyRad` from `TwoBodyAnalytic`

**What:** Add `trueToEccentricAnomalyRad` to the return/export object in `demos/_assets/physics/two-body-analytic.js`.

**Why:** Eliminates a “hidden” internal API and enables reuse (audit item).

**Evidence (file:line):**
- Implementation exists. `demos/_assets/physics/two-body-analytic.js:40`
- Not exported. `demos/_assets/physics/two-body-analytic.js:216`

**Test/Verification (TDD):**

**Step 1: Confirm failing test exists**

- Ensure Task P0.4 test is present and failing:
  - Run: `node --test tests/two-body-analytic.test.js`
  - Expected: FAIL

**Step 2: Implement minimal export**

Modify `demos/_assets/physics/two-body-analytic.js` to include `trueToEccentricAnomalyRad` in the returned object.

**Step 3: Run the test**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS.

**Step 4: Add one correctness cross-check test (optional but cheap)**

Add a second test to `tests/two-body-analytic.test.js`:

```js
test('trueToEccentricAnomalyRad is consistent with trueToMeanAnomalyRad', () => {
  const e = 0.6;
  const thetaRad = 1.0;
  const E = TwoBody.trueToEccentricAnomalyRad({ thetaRad, e });
  const M1 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
  const M2 = E - e * Math.sin(E);
  assert.ok(Math.abs(M1 - M2) < 1e-12);
});
```

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS.

**Change list (files):**
- Modify: `demos/_assets/physics/two-body-analytic.js`
- Modify: `tests/two-body-analytic.test.js`

**Risks/Side effects:**
- Very low; additive export only.

**Rollback:**
- Remove the export line from the return object and revert the new tests.

---

### Task P1.2: DRY Kepler’s model anomaly conversions via direct delegation

**What:** Remove the duplicate `trueToEccentricAnomalyRad`, `trueToMeanAnomalyRad`, and `meanToTrueAnomalyRad` implementations from `demos/_assets/keplers-laws-model.js` and re-export the corresponding `TwoBodyAnalytic` functions.

**Why:** Eliminates duplication and matches audit recommendation.

**Evidence (file:line):**
- Duplicate conversions in Kepler model. `demos/_assets/keplers-laws-model.js:55`
- Canonical versions in TwoBodyAnalytic. `demos/_assets/physics/two-body-analytic.js:40`
- Audit item. `docs/audits/2026-01-29-demos-physics-library-code-review.md:74`

**Test/Verification (TDD):**

**Step 1: Confirm failing delegation test exists**

- Ensure Task P0.3 test exists and is failing:
  - Run: `node --test tests/anomaly-delegation.test.js`
  - Expected: FAIL

**Step 2: Minimal refactor**

In `demos/_assets/keplers-laws-model.js`, add a module-local `TwoBody` reference:

- Browser: `globalThis.TwoBodyAnalytic`
- Node: `require('./physics/two-body-analytic.js')`

Then set:

- `trueToMeanAnomalyRad = TwoBody.trueToMeanAnomalyRad`
- `meanToTrueAnomalyRad = TwoBody.meanToTrueAnomalyRad`

Delete the duplicated implementations.

**Step 3: Run focused tests**

Run: `node --test tests/anomaly-delegation.test.js`  
Expected: PASS.

Run: `node --test tests/keplers-laws-model.test.js`  
Expected: PASS.

**Change list (files):**
- Modify: `demos/_assets/keplers-laws-model.js`
- (Already created in P0) `tests/anomaly-delegation.test.js`

**Risks/Side effects:**
- If `TwoBodyAnalytic` is not loaded before `keplers-laws-model.js` in some HTML, Kepler’s demo would error at runtime. Audit indicates load order is correct. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:182`.

**Rollback:**
- Restore the prior local implementations from git history if runtime dependency issues emerge.

---

### Task P1.3: DRY Binary Orbits anomaly conversions via delegation + explicit wrapping

**What:** Replace `BinaryOrbitsModel.meanToTrueAnomalyRad` and `BinaryOrbitsModel.trueToMeanAnomalyRad` implementations with wrappers that:

1. Preserve Binary Orbits’ input validation and normalization behavior, then
2. Delegate the math to `TwoBodyAnalytic`, then
3. Wrap outputs to the existing expected range (VERIFY via Task P0.5 characterization tests).

**Why:** Removes duplicated Kepler solver logic while keeping the demo’s angle conventions stable.

**Evidence (file:line):**
- Duplicate conversions + Newton solver in Binary model. `demos/_assets/binary-orbits-model.js:263`
- Binary normalizes mean anomaly to `[0, 2π)`. `demos/_assets/binary-orbits-model.js:281`
- Canonical conversions in TwoBodyAnalytic. `demos/_assets/physics/two-body-analytic.js:50`

**Test/Verification (TDD-ish / characterization-driven):**

**Step 1: Ensure characterization tests pass before changing code**

Run: `node --test tests/binary-orbits-anomalies.test.js`  
Expected: PASS (if this fails, stop and adjust the assumed invariant).

**Step 2: Minimal implementation change**

Modify `demos/_assets/binary-orbits-model.js`:

- Acquire `TwoBody` as `globalThis.TwoBodyAnalytic` (browser) or `require('./physics/two-body-analytic.js')` (Node).
- Keep existing `e` clamping behavior (`e >= 1 → 0.999`, `e < 0 → 0`).
- Keep mean anomaly normalization (`[0, 2π)`).
- Delegate:
  - `theta = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: Mnorm, e })`
  - `M = TwoBody.trueToMeanAnomalyRad({ thetaRad, e })`
- Wrap outputs to match existing demo expectations (likely `[0, 2π)` for `meanToTrueAnomalyRad` and `trueToMeanAnomalyRad` for `e > 0`; VERIFY).

**Step 3: Run focused tests**

Run: `node --test tests/binary-orbits-anomalies.test.js`  
Expected: PASS.

Run: `node --test`  
Expected: PASS.

**Step 4: DRY verification (non-test)**

Run: `rg -n \"Newton-Raphson|Kepler's equation\" demos/_assets/binary-orbits-model.js`  
Expected: the anomaly solver block no longer exists (only high-level wrapper remains).

**Change list (files):**
- Modify: `demos/_assets/binary-orbits-model.js`
- (Already created in P0) `tests/binary-orbits-anomalies.test.js`

**Risks/Side effects:**
- Angle-wrapping changes can cause visible animation discontinuities even when positions are mathematically identical; rely on characterization tests + (optional) quick manual smoke in the browser.
- If `TwoBodyAnalytic` is not loaded before `binary-orbits-model.js` in some HTML, Binary Orbits would error at runtime. Audit indicates load order is correct. Evidence: `docs/audits/2026-01-29-demos-physics-library-code-review.md:191`.

**Rollback:**
- Revert `demos/_assets/binary-orbits-model.js` to previous implementation if demo behavior changes or tests fail.

---

### Task P1.4: Document/justify the Newton iteration limit (`25`) with test coverage

**What:** Add a comment near the `for (let i = 0; i < 25; i++)` loop in `TwoBodyAnalytic.meanToTrueAnomalyRad` explaining why `25` is chosen, and add tests that cover the intended high-eccentricity regime.

**Why:** The audit flags `25` as a magic number; we should justify it with evidence from tests rather than an ungrounded claim.

**Evidence (file:line):**
- Magic number. `demos/_assets/physics/two-body-analytic.js:64`
- Audit item. `docs/audits/2026-01-29-demos-physics-library-code-review.md:121`

**Test/Verification:**

**Step 1: Add a high-e regression test (may already pass; that’s okay)**

Update `tests/two-body-analytic.test.js`:

```js
test('Kepler solver converges for high e (regression)', () => {
  const e = 0.999;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = TwoBody.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});
```

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS. (If FAIL: solver limit/tolerance needs adjustment; treat as numerical-correctness change and re-scope carefully.)

**Step 2: Add a comment tied to test coverage**

In `demos/_assets/physics/two-body-analytic.js` near the loop:

- State the tolerance (`1e-12`) and that the iteration cap is chosen based on test coverage up to `e=0.999` (or whatever the test actually covers).
- Avoid claiming convergence for all `e < 1` unless tests demonstrate it.

**Step 3: Verify**

Run: `node --test tests/two-body-analytic.test.js`  
Expected: PASS.

**Change list (files):**
- Modify: `tests/two-body-analytic.test.js`
- Modify: `demos/_assets/physics/two-body-analytic.js`

**Risks/Side effects:**
- If the new “high e” test is too strict, it can introduce flaky failures; keep tolerance consistent with existing tests (currently `1e-8` on `wrapPi` residuals). Evidence: `tests/two-body-analytic.test.js:22`.

**Rollback:**
- Revert the added test and comment if it proves unstable; replace with a narrower or better-conditioned set of cases.

---

## P2 Tasks — Documentation + consistency checks

### Task P2.1: Add “specific quantity” + unit-system comments in UI readouts (targeted only)

**What:** Add short comments in the conservation readout blocks explaining:

- “specific” = per unit mass
- resulting dimensions/units for ε and h
- why the UI toggles between AU/yr “teaching units” and CGS

**Why:** Prevent future maintainers from misunderstanding the dimensionality and unit toggles.

**Evidence (file:line):**
- Kepler’s readout block. `demos/keplers-laws/keplers-laws.js:513`
- Binary Orbits readout block. `demos/binary-orbits/binary-orbits.js:1001`
- Audit recommendation. `docs/audits/2026-01-29-demos-physics-library-code-review.md:105`

**Test/Verification:**

**Minimal change (no test appropriate):**

- These are comment-only changes; there is no meaningful unit test.
- Verification is via acceptance gates:
  - `node --test`
  - `conda run -n astro make render`
  - `conda run -n astro python scripts/check_demo_polish.py`

**Change list (files):**
- Modify: `demos/keplers-laws/keplers-laws.js`
- Modify: `demos/binary-orbits/binary-orbits.js`

**Risks/Side effects:**
- None (comment-only). Avoid reformatting unrelated code.

**Rollback:**
- Revert comment edits.

---

### Task P2.2: Standardize `v² < 0` handling across speed helpers (confirm + lock down)

**What:** Verify how each speed helper behaves when `v²` is negative (due to invalid inputs or numerical edges) and ensure behavior is consistent and documented.

**Why:** Audit flags potential inconsistency; we should either fix or explicitly confirm consistency and lock it in with a regression test.

**Evidence (file:line):**
- Clamp in TwoBodyAnalytic. `demos/_assets/physics/two-body-analytic.js:110`
- Clamp in BinaryOrbitsModel. `demos/_assets/binary-orbits-model.js:193`
- Audit issue text. `docs/audits/2026-01-29-demos-physics-library-code-review.md:96`

**Test/Verification (regression):**

> If behavior is already consistent (both return `0`), the “test-first” step is a regression test that should PASS immediately.

**Step 1: Add test**

Create `tests/vis-viva-negative-v2.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Binary = require('../demos/_assets/binary-orbits-model.js');

test('vis-viva speed clamps negative v^2 to 0 (TwoBodyAnalytic)', () => {
  const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(1);
  // Choose r > 2a so (2/r - 1/a) < 0.
  const v = TwoBody.visVivaSpeedAuPerYr({ rAu: 3, aAu: 1, muAu3Yr2 });
  assert.equal(v, 0);
});

test('orbitalVelocityKms clamps negative v^2 to 0 (BinaryOrbitsModel)', () => {
  const v = Binary.orbitalVelocityKms({ rAu: 3, aAu: 1, M1: 1, M2: 0 });
  assert.equal(v, 0);
});
```

**Step 2: Run test**

Run: `node --test tests/vis-viva-negative-v2.test.js`  
Expected: PASS.

**Step 3: If inconsistency is found**

- Decide the invariant (return `0` vs `NaN`).
- Update the failing test expectation first, then implement the minimal change in the outlier function.

**Change list (files):**
- Create: `tests/vis-viva-negative-v2.test.js`
- (Potentially) Modify: `demos/_assets/physics/two-body-analytic.js` and/or `demos/_assets/binary-orbits-model.js` (only if tests reveal inconsistency)

**Risks/Side effects:**
- Changing `0` → `NaN` can cascade through UI readouts and break demos; prefer preserving current behavior unless there’s evidence it is harmful.

**Rollback:**
- Revert to the prior clamp behavior and keep the regression test aligned to the chosen invariant.

---

## P3 Tasks — Conventions + optional polish (low-risk only)

### Task P3.1: Naming convention proposal + adoption strategy (no renames required)

**What:** Write down a naming convention for physics helpers and choose an adoption strategy that avoids breaking demos.

**Why:** Audit notes inconsistent suffix patterns; we want to prevent drift as new helpers are added.

**Evidence (file:line):**
- Example inconsistency called out. `docs/audits/2026-01-29-demos-physics-library-code-review.md:135`
- Current mixed naming in TwoBodyAnalytic. `demos/_assets/physics/two-body-analytic.js:82`, `demos/_assets/physics/two-body-analytic.js:105`

**Proposed convention (proposal only; do not rename existing APIs in this batch):**

- **Function names include output units**, while **parameter names carry input units** (already common in this repo: `rAu`, `aAu`, `vVecAuYr`).
  - Example: `visVivaSpeedAuPerYr({ rAu, aAu, muAu3Yr2 })` (output units in name; inputs in params).
- When input is a scalar in a different unit system (e.g., `massSolar`), include it in the function name: `muAu3Yr2FromMassSolar(massSolar)`.
- Prefer spelled-out unit exponents in names (`Au3Yr2`, `Au2Yr`) consistently; avoid mixing `AuYr` vs `AuPerYr` unless matching established patterns.

**Adoption strategy (low-risk):**

- “New functions only”: enforce convention for any new exports added after this plan.
- If renames become necessary later, add **aliases** (old name → new name) and deprecate in comments before removal (separate PR/plan).

**Test/Verification:** No test appropriate (naming convention).

**Change list (files):**
- None required to satisfy this task (documented here).

**Risks/Side effects:** None

**Rollback:** None

---

### Task P3.2 (Optional): Add minimal JSDoc for public physics exports (backlog unless clearly low-risk)

**What:** Add lightweight JSDoc blocks for exported functions in:

- `demos/_assets/physics/astro-constants.js`
- `demos/_assets/physics/units.js`
- `demos/_assets/physics/two-body-analytic.js`

**Why:** Improves IDE autocomplete and makes unit expectations explicit; audit backlog item.

**Evidence (file:line):**
- Audit recommendation. `docs/audits/2026-01-29-demos-physics-library-code-review.md:144`

**Test/Verification:**

- No unit test (comment-only); verify via `node --test` and acceptance gates.

**Change list (files):**
- Modify (optional): `demos/_assets/physics/astro-constants.js`, `demos/_assets/physics/units.js`, `demos/_assets/physics/two-body-analytic.js`

**Risks/Side effects:**
- Low, but avoid “documentation refactors” that rewrap or reorder code; keep diffs minimal.

**Rollback:**
- Revert comment-only changes.

---

### Task P3.3: Simplify the Binary Orbits readout panel for first-time users

**What:** Reduce cognitive load in `demos/binary-orbits/` by moving “advanced” readouts (barycenter distance + stellar properties) into a collapsed `<details>` section, leaving the core orbital readouts visible by default.

**Why:** First-time users should see the primary physics quantities (period, separation, velocities) without being overwhelmed by secondary metadata (spectral types, barycenter-in-star note).

**Evidence (file:line):**
- Current readout panel is dense. `demos/binary-orbits/index.html:183`
- Barycenter + stellar properties are currently in the always-visible readout grid. `demos/binary-orbits/index.html:215`
- These readouts are updated in JS. `demos/binary-orbits/binary-orbits.js:895`

**Test/Verification (TDD via HTML smoke):**

**Step 1: Write the failing test**

Update `tests/demo-html-smoke.test.js`:

```js
test('Binary Orbits readouts include a collapsed advanced section for first-time users', () => {
  const html = readText('demos', 'binary-orbits', 'index.html');
  assert.match(html, /<details\\b[^>]*>\\s*<summary>\\s*(Advanced|More)\\s+readouts/i);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/demo-html-smoke.test.js`  
Expected: FAIL (no advanced `<details>` yet).

**Step 3: Minimal code change**

- Modify `demos/binary-orbits/index.html`:
  - Keep the existing element IDs (so JS continues to update values).
  - Wrap the “advanced” readout items (barycenter + T/type rows) in a `<details>` block with a clear `<summary>` (e.g., “Advanced readouts”).

**Step 4: Run test to verify it passes**

Run: `node --test tests/demo-html-smoke.test.js`  
Expected: PASS.

**Change list (files):**
- Modify: `tests/demo-html-smoke.test.js`
- Modify: `demos/binary-orbits/index.html`
- (Optional, styling only): `demos/binary-orbits/binary-orbits.css`

**Risks/Side effects:**
- Low. Main risk is accidentally removing/renaming IDs that `binary-orbits.js` expects.

**Rollback:**
- Revert `demos/binary-orbits/index.html` and the smoke test if the UI change is not desired.

---

### Task P3.4: Add a simple animation loop to the Conservation Laws demo

**What:** Add play/pause/reset controls and animate the particle along the displayed conic in `demos/conservation-laws/`.

**Why:** Motion helps learners connect conserved quantities (ε, h) to the *trajectory* and qualitative “faster/ slower” intuition, without introducing a numerical integrator.

**Evidence (file:line):**
- Demo currently renders a static initial point + velocity arrow. `demos/conservation-laws/conservation-laws.js:176`
- No animation controls exist in the page. `demos/conservation-laws/index.html:87`

**Test/Verification (TDD via HTML smoke):**

**Step 1: Write the failing test**

Update `tests/demo-html-smoke.test.js`:

```js
test('Conservation Laws includes animation controls', () => {
  const html = readText('demos', 'conservation-laws', 'index.html');
  assert.match(html, /id=\"btn-play\"/);
  assert.match(html, /id=\"btn-pause\"/);
  assert.match(html, /id=\"btn-reset\"/);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/demo-html-smoke.test.js`  
Expected: FAIL (controls not present yet).

**Step 3: Minimal code change**

- Modify `demos/conservation-laws/index.html`:
  - Add a small control row with buttons `btn-play`, `btn-pause`, `btn-reset` (match patterns used in other demos).
- Modify `demos/conservation-laws/conservation-laws.js`:
  - Add state for `playing`, `animationId`, and a phase parameter.
  - Use `requestAnimationFrame` to advance the phase and update the particle position along the already-sampled conic (no integrator).
  - Cancel animation on pause/reset and when inputs change.
- Modify `demos/conservation-laws/conservation-laws.css` as needed for layout.

**Step 4: Run verification**

Run: `node --test`  
Expected: PASS.

**Change list (files):**
- Modify: `tests/demo-html-smoke.test.js`
- Modify: `demos/conservation-laws/index.html`
- Modify: `demos/conservation-laws/conservation-laws.js`
- (Optional, styling only): `demos/conservation-laws/conservation-laws.css`

**Risks/Side effects:**
- Animation loops can leak `requestAnimationFrame` handles if not canceled; ensure pause/reset and input changes stop the loop.

**Rollback:**
- Revert the HTML controls and animation logic, returning to a static visualization.

---

### Task P3.5: Improve Kepler’s 2nd Law visualization with equal-time markers

**What:** Add “equal time” marker dots along the orbit (computed from equal mean-anomaly steps) and render them when the “Equal Areas” overlay is enabled.

**Why:** The wedge visualization alone can be hard to interpret; equal-time markers explicitly show that the planet covers more distance near perihelion in the same time interval.

**Evidence (file:line):**
- Current overlay draws only a wedge path. `demos/keplers-laws/keplers-laws.js:452`
- The SVG overlay group currently contains only the wedge path. `demos/keplers-laws/index.html:253`

**Test/Verification (TDD via HTML smoke):**

**Step 1: Write the failing test**

Update `tests/demo-html-smoke.test.js`:

```js
test(\"Kepler's Laws includes an equal-time markers group\", () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /id=\"equal-time-markers\"/);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test tests/demo-html-smoke.test.js`  
Expected: FAIL (group not present yet).

**Step 3: Minimal code change**

- Modify `demos/keplers-laws/index.html`:
  - Add a `<g id="equal-time-markers"></g>` inside the existing `equal-areas-group`.
- Modify `demos/keplers-laws/keplers-laws.js`:
  - In `initElements()`, store a reference to the markers group.
  - In `updateEqualAreas()`, compute `N` marker positions using equal mean-anomaly spacing:
    - `M_i = 2π i / N`
    - `θ_i = meanToTrueAnomaly(M_i, e)`
    - `r_i = orbitalRadius(a, e, θ_i)`
    - `pos_i = orbitalToSvg(r_i, θ_i)`
  - Render/update marker circles in `equal-time-markers`.

**Step 4: Run verification**

Run: `node --test`  
Expected: PASS.

**Change list (files):**
- Modify: `tests/demo-html-smoke.test.js`
- Modify: `demos/keplers-laws/index.html`
- Modify: `demos/keplers-laws/keplers-laws.js`

**Risks/Side effects:**
- Low. Ensure markers hide when the overlay is off and do not interfere with dragging.

**Rollback:**
- Revert the added SVG group, JS updates, and smoke test.
