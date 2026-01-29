# Binary Orbits Zoom + Readability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Make `demos/binary-orbits` usable for very small orbits by adding a view zoom control and a marker-size control, and improve readability (especially the separation/distance label) while aligning typography with other demos.

**Architecture:** Keep physics in `demos/_assets/binary-orbits-model.js` unchanged; implement view scaling and marker sizing as UI-layer controls in `demos/binary-orbits/binary-orbits.js`, with minimal DOM additions in `demos/binary-orbits/index.html`. Use CSS tokens from the shared theme/legacy bridge for consistent font sizing.

**Tech Stack:** Vanilla HTML/CSS/JS, SVG rendering, Node test runner (`node --test`), demo polish check (`conda run -n astro python scripts/check_demo_polish.py`), site build (`conda run -n astro make render`).

---

## Task 1: Add view controls (zoom + marker size)

**Files:**
- Modify: `demos/binary-orbits/index.html`
- Modify: `demos/binary-orbits/binary-orbits.js`
- Modify: `demos/binary-orbits/binary-orbits.css`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Write the failing smoke test**

Add a test that asserts the Binary Orbits demo includes the new controls by ID:
- `zoom-slider`, `zoom-display`
- `marker-size-slider`, `marker-size-display`

Run: `node --test tests/demo-html-smoke.test.js`
Expected: FAIL (IDs missing).

**Step 2: Add the controls to HTML**

Add a new “View” controls row (reuse `.slider-group`) with:
- “View zoom” (log slider; display as e.g. `1×`, `10×`, `100×`)
- “Marker size” (linear slider; display as e.g. `1.0×`)

**Step 3: Implement control behavior in JS**

- Extend `state` with `view: { zoom: number, markerScale: number }`.
- Add DOM refs in `initElements()`.
- Add `setupViewControls()` wired into `init()`.
- Apply zoom by modifying `getScale()` (ensuring it never exceeds “fit-to-view” scale).
- Apply markerScale by multiplying computed body radii in `updateBodies()`.

**Step 4: Run smoke test**

Run: `node --test tests/demo-html-smoke.test.js`
Expected: PASS.

**Rollback:** Remove the new view controls and revert `getScale()` and radius scaling logic.

---

## Task 2: Fix small text + distance label readability

**Files:**
- Modify: `demos/binary-orbits/binary-orbits.css`

**Step 1: Verify the issue exists**

Manually verify (local browser) that:
- The separation label (`#separation-text`) is hard to read.
- Readout labels/units are smaller than other demos due to overrides in `binary-orbits.css`.

**Step 2: Minimal CSS changes**

- Increase SVG label font sizes (`#separation-text`, `#body-1-label`, `#body-2-label`, `#barycenter-label`).
- Add text stroke/paint-order to `#separation-text` so it remains legible over lines.
- Replace very small rem sizes (`0.6rem`, `0.65rem`, `0.7rem`) with shared token sizes like `var(--font-size-sm)` / `var(--font-size-xs)` and avoid shrinking below the legacy bridge defaults.

**Step 3: Verify demo polish + build gates**

Run:
- `node --test`
- `conda run -n astro python scripts/check_demo_polish.py`
- `conda run -n astro make render`

Expected: all PASS.

**Rollback:** Revert CSS changes only.

