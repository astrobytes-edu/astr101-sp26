# Demo Visual Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve typography, colors, controls, and animations across all 9 ASTR 101/201 demos following the Cosmic Nebula design.

**Architecture:** Shared CSS variables in `astro-theme.css` propagate to all demos. New animation utilities in `astro-utils.js` provide reusable micro-interactions. Changes are additive — existing class names preserved for backwards compatibility.

**Tech Stack:** Pure CSS (custom properties), vanilla JavaScript, Canvas API (starfield)

**Design Reference:** `docs/plans/2026-01-22-demo-visual-polish-design.md`

---

## Phase 1: Typography & Color Palette

Update CSS custom properties to implement Cosmic Nebula palette and improved typography.

### Task 1.1: Update Color Palette Variables

**Files:**
- Modify: `demos/_assets/astro-theme.css:9-40`

**Step 1: Replace UI colors section**

Find and replace the UI colors block (lines 27-34):

```css
  /* UI colors - Cosmic Nebula Palette */
  --text-primary: #F8F8F2;
  --text-secondary: #BFBFBF;
  --text-muted: #6272A4;

  /* Accent colors */
  --cosmic-teal: #4ECDC4;
  --soft-magenta: #C792EA;
  --stellar-amber: #FFB86C;
  --nebula-green: #50FA7B;
  --nova-pink: #FF79C6;
  --ice-blue: #8BE9FD;

  /* Legacy aliases (backwards compatibility) */
  --accent-blue: var(--cosmic-teal);
  --accent-green: var(--nebula-green);
  --accent-red: var(--nova-pink);
  --accent-gold: var(--stellar-amber);
```

**Step 2: Verify the file saved correctly**

Run: `head -50 demos/_assets/astro-theme.css`
Expected: See new Cosmic Nebula color variables

**Step 3: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update color palette to Cosmic Nebula theme"
```

---

### Task 1.2: Update Glow Effects

**Files:**
- Modify: `demos/_assets/astro-theme.css:36-40`

**Step 1: Replace glow effects section**

```css
  /* Glow effects - Cosmic Nebula */
  --glow-teal: 0 0 20px rgba(78, 205, 196, 0.4);
  --glow-magenta: 0 0 20px rgba(199, 146, 234, 0.4);
  --glow-amber: 0 0 30px rgba(255, 184, 108, 0.5);
  --glow-sun: 0 0 60px rgba(255, 184, 108, 0.6), 0 0 120px rgba(255, 184, 108, 0.3);
  --glow-moon: 0 0 20px rgba(232, 232, 240, 0.3);
  --glow-earth: 0 0 30px rgba(74, 144, 217, 0.4);
  --glow-accent: 0 0 15px var(--cosmic-teal);
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update glow effects for Cosmic Nebula palette"
```

---

### Task 1.3: Update Typography Variables

**Files:**
- Modify: `demos/_assets/astro-theme.css:49-55`

**Step 1: Replace typography section**

```css
  /* Typography - Improved sizes */
  --font-main: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  --font-size-xs: 0.75rem;   /* 12px - tick values */
  --font-size-sm: 0.875rem;  /* 14px - labels, controls */
  --font-size-md: 1rem;      /* 16px - body text */
  --font-size-lg: 1.25rem;   /* 20px - emphasis */
  --font-size-xl: 1.5rem;    /* 24px - values */
  --font-size-2xl: 1.75rem;  /* 28px - titles */

  /* Line heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: improve typography scale with larger minimum sizes"
```

---

### Task 1.4: Update Base Typography Classes

**Files:**
- Modify: `demos/_assets/astro-theme.css:98-133`

**Step 1: Replace typography classes section**

```css
/* ============================================
   Typography - Enhanced
   ============================================ */
.demo-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: 0.02em;
  line-height: var(--line-height-tight);
}

.demo-subtitle {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin: 0 0 var(--space-lg) 0;
  line-height: var(--line-height-normal);
}

.demo-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
  line-height: var(--line-height-tight);
}

.demo-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--stellar-amber);
  line-height: var(--line-height-tight);
}

.demo-value-large {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.demo-unit {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-left: var(--space-xs);
}

.demo-secondary {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  font-family: var(--font-mono);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: enhance typography classes with improved sizing"
```

---

### Task 1.5: Add Value Card Component

**Files:**
- Modify: `demos/_assets/astro-theme.css` (add after typography section)

**Step 1: Add new value-card component class**

```css
/* ============================================
   Value Cards (numeric readouts)
   ============================================ */
.value-card {
  background: var(--space-deep);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  text-align: center;
}

.value-card__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value-card__value {
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.value-card__unit {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-left: 0.25em;
}

.value-card__secondary {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

.value-card--highlight .value-card__value {
  color: var(--cosmic-teal);
}

.value-card--warn .value-card__value {
  color: var(--stellar-amber);
}

.value-card--success .value-card__value {
  color: var(--nebula-green);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: add value-card component for numeric readouts"
```

---

## Phase 2: Control Styling

Update sliders, buttons, and presets to match Cosmic Nebula design.

### Task 2.1: Update Slider Styling

**Files:**
- Modify: `demos/_assets/astro-theme.css:193-234`

**Step 1: Replace slider styles**

```css
/* ============================================
   Sliders - Cosmic Nebula
   ============================================ */
.astro-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--space-light);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.astro-slider:hover {
  background: var(--space-medium);
}

.astro-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--space-deep);
  border: 2px solid var(--cosmic-teal);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--glow-teal);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.astro-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(78, 205, 196, 0.6);
}

.astro-slider::-webkit-slider-thumb:active {
  transform: scale(1.2);
  background: var(--cosmic-teal);
}

.astro-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--space-deep);
  border: 2px solid var(--cosmic-teal);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--glow-teal);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.astro-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 0 25px rgba(78, 205, 196, 0.6);
}

/* Slider value display */
.slider-with-value {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
}

.slider-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--stellar-amber);
  min-width: 90px;
  text-align: right;
  background: var(--space-deep);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update slider styling with Cosmic Nebula theme"
```

---

### Task 2.2: Update Button Styling

**Files:**
- Modify: `demos/_assets/astro-theme.css:256-305`

**Step 1: Replace button styles**

```css
/* ============================================
   Buttons - Cosmic Nebula
   ============================================ */
.astro-btn {
  font-family: var(--font-main);
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--space-sm) var(--space-lg);
  min-height: 44px;
  border: 1px solid var(--cosmic-teal);
  border-radius: 9999px; /* Pill shape */
  background: transparent;
  color: var(--cosmic-teal);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.astro-btn:hover {
  background: rgba(78, 205, 196, 0.15);
  box-shadow: var(--glow-teal);
}

.astro-btn:active {
  transform: scale(0.98);
  background: rgba(78, 205, 196, 0.25);
}

.astro-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.astro-btn.active,
.astro-btn.primary {
  background: var(--cosmic-teal);
  color: var(--space-black);
  border-color: var(--cosmic-teal);
}

.astro-btn.active:hover,
.astro-btn.primary:hover {
  background: #6ad4cc;
  box-shadow: 0 0 20px rgba(78, 205, 196, 0.5);
}

/* Secondary button variant */
.astro-btn.secondary {
  border-color: var(--soft-magenta);
  color: var(--soft-magenta);
}

.astro-btn.secondary:hover {
  background: rgba(199, 146, 234, 0.15);
  box-shadow: var(--glow-magenta);
}

.astro-btn.secondary.active {
  background: var(--soft-magenta);
  color: var(--space-black);
}

/* Button group */
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update button styling with pill shape and glow effects"
```

---

### Task 2.3: Update Preset Button Styling

**Files:**
- Modify: `demos/_assets/astro-theme.css:306-342`

**Step 1: Replace preset button styles**

```css
/* ============================================
   Presets - Cosmic Nebula
   ============================================ */
.presets-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.preset-btn {
  font-family: var(--font-main);
  font-size: var(--font-size-sm);
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  min-height: 44px;
  background: var(--space-light);
  border: 1px solid var(--border-color);
  border-radius: 9999px; /* Pill shape */
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.preset-btn:hover {
  background: var(--space-medium);
  color: var(--text-primary);
  border-color: var(--cosmic-teal);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.preset-btn:active {
  transform: scale(0.98);
}

.preset-btn.active {
  background: var(--cosmic-teal);
  color: var(--space-black);
  border-color: var(--cosmic-teal);
  font-weight: 600;
}

.preset-btn.easter-egg {
  border-style: dashed;
  border-color: var(--soft-magenta);
}

.preset-btn.easter-egg:hover {
  border-color: var(--soft-magenta);
  box-shadow: var(--glow-magenta);
}

.preset-btn.easter-egg.active {
  background: var(--soft-magenta);
  border-style: solid;
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update preset buttons with pill shape and hover effects"
```

---

### Task 2.4: Add Toggle Switch Component

**Files:**
- Modify: `demos/_assets/astro-theme.css` (add after presets section)

**Step 1: Add toggle switch component**

```css
/* ============================================
   Toggle Switches
   ============================================ */
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.toggle-switch__track {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--space-light);
  border-radius: 12px;
  transition: background var(--transition-fast);
}

.toggle-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: all var(--transition-fast);
}

.toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch input:checked + .toggle-switch__track {
  background: var(--nebula-green);
}

.toggle-switch input:checked + .toggle-switch__track .toggle-switch__thumb {
  left: 22px;
  background: var(--space-black);
}

.toggle-switch input:focus-visible + .toggle-switch__track {
  outline: 2px solid var(--cosmic-teal);
  outline-offset: 2px;
}

.toggle-switch__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: add toggle switch component"
```

---

### Task 2.5: Update Status Indicators

**Files:**
- Modify: `demos/_assets/astro-theme.css:375-400`

**Step 1: Replace status indicator styles**

```css
/* Status indicators - Cosmic Nebula */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: 9999px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.status-indicator.success {
  background: rgba(80, 250, 123, 0.15);
  color: var(--nebula-green);
  border: 1px solid rgba(80, 250, 123, 0.3);
}

.status-indicator.error {
  background: rgba(255, 121, 198, 0.15);
  color: var(--nova-pink);
  border: 1px solid rgba(255, 121, 198, 0.3);
}

.status-indicator.warning {
  background: rgba(255, 184, 108, 0.15);
  color: var(--stellar-amber);
  border: 1px solid rgba(255, 184, 108, 0.3);
}

.status-indicator.info {
  background: rgba(78, 205, 196, 0.15);
  color: var(--cosmic-teal);
  border: 1px solid rgba(78, 205, 196, 0.3);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: update status indicators with Cosmic Nebula colors"
```

---

## Phase 3: Data Visualization Clarity

Add CSS classes for charts, axes, and key value highlighting.

### Task 3.1: Add Chart Axis Styling

**Files:**
- Modify: `demos/_assets/astro-theme.css` (add new section)

**Step 1: Add chart styling section**

```css
/* ============================================
   Chart & Graph Styling
   ============================================ */
.chart-axis {
  stroke: var(--text-secondary);
  stroke-width: 2;
}

.chart-axis-label {
  font-family: var(--font-main);
  font-size: var(--font-size-sm);
  font-weight: 600;
  fill: var(--text-secondary);
}

.chart-tick {
  stroke: var(--text-secondary);
  stroke-width: 1;
}

.chart-tick-label {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  fill: var(--text-muted);
}

.chart-grid {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-line--primary {
  stroke: var(--cosmic-teal);
}

.chart-line--secondary {
  stroke: var(--soft-magenta);
}

.chart-line--warm {
  stroke: var(--stellar-amber);
}

.chart-area {
  opacity: 0.2;
}

.chart-area--primary {
  fill: var(--cosmic-teal);
}

/* Peak/reference markers */
.chart-marker {
  stroke-width: 2;
  stroke-dasharray: 4 2;
}

.chart-marker--reference {
  stroke: var(--stellar-amber);
}

.chart-marker-label {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  fill: var(--stellar-amber);
}

/* Visible spectrum band highlight */
.spectrum-visible-band {
  fill: url(#visible-spectrum-gradient);
  opacity: 0.3;
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: add chart and graph styling classes"
```

---

### Task 3.2: Update Control Labels

**Files:**
- Modify: `demos/_assets/astro-theme.css:184-189`

**Step 1: Update control label styles**

```css
.control-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 120px;
  line-height: var(--line-height-normal);
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: improve control label readability"
```

---

## Phase 4: Micro-Interactions

Add JavaScript utilities for value animations, hover effects, and feedback.

### Task 4.1: Add Value Animation Utility

**Files:**
- Modify: `demos/_assets/astro-utils.js` (add after line 246)

**Step 1: Add animated value display function**

```javascript
/**
 * Animate a numeric value change with visual feedback
 * @param {HTMLElement} element - Element displaying the value
 * @param {number} newValue - New value to display
 * @param {function} formatter - Function to format value for display
 * @param {object} options - Animation options
 */
function animateValueChange(element, newValue, formatter, options = {}) {
  const {
    duration = 300,
    flashColor = '#4ECDC4', // cosmic-teal
    pulseScale = 1.05
  } = options;

  // Get current value
  const currentText = element.textContent;
  const currentValue = parseFloat(currentText.replace(/[^\d.-]/g, '')) || 0;

  // Skip if same value
  if (Math.abs(newValue - currentValue) < 0.0001) {
    element.textContent = formatter ? formatter(newValue) : newValue;
    return;
  }

  // Animate the number
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const displayValue = lerp(currentValue, newValue, easedProgress);

    element.textContent = formatter ? formatter(displayValue) : displayValue.toFixed(2);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  // Apply visual feedback
  element.style.transition = 'transform 0.15s ease-out, color 0.15s ease-out';
  element.style.transform = `scale(${pulseScale})`;
  element.style.color = flashColor;

  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.color = '';
  }, 150);

  requestAnimationFrame(update);
}

/**
 * Create a value display that animates on change
 * @param {HTMLElement} element - The display element
 * @param {function} formatter - Value formatter function
 * @returns {object} Controller with setValue(newValue)
 */
function createAnimatedValue(element, formatter) {
  let currentValue = 0;

  return {
    setValue(newValue) {
      animateValueChange(element, newValue, formatter);
      currentValue = newValue;
    },
    getValue() {
      return currentValue;
    },
    setInstant(newValue) {
      element.textContent = formatter ? formatter(newValue) : newValue;
      currentValue = newValue;
    }
  };
}
```

**Step 2: Export the new functions**

Add to the `window.AstroUtils` export block:

```javascript
    // Animated values
    animateValueChange,
    createAnimatedValue,
```

**Step 3: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add animated value change utility"
```

---

### Task 4.2: Add Ripple Effect Utility

**Files:**
- Modify: `demos/_assets/astro-utils.js` (add after animated value section)

**Step 1: Add ripple effect function**

```javascript
/**
 * Add ripple effect to an element on click
 * @param {HTMLElement} element - Element to add ripple to
 * @param {object} options - Ripple options
 */
function addRippleEffect(element, options = {}) {
  const {
    color = 'rgba(78, 205, 196, 0.3)', // cosmic-teal with opacity
    duration = 400
  } = options;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';

  element.addEventListener('click', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      transform: scale(0);
      animation: ripple-effect ${duration}ms ease-out;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
    `;

    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), duration);
  });
}

// Add ripple keyframes to document if not present
if (typeof document !== 'undefined' && !document.getElementById('astro-ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'astro-ripple-styles';
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(20);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
```

**Step 2: Export the new function**

Add to exports:

```javascript
    // Effects
    addRippleEffect,
```

**Step 3: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add ripple click effect utility"
```

---

### Task 4.3: Add Slider Tooltip Utility

**Files:**
- Modify: `demos/_assets/astro-utils.js` (add after ripple section)

**Step 1: Add slider tooltip function**

```javascript
/**
 * Add floating tooltip to slider that follows thumb during drag
 * @param {HTMLInputElement} slider - The range input
 * @param {function} formatter - Value formatter function
 * @returns {object} Controller with update(), show(), hide()
 */
function addSliderTooltip(slider, formatter) {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'slider-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    background: var(--space-deep, #12121f);
    color: var(--cosmic-teal, #4ECDC4);
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid var(--border-color, rgba(255,255,255,0.1));
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    transform: translateX(-50%);
    white-space: nowrap;
    z-index: 100;
  `;

  // Position tooltip container
  const container = slider.parentElement;
  container.style.position = 'relative';
  container.appendChild(tooltip);

  function updatePosition() {
    const value = parseFloat(slider.value);
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const percent = (value - min) / (max - min);

    const sliderRect = slider.getBoundingClientRect();
    const thumbWidth = 20; // Approximate thumb width
    const trackWidth = sliderRect.width - thumbWidth;
    const left = (thumbWidth / 2) + (percent * trackWidth);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = '-30px';
    tooltip.textContent = formatter ? formatter(value) : value;
  }

  function show() {
    tooltip.style.opacity = '1';
    updatePosition();
  }

  function hide() {
    tooltip.style.opacity = '0';
  }

  // Event listeners
  slider.addEventListener('input', updatePosition);
  slider.addEventListener('mousedown', show);
  slider.addEventListener('touchstart', show);
  document.addEventListener('mouseup', hide);
  document.addEventListener('touchend', hide);

  return {
    update: updatePosition,
    show,
    hide,
    destroy() {
      tooltip.remove();
      slider.removeEventListener('input', updatePosition);
      slider.removeEventListener('mousedown', show);
      slider.removeEventListener('touchstart', show);
    }
  };
}
```

**Step 2: Export the new function**

Add to exports:

```javascript
    addSliderTooltip,
```

**Step 3: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add slider tooltip utility for drag feedback"
```

---

### Task 4.4: Add Success Indicator Utility

**Files:**
- Modify: `demos/_assets/astro-utils.js` (add after tooltip section)

**Step 1: Add success indicator function**

```javascript
/**
 * Show a brief success indicator (checkmark + optional message)
 * @param {HTMLElement} targetElement - Element to show indicator near
 * @param {string} message - Optional message to display
 * @param {object} options - Display options
 */
function showSuccessIndicator(targetElement, message = '', options = {}) {
  const {
    duration = 2000,
    position = 'top' // 'top', 'bottom', 'left', 'right'
  } = options;

  const indicator = document.createElement('div');
  indicator.className = 'success-indicator-popup';
  indicator.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${message ? `<span>${message}</span>` : ''}
  `;

  indicator.style.cssText = `
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(80, 250, 123, 0.2);
    color: #50FA7B;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 9999px;
    border: 1px solid rgba(80, 250, 123, 0.4);
    animation: success-pop 0.3s ease-out;
    z-index: 1000;
    pointer-events: none;
  `;

  // Position relative to target
  const rect = targetElement.getBoundingClientRect();
  const parentRect = targetElement.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

  targetElement.offsetParent?.appendChild(indicator) || document.body.appendChild(indicator);

  const indicatorRect = indicator.getBoundingClientRect();

  switch (position) {
    case 'top':
      indicator.style.left = `${rect.left - parentRect.left + rect.width / 2 - indicatorRect.width / 2}px`;
      indicator.style.top = `${rect.top - parentRect.top - indicatorRect.height - 8}px`;
      break;
    case 'bottom':
      indicator.style.left = `${rect.left - parentRect.left + rect.width / 2 - indicatorRect.width / 2}px`;
      indicator.style.top = `${rect.bottom - parentRect.top + 8}px`;
      break;
    default:
      indicator.style.left = `${rect.left - parentRect.left}px`;
      indicator.style.top = `${rect.top - parentRect.top - indicatorRect.height - 8}px`;
  }

  setTimeout(() => {
    indicator.style.opacity = '0';
    indicator.style.transition = 'opacity 0.3s ease';
    setTimeout(() => indicator.remove(), 300);
  }, duration);
}

// Add success-pop keyframes
if (typeof document !== 'undefined' && !document.getElementById('astro-success-styles')) {
  const style = document.createElement('style');
  style.id = 'astro-success-styles';
  style.textContent = `
    @keyframes success-pop {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
```

**Step 2: Export the new function**

Add to exports:

```javascript
    showSuccessIndicator,
```

**Step 3: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add success indicator popup utility"
```

---

## Phase 5: Smoother Animations

Add easing functions and animation utilities for smoother motion.

### Task 5.1: Add Additional Easing Functions

**Files:**
- Modify: `demos/_assets/astro-utils.js` (add after existing easing functions ~line 210)

**Step 1: Add more easing functions**

```javascript
/**
 * Ease out cubic - fast start, slow end
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in cubic - slow start, fast end
 */
function easeInCubic(t) {
  return t * t * t;
}

/**
 * Ease out elastic - bouncy overshoot
 */
function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Ease out back - slight overshoot
 */
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Custom easing for Kepler's 2nd law (faster at perihelion)
 * @param {number} t - Progress 0-1 through orbit
 * @param {number} eccentricity - Orbital eccentricity 0-1
 * @returns {number} Adjusted progress accounting for varying orbital speed
 */
function keplerianEasing(t, eccentricity = 0.5) {
  // Approximate Kepler's equation solution
  // Objects move faster when closer to focus (perihelion)
  const M = t * 2 * Math.PI; // Mean anomaly
  let E = M; // Eccentric anomaly (iterative solve)

  // Newton-Raphson iteration
  for (let i = 0; i < 5; i++) {
    E = E - (E - eccentricity * Math.sin(E) - M) / (1 - eccentricity * Math.cos(E));
  }

  // Convert to true anomaly
  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  return (trueAnomaly + Math.PI) / (2 * Math.PI); // Normalize to 0-1
}
```

**Step 2: Export the new functions**

Add to exports:

```javascript
    // Additional easing
    easeOutCubic,
    easeInCubic,
    easeOutElastic,
    easeOutBack,
    keplerianEasing,
```

**Step 3: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat: add additional easing functions including Keplerian"
```

---

### Task 5.2: Add CSS Animation Classes

**Files:**
- Modify: `demos/_assets/astro-theme.css` (update animation section ~line 543)

**Step 1: Replace and expand animation utilities**

```css
/* ============================================
   Animation Utilities - Enhanced
   ============================================ */

/* Fade animations */
.fade-in {
  animation: fadeIn var(--transition-medium) ease-out;
}

.fade-out {
  animation: fadeOut var(--transition-medium) ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Pulse animations */
.pulse {
  animation: pulse 2s ease-in-out infinite;
}

.pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

/* Glow pulse (for celestial objects) */
.glow-pulse {
  animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 20px currentColor); }
  50% { filter: drop-shadow(0 0 30px currentColor); }
}

/* Twinkle (for stars) */
.twinkle {
  animation: twinkle 2s ease-in-out infinite;
  animation-delay: calc(var(--twinkle-delay, 0) * 1s);
}

@keyframes twinkle {
  0%, 100% { opacity: var(--star-opacity, 0.8); }
  50% { opacity: calc(var(--star-opacity, 0.8) * 0.4); }
}

/* Scale animations */
.pop-in {
  animation: pop-in 0.3s ease-out;
}

@keyframes pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

/* Slide animations */
.slide-up {
  animation: slide-up var(--transition-medium) ease-out;
}

@keyframes slide-up {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Value change highlight */
.value-flash {
  animation: value-flash 0.3s ease-out;
}

@keyframes value-flash {
  0% { color: var(--cosmic-teal); transform: scale(1.05); }
  100% { color: inherit; transform: scale(1); }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .fade-out,
  .pulse,
  .pulse-subtle,
  .glow-pulse,
  .twinkle,
  .pop-in,
  .slide-up,
  .value-flash {
    animation: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Commit**

```bash
git add demos/_assets/astro-theme.css
git commit -m "style: add enhanced animation utility classes"
```

---

## Phase 6: Atmospheric Polish

Enhance starfield with layers and twinkling.

### Task 6.1: Add Multi-Layer Starfield

**Files:**
- Modify: `demos/_assets/starfield.js` (replace createStarfield function)

**Step 1: Update starfield with depth layers**

Replace the `initStars` function inside `createStarfield` (~line 39-54):

```javascript
  /**
   * Initialize stars with depth layers
   */
  function initStars() {
    stars = [];
    const { width, height } = canvas;

    // Create 3 depth layers
    const layers = [
      { count: Math.floor(config.starCount * 0.5), minSize: 0.3, maxSize: 0.8, baseOpacity: 0.3, speed: 0.5 },  // Far
      { count: Math.floor(config.starCount * 0.35), minSize: 0.5, maxSize: 1.2, baseOpacity: 0.5, speed: 1.0 }, // Mid
      { count: Math.floor(config.starCount * 0.15), minSize: 1.0, maxSize: 2.5, baseOpacity: 0.7, speed: 1.5 }  // Near
    ];

    layers.forEach((layer, layerIndex) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer.minSize + Math.random() * (layer.maxSize - layer.minSize),
          color: config.colors[Math.floor(Math.random() * config.colors.length)],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: config.twinkleSpeed * layer.speed * (0.5 + Math.random()),
          baseOpacity: layer.baseOpacity + Math.random() * 0.2,
          layer: layerIndex
        });
      }
    });

    // Sort by layer (far stars render first)
    stars.sort((a, b) => a.layer - b.layer);
  }
```

**Step 2: Commit**

```bash
git add demos/_assets/starfield.js
git commit -m "feat: add multi-layer depth to starfield"
```

---

### Task 6.2: Add Shooting Star Effect

**Files:**
- Modify: `demos/_assets/starfield.js` (add after star drawing code)

**Step 1: Add shooting star functionality**

Add these variables after line 34 (`let running = false;`):

```javascript
  let shootingStar = null;
  let lastShootingStarTime = 0;
  const shootingStarInterval = 30000 + Math.random() * 30000; // 30-60 seconds
```

Add this function after `drawStar`:

```javascript
  /**
   * Draw a shooting star
   */
  function drawShootingStar(star, time) {
    const progress = (time - star.startTime) / star.duration;
    if (progress > 1) {
      shootingStar = null;
      return;
    }

    const x = star.startX + (star.endX - star.startX) * progress;
    const y = star.startY + (star.endY - star.startY) * progress;

    // Fade in then out
    const opacity = progress < 0.2 ? progress * 5 : (1 - progress) * 1.25;

    // Draw trail
    const trailLength = 50;
    const gradient = ctx.createLinearGradient(
      x - star.dirX * trailLength,
      y - star.dirY * trailLength,
      x, y
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

    ctx.beginPath();
    ctx.moveTo(x - star.dirX * trailLength, y - star.dirY * trailLength);
    ctx.lineTo(x, y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw head
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }

  /**
   * Maybe spawn a shooting star
   */
  function maybeSpawnShootingStar(time) {
    if (shootingStar || !config.shootingStars) return;
    if (time - lastShootingStarTime < shootingStarInterval) return;

    const { width, height } = canvas;

    // Random start position (top or right edge)
    const fromTop = Math.random() > 0.5;
    const startX = fromTop ? Math.random() * width : width;
    const startY = fromTop ? 0 : Math.random() * height * 0.5;

    // Direction (down-left)
    const angle = Math.PI * 0.6 + Math.random() * 0.4; // 108-144 degrees
    const speed = 200 + Math.random() * 100;

    shootingStar = {
      startTime: time,
      duration: 800 + Math.random() * 400,
      startX,
      startY,
      endX: startX + Math.cos(angle) * speed,
      endY: startY + Math.sin(angle) * speed,
      dirX: Math.cos(angle),
      dirY: Math.sin(angle)
    };

    lastShootingStarTime = time;
  }
```

Update the `render` function to include shooting stars:

```javascript
  function render(time) {
    const { width, height } = canvas;

    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.baseOpacity + twinkle * config.twinkleAmount;
      drawStar(star, opacity);
    });

    // Shooting stars
    maybeSpawnShootingStar(time);
    if (shootingStar) {
      drawShootingStar(shootingStar, time);
    }
  }
```

Update the default config to include shooting stars option (~line 28):

```javascript
    shootingStars: options.shootingStars !== false, // Enable by default
```

**Step 2: Commit**

```bash
git add demos/_assets/starfield.js
git commit -m "feat: add occasional shooting star effect to starfield"
```

---

## Final Verification

### Task 7.1: Visual Regression Test

**Step 1: Open each demo and verify styling**

Run: `open demos/angular-size/index.html`

Checklist:
- [ ] Colors match Cosmic Nebula palette
- [ ] Fonts are readable (16px+ body, 24px+ values)
- [ ] Buttons have pill shape and glow on hover
- [ ] Sliders have teal accents
- [ ] Starfield has depth layers and occasional shooting stars

Repeat for all 9 demos.

**Step 2: Test reduced motion preference**

In macOS: System Preferences → Accessibility → Display → Reduce motion

Verify decorative animations are disabled but functionality remains.

**Step 3: Final commit**

```bash
git add -A
git commit -m "style: complete Cosmic Nebula visual polish implementation"
```

---

## Summary

| Phase | Tasks | Files Modified |
|-------|-------|----------------|
| 1. Typography & Color | 5 tasks | `astro-theme.css` |
| 2. Control Styling | 5 tasks | `astro-theme.css` |
| 3. Data Visualization | 2 tasks | `astro-theme.css` |
| 4. Micro-Interactions | 4 tasks | `astro-utils.js` |
| 5. Animations | 2 tasks | `astro-theme.css`, `astro-utils.js` |
| 6. Atmospheric | 2 tasks | `starfield.js` |
| 7. Verification | 1 task | — |

**Total: 21 tasks**
