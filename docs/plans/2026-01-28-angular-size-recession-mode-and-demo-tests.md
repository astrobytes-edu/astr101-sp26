# Angular Size Recession Mode + Demo Unit Tests — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a clearly-labeled Moon “recession-time” mode to the Angular Size demo (keeping the existing perigee↔apogee mode), fix the ISS preset, and add unit tests for Angular Size plus core physics helper-model tests for Moon Phases and Seasons.

**Architecture:** Move core math into small UMD “model” modules under `demos/_assets/` that can run in both the browser (`window.*Model`) and Node (`require()`), mirroring the pattern already used by `demos/_assets/eclipse-geometry-model.js`. Keep demos’ UI code in their existing per-demo JS, but source key calculations from the model modules.

**Tech Stack:** Vanilla JS, `node:test` runner, Quarto site (verify via `conda run -n astro make render`).

---

### Task 1: Add failing Angular Size unit tests (RED)

**Files:**
- Create: `tests/angular-size-model.test.js`

**Step 1: Write the failing test**

Create tests that assert:
- `angularDiameterDeg()` returns ~0.53° for Sun-at-1AU preset values.
- ISS preset is `0.109 km` diameter (109 m) and yields ~0.9 arcmin at 420 km.
- Recession mode distance change matches linear rate conversion (3.8 cm/yr → 38 km/Myr).

**Step 2: Run test to verify it fails**

Run: `node tests/angular-size-model.test.js`  
Expected: FAIL because `demos/_assets/angular-size-model.js` does not exist and ISS preset currently has the wrong diameter.

---

### Task 2: Implement Angular Size model module (GREEN)

**Files:**
- Create: `demos/_assets/angular-size-model.js`
- Modify: `demos/angular-size/angular-size.js`

**Step 1: Write minimal implementation**

Implement (UMD):
- `angularDiameterDeg({ diameterKm, distanceKm })` using exact \(2\arctan(d/2D)\).
- `moonDistanceKmFromRecession({ distanceTodayKm, recessionCmPerYr, timeMyr })` using linear change.

Update `demos/angular-size/angular-size.js` to use the model module when present.

**Step 2: Run test to verify it passes**

Run: `node tests/angular-size-model.test.js`  
Expected: PASS for formula tests, still FAIL for ISS preset until Task 3.

---

### Task 3: Fix ISS preset (GREEN)

**Files:**
- Modify: `demos/angular-size/angular-size.js`

**Step 1: Write the minimal code change**

Fix:
- `PRESETS.iss.diameter` from `0.000109` → `0.109`.

**Step 2: Run tests**

Run: `node tests/angular-size-model.test.js`  
Expected: PASS.

---

### Task 4: Add “recession-time mode” UI and logic (TDD)

**Files:**
- Modify: `demos/angular-size/index.html`
- Modify: `demos/angular-size/angular-size.js`

**Step 1: Write a failing UI-state test (optional)**

If we avoid DOM testing, skip. Instead, test the underlying recession distance mapping in `tests/angular-size-model.test.js` (already done).

**Step 2: Implement UI**

Add a mode selector shown only for the Moon preset:
- `Orbit (perigee↔apogee)` uses the existing `time-slider` (0–360°).
- `Recession (Myr from today)` uses a new slider (e.g., -1000..+1000 Myr, step 10).

Behavior rules:
- Changing the recession slider updates `state.distance` via the model function.
- Changing the distance slider updates the recession slider when in recession mode (invert the linear mapping).
- Mode is clearly labeled as a *toy linear extrapolation* using today’s mean recession rate and is not an ephemeris.

**Step 3: Manual verification**

Open `demos/angular-size/index.html` and verify:
- Moon preset shows the mode selector + correct controls.
- Other presets hide the time controls.
- The numeric readout changes sensibly with recession time.

---

### Task 5: Add Moon Phases model tests and module (TDD)

**Files:**
- Create: `tests/moon-phases-model.test.js`
- Create: `demos/_assets/moon-phases-model.js`
- (Optional) Modify: `demos/moon-phases/moon-phases.js` to use the module

**Step 1: Write failing tests**

Test:
- Illumination is 1 at “Full” and 0 at “New” for that demo’s angle convention.
- Quarter gives ~0.5 illumination.

Run: `node tests/moon-phases-model.test.js`  
Expected: FAIL until module exists.

**Step 2: Implement module + rerun**

---

### Task 6: Add Seasons model tests and module (TDD)

**Files:**
- Create: `tests/seasons-model.test.js`
- Create: `demos/_assets/seasons-model.js`
- (Optional) Modify: `demos/seasons/seasons.js` to use the module

**Step 1: Write failing tests**

Test:
- Declination is ~0 at day ~80 in the simplified model.
- Day length at equator is ~12 hours for any declination.
- Polar-day/night behavior at extreme latitudes.

Run: `node tests/seasons-model.test.js`  
Expected: FAIL until module exists.

**Step 2: Implement module + rerun**

---

### Task 7: Full verification and cleanup

**Step 1: Run all unit tests**

Run:
- `node tests/eclipse-geometry-model.test.js`
- `node tests/angular-size-model.test.js`
- `node tests/moon-phases-model.test.js`
- `node tests/seasons-model.test.js`

Expected: PASS.

**Step 2: Render site**

Run: `conda run -n astro make render`  
Expected: successful render.

**Step 3: Update docs if needed**

If README claims don’t match behavior (especially `demos/angular-size/README.md`), update to reflect the new two-mode control.

