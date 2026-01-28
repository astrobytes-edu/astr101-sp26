# Eclipse Geometry Production Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `demos/eclipse-geometry/` as physically realistic as practical for ASTR 101 while being robust, testable, accessible, and maintainable.

**Architecture:** Move the demo from an implicit Sun-fixed “single angle” model to an explicit inertial model with separate state for Sun longitude, Moon longitude, and nodal longitude; compute phase and ecliptic latitude from those; keep visualization as a projection of those variables. Extract pure model/math into a small module that can be unit-tested with `node:test`.

**Tech Stack:** Vanilla JS + SVG (browser), `node:test` for unit tests, Quarto site build via `conda run -n astro make render`.

---

### Task 1: Define model scope + invariants (write it down first)

**Files:**
- Modify: `demos/eclipse-geometry/README.md`

**Step 1: Add a “Model scope” section**
- Specify what’s modeled (ecliptic latitude, nodes, eclipse seasons) vs ignored (eccentricity, parallax, Earth rotation, shadow cone geometry).
- Add explicit invariants:
  - Two eclipse seasons per year (≈6 months apart) in the long-run log.
  - Solar eclipses require New Moon; lunar eclipses require Full Moon (via true phase angle, not label bins).
  - UI reset/clear actions update the visible DOM immediately.

**Step 2: Add VERIFY markers for any numeric constants that need sourcing**

---

### Task 2: Extract a testable “eclipse model” module

**Files:**
- Create: `demos/_assets/eclipse-geometry-model.js`
- Test: `tests/eclipse-geometry-model.test.js`

**Step 1: Write the failing tests (node:test)**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../demos/_assets/eclipse-geometry-model.js');

test('ecliptic latitude is 0 at nodes', () => {
  assert.equal(M.eclipticLatitudeDeg({ tiltDeg: 5.145, moonLonDeg: 10, nodeLonDeg: 10 }).toFixed(6), '0.000000');
});

test('phase angle produces ~29.53 d synodic cycle from sidereal+solar rates', () => {
  // VERIFY tolerances after implementation; check order-of-magnitude correctness.
  const days = 29.53;
  const phase0 = M.phaseAngleDeg({ moonLonDeg: 0, sunLonDeg: 0 });
  const phase1 = M.phaseAngleDeg({
    moonLonDeg: (360 / 27.321661) * days,
    sunLonDeg: (360 / 365.2422) * days
  });
  assert.ok(Math.abs(M.angularSeparationDeg(phase0, phase1)) < 20);
});
```

**Step 2: Run tests to confirm failure**
- Run: `node --test tests/eclipse-geometry-model.test.js`
- Expected: FAIL (module missing).

**Step 3: Implement the module (minimal API)**
Implement:
- `normalizeAngleDeg(angle)`
- `angularSeparationDeg(a,b)`
- `phaseAngleDeg({moonLonDeg, sunLonDeg})` returning `normalizeAngleDeg(moonLonDeg - sunLonDeg)`
- `eclipticLatitudeDeg({tiltDeg, moonLonDeg, nodeLonDeg})` using the exact formula:
  - `beta = asin(sin(i) * sin(λ-Ω))` (return degrees)
- `nearestNodeDistanceDeg({moonLonDeg, nodeLonDeg})` min distance to asc/desc node

**Step 4: Run tests**
- Run: `node --test`
- Expected: PASS.

---

### Task 3: Refactor the demo to use explicit Sun/Moon/node longitudes (inertial frame)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/index.html` (only if UI needs new readouts)

**Step 1: Introduce explicit state variables**
- Replace/augment `moonAngle`/`nodeAngle` with:
  - `sunLonDeg`
  - `moonLonDeg` (inertial)
  - `nodeLonDeg` (inertial)

**Step 2: Re-derive “phase label” and “syzygy gating”**
- Label phase from phase angle (Moon–Sun separation).
- Gate eclipses by small tolerance on phase angle near:
  - New: 0°
  - Full: 180°

**Step 3: Update animation/simulation stepping**
- Use `dtDays` stepping with:
  - `sunLonDeg += 360/365.2422 * dt`
  - `moonLonDeg += 360/27.321661 * dt`
  - `nodeLonDeg += (-360/(18.6*365.2422)) * dt` (sign VERIFY)
- In the long-term simulation, detect syzygies by tracking phase angle crossings and sampling near minima (simple interpolation is fine).

**Step 4: Keep the visualization Sun-fixed (projection)**
- Convert inertial → display coordinates by subtracting `sunLonDeg` so “Sun is always left”.

**Step 5: Manual sanity checks**
- New/Full buttons set the *phase angle* to 0/180 (not a hardcoded moonLon).
- 10-year log shows clustering in two seasons/year.

---

### Task 4: Improve interpretability (node distance + eclipse windows overlay)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add a “Nearest node distance: X°” readout**

**Step 2: Draw faint arcs around nodes**
- Arc for “any solar” and “central solar” windows (values VERIFY).
- Optional: separate “umbral lunar” vs “penumbral lunar” windows (rename accordingly).

---

### Task 5: Production hardening (a11y, controls, reliability)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- (Optional) Modify: `demos/_assets/challenge-engine.js` (if accessibility gaps exist)

**Step 1: Keyboard control for Moon position**
- Add an `input[type=range]` for “Moon position” (or make the Moon draggable element a `role="slider"` with arrow keys).

**Step 2: Add explicit “Clear Log” button**
- Separate from Reset, so student intent is unambiguous.

**Step 3: Add smoke tests**
- Extend `node --test` coverage for:
  - log clearing updates table
  - syzygy tolerance rejects ±20° cases

---

### Task 6: Verification + docs

**Files:**
- Modify: `demos/eclipse-geometry/README.md`

**Step 1: Run unit tests**
- Run: `node --test`
- Expected: PASS

**Step 2: Render site**
- Run: `conda run -n astro make render`
- Expected: success; no new warnings introduced by demo changes

**Step 3: Manual QA checklist**
- 10-year run: seasons present
- Reset clears stats/log visibly
- Challenge Mode still works
- Mobile width: no overflow

