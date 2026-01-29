# Kepler’s Laws Demo (ASTR 201) Student-Ready Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make `demos/keplers-laws/` production-ready for ASTR 201 by fixing the Newton-mode vector correctness bug, making units/math readouts internally consistent (101 vs 201), reducing animation jank risk, and adding testable “physics model” utilities.

**Architecture:** Move testable orbital-mechanics math into `demos/_assets/keplers-laws-model.js` (UMD like other demos) and cover it with `node:test`. Keep DOM/SVG wiring in `demos/keplers-laws/keplers-laws.js`. Use KaTeX for static math via `data-math`, and throttle dynamic KaTeX updates during animation.

**Tech Stack:** Vanilla JS + SVG, KaTeX, Node built-in tests (`node --test`), Python demo checks (`conda run -n astro …`), Quarto (`conda run -n astro make render`).

---

## Context (from the 2026-01-29 audit)

Source audit: `docs/audits/2026-01-29-keplers-laws-demo-audit.md`

Key issues to address:
- **P0:** Newton-mode velocity vector direction inconsistent with orbit geometry.
- **P1:** Dynamic KaTeX equations ignore the 101/201 unit toggle (mismatch on screen).
- **P1:** KaTeX re-renders on every `update()` in Newton mode (possible animation jank).
- **P2:** Speed control needs explicit “what does 1× mean?” mapping.
- **P3:** Robustify anomaly conversion math and tighten README unit-system narration.

---

## Quality gates (must be green before any “done” claim)

Run from repo root:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## Task 0 (Optional): Worktree + baseline verification

> If you’re intentionally staying on `main`, skip the worktree commands and just run the gates.

**Step 1: Create a worktree**

```bash
git worktree add ../astr101-sp26-keplers-laws-hardening main
cd ../astr101-sp26-keplers-laws-hardening
```

**Step 2: Run baseline gates**

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: PASS.

---

## Task 1: Add a testable Kepler’s Laws model module (skeleton + failing tests)

**Files:**
- Create: `demos/_assets/keplers-laws-model.js`
- Create: `tests/keplers-laws-model.test.js`

### Step 1: Write the failing tests

Create `tests/keplers-laws-model.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const Model = require('../demos/_assets/keplers-laws-model.js');

function wrapPi(rad) {
  // Wrap to (-pi, pi]
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('orbitTangentAngleRad: circular orbit gives tangent angle = pi/2 - theta (demo coords)', () => {
  const a = 1;
  const e = 0;
  for (const deg of [0, 30, 90, 135, 180, 270, 359]) {
    const theta = (deg * Math.PI) / 180;
    const tangent = Model.orbitTangentAngleRad({ aAu: a, e, thetaRad: theta });
    const expected = Math.PI / 2 - theta;
    assert.ok(Math.abs(wrapPi(tangent - expected)) < 1e-10);
  }
});

test('orbitTangentAngleRad: matches numeric derivative direction (elliptical case)', () => {
  const aAu = 1;
  const e = 0.5;
  const theta = Math.PI / 4;
  const eps = 1e-6;

  const p1 = Model.positionFromFocusAu({ aAu, e, thetaRad: theta - eps });
  const p2 = Model.positionFromFocusAu({ aAu, e, thetaRad: theta + eps });
  const dx = p2.xAu - p1.xAu;
  const dy = p2.yAu - p1.yAu;

  const numericAngle = Math.atan2(dy, dx);
  const tangentAngle = Model.orbitTangentAngleRad({ aAu, e, thetaRad: theta });
  assert.ok(Math.abs(wrapPi(tangentAngle - numericAngle)) < 1e-6);
});

test('trueToMeanAnomalyRad + meanToTrueAnomalyRad approximately invert (moderate e)', () => {
  const e = 0.6;
  for (const deg of [0, 20, 60, 120, 179, 240, 300]) {
    const theta = (deg * Math.PI) / 180;
    const M = Model.trueToMeanAnomalyRad({ thetaRad: theta, e });
    const theta2 = Model.meanToTrueAnomalyRad({ meanAnomalyRad: M, e });
    assert.ok(Math.abs(wrapPi(theta2 - theta)) < 1e-8);
  }
});
```

### Step 2: Run tests to confirm they fail

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: FAIL (module missing).

### Step 3: Commit the failing test (optional but recommended)

```bash
git add tests/keplers-laws-model.test.js
git commit -m "test(keplers-laws): add failing model tests"
```

---

## Task 2: Implement `keplers-laws-model.js` (minimal to pass tests)

**Files:**
- Modify: `demos/_assets/keplers-laws-model.js`
- Test: `tests/keplers-laws-model.test.js`

### Step 1: Implement the model module

Create `demos/_assets/keplers-laws-model.js`:

```js
(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.KeplersLawsModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeAngleRad(rad) {
    const twoPi = 2 * Math.PI;
    return ((rad % twoPi) + twoPi) % twoPi;
  }

  // r(θ) = a(1-e^2) / (1 + e cos θ)
  function orbitalRadiusAu({ aAu, e, thetaRad }) {
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const denom = 1 + e * Math.cos(thetaRad);
    return (aAu * (1 - e * e)) / denom;
  }

  // Demo’s coordinate convention is focus-centered with perihelion to the left:
  // x = -r cos θ, y = r sin θ.
  function positionFromFocusAu({ aAu, e, thetaRad }) {
    const r = orbitalRadiusAu({ aAu, e, thetaRad });
    return { xAu: -r * Math.cos(thetaRad), yAu: r * Math.sin(thetaRad) };
  }

  // Tangent direction in the same (x,y) convention as positionFromFocusAu.
  // Velocity direction is tangent to the path because x(θ),y(θ) is a curve and θ increases in time in the demo.
  function orbitTangentAngleRad({ aAu, e, thetaRad }) {
    const r = orbitalRadiusAu({ aAu, e, thetaRad });
    // dr/dθ for r = p/(1 + e cos θ)
    const p = aAu * (1 - e * e);
    const denom = 1 + e * Math.cos(thetaRad);
    const drdTheta = (p * e * Math.sin(thetaRad)) / (denom * denom);

    // x = -r cosθ; y = r sinθ
    // dx/dθ = -(dr/dθ)cosθ + r sinθ
    // dy/dθ = (dr/dθ)sinθ + r cosθ
    const dx = -drdTheta * Math.cos(thetaRad) + r * Math.sin(thetaRad);
    const dy = drdTheta * Math.sin(thetaRad) + r * Math.cos(thetaRad);

    return Math.atan2(dy, dx);
  }

  // Robust conversion using atan2 forms (avoids tan-half-angle quadrant issues).
  function trueToEccentricAnomalyRad({ thetaRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const cosT = Math.cos(thetaRad);
    const sinT = Math.sin(thetaRad);
    const denom = 1 + e * cosT;
    const cosE = (e + cosT) / denom;
    const sinE = (Math.sqrt(1 - e * e) * sinT) / denom;
    return Math.atan2(sinE, cosE);
  }

  function trueToMeanAnomalyRad({ thetaRad, e }) {
    const E = trueToEccentricAnomalyRad({ thetaRad, e });
    return E - e * Math.sin(E);
  }

  function meanToTrueAnomalyRad({ meanAnomalyRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const M = normalizeAngleRad(meanAnomalyRad);

    // Solve Kepler’s equation: M = E - e sin E
    let E = e < 0.8 ? M : Math.PI; // rough initial guess
    for (let i = 0; i < 20; i++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const dE = -f / fp;
      E += dE;
      if (Math.abs(dE) < 1e-12) break;
    }

    const denom = 1 - e * Math.cos(E);
    const cosT = (Math.cos(E) - e) / denom;
    const sinT = (Math.sqrt(1 - e * e) * Math.sin(E)) / denom;
    return Math.atan2(sinT, cosT);
  }

  return {
    orbitalRadiusAu,
    positionFromFocusAu,
    orbitTangentAngleRad,
    trueToMeanAnomalyRad,
    meanToTrueAnomalyRad,
  };
});
```

### Step 2: Run tests to verify they pass

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: PASS.

### Step 3: Commit

```bash
git add demos/_assets/keplers-laws-model.js tests/keplers-laws-model.test.js
git commit -m "feat(keplers-laws): add testable orbital model utilities"
```

---

## Task 3: Wire the demo to load the shared model module

**Files:**
- Modify: `demos/keplers-laws/index.html`
- Modify: `demos/keplers-laws/keplers-laws.js`
- (Optional) Test: `tests/demo-html-smoke.test.js`

### Step 1: Add the model `<script>` to the demo HTML

In `demos/keplers-laws/index.html`, insert:

```html
  <script src="../_assets/keplers-laws-model.js"></script>
```

…before:

```html
  <script src="keplers-laws.js"></script>
```

### Step 2: Update `keplers-laws.js` to consume `window.KeplersLawsModel`

At the top of `demos/keplers-laws/keplers-laws.js`, add:

```js
  const Model = typeof window !== 'undefined' ? window.KeplersLawsModel : null;
  if (!Model) {
    console.error('Kepler’s Laws: missing window.KeplersLawsModel (did you load demos/_assets/keplers-laws-model.js?)');
    return;
  }
```

Then, in places where the demo uses pure math:
- Replace `orbitalRadius(state.a, state.e, state.theta)` with:
  ```js
  Model.orbitalRadiusAu({ aAu: state.a, e: state.e, thetaRad: state.theta })
  ```

Do this in small steps (one callsite at a time), running `conda run -n astro python scripts/demo_static_checks.py` after each small batch if desired.

### Step 3: (Optional) Add/extend an HTML smoke test

Add one more test to `tests/demo-html-smoke.test.js`:

```js
test('Kepler’s Laws loads KeplersLawsModel', () => {
  const html = read('demos/keplers-laws/index.html');
  assert.match(html, /_assets\\/keplers-laws-model\\.js/);
});
```

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

### Step 4: Commit

```bash
git add demos/keplers-laws/index.html demos/keplers-laws/keplers-laws.js tests/demo-html-smoke.test.js
git commit -m "refactor(keplers-laws): load shared model module"
```

---

## Task 4 (P0): Fix Newton-mode velocity vector direction (use tangent direction)

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`
- Test: `tests/keplers-laws-model.test.js` (already covers tangent logic)

### Step 1: Replace the velocity direction calculation in Newton mode

In `demos/keplers-laws/keplers-laws.js`, remove/stop using `velocityAngle()` for rendering vectors.

In `updateVectors()`, replace:

```js
const vAngle = velocityAngle(state.theta, state.e);
```

with:

```js
const vAngle = Model.orbitTangentAngleRad({ aAu: state.a, e: state.e, thetaRad: state.theta });
```

### Step 2: Manual correctness check (fast but decisive)

Serve locally:

```bash
conda run -n astro python -m http.server 8000 --bind 127.0.0.1
```

Open: `http://127.0.0.1:8000/demos/keplers-laws/`

Checklist:
- [ ] Switch to **Newton Mode**
- [ ] Enable **Vectors** overlay
- [ ] Drag planet to several positions (near perihelion, quadrant, aphelion)
- [ ] Velocity arrow is tangent to the orbit everywhere and points along the direction of motion

### Step 3: Commit

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "fix(keplers-laws): make velocity vector tangent to the orbit"
```

---

## Task 5 (P1): Make dynamic KaTeX equations unit-consistent (101 vs 201)

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

### Step 1: Write a tiny unit conversion helper (pure, testable)

Add to `demos/_assets/keplers-laws-model.js`:

```js
function formatNewtonReadouts({ vKms, aMs2, units }) {
  if (units === '201') {
    return {
      vValue: vKms * 1e5,
      vUnit: 'cm/s',
      aValue: aMs2 * 100,
      aUnit: 'cm/s^2',
    };
  }
  return { vValue: vKms, vUnit: 'km/s', aValue: aMs2, aUnit: 'm/s^2' };
}
```

Export it, then add a test in `tests/keplers-laws-model.test.js`:

```js
test('formatNewtonReadouts matches 101 vs 201 units', () => {
  const r101 = Model.formatNewtonReadouts({ vKms: 1, aMs2: 2, units: '101' });
  assert.equal(r101.vValue, 1);
  assert.equal(r101.vUnit, 'km/s');
  assert.equal(r101.aValue, 2);
  assert.equal(r101.aUnit, 'm/s^2');

  const r201 = Model.formatNewtonReadouts({ vKms: 1, aMs2: 2, units: '201' });
  assert.equal(r201.vValue, 1e5);
  assert.equal(r201.vUnit, 'cm/s');
  assert.equal(r201.aValue, 200);
  assert.equal(r201.aUnit, 'cm/s^2');
});
```

Run:

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: FAIL until implemented/exported.

### Step 2: Use the helper for both readouts and KaTeX

In `updateReadouts()`:
- Keep `v` in km/s and `acc` in m/s² (as currently computed).
- Compute:
  ```js
  const fmt = Model.formatNewtonReadouts({ vKms: v, aMs2: acc, units: state.units });
  ```
- Use `fmt.vValue/fmt.vUnit` and `fmt.aValue/fmt.aUnit` both for:
  - The numeric readouts and unit labels
  - The KaTeX strings (Newton mode insight box)

KaTeX strings (example; choose one style and stick to it):

```js
const vLatexUnit = fmt.vUnit === 'km/s' ? '\\\\text{ km/s}' : '\\\\text{ cm/s}';
const aLatexUnit = fmt.aUnit === 'm/s^2' ? '\\\\text{ m/s}^2' : '\\\\text{ cm/s}^2';
```

### Step 3: Manual check

- [ ] Toggle 101/201 and confirm **both** the readout panel and the Newton-mode KaTeX values show the same units and numerics.

### Step 4: Commit

```bash
git add demos/_assets/keplers-laws-model.js tests/keplers-laws-model.test.js demos/keplers-laws/keplers-laws.js
git commit -m "fix(keplers-laws): make Newton math readouts unit-consistent"
```

---

## Task 6 (P1): Throttle dynamic KaTeX rendering to reduce animation jank

**Files:**
- Modify: `demos/keplers-laws/keplers-laws.js`

### Step 1: Add a lightweight render throttle/cache

Implement a small cache at module scope:

```js
let lastNewtonKatex = { v: '', a: '', tMs: 0 };
const NEWTON_KATEX_MIN_INTERVAL_MS = 120; // ~8 Hz during animation
```

In `updateReadouts()`, before calling `katex.render(...)`:
- If `state.playing` is true and `performance.now() - lastNewtonKatex.tMs < NEWTON_KATEX_MIN_INTERVAL_MS`, skip rendering.
- Otherwise render, and update the cached strings + timestamp.

### Step 2: Manual performance check

- [ ] In Newton mode, press Play at 10× and confirm animation remains smooth on a typical student laptop.
- [ ] When paused, KaTeX updates immediately after drag/step.

### Step 3: Commit

```bash
git add demos/keplers-laws/keplers-laws.js
git commit -m "perf(keplers-laws): throttle dynamic KaTeX updates during animation"
```

---

## Task 7 (P2): Clarify what “Speed” means (units + pedagogy)

**Files:**
- Modify: `demos/keplers-laws/index.html`
- (Optional) Modify: `demos/keplers-laws/README.md`

### Step 1: Update the UI label

Change the speed label to be explicit, e.g.:

```html
<label>Speed (years/sec):</label>
```

### Step 2: Add a one-line model note (optional but recommended)

In the UI, add a short sentence near the controls:
“Animation time is a teaching scale (not real time).”

### Step 3: (Optional) Add a smoke test assertion

Add to `tests/demo-html-smoke.test.js`:

```js
test('Kepler’s Laws labels animation speed units', () => {
  const html = read('demos/keplers-laws/index.html');
  assert.match(html, /years\\/sec/i);
});
```

### Step 4: Commit

```bash
git add demos/keplers-laws/index.html demos/keplers-laws/README.md tests/demo-html-smoke.test.js
git commit -m "docs(keplers-laws): clarify animation speed meaning"
```

---

## Task 8 (P3): Tighten docs + close the loop on the audit

**Files:**
- Modify: `demos/keplers-laws/README.md`
- Modify: `docs/audits/2026-01-29-keplers-laws-demo-audit.md`

### Step 1: README unit-system clarification

Add one short paragraph stating:
- Which formulas are “solar units” (AU, years, M☉) vs SI/CGS
- What the demo actually computes in code (km/s and m/s² internally, then converts)

### Step 2: Update the audit verdict

Update `docs/audits/2026-01-29-keplers-laws-demo-audit.md`:
- Flip “Overall” to **Pass** only if Task 4–7 are complete and verified.
- Record what was fixed and what remains as backlog.

### Step 3: Commit

```bash
git add demos/keplers-laws/README.md docs/audits/2026-01-29-keplers-laws-demo-audit.md
git commit -m "docs(keplers-laws): finalize student-ready notes and audit status"
```

---

## Task 9: Final verification (gates + manual demo checklist)

### Step 1: Run repo quality gates

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: PASS.

### Step 2: Manual “ready to teach” checklist (Kepler’s Laws demo)

Open `http://127.0.0.1:8000/demos/keplers-laws/`:

- [ ] Kepler mode: foci/apsides overlays match the orbit as `a`/`e` change
- [ ] Equal-areas wedge looks stable and qualitatively right as you scrub time
- [ ] Newton mode: velocity vector tangent everywhere; force vector always points to star
- [ ] 101 vs 201: readout panel + Newton KaTeX agree on values/units
- [ ] Play at 10×: no obvious stutter (KaTeX throttling works)

### Step 3: Push (when you’re ready)

```bash
git push origin main
```

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-01-29-keplers-laws-demo-student-ready.md`.

Two execution options:
1. **This session:** use `superpowers:executing-plans` and implement task-by-task with checkpoints.
2. **Separate session:** open a new session in a worktree and use `superpowers:executing-plans` there.

Which approach do you want?

