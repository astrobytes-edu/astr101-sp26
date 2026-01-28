# Eclipse Geometry Student-Ready Hardening Plan (ASAP)

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `demos/eclipse-geometry/` immediately student-ready: physically clear/defensible, intuitive UI cues (“distance to node”), and robust UX (log clear, keyboard access), while keeping the inertial-frame model.

**Architecture:** Keep the inertial state (`sunLonDeg`, `moonLonDeg`, `nodeLonDeg`) in `demos/eclipse-geometry/eclipse-geometry.js`, but push all physics/math helpers into `demos/_assets/eclipse-geometry-model.js` so they’re unit-tested. UI reads out “node distance” and draws node-window arcs derived from the same math/thresholds used for eclipse classification.

**Tech Stack:** Vanilla JS + SVG, `node:test`, Quarto (`conda run -n astro make render`).

---

## Must-do (student-ready)

### Task 1: Add “nearest node distance” readout (degrees)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add a new status line in the status panel**
- Add a new element near `#status-detail`, e.g.:

```html
<div class="status-detail" id="node-distance-detail"></div>
```

**Step 2: Wire it in `initElements()`**
- Add:

```js
nodeDistanceDetail: document.getElementById('node-distance-detail'),
```

**Step 3: Populate it in `updateStatus()`**
- Compute node distance in degrees from inertial longitudes:

```js
const dNode = Model.nearestNodeDistanceDeg({ moonLonDeg: state.moonLonDeg, nodeLonDeg: state.nodeLonDeg });
elements.nodeDistanceDetail.textContent = `Nearest node: ${dNode.toFixed(1)}°`;
```

**Step 4: Manual check**
- Drag Moon around: value should smoothly vary, and be ~0° at the gold node markers.

---

### Task 2: Draw eclipse “season windows” as faint arcs around each node

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/_assets/eclipse-geometry-model.js`
- Test: `tests/eclipse-geometry-model.test.js`

**Step 1: Extend the model module with β↔Δλ helpers**
- Add these to `demos/_assets/eclipse-geometry-model.js`:

```js
function betaFromDeltaLambdaDeg({ tiltDeg, deltaLambdaDeg }) {
  const iRad = (tiltDeg * Math.PI) / 180;
  const dRad = (deltaLambdaDeg * Math.PI) / 180;
  const betaRad = Math.asin(Math.sin(iRad) * Math.sin(dRad));
  return (betaRad * 180) / Math.PI;
}

function deltaLambdaFromBetaDeg({ tiltDeg, betaDeg }) {
  const iRad = (tiltDeg * Math.PI) / 180;
  const bRad = (betaDeg * Math.PI) / 180;
  const denom = Math.sin(iRad);
  if (Math.abs(denom) < 1e-12) return 180; // tilt ~0 => “always near the plane”
  const x = Math.min(1, Math.max(0, Math.sin(Math.abs(bRad)) / Math.abs(denom)));
  const dRad = Math.asin(x);
  return (dRad * 180) / Math.PI;
}
```

Export them from the module.

**Step 2: Add unit tests validating the conversion matches the demo’s published thresholds**
- In `tests/eclipse-geometry-model.test.js`, add:

```js
test('betaFromDeltaLambdaDeg matches published eclipse thresholds (approx)', () => {
  const tilt = 5.145;
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 10.5 }) - 0.94) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 18.5 }) - 1.63) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 4.6 }) - 0.41) < 0.05);
  assert.ok(Math.abs(M.betaFromDeltaLambdaDeg({ tiltDeg: tilt, deltaLambdaDeg: 12.2 }) - 1.09) < 0.05);
});
```

**Step 3: Run tests**
- Run: `node --test`
- Expected: PASS.

**Step 4: Add SVG paths for arcs**
- In `demos/eclipse-geometry/index.html`, inside the top-view SVG, add 4 path elements (two solar, two lunar), e.g.:

```html
<path id="arc-solar-any" class="window-arc solar any" d="" />
<path id="arc-solar-central" class="window-arc solar central" d="" />
<path id="arc-lunar-any" class="window-arc lunar any" d="" />
<path id="arc-lunar-central" class="window-arc lunar central" d="" />
```

Add CSS (faint, pointer-events none):

```css
.window-arc { fill: none; stroke-width: 4; opacity: 0.18; pointer-events: none; }
.window-arc.solar { stroke: var(--accent-gold); }
.window-arc.lunar { stroke: var(--accent-green); }
.window-arc.central { stroke-width: 6; opacity: 0.25; }
.window-arc.any { stroke-dasharray: 6 6; }
```

**Step 5: Compute and update the arc `d` paths every frame**
- In `eclipse-geometry.js`, capture arc elements in `initElements()`.
- Add helper:

```js
function polarToXY(center, r, deg) {
  const a = (deg * Math.PI) / 180;
  return { x: center.x + r * Math.cos(a), y: center.y - r * Math.sin(a) };
}

function arcPath(center, r, startDeg, endDeg) {
  const start = polarToXY(center, r, startDeg);
  const end = polarToXY(center, r, endDeg);
  const sweep = Model.angularSeparationDeg(endDeg, startDeg);
  const largeArc = sweep > 180 ? 1 : 0;
  // Sweep flag 0/1 sets direction; pick 0 for consistency with angle convention.
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}
```

- Compute node window half-widths (Δλ) for current tilt using the **same β thresholds** used for classification:

```js
const dSolarAny = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: PARTIAL_SOLAR_THRESHOLD });
const dSolarCentral = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: TOTAL_SOLAR_THRESHOLD });
const dLunarAny = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: PARTIAL_LUNAR_THRESHOLD });
const dLunarCentral = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: TOTAL_LUNAR_THRESHOLD });
```

- Use the **display node angles** (Sun-fixed) for where to draw arcs:
  - `nodeDisplay = getDisplayNodeAngleDeg()`
  - descending node is `nodeDisplay + 180`
  - For each arc: draw two arcs (around asc + desc) by setting `d` to two subpaths (string concatenation) or use two `<path>`s per arc type.

**Step 6: Manual check**
- With real tilt, arcs should hug the nodes (small windows).
- Decrease tilt toward 0°: arcs widen (more eclipses).

---

### Task 3: Make lunar eclipse naming honest (avoid “partial” meaning mismatch)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/README.md`

**Step 1: Rename UI/log labels to “Any lunar eclipse” vs “Total lunar eclipse”**
- Keep the existing thresholds, but change strings so you’re not implicitly claiming umbral-only partial eclipses.
- Example:
  - `partial-lunar` → label shown as “Lunar eclipse (non-total)” (or “Any lunar eclipse” depending on how you teach it)

**Step 2: Update README wording**
- Match whatever label choice you make in the log table and in the banner subtext.

---

### Task 4: Add keyboard-accessible Moon position control (ASAP accessibility)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add a slider (0–360°) for “Moon position”**
- HTML:

```html
<input type="range" id="moon-angle-slider" class="astro-slider" min="0" max="360" step="1" value="0" aria-label="Moon position (degrees)" />
```

**Step 2: Wire it to `setMoonFromDisplayAngleDeg()`**
- On `input`, call `setMoonFromDisplayAngleDeg(parseFloat(slider.value))`, then `update()`.
- In `updateStatus()` (or `update()`), keep slider value synced to `getDisplayMoonAngleDeg()` so drag + slider stay consistent.

**Step 3: Manual check**
- Keyboard arrows move the Moon.
- Dragging updates the slider thumb.

---

## Nice-to-have (if time today)

### Task 5: Add “Clear Log” button (separate from Reset)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Steps:**
- Add a button near “Show Log”.
- Handler: `state.eclipseLog = []; updateLogTable();`

---

### Task 6: Add a lightweight QA checklist in the README (student-facing reliability)

**Files:**
- Modify: `demos/eclipse-geometry/README.md`

**Checklist (brief):**
- 10-year sim shows clusters ~0.5 years apart
- reset clears stats + log immediately
- keyboard-only user can move Moon via slider

---

## Verification (required)

1. Run unit tests: `node --test`
2. Render site: `conda run -n astro make render`
3. Manual smoke: open `demos/eclipse-geometry/` and check:
   - New/Full buttons + drag + slider all agree
   - arcs track node markers as they drift
   - log clears immediately on Reset and Clear Log

