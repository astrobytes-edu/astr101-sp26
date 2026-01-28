# Eclipse + Seasons Demo Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Fix Eclipse Geometry + Seasons demos issues (log clearing, pacing/speed controls, penumbral lunar modeling, hour-grid rendering, tropic label cutoff) and improve scientific correctness while keeping the UI student-friendly.

**Architecture:** Add physically-motivated eclipse classification as **pure model functions** (`demos/_assets/eclipse-geometry-model.js`) with **unit tests**, then wire the demo UI to those functions. For seasons, fix the SVG issues in `index.html` and move the “physics” calculations to `demos/_assets/seasons-model.js` so correctness is testable and shared.

**Tech Stack:** Vanilla JS + SVG + Node’s built-in `node:test` tests; Quarto site render via `conda run -n astro make render`.

---

### Task 1: Add physically-motivated eclipse classification + penumbral lunar support (model + tests)

**Files:**
- Modify: `demos/_assets/eclipse-geometry-model.js`
- Test: `tests/eclipse-geometry-model.test.js`

**Step 1: Write the failing tests**

Add tests for new exported functions:
- `lunarEclipseTypeFromBetaDeg(...)` returns `total-lunar` at `beta≈0`
- `lunarEclipseTypeFromBetaDeg(...)` returns `penumbral-lunar` for beta between umbral and penumbral limits
- `eclipseThresholdsDeg(...)` returns sane ordering: `total < umbral < penumbral`

Sketch:
```js
const thr = M.eclipseThresholdsDeg({ earthMoonDistanceKm: 384400 });
assert.ok(thr.totalLunarDeg < thr.umbralLunarDeg);
assert.ok(thr.umbralLunarDeg < thr.penumbralLunarDeg);
assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: 0, earthMoonDistanceKm: 384400 }).type, 'total-lunar');
assert.equal(M.lunarEclipseTypeFromBetaDeg({ betaDeg: (thr.umbralLunarDeg + thr.penumbralLunarDeg)/2, earthMoonDistanceKm: 384400 }).type, 'penumbral-lunar');
```

**Step 2: Run tests to verify they fail**

Run: `node --test tests/eclipse-geometry-model.test.js`

Expected: FAIL with “function not defined” (new exports missing).

**Step 3: Write minimal implementation**

Implement, export, and document:
- Physical constants (km) as defaults: `earthRadiusKm`, `moonRadiusKm`, `sunRadiusKm`, `auKm`
- Shadow radii at distance (similar triangles)
- `eclipseThresholdsDeg(...)` (returns max beta for each category)
- `lunarEclipseTypeFromBetaDeg(...)` (returns `{ type, detail }` for `none|penumbral-lunar|partial-lunar|total-lunar`)

**Step 4: Run tests to verify they pass**

Run: `node --test tests/eclipse-geometry-model.test.js`

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/_assets/eclipse-geometry-model.js tests/eclipse-geometry-model.test.js
git commit -m "feat(demos): add penumbral lunar eclipse model"
```

---

### Task 2: Wire Eclipse demo UI + simulation to new classification (and log it)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- (Optional) Modify: `demos/eclipse-geometry/index.html` (if UI labels need updating)

**Step 1: Write the failing test (if feasible)**

If we can keep this purely in the model layer, skip UI tests. Instead, add/extend model tests verifying type labels are stable. (No DOM test harness.)

**Step 2: Implement UI integration**

- Replace hard-coded lunar thresholds with calls to:
  - `Model.eclipseThresholdsDeg(...)` (to compute category limits)
  - `Model.lunarEclipseTypeFromBetaDeg(...)` (for Full Moon cases)
- Update `checkEclipse()` to return `penumbral-lunar` when applicable and to display a clear explanation.
- Update `formatEclipseTypeLabel()` and `updateStats()` to include penumbral lunar counts.
- Update `simulateYears()` to classify each Full Moon event as `total-lunar | partial-lunar | penumbral-lunar | none` and to push those entries to `state.eclipseLog`.

**Step 3: Manual verification**

Open `demos/eclipse-geometry/index.html` in a browser and confirm:
- At Full Moon near a node, you can see “Penumbral lunar eclipse” for intermediate offsets.
- The log table includes penumbral entries.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/index.html
git commit -m "feat(demos): add penumbral lunar eclipse to demo + sim"
```

---

### Task 3: Fix “Clear Log” + add speed controls + make simulation pacing visible

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Reproduce/lock in desired behavior**

Behavior target:
- Clicking **Clear Log** always clears the visible table immediately.
- If a simulation is currently running, **Clear Log** should (a) clear the log and (b) stop the simulation (so it doesn’t instantly repopulate).
- Add a speed control (dropdown or radio) that affects:
  - `Animate 1 Month`
  - `Animate 1 Year`
  - `Run Simulation` pacing (so 10-year default is not instantaneous at “Normal” speed).

**Step 2: Implement**

- Add UI control: `#sim-speed` (e.g., Slow/Normal/Fast/Instant).
- Implement `getSpeedConfig()` → `{ monthMs, yearMs, simMonthsPerTick, simTickMs }`.
- Update `animateMonth()`/`animateYear()` durations to use selected speed.
- Update `simulateYears()` loop to use `setTimeout(simulateBatch, simTickMs)` (or a throttled rAF) so the sim is visibly progressive at Normal speed.
- Update Clear Log handler to call `stopAnimation()` before clearing.

**Step 3: Manual verification**

- Run sim for ~10 years at Normal speed and confirm it takes a few seconds and updates year count smoothly.
- Confirm Clear Log clears and stays cleared.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/index.html
git commit -m "fix(demos): eclipse sim pacing + speed controls + clear log"
```

---

### Task 4: Fix Seasons demo hour-grid rendering

**Files:**
- Modify: `demos/seasons/index.html`
- Modify: `demos/seasons/seasons.js` (only if toggling needs adjustment)

**Step 1: Reproduce**

Open `demos/seasons/index.html`, toggle “Hour Angle Grid”, observe missing/too-faint grid.

**Step 2: Implement**

- Ensure the hour-grid lines are visually on top of the terminator (SVG element ordering).
- Increase stroke opacity slightly if needed, keeping it subtle.

**Step 3: Manual verification**

Toggle “Hour Angle Grid” on/off and confirm it is clearly visible.

**Step 4: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js
git commit -m "fix(demos): seasons hour grid overlay renders"
```

---

### Task 5: Fix Seasons tropic labels cutoff by wrapping to two lines

**Files:**
- Modify: `demos/seasons/index.html`

**Step 1: Implement**

Update “Tropic of Cancer/Capricorn” labels to use `<tspan>` line breaks and a right-aligned anchor so text never clips.

**Step 2: Manual verification**

Confirm labels are fully visible at common browser widths.

**Step 3: Commit**

```bash
git add demos/seasons/index.html
git commit -m "fix(demos): wrap tropic labels to avoid clipping"
```

---

### Task 6: Improve Seasons “physics” consistency (model reuse) + verify everything + push

**Files:**
- Modify: `demos/_assets/seasons-model.js`
- Modify: `tests/seasons-model.test.js`
- Modify: `demos/seasons/seasons.js`
- Modify: `demos/seasons/index.html` (update model note copy if needed)

**Step 1: Write failing tests**

Update tests to validate the improved declination model:
- `sunDeclinationDeg(...)` is ~0° near equinox (by construction)
- peak declination is ~`axialTiltDeg` at solstice (within a small tolerance)

**Step 2: Implement model upgrade**

Use the exact geometry form:
- `δ = asin( sin ε * sin L )`
- `L ≈ 2π * (dayOfYear - dayEquinox)/365.2422` (keep the existing day-80 anchor)

**Step 3: Wire seasons.js to SeasonsModel**

Replace local duplicates with:
- `SeasonsModel.sunDeclinationDeg(...)`
- `SeasonsModel.dayLengthHours(...)`
- `SeasonsModel.sunNoonAltitudeDeg(...)`

**Step 4: Run tests**

Run: `node --test`
Expected: PASS.

**Step 5: Render site**

Run: `conda run -n astro make render`
Expected: render succeeds with no errors.

**Step 6: Commit + push**

```bash
git add -A
git commit -m "fix(demos): eclipse + seasons student-ready polish"
git push origin main
```

