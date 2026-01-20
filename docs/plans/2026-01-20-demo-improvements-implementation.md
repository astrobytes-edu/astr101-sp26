# Demo Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance Moon Phases, Angular Size, and Seasons demos with improved visualization, accessibility, and interactivity.

**Architecture:** Pure JavaScript/HTML/CSS enhancements to existing demos. No dependencies added. Each demo remains self-contained.

**Tech Stack:** Vanilla JS, SVG, HTML5, CSS3

---

## Task 1: Fix Seasons Demo Planet Presets (Bug Fix)

**Files:**
- Modify: `demos/seasons/index.html:720` (slider max attribute)
- Modify: `demos/seasons/seasons.js:687-694` (tilt capping bug)

**Step 1: Update HTML slider max to 180°**

In `demos/seasons/index.html`, change line 720:

```html
<!-- OLD -->
<input type="range" id="tilt-slider" class="astro-slider" min="0" max="90" value="23.5" step="0.1">

<!-- NEW -->
<input type="range" id="tilt-slider" class="astro-slider" min="0" max="180" value="23.5" step="0.1">
```

**Step 2: Update slider labels**

In `demos/seasons/index.html`, change lines 721-725:

```html
<!-- OLD -->
<div class="slider-labels">
  <span>0° (no seasons)</span>
  <span>45°</span>
  <span>90° (extreme)</span>
</div>

<!-- NEW -->
<div class="slider-labels">
  <span>0°</span>
  <span>90°</span>
  <span>180° (retrograde)</span>
</div>
```

**Step 3: Fix the tilt capping bug in JS**

In `demos/seasons/seasons.js`, replace lines 681-694:

```javascript
// OLD CODE (buggy):
planetPresets.forEach(preset => {
  preset.el.addEventListener('click', () => {
    const tilt = parseFloat(preset.el.getAttribute('data-tilt'));
    state.currentPlanet = preset.planet;

    // Handle Venus and Uranus special cases (tilt > 90)
    // For simplicity, we cap at 90 for the slider but store actual value
    const displayTilt = Math.min(tilt, 90);
    state.axialTilt = displayTilt;
    elements.tiltSlider.value = displayTilt;

    updatePlanetPresetHighlight(preset.el);
    update();
  });
});

// NEW CODE (fixed):
planetPresets.forEach(preset => {
  preset.el.addEventListener('click', () => {
    const tilt = parseFloat(preset.el.getAttribute('data-tilt'));
    state.currentPlanet = preset.planet;

    // Store actual tilt value (0-180° range now supported)
    state.axialTilt = tilt;
    elements.tiltSlider.value = tilt;

    updatePlanetPresetHighlight(preset.el);
    update();
  });
});
```

**Step 4: Test the fix**

1. Open `demos/seasons/index.html` in browser
2. Click "Uranus" preset → verify slider shows 97.8° (not capped to 90°)
3. Click "Venus" preset → verify slider shows 177.4°
4. Drag tilt slider to 180° → verify visualization handles extreme tilts

**Step 5: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js
git commit -m "fix(seasons): support full 0-180° tilt range for planet presets

Venus (177.4°) and Uranus (97.8°) now display correctly.
Slider extended to 180° to handle retrograde rotation planets."
```

---

## Task 2: Add ARIA Labels to Moon Phases Demo

**Files:**
- Modify: `demos/moon-phases/index.html` (add ARIA attributes)
- Modify: `demos/moon-phases/moon-phases.js` (update ARIA on state change)

**Step 1: Add ARIA attributes to HTML**

In `demos/moon-phases/index.html`, update the moon-group SVG element (around line 268):

```html
<!-- OLD -->
<g id="moon-group" class="moon-draggable">

<!-- NEW -->
<g id="moon-group" class="moon-draggable"
   role="slider"
   aria-label="Moon position on orbit"
   aria-valuemin="0"
   aria-valuemax="360"
   aria-valuenow="0"
   aria-valuetext="Full Moon, 100% illuminated"
   tabindex="0">
```

**Step 2: Add live region for announcements**

In `demos/moon-phases/index.html`, add after the insight-box (around line 347):

```html
<!-- Screen reader announcements -->
<div id="status-announce" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

**Step 3: Update ARIA values in JS when state changes**

In `demos/moon-phases/moon-phases.js`, add to the `updateReadouts()` function (after line 253):

```javascript
// Update ARIA attributes for accessibility
moonGroup.setAttribute('aria-valuenow', Math.round(moonAngle));
moonGroup.setAttribute('aria-valuetext',
  `${name}, ${Math.round(illum * 100)}% illuminated, Day ${days.toFixed(0)} of lunar cycle`);
```

**Step 4: Add reference to moonGroup at top of updateReadouts**

At the beginning of `updateReadouts()` function (around line 239), ensure moonGroup is accessible:

```javascript
function updateReadouts() {
  const illum = getIllumination(moonAngle);
  const name = getPhaseName(moonAngle);
  const days = getDaysSinceNew(moonAngle);
  const moonGroup = document.getElementById('moon-group');  // Add this line

  // ... rest of function
```

**Step 5: Verify ARIA updates work**

1. Open demo in browser
2. Open browser DevTools, select moon-group element
3. Drag Moon → verify aria-valuenow and aria-valuetext update
4. Use screen reader (VoiceOver/NVDA) → verify announcements

**Step 6: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "a11y(moon-phases): add ARIA labels for screen readers

- Moon position slider has proper role, valuemin/max, valuenow, valuetext
- Live region announces state changes
- Screen-reader-only class for invisible announcements"
```

---

## Task 3: Add Keyboard Navigation to Moon Phases Demo

**Files:**
- Modify: `demos/moon-phases/moon-phases.js` (add keyboard handlers)

**Step 1: Add keyboard event handler**

In `demos/moon-phases/moon-phases.js`, add new function after `setupDrag()` (around line 328):

```javascript
// ============================================
// Keyboard Navigation
// ============================================

function setupKeyboard() {
  const moonGroup = document.getElementById('moon-group');

  moonGroup.addEventListener('keydown', (event) => {
    let delta = 0;
    let jump = null;

    switch (event.key) {
      case 'ArrowLeft':
        delta = event.shiftKey ? -1 : -5;
        break;
      case 'ArrowRight':
        delta = event.shiftKey ? 1 : 5;
        break;
      case 'ArrowUp':
        delta = event.shiftKey ? -1 : -5;
        break;
      case 'ArrowDown':
        delta = event.shiftKey ? 1 : 5;
        break;
      case 'Home':
        jump = 0;  // Full Moon
        break;
      case 'End':
        jump = 180;  // New Moon
        break;
      case '1':
        jump = 180;  // New Moon
        break;
      case '2':
        jump = 225;  // Waxing Crescent
        break;
      case '3':
        jump = 270;  // First Quarter
        break;
      case '4':
        jump = 315;  // Waxing Gibbous
        break;
      case '5':
        jump = 0;    // Full Moon
        break;
      case '6':
        jump = 45;   // Waning Gibbous
        break;
      case '7':
        jump = 90;   // Third Quarter
        break;
      case '8':
        jump = 135;  // Waning Crescent
        break;
      default:
        return;  // Don't prevent default for other keys
    }

    event.preventDefault();

    if (jump !== null) {
      // Animate to jump position
      const startAngle = moonAngle;
      let diff = jump - startAngle;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      AstroUtils.animateValue(startAngle, startAngle + diff, 300, (value) => {
        moonAngle = ((value % 360) + 360) % 360;
        update();
      });
    } else if (delta !== 0) {
      moonAngle = ((moonAngle + delta) % 360 + 360) % 360;
      update();

      // Announce change for screen readers
      const announce = document.getElementById('status-announce');
      if (announce) {
        const name = getPhaseName(moonAngle);
        const illum = getIllumination(moonAngle);
        announce.textContent = `${name}, ${Math.round(illum * 100)}% illuminated`;
      }
    }
  });

  // Visual focus indicator
  moonGroup.addEventListener('focus', () => {
    moonGroup.style.outline = '2px solid var(--accent-blue)';
    moonGroup.style.outlineOffset = '4px';
  });

  moonGroup.addEventListener('blur', () => {
    moonGroup.style.outline = 'none';
  });
}
```

**Step 2: Call setupKeyboard in init()**

In `demos/moon-phases/moon-phases.js`, update the `init()` function (around line 361):

```javascript
function init() {
  initElements();
  setupDrag();
  setupPresets();
  setupKeyboard();  // Add this line

  // ... rest of init
}
```

**Step 3: Test keyboard navigation**

1. Open demo in browser
2. Click on Moon to focus it, or Tab to it
3. Press Arrow keys → Moon moves 5°
4. Press Shift+Arrow → Moon moves 1°
5. Press Home → jumps to Full Moon
6. Press End → jumps to New Moon
7. Press 1-8 → jumps to each named phase

**Step 4: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "a11y(moon-phases): add keyboard navigation for draggable Moon

- Arrow keys: move Moon 5° (Shift for 1°)
- Home/End: jump to Full/New Moon
- 1-8: jump to each named phase
- Visual focus indicator on focus
- Screen reader announces position changes"
```

---

## Task 4: Add ARIA Labels to Seasons Demo

**Files:**
- Modify: `demos/seasons/index.html` (add ARIA attributes)
- Modify: `demos/seasons/seasons.js` (update ARIA on state change)

**Step 1: Add ARIA to orbital Earth element**

In `demos/seasons/index.html`, update the earth-orbital group (around line 559):

```html
<!-- OLD -->
<g id="earth-orbital" class="earth-marker">

<!-- NEW -->
<g id="earth-orbital" class="earth-marker"
   role="img"
   aria-label="Earth position on orbit"
   aria-roledescription="Earth at current date position">
```

**Step 2: Add live region**

In `demos/seasons/index.html`, add after the insight-box (around line 801):

```html
<!-- Screen reader announcements -->
<div id="status-announce" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

**Step 3: Update ARIA in JS**

In `demos/seasons/seasons.js`, add to `updateReadouts()` function (around line 615):

```javascript
// Update ARIA for Earth position
const earthOrbital = document.getElementById('earth-orbital');
if (earthOrbital) {
  const seasonN = getSeasonNorth(state.dayOfYear);
  earthOrbital.setAttribute('aria-label',
    `Earth at ${dayOfYearToDate(state.dayOfYear)}, ${seasonN} in Northern Hemisphere`);
}

// Announce significant changes
const announce = document.getElementById('status-announce');
if (announce && !state.animating) {
  announce.textContent = `${dayOfYearToDate(state.dayOfYear)}, Northern ${seasonN}`;
}
```

**Step 4: Test**

1. Open demo, use screen reader
2. Navigate to Earth → verify description is read
3. Change date → verify announcement

**Step 5: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js
git commit -m "a11y(seasons): add ARIA labels for screen readers

- Earth orbital position has descriptive aria-label
- Live region announces date/season changes
- SR-only class for hidden announcements"
```

---

## Task 5: Add Keyboard Navigation to Seasons Demo

**Files:**
- Modify: `demos/seasons/seasons.js` (add keyboard handlers)

**Step 1: Add keyboard event handler**

In `demos/seasons/seasons.js`, add new function before `init()` (around line 860):

```javascript
// ============================================
// Keyboard Navigation
// ============================================

function setupKeyboard() {
  document.addEventListener('keydown', (event) => {
    // Only handle if not focused on an input
    if (event.target.tagName === 'INPUT') return;

    let dayDelta = 0;
    let jumpDay = null;

    switch (event.key) {
      case 'ArrowLeft':
        dayDelta = event.shiftKey ? -30 : -1;
        break;
      case 'ArrowRight':
        dayDelta = event.shiftKey ? 30 : 1;
        break;
      case 'e':
      case 'E':
        // Jump to nearest equinox
        const distToMar = Math.abs(state.dayOfYear - 80);
        const distToSep = Math.abs(state.dayOfYear - 266);
        jumpDay = distToMar < distToSep ? 80 : 266;
        break;
      case 's':
      case 'S':
        // Jump to nearest solstice
        const distToJun = Math.abs(state.dayOfYear - 172);
        const distToDec = Math.min(Math.abs(state.dayOfYear - 356), Math.abs(state.dayOfYear + 9));
        jumpDay = distToJun < distToDec ? 172 : 356;
        break;
      case ' ':
        event.preventDefault();
        if (state.animating) {
          stopAnimation();
        } else {
          animateYear();
        }
        return;
      default:
        return;
    }

    event.preventDefault();
    stopAnimation();

    if (jumpDay !== null) {
      animateToDay(jumpDay);
    } else if (dayDelta !== 0) {
      state.dayOfYear = ((state.dayOfYear + dayDelta) % 365 + 365) % 365;
      elements.dateSlider.value = state.dayOfYear;
      updateSeasonPresetHighlight();
      update();
    }
  });
}
```

**Step 2: Call setupKeyboard in init()**

In `demos/seasons/seasons.js`, update `init()` (around line 861):

```javascript
function init() {
  initElements();
  setupControls();
  setupKeyboard();  // Add this line

  // ... rest of init
}
```

**Step 3: Test**

1. Open demo, ensure no input is focused
2. Press Arrow Left/Right → day changes by 1
3. Press Shift+Arrow → day changes by 30 (1 month)
4. Press E → jumps to nearest equinox
5. Press S → jumps to nearest solstice
6. Press Space → toggles animation

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js
git commit -m "a11y(seasons): add keyboard navigation

- Arrow keys: change day (Shift for month)
- E: jump to nearest equinox
- S: jump to nearest solstice
- Space: toggle year animation"
```

---

## Task 6: Add ARIA Labels to Angular Size Demo

**Files:**
- Modify: `demos/angular-size/index.html` (add ARIA attributes)
- Modify: `demos/angular-size/angular-size.js` (update ARIA on state change)

**Step 1: Add ARIA to object circle**

In `demos/angular-size/index.html`, update the object-circle (around line 295):

```html
<!-- OLD -->
<circle id="object-circle" cx="600" cy="150" r="40" fill="url(#sunGradient)" filter="url(#glow)"/>

<!-- NEW -->
<circle id="object-circle" cx="600" cy="150" r="40" fill="url(#sunGradient)" filter="url(#glow)"
        role="img" aria-label="Sun at 1 AU, angular size 0.53 degrees"/>
```

**Step 2: Add live region**

In `demos/angular-size/index.html`, add after the reference-guide (around line 383):

```html
<!-- Screen reader announcements -->
<div id="status-announce" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
```

**Step 3: Update ARIA in JS**

In `demos/angular-size/angular-size.js`, add to `updateReadouts()` function (after line 356):

```javascript
// Update ARIA for celestial object
const objectCircle = document.getElementById('object-circle');
if (objectCircle) {
  const preset = PRESETS[state.activePreset];
  const name = preset ? preset.name : 'Object';
  const angleF = formatAngle(calculateAngularSize(state.diameter, state.distance));
  const distF = formatDistance(state.distance);
  objectCircle.setAttribute('aria-label',
    `${name} at ${distF.value} ${distF.unit}, angular size ${angleF.value} ${angleF.unit}`);
}
```

**Step 4: Test**

1. Open demo with screen reader
2. Focus on object circle → verify description
3. Change presets → verify ARIA updates

**Step 5: Commit**

```bash
git add demos/angular-size/index.html demos/angular-size/angular-size.js
git commit -m "a11y(angular-size): add ARIA labels for screen readers

- Object circle has descriptive aria-label with name, distance, angular size
- Live region for announcements"
```

---

## Task 7: Add Keyboard Navigation to Angular Size Demo

**Files:**
- Modify: `demos/angular-size/angular-size.js` (add keyboard handlers)

**Step 1: Add keyboard event handler**

In `demos/angular-size/angular-size.js`, add new function after `clearPresetSelection()` (around line 514):

```javascript
// ============================================
// Keyboard Navigation
// ============================================

function setupKeyboard() {
  document.addEventListener('keydown', (event) => {
    // Only handle if not focused on a slider
    if (event.target.tagName === 'INPUT') return;

    const logStep = event.shiftKey ? 0.02 : 0.1;  // Finer control with Shift
    let distanceMultiplier = 1;
    let sizeMultiplier = 1;
    let presetKey = null;

    switch (event.key) {
      case 'ArrowLeft':
        distanceMultiplier = Math.pow(10, -logStep);
        break;
      case 'ArrowRight':
        distanceMultiplier = Math.pow(10, logStep);
        break;
      case 'ArrowUp':
        sizeMultiplier = Math.pow(10, logStep);
        break;
      case 'ArrowDown':
        sizeMultiplier = Math.pow(10, -logStep);
        break;
      case '1':
        presetKey = 'sun';
        break;
      case '2':
        presetKey = 'moon';
        break;
      case '3':
        presetKey = 'jupiter';
        break;
      case '4':
        presetKey = 'venus';
        break;
      case '5':
        presetKey = 'mars';
        break;
      case '6':
        presetKey = 'andromeda';
        break;
      default:
        return;
    }

    event.preventDefault();

    if (presetKey) {
      selectPreset(presetKey);
    } else {
      if (distanceMultiplier !== 1) {
        state.distance = Math.max(DISTANCE_MIN, Math.min(DISTANCE_MAX,
          state.distance * distanceMultiplier));
        elements.distanceSlider.value = valueToLogSlider(state.distance, DISTANCE_MIN, DISTANCE_MAX);
        clearPresetSelection();
      }
      if (sizeMultiplier !== 1) {
        state.diameter = Math.max(SIZE_MIN, Math.min(SIZE_MAX,
          state.diameter * sizeMultiplier));
        elements.sizeSlider.value = valueToLogSlider(state.diameter, SIZE_MIN, SIZE_MAX);
        clearPresetSelection();
      }
      update();
    }
  });
}
```

**Step 2: Call setupKeyboard in init()**

In `demos/angular-size/angular-size.js`, update `init()` (around line 529):

```javascript
function init() {
  initElements();
  setupSliders();
  setupPresets();
  setupKeyboard();  // Add this line

  // ... rest of init
}
```

**Step 3: Test**

1. Open demo, ensure no slider is focused
2. Press Arrow Left/Right → distance changes (logarithmic)
3. Press Arrow Up/Down → size changes
4. Press Shift+Arrow → finer control
5. Press 1-6 → selects presets (Sun, Moon, Jupiter, Venus, Mars, Andromeda)

**Step 4: Commit**

```bash
git add demos/angular-size/angular-size.js
git commit -m "a11y(angular-size): add keyboard navigation

- Arrow Left/Right: adjust distance (logarithmic)
- Arrow Up/Down: adjust size
- Shift+Arrow: finer control
- 1-6: quick preset selection"
```

---

## Task 8: Add Moon Phases Timeline Strip

**Files:**
- Modify: `demos/moon-phases/index.html` (add timeline HTML/CSS)
- Modify: `demos/moon-phases/moon-phases.js` (add timeline logic)

**Step 1: Add timeline HTML**

In `demos/moon-phases/index.html`, add after the readout-panel (around line 330):

```html
<!-- Phase Timeline -->
<div class="timeline-panel">
  <div class="timeline-header">
    <span class="timeline-direction" id="timeline-direction">WAXING →</span>
    <span class="timeline-day" id="timeline-day">Day 0 of 29.5</span>
  </div>
  <div class="timeline-strip" id="timeline-strip">
    <button class="timeline-phase" data-angle="180" title="New Moon">
      <div class="phase-icon new-moon"></div>
      <span>New</span>
    </button>
    <button class="timeline-phase" data-angle="225" title="Waxing Crescent">
      <div class="phase-icon waxing-crescent"></div>
      <span>Crescent</span>
    </button>
    <button class="timeline-phase" data-angle="270" title="First Quarter">
      <div class="phase-icon first-quarter"></div>
      <span>1st Qtr</span>
    </button>
    <button class="timeline-phase" data-angle="315" title="Waxing Gibbous">
      <div class="phase-icon waxing-gibbous"></div>
      <span>Gibbous</span>
    </button>
    <button class="timeline-phase" data-angle="0" title="Full Moon">
      <div class="phase-icon full-moon"></div>
      <span>Full</span>
    </button>
    <button class="timeline-phase" data-angle="45" title="Waning Gibbous">
      <div class="phase-icon waning-gibbous"></div>
      <span>Gibbous</span>
    </button>
    <button class="timeline-phase" data-angle="90" title="Third Quarter">
      <div class="phase-icon third-quarter"></div>
      <span>3rd Qtr</span>
    </button>
    <button class="timeline-phase" data-angle="135" title="Waning Crescent">
      <div class="phase-icon waning-crescent"></div>
      <span>Crescent</span>
    </button>
  </div>
</div>
```

**Step 2: Add timeline CSS**

In `demos/moon-phases/index.html`, add to `<style>` section (before the closing `</style>` tag):

```css
/* Timeline Strip */
.timeline-panel {
  background: rgba(18, 18, 31, 0.9);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.timeline-direction {
  color: var(--accent-gold);
  font-weight: 600;
}

.timeline-direction.waning {
  color: var(--accent-blue);
}

.timeline-day {
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.timeline-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
}

.timeline-phase {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 0;
}

.timeline-phase:hover {
  background: rgba(93, 173, 226, 0.1);
  border-color: var(--accent-blue);
}

.timeline-phase.active {
  background: rgba(244, 208, 63, 0.2);
  border-color: var(--accent-gold);
}

.timeline-phase span {
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.timeline-phase.active span {
  color: var(--accent-gold);
}

/* Phase icons */
.phase-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: relative;
  background: #3a3a4a;
  overflow: hidden;
}

.phase-icon::after {
  content: '';
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: #e8e8f0;
}

.phase-icon.new-moon::after { display: none; }
.phase-icon.full-moon::after { width: 100%; left: 0; border-radius: 50%; }
.phase-icon.first-quarter::after { left: 50%; }
.phase-icon.third-quarter::after { left: 0; }
.phase-icon.waxing-crescent::after { left: 50%; width: 25%; border-radius: 0 50% 50% 0; }
.phase-icon.waning-crescent::after { left: 25%; width: 25%; border-radius: 50% 0 0 50%; }
.phase-icon.waxing-gibbous::after { left: 25%; width: 75%; border-radius: 50% 50% 50% 50%; }
.phase-icon.waning-gibbous::after { left: 0; width: 75%; border-radius: 50% 50% 50% 50%; }

@media (max-width: 600px) {
  .timeline-phase span { display: none; }
  .phase-icon { width: 24px; height: 24px; }
}
```

**Step 3: Add timeline update logic in JS**

In `demos/moon-phases/moon-phases.js`, add to DOM elements (around line 50):

```javascript
let timelineDirection, timelineDay, timelinePhases;
```

Update `initElements()` to include:

```javascript
timelineDirection = document.getElementById('timeline-direction');
timelineDay = document.getElementById('timeline-day');
timelinePhases = document.querySelectorAll('.timeline-phase');
```

**Step 4: Add timeline update function**

In `demos/moon-phases/moon-phases.js`, add new function after `updateReadouts()`:

```javascript
/**
 * Update the timeline strip
 */
function updateTimeline() {
  const normalized = ((moonAngle % 360) + 360) % 360;
  const days = getDaysSinceNew(moonAngle);

  // Update direction indicator
  const isWaxing = normalized > 180 || normalized === 0;
  if (timelineDirection) {
    timelineDirection.textContent = isWaxing ? 'WAXING →' : '← WANING';
    timelineDirection.classList.toggle('waning', !isWaxing);
  }

  // Update day counter
  if (timelineDay) {
    timelineDay.textContent = `Day ${days.toFixed(1)} of ${SYNODIC_MONTH}`;
  }

  // Update active phase in timeline
  if (timelinePhases) {
    timelinePhases.forEach(phase => {
      const phaseAngle = parseFloat(phase.dataset.angle);
      const diff = Math.abs(((normalized - phaseAngle + 180) % 360) - 180);
      phase.classList.toggle('active', diff < 22.5);
    });
  }
}
```

**Step 5: Call updateTimeline in update()**

In `demos/moon-phases/moon-phases.js`, update the `update()` function:

```javascript
function update() {
  updateOrbitalView();
  updatePhaseView();
  updateReadouts();
  updateTimeline();  // Add this line
}
```

**Step 6: Add timeline phase click handlers**

In `demos/moon-phases/moon-phases.js`, add to `setupPresets()` or create new function:

```javascript
function setupTimeline() {
  if (timelinePhases) {
    timelinePhases.forEach(phase => {
      phase.addEventListener('click', () => {
        const targetAngle = parseFloat(phase.dataset.angle);

        // Animate to target
        const startAngle = moonAngle;
        let diff = targetAngle - startAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        AstroUtils.animateValue(startAngle, startAngle + diff, 400, (value) => {
          moonAngle = ((value % 360) + 360) % 360;
          update();
        });
      });
    });
  }
}
```

**Step 7: Call setupTimeline in init()**

Update `init()`:

```javascript
function init() {
  initElements();
  setupDrag();
  setupPresets();
  setupTimeline();  // Add this line
  setupKeyboard();
  // ...
}
```

**Step 8: Test**

1. Open demo in browser
2. Verify timeline shows below readouts
3. Drag Moon → timeline highlights correct phase
4. Click timeline phases → Moon animates to that position
5. Check "WAXING →" / "← WANING" updates correctly

**Step 9: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add horizontal timeline strip

- Shows all 8 phases with visual icons
- Highlights current phase as Moon moves
- Click any phase to jump to it
- Shows 'WAXING/WANING' direction indicator
- Day counter (Day X of 29.5)"
```

---

## Task 9: Add Moon Phases Animation Controls

**Files:**
- Modify: `demos/moon-phases/index.html` (add animation buttons)
- Modify: `demos/moon-phases/moon-phases.js` (add animation logic)

**Step 1: Add animation controls HTML**

In `demos/moon-phases/index.html`, add after the timeline-panel:

```html
<!-- Animation Controls -->
<div class="animation-controls">
  <button class="anim-btn primary" id="btn-play">
    <span class="btn-icon">▶</span> Play
  </button>
  <button class="anim-btn" id="btn-pause" disabled>
    <span class="btn-icon">⏸</span> Pause
  </button>
  <button class="anim-btn" id="btn-step-back">
    <span class="btn-icon">⏮</span>
  </button>
  <button class="anim-btn" id="btn-step-forward">
    <span class="btn-icon">⏭</span>
  </button>
  <div class="speed-control">
    <label>Speed:</label>
    <select id="speed-select">
      <option value="1">1x</option>
      <option value="5" selected>5x</option>
      <option value="10">10x</option>
    </select>
  </div>
</div>
```

**Step 2: Add animation controls CSS**

```css
/* Animation Controls */
.animation-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(18, 18, 31, 0.9);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.anim-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: var(--space-light);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.anim-btn:hover:not(:disabled) {
  background: var(--space-medium);
  color: var(--text-primary);
  border-color: var(--accent-blue);
}

.anim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.anim-btn.primary {
  background: var(--accent-blue);
  color: var(--space-black);
  border-color: var(--accent-blue);
}

.anim-btn.primary:hover:not(:disabled) {
  background: #7bc0eb;
}

.btn-icon {
  font-size: 0.75rem;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.speed-control select {
  padding: 0.25rem 0.5rem;
  background: var(--space-light);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  color: var(--text-primary);
  cursor: pointer;
}
```

**Step 3: Add animation state and logic in JS**

In `demos/moon-phases/moon-phases.js`, add to state section:

```javascript
let isAnimating = false;
let animationId = null;
let animationSpeed = 5;  // degrees per frame at 60fps
```

Add animation functions:

```javascript
// ============================================
// Animation
// ============================================

function startAnimation() {
  if (isAnimating) return;

  isAnimating = true;
  document.getElementById('btn-play').disabled = true;
  document.getElementById('btn-pause').disabled = false;

  let lastTime = performance.now();

  function animate(currentTime) {
    if (!isAnimating) return;

    const delta = (currentTime - lastTime) / 1000;  // seconds
    lastTime = currentTime;

    // Move Moon based on speed setting
    // 360 degrees / 29.53 days = 12.19 degrees per day
    // At 1x speed, 1 second = 1 day
    const degreesPerSecond = 12.19 * animationSpeed;
    moonAngle = (moonAngle + degreesPerSecond * delta) % 360;

    update();

    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
  isAnimating = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  document.getElementById('btn-play').disabled = false;
  document.getElementById('btn-pause').disabled = true;
}

function stepForward() {
  stopAnimation();
  // Jump to next named phase (45° increments)
  const currentPhaseIndex = Math.round(moonAngle / 45) % 8;
  const nextAngle = ((currentPhaseIndex + 1) % 8) * 45;

  AstroUtils.animateValue(moonAngle, moonAngle + ((nextAngle - moonAngle + 360) % 360), 300, (val) => {
    moonAngle = val % 360;
    update();
  });
}

function stepBackward() {
  stopAnimation();
  const currentPhaseIndex = Math.round(moonAngle / 45) % 8;
  const prevAngle = ((currentPhaseIndex - 1 + 8) % 8) * 45;

  let diff = prevAngle - moonAngle;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  AstroUtils.animateValue(moonAngle, moonAngle + diff, 300, (val) => {
    moonAngle = ((val % 360) + 360) % 360;
    update();
  });
}

function setupAnimationControls() {
  document.getElementById('btn-play').addEventListener('click', startAnimation);
  document.getElementById('btn-pause').addEventListener('click', stopAnimation);
  document.getElementById('btn-step-forward').addEventListener('click', stepForward);
  document.getElementById('btn-step-back').addEventListener('click', stepBackward);

  document.getElementById('speed-select').addEventListener('change', (e) => {
    animationSpeed = parseFloat(e.target.value);
  });
}
```

**Step 4: Call setupAnimationControls in init()**

```javascript
function init() {
  initElements();
  setupDrag();
  setupPresets();
  setupTimeline();
  setupKeyboard();
  setupAnimationControls();  // Add this line
  // ...
}
```

**Step 5: Test**

1. Click Play → Moon animates through cycle
2. Click Pause → animation stops
3. Click step forward/back → jumps to next/prev phase
4. Change speed → animation speed changes

**Step 6: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add animation controls

- Play/Pause button for continuous animation
- Step forward/back buttons (phase by phase)
- Speed selector (1x, 5x, 10x)
- 1x = 1 second per lunar day"
```

---

## Summary: Implementation Order

| Task | Description | Priority | Estimated Effort |
|------|-------------|----------|------------------|
| 1 | Seasons tilt fix | Critical | 10 min |
| 2 | Moon Phases ARIA | High | 15 min |
| 3 | Moon Phases Keyboard | High | 20 min |
| 4 | Seasons ARIA | High | 15 min |
| 5 | Seasons Keyboard | High | 20 min |
| 6 | Angular Size ARIA | High | 15 min |
| 7 | Angular Size Keyboard | High | 20 min |
| 8 | Moon Phases Timeline | Medium | 45 min |
| 9 | Moon Phases Animation | Medium | 30 min |

**Total: ~3 hours for Tasks 1-9**

Additional tasks (3D sphere for Moon Phases, Angular Size viewport panel) are more complex and should be planned separately after these foundational improvements are complete.

---

## Verification Checklist

After completing all tasks:

- [ ] Seasons: Venus (177.4°) and Uranus (97.8°) display correctly
- [ ] All demos: Tab navigates through interactive elements
- [ ] All demos: Screen reader announces state changes
- [ ] Moon Phases: Arrow keys move Moon around orbit
- [ ] Moon Phases: Timeline highlights current phase
- [ ] Moon Phases: Animation plays smoothly
- [ ] Seasons: E/S keys jump to equinox/solstice
- [ ] Angular Size: Number keys select presets
- [ ] No console errors in any demo