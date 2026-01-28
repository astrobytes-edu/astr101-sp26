# Lunar Geometry Lab Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the moon-phases and eclipse-geometry demos to become a unified, pedagogy-first "Lunar Geometry Lab" with misconception-targeting visuals, structured challenges, and instructor tools.

**Architecture:** Add shared modules (`challenge-engine.js`, `tour-engine.js`) to `demos/_assets/`, then integrate into both demos. Earth's shadow cone is the #1 priority as it directly targets the most common misconception. Progressive enhancement approach — existing functionality remains intact.

**Tech Stack:** Vanilla JavaScript (ES6+), SVG for rendering, existing `astro-utils.js` utilities.

---

## Background: Gap Analysis

### Feature Comparison Matrix

| Spec Requirement | moon-phases | eclipse-geometry | Status |
|------------------|-------------|------------------|--------|
| Dual-panel layout (space + observer) | ✅ | ✅ | Good |
| Draggable Moon | ✅ | ✅ | Good |
| Phase computation from geometry | ✅ | ✅ | Good |
| **Earth's shadow cone visible** | ❌ | ❌ | **CRITICAL GAP** |
| Orbital tilt + nodes | ❌ | ✅ | Partial |
| Eclipse detection | ❌ | ✅ | Partial |
| **Challenge mode** | ❌ | ❌ | **MAJOR GAP** |
| **Instructor tour mode** | ❌ | ❌ | **MAJOR GAP** |
| Camera presets | ❌ | Partial | Gap |
| Reset button | ❌ | ❌ | Gap |
| Cross-demo navigation | ❌ | ❌ | Gap |
| Rise/set timing cue | ❌ | ❌ | Optional |
| Phase angle (ASTR 201) | ❌ | ❌ | Optional |

### Priority Order

1. **Phase 1: Misconception Targeting** — Earth's shadow cone (HIGH IMPACT)
2. **Phase 2: Core UX** — Reset button, cross-navigation
3. **Phase 3: Challenge Mode** — 5 structured puzzles
4. **Phase 4: Instructor Tour** — 4-step scripted presentation
5. **Phase 5: Polish** — Camera presets, accessibility

---

## Phase 1: Earth's Shadow Cone (Misconception Killer)

### Task 1.1: Add Shadow Cone SVG Elements to moon-phases

**Files:**
- Modify: `demos/moon-phases/index.html`

**Step 1: Add shadow cone SVG group after Earth group**

In `demos/moon-phases/index.html`, find the Earth group (around line 438) and add after it:

```html
<!-- Earth's Shadow Cone (toggled by checkbox) -->
<g id="earth-shadow-group" style="display: none;">
  <!-- Shadow cone extending opposite to Sun (rightward) -->
  <defs>
    <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(30, 30, 50, 0.6)"/>
      <stop offset="100%" stop-color="rgba(30, 30, 50, 0)"/>
    </linearGradient>
  </defs>
  <!-- Umbra cone (darker, narrower) -->
  <path id="umbra-cone"
        d="M 225 200 L 380 185 L 380 215 Z"
        fill="rgba(20, 20, 40, 0.5)"
        stroke="none"/>
  <!-- Penumbra cone (lighter, wider) -->
  <path id="penumbra-cone"
        d="M 225 200 L 400 160 L 400 240 Z"
        fill="url(#shadowGradient)"
        stroke="rgba(100, 100, 140, 0.3)"
        stroke-width="1"
        stroke-dasharray="4 2"/>
  <!-- Label -->
  <text x="320" y="155" fill="#ec7063" font-size="10" opacity="0.8">Earth's Shadow</text>
  <text x="300" y="168" fill="#ec7063" font-size="9" opacity="0.6">(only matters for eclipses!)</text>
</g>
```

**Step 2: Add toggle checkbox in controls section**

Find the controls-panel div (around line 581) and add before the phase buttons:

```html
<!-- Shadow Toggle -->
<div class="toggle-row" style="margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
  <label class="toggle-switch">
    <input type="checkbox" id="show-shadow-toggle">
    <span class="toggle-slider"></span>
  </label>
  <label for="show-shadow-toggle" style="font-size: 0.875rem; color: var(--text-secondary); cursor: pointer;">
    Show Earth's Shadow
  </label>
</div>
```

**Step 3: Commit**

```bash
git add demos/moon-phases/index.html
git commit -m "feat(moon-phases): add Earth shadow cone SVG elements

- Add umbra and penumbra cone shapes
- Add toggle checkbox for shadow visibility
- Shadow is hidden by default, shown on toggle"
```

---

### Task 1.2: Add Shadow Toggle Logic to moon-phases.js

**Files:**
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Add shadow toggle handler in setupPresets function**

Find the `setupPresets()` function (around line 382) and add at the end before closing brace:

```javascript
// Shadow toggle
const shadowToggle = document.getElementById('show-shadow-toggle');
const shadowGroup = document.getElementById('earth-shadow-group');

if (shadowToggle && shadowGroup) {
  shadowToggle.addEventListener('change', () => {
    shadowGroup.style.display = shadowToggle.checked ? 'block' : 'none';

    // Announce for screen readers
    const announce = document.getElementById('status-announce');
    if (announce) {
      announce.textContent = shadowToggle.checked
        ? "Earth's shadow cone is now visible. Notice it points away from the Sun and rarely touches the Moon."
        : "Earth's shadow cone hidden.";
    }
  });
}
```

**Step 2: Add insight popup when shadow first shown**

Add this function before `init()`:

```javascript
/**
 * Show insight popup when shadow is first toggled on
 */
let shadowInsightShown = false;

function showShadowInsight() {
  if (shadowInsightShown) return;
  shadowInsightShown = true;

  // Create popup
  const popup = document.createElement('div');
  popup.className = 'insight-popup';
  popup.innerHTML = `
    <div class="insight-popup-content">
      <strong>Key Observation:</strong> Earth's shadow always points
      <em>away</em> from the Sun. The Moon is almost never in the shadow — that's why phases are NOT caused by Earth's shadow!
      <button class="insight-close" aria-label="Close">Got it!</button>
    </div>
  `;
  popup.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(46, 204, 113, 0.95);
    color: #1a1a2e;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    max-width: 400px;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease-out;
  `;

  document.body.appendChild(popup);

  popup.querySelector('.insight-close').addEventListener('click', () => {
    popup.remove();
  });

  // Auto-dismiss after 8 seconds
  setTimeout(() => popup.remove(), 8000);
}
```

**Step 3: Connect insight to toggle**

Update the shadow toggle handler to call the insight:

```javascript
shadowToggle.addEventListener('change', () => {
  shadowGroup.style.display = shadowToggle.checked ? 'block' : 'none';

  if (shadowToggle.checked) {
    showShadowInsight();
  }

  // ... rest of handler
});
```

**Step 4: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add shadow toggle logic with insight popup

- Toggle shows/hides Earth's shadow cone
- First toggle shows educational insight popup
- Screen reader announcements for accessibility"
```

---

### Task 1.3: Add CSS for Insight Popup

**Files:**
- Modify: `demos/moon-phases/index.html` (style section)

**Step 1: Add popup animation and styles**

Add to the `<style>` section (around line 309):

```css
/* Insight popup animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.insight-popup-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.insight-popup-content strong {
  color: #1a5f3a;
}

.insight-close {
  align-self: flex-end;
  background: #1a5f3a;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.insight-close:hover {
  background: #145a32;
}
```

**Step 2: Commit**

```bash
git add demos/moon-phases/index.html
git commit -m "style(moon-phases): add insight popup CSS animation"
```

---

## Phase 2: Core UX Improvements

### Task 2.1: Add Reset Button to moon-phases

**Files:**
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Add reset button HTML**

In `index.html`, find the animation-controls div (around line 557) and add reset button:

```html
<button class="anim-btn" id="btn-reset" title="Reset to Full Moon">
  <span class="btn-icon">↺</span> Reset
</button>
```

**Step 2: Add reset handler in JavaScript**

In `moon-phases.js`, add to `setupAnimationControls()`:

```javascript
document.getElementById('btn-reset').addEventListener('click', () => {
  stopAnimation();

  // Reset to Full Moon (angle 0)
  AstroUtils.animateValue(moonAngle, 0, 300, (val) => {
    moonAngle = ((val % 360) + 360) % 360;
    update();
  });

  // Hide shadow if shown
  const shadowToggle = document.getElementById('show-shadow-toggle');
  const shadowGroup = document.getElementById('earth-shadow-group');
  if (shadowToggle && shadowGroup) {
    shadowToggle.checked = false;
    shadowGroup.style.display = 'none';
  }

  // Announce reset
  const announce = document.getElementById('status-announce');
  if (announce) {
    announce.textContent = 'Reset to Full Moon position.';
  }
});
```

**Step 3: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add reset button

- Resets Moon to Full Moon position
- Hides shadow cone if visible
- Stops any running animation"
```

---

### Task 2.2: Add Reset Button to eclipse-geometry

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add reset button HTML**

In `index.html`, find sim-controls div and add:

```html
<button class="sim-btn" id="btn-reset" title="Reset simulation">↺ Reset</button>
```

**Step 2: Add reset handler**

In `eclipse-geometry.js`, add to `setupControls()`:

```javascript
// Reset button
const btnReset = document.getElementById('btn-reset');
if (btnReset) {
  btnReset.addEventListener('click', () => {
    stopAnimation();

    // Reset state
    state.moonAngle = 0;
    state.nodeAngle = 0;
    state.orbitalTilt = 5.145;

    // Reset UI
    elements.tiltSlider.value = state.orbitalTilt * 10;
    elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';

    // Reset stats
    state.totalSolarEclipses = 0;
    state.partialSolarEclipses = 0;
    state.totalLunarEclipses = 0;
    state.partialLunarEclipses = 0;
    state.yearsSimulated = 0;
    state.eclipseLog = [];

    elements.statsPanel.style.display = 'none';
    elements.logPanel.style.display = 'none';

    update();
  });
}
```

**Step 3: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js
git commit -m "feat(eclipse-geometry): add reset button

- Resets Moon, node, and tilt to defaults
- Clears simulation stats and log
- Stops any running animation"
```

---

### Task 2.3: Add Cross-Demo Navigation

**Files:**
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Add navigation link to moon-phases**

In `moon-phases/index.html`, add after the insight-box (around line 596):

```html
<!-- Cross-demo navigation -->
<div class="demo-nav" style="margin-top: 1.5rem; text-align: center;">
  <a href="../eclipse-geometry/" class="demo-nav-link" style="
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--space-light);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  ">
    Continue to Eclipse Geometry →
    <span style="font-size: 0.75rem; opacity: 0.7;">Why don't eclipses happen every month?</span>
  </a>
</div>

<style>
  .demo-nav-link:hover {
    background: var(--space-medium);
    border-color: var(--cosmic-teal);
    color: var(--text-primary);
  }
</style>
```

**Step 2: Add navigation link to eclipse-geometry**

In `eclipse-geometry/index.html`, add after the insight-box:

```html
<!-- Cross-demo navigation -->
<div class="demo-nav" style="margin-top: 1.5rem; text-align: center;">
  <a href="../moon-phases/" class="demo-nav-link" style="
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--space-light);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  ">
    ← Back to Moon Phases
    <span style="font-size: 0.75rem; opacity: 0.7;">Review how phases work</span>
  </a>
</div>

<style>
  .demo-nav-link:hover {
    background: var(--space-medium);
    border-color: var(--cosmic-teal);
    color: var(--text-primary);
  }
</style>
```

**Step 3: Commit**

```bash
git add demos/moon-phases/index.html demos/eclipse-geometry/index.html
git commit -m "feat(demos): add cross-navigation between moon-phases and eclipse-geometry

- Moon phases links to eclipse geometry with context
- Eclipse geometry links back to moon phases
- Hover effects match Cosmic Nebula theme"
```

---

## Phase 3: Challenge Mode

### Task 3.1: Create Challenge Engine Module

**Files:**
- Create: `demos/_assets/challenge-engine.js`

**Step 1: Write the challenge engine**

```javascript
/**
 * Challenge Engine for Astronomy Demos
 * Provides structured puzzles with feedback
 */

(function() {
  'use strict';

  /**
   * Create a challenge engine for a demo
   * @param {Object} config - Configuration object
   * @param {Array} config.challenges - Array of challenge definitions
   * @param {Function} config.getState - Function returning current demo state
   * @param {Function} config.setState - Function to set demo state
   * @param {HTMLElement} config.container - Container for challenge UI
   */
  function createChallengeEngine(config) {
    const { challenges, getState, setState, container } = config;

    let currentIndex = -1;
    let isActive = false;
    let ui = null;

    // Create UI elements
    function createUI() {
      const wrapper = document.createElement('div');
      wrapper.className = 'challenge-panel';
      wrapper.innerHTML = `
        <div class="challenge-header">
          <span class="challenge-badge">Challenge Mode</span>
          <button class="challenge-close" aria-label="Exit challenge mode">×</button>
        </div>
        <div class="challenge-content">
          <div class="challenge-number"></div>
          <div class="challenge-prompt"></div>
          <div class="challenge-hint" style="display: none;"></div>
          <div class="challenge-feedback" style="display: none;"></div>
        </div>
        <div class="challenge-actions">
          <button class="challenge-btn hint-btn">Show Hint</button>
          <button class="challenge-btn check-btn primary">Check Answer</button>
        </div>
        <div class="challenge-nav">
          <button class="challenge-btn prev-btn" disabled>← Previous</button>
          <span class="challenge-progress"></span>
          <button class="challenge-btn next-btn">Next →</button>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .challenge-panel {
          background: rgba(18, 18, 31, 0.95);
          border: 2px solid var(--cosmic-teal);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
        }
        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .challenge-badge {
          background: var(--cosmic-teal);
          color: var(--space-black);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .challenge-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 0.5rem;
        }
        .challenge-close:hover { color: var(--text-primary); }
        .challenge-number {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .challenge-prompt {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .challenge-hint {
          background: rgba(255, 184, 108, 0.1);
          border-left: 3px solid var(--stellar-amber);
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--stellar-amber);
        }
        .challenge-feedback {
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .challenge-feedback.correct {
          background: rgba(80, 250, 123, 0.1);
          border-left: 3px solid var(--nebula-green);
          color: var(--nebula-green);
        }
        .challenge-feedback.incorrect {
          background: rgba(255, 121, 198, 0.1);
          border-left: 3px solid var(--nova-pink);
          color: var(--nova-pink);
        }
        .challenge-feedback.close {
          background: rgba(255, 184, 108, 0.1);
          border-left: 3px solid var(--stellar-amber);
          color: var(--stellar-amber);
        }
        .challenge-actions, .challenge-nav {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .challenge-nav {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .challenge-progress {
          flex: 1;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .challenge-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--space-light);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.15s ease;
        }
        .challenge-btn:hover:not(:disabled) {
          background: var(--space-medium);
          color: var(--text-primary);
          border-color: var(--cosmic-teal);
        }
        .challenge-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .challenge-btn.primary {
          background: var(--cosmic-teal);
          color: var(--space-black);
          border-color: var(--cosmic-teal);
        }
        .challenge-btn.primary:hover:not(:disabled) {
          background: #7dd8d2;
        }
      `;

      document.head.appendChild(style);
      return wrapper;
    }

    // Load a specific challenge
    function loadChallenge(index) {
      if (index < 0 || index >= challenges.length) return;

      currentIndex = index;
      const challenge = challenges[index];

      ui.querySelector('.challenge-number').textContent =
        `Challenge ${index + 1} of ${challenges.length}`;
      ui.querySelector('.challenge-prompt').textContent = challenge.prompt;
      ui.querySelector('.challenge-hint').textContent = challenge.hint || '';
      ui.querySelector('.challenge-hint').style.display = 'none';
      ui.querySelector('.challenge-feedback').style.display = 'none';

      ui.querySelector('.prev-btn').disabled = index === 0;
      ui.querySelector('.next-btn').textContent =
        index === challenges.length - 1 ? 'Finish' : 'Next →';
      ui.querySelector('.challenge-progress').textContent =
        `${index + 1} / ${challenges.length}`;

      // Set initial state if challenge has one
      if (challenge.initialState && setState) {
        setState(challenge.initialState);
      }
    }

    // Check current answer
    function checkAnswer() {
      const challenge = challenges[currentIndex];
      const state = getState();
      const result = challenge.check(state);

      const feedback = ui.querySelector('.challenge-feedback');
      feedback.style.display = 'block';

      if (result.correct) {
        feedback.className = 'challenge-feedback correct';
        feedback.innerHTML = `<strong>Correct!</strong> ${result.message || ''}`;
      } else if (result.close) {
        feedback.className = 'challenge-feedback close';
        feedback.innerHTML = `<strong>Close!</strong> ${result.message || 'Keep trying.'}`;
      } else {
        feedback.className = 'challenge-feedback incorrect';
        feedback.innerHTML = `<strong>Not quite.</strong> ${result.message || 'Try again.'}`;
      }
    }

    // Show hint
    function showHint() {
      const hint = ui.querySelector('.challenge-hint');
      hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    }

    // Start challenge mode
    function start() {
      if (!ui) {
        ui = createUI();
        container.insertBefore(ui, container.firstChild);

        // Wire up buttons
        ui.querySelector('.challenge-close').addEventListener('click', stop);
        ui.querySelector('.hint-btn').addEventListener('click', showHint);
        ui.querySelector('.check-btn').addEventListener('click', checkAnswer);
        ui.querySelector('.prev-btn').addEventListener('click', () => loadChallenge(currentIndex - 1));
        ui.querySelector('.next-btn').addEventListener('click', () => {
          if (currentIndex === challenges.length - 1) {
            stop();
          } else {
            loadChallenge(currentIndex + 1);
          }
        });
      }

      isActive = true;
      ui.style.display = 'block';
      loadChallenge(0);
    }

    // Stop challenge mode
    function stop() {
      isActive = false;
      if (ui) {
        ui.style.display = 'none';
      }
    }

    return {
      start,
      stop,
      isActive: () => isActive,
      loadChallenge,
      getCurrentIndex: () => currentIndex
    };
  }

  // Export
  if (typeof window !== 'undefined') {
    window.ChallengeEngine = { create: createChallengeEngine };
  }

})();
```

**Step 2: Commit**

```bash
git add demos/_assets/challenge-engine.js
git commit -m "feat(demos): add challenge engine module

- Reusable challenge system for all demos
- Supports prompts, hints, and answer checking
- Visual feedback for correct/incorrect/close answers
- Navigation between challenges"
```

---

### Task 3.2: Add Moon Phase Challenges

**Files:**
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Add script reference and challenge button**

In `index.html`, add before the closing `</body>`:

```html
<script src="../_assets/challenge-engine.js"></script>
```

Add challenge mode button in animation-controls:

```html
<button class="anim-btn" id="btn-challenges" style="margin-left: auto;">
  <span class="btn-icon">🎯</span> Challenges
</button>
```

**Step 2: Define challenges and integrate engine**

In `moon-phases.js`, add before `init()`:

```javascript
// ============================================
// Challenge Mode
// ============================================

const PHASE_CHALLENGES = [
  {
    prompt: "Place the Moon so you see a waxing crescent from Earth.",
    hint: "A waxing crescent is just after new moon, with the right side lit. The Moon should be between new (180°) and first quarter (270°).",
    check: (state) => {
      const angle = ((state.moonAngle % 360) + 360) % 360;
      const isWaxingCrescent = angle > 200 && angle < 250;
      const isClose = angle > 180 && angle < 270;
      return {
        correct: isWaxingCrescent,
        close: isClose && !isWaxingCrescent,
        message: isWaxingCrescent
          ? "The waxing crescent shows a sliver of light on the right side."
          : isClose
            ? "You're in the right quadrant, but not quite at waxing crescent."
            : "Try moving the Moon between the new moon and first quarter positions."
      };
    }
  },
  {
    prompt: "Place the Moon so it rises at sunset (rises in the east as the Sun sets in the west).",
    hint: "The Moon rises at sunset when it's on the opposite side of Earth from the Sun — that's the full moon position!",
    check: (state) => {
      const angle = ((state.moonAngle % 360) + 360) % 360;
      const isFullMoon = angle < 22.5 || angle > 337.5;
      const isClose = angle < 45 || angle > 315;
      return {
        correct: isFullMoon,
        close: isClose && !isFullMoon,
        message: isFullMoon
          ? "Correct! The full moon rises at sunset because it's opposite the Sun."
          : "Think about where the Moon needs to be to rise as the Sun sets."
      };
    }
  },
  {
    prompt: "Place the Moon at third quarter (left half illuminated from Earth).",
    hint: "Third quarter is also called 'last quarter' — the Moon is 90° ahead of Earth in its orbit, so we see the left half lit.",
    check: (state) => {
      const angle = ((state.moonAngle % 360) + 360) % 360;
      const isThirdQuarter = angle > 67.5 && angle < 112.5;
      const isClose = angle > 45 && angle < 135;
      return {
        correct: isThirdQuarter,
        close: isClose && !isThirdQuarter,
        message: isThirdQuarter
          ? "That's third quarter — the left half is lit as seen from Earth."
          : "Third quarter is about 90° from full moon, moving toward new moon."
      };
    }
  },
  {
    prompt: "Enable Earth's shadow and find a phase where the shadow points toward the Moon.",
    hint: "Earth's shadow always points away from the Sun. When does the Moon cross into that shadow region?",
    initialState: { showShadow: true },
    check: (state) => {
      const angle = ((state.moonAngle % 360) + 360) % 360;
      // Shadow points right (opposite Sun), Moon is in shadow zone when angle is near 0 (full moon)
      const inShadowZone = angle < 30 || angle > 330;
      return {
        correct: inShadowZone,
        close: false,
        message: inShadowZone
          ? "The Moon is in the shadow zone! This is the ONLY time Earth's shadow matters — during a lunar eclipse. Notice that phases work the same whether the Moon is in the shadow or not!"
          : "Earth's shadow points to the right (away from the Sun). Move the Moon there."
      };
    }
  },
  {
    prompt: "Place the Moon where it's NOT in Earth's shadow to prove phases aren't caused by the shadow.",
    hint: "Most of the orbit is NOT in Earth's shadow. Any position except directly opposite the Sun will work!",
    initialState: { showShadow: true },
    check: (state) => {
      const angle = ((state.moonAngle % 360) + 360) % 360;
      const inShadowZone = angle < 30 || angle > 330;
      const isNew = angle > 157.5 && angle < 202.5;
      return {
        correct: !inShadowZone,
        close: false,
        message: !inShadowZone
          ? `The Moon shows a ${getPhaseName(angle)} phase even though it's nowhere near Earth's shadow. This proves phases are about viewing geometry, not shadows!`
          : "That's the shadow zone. Move the Moon elsewhere to see a phase without the shadow."
      };
    }
  }
];

let challengeEngine = null;

function setupChallenges() {
  const container = document.querySelector('.demo-content');
  const btn = document.getElementById('btn-challenges');

  if (!container || !btn) return;

  challengeEngine = ChallengeEngine.create({
    challenges: PHASE_CHALLENGES,
    getState: () => ({
      moonAngle,
      showShadow: document.getElementById('show-shadow-toggle')?.checked
    }),
    setState: (state) => {
      if (state.showShadow !== undefined) {
        const toggle = document.getElementById('show-shadow-toggle');
        const shadowGroup = document.getElementById('earth-shadow-group');
        if (toggle && shadowGroup) {
          toggle.checked = state.showShadow;
          shadowGroup.style.display = state.showShadow ? 'block' : 'none';
        }
      }
    },
    container
  });

  btn.addEventListener('click', () => {
    if (challengeEngine.isActive()) {
      challengeEngine.stop();
    } else {
      challengeEngine.start();
    }
  });
}
```

**Step 3: Call setupChallenges in init()**

Add to the `init()` function:

```javascript
setupChallenges();
```

**Step 4: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add 5 challenge mode puzzles

- Waxing crescent placement
- Moon rise timing (sunset = full moon)
- Third quarter identification
- Shadow zone exploration
- Shadow vs phase proof

Integrates with ChallengeEngine module"
```

---

### Task 3.3: Add Eclipse Challenges

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add script and button**

In `index.html`, add before `</body>`:

```html
<script src="../_assets/challenge-engine.js"></script>
```

Add button in sim-controls:

```html
<button class="sim-btn" id="btn-challenges">🎯 Challenges</button>
```

**Step 2: Define eclipse challenges**

In `eclipse-geometry.js`, add before `init()`:

```javascript
// ============================================
// Challenge Mode
// ============================================

const ECLIPSE_CHALLENGES = [
  {
    prompt: "Create the conditions for a solar eclipse.",
    hint: "Solar eclipses happen at new moon when the Moon is near a node (where it crosses the ecliptic plane).",
    check: (state) => {
      const phase = getPhase(state.moonAngle);
      const height = Math.abs(getMoonEclipticHeight(state.moonAngle, state.orbitalTilt, state.nodeAngle));
      const isNewMoon = phase === 'New Moon';
      const nearNode = height < 1.63; // partial solar threshold
      return {
        correct: isNewMoon && nearNode,
        close: isNewMoon || nearNode,
        message: isNewMoon && nearNode
          ? `Solar eclipse! The Moon is at new moon AND only ${height.toFixed(1)}° from the ecliptic.`
          : isNewMoon
            ? `You have new moon, but the Moon is ${height.toFixed(1)}° from the ecliptic — too far for an eclipse.`
            : nearNode
              ? "The Moon is near a node, but it's not new moon. Solar eclipses require new moon."
              : "You need both new moon AND proximity to a node."
      };
    }
  },
  {
    prompt: "Create the conditions for a lunar eclipse.",
    hint: "Lunar eclipses happen at full moon when the Moon passes through Earth's shadow near a node.",
    check: (state) => {
      const phase = getPhase(state.moonAngle);
      const height = Math.abs(getMoonEclipticHeight(state.moonAngle, state.orbitalTilt, state.nodeAngle));
      const isFullMoon = phase === 'Full Moon';
      const nearNode = height < 1.09; // partial lunar threshold
      return {
        correct: isFullMoon && nearNode,
        close: isFullMoon || nearNode,
        message: isFullMoon && nearNode
          ? `Lunar eclipse! The Moon is at full moon AND passing through Earth's shadow.`
          : isFullMoon
            ? `You have full moon, but the Moon is ${height.toFixed(1)}° from the ecliptic — it misses Earth's shadow.`
            : nearNode
              ? "The Moon is near a node, but it's not full moon. Lunar eclipses require full moon."
              : "You need both full moon AND proximity to a node."
      };
    }
  },
  {
    prompt: "Find a full moon that does NOT cause a lunar eclipse.",
    hint: "Most full moons don't cause eclipses because the Moon is above or below the ecliptic plane.",
    check: (state) => {
      const phase = getPhase(state.moonAngle);
      const height = Math.abs(getMoonEclipticHeight(state.moonAngle, state.orbitalTilt, state.nodeAngle));
      const isFullMoon = phase === 'Full Moon';
      const noEclipse = height > 1.09;
      return {
        correct: isFullMoon && noEclipse,
        close: isFullMoon,
        message: isFullMoon && noEclipse
          ? `Correct! The Moon is ${height.toFixed(1)}° from the ecliptic — it passes above/below Earth's shadow. This is why eclipses don't happen every month!`
          : isFullMoon
            ? `That's a full moon with an eclipse! The Moon is only ${height.toFixed(1)}° from the ecliptic. Try a full moon position farther from the nodes.`
            : "First get to full moon position."
      };
    }
  },
  {
    prompt: "Set the orbital tilt to 0° and observe what happens.",
    hint: "Without orbital tilt, the Moon always stays in the ecliptic plane...",
    initialState: { tilt: 0 },
    check: (state) => {
      const tiltZero = state.orbitalTilt < 0.5;
      return {
        correct: tiltZero,
        close: state.orbitalTilt < 2,
        message: tiltZero
          ? "With zero tilt, every new moon is a solar eclipse and every full moon is a lunar eclipse! The ~5° tilt is what makes eclipses rare."
          : "Use the tilt slider to set orbital tilt to 0°."
      };
    }
  },
  {
    prompt: "Run a 10-year simulation and count the eclipses. Are they rare?",
    hint: "Click 'Run Simulation' with 10 years selected. How many total solar and lunar eclipses occur?",
    check: (state) => {
      const hasRunSim = state.yearsSimulated >= 9;
      const totalEclipses = state.totalSolarEclipses + state.partialSolarEclipses +
                           state.totalLunarEclipses + state.partialLunarEclipses;
      return {
        correct: hasRunSim && totalEclipses > 0,
        close: state.yearsSimulated > 0,
        message: hasRunSim
          ? `In ${state.yearsSimulated.toFixed(0)} years: ${state.totalSolarEclipses + state.partialSolarEclipses} solar eclipses, ${state.totalLunarEclipses + state.partialLunarEclipses} lunar eclipses. That's about 2-5 per year total — rare compared to 12+ new/full moons per year!`
          : "Run the simulation for at least 10 years."
      };
    }
  }
];

let challengeEngine = null;

function setupChallenges() {
  const container = document.querySelector('.demo-content');
  const btn = document.getElementById('btn-challenges');

  if (!container || !btn) return;

  challengeEngine = ChallengeEngine.create({
    challenges: ECLIPSE_CHALLENGES,
    getState: () => ({
      moonAngle: state.moonAngle,
      nodeAngle: state.nodeAngle,
      orbitalTilt: state.orbitalTilt,
      yearsSimulated: state.yearsSimulated,
      totalSolarEclipses: state.totalSolarEclipses,
      partialSolarEclipses: state.partialSolarEclipses,
      totalLunarEclipses: state.totalLunarEclipses,
      partialLunarEclipses: state.partialLunarEclipses
    }),
    setState: (newState) => {
      if (newState.tilt !== undefined) {
        state.orbitalTilt = newState.tilt;
        elements.tiltSlider.value = newState.tilt * 10;
        elements.tiltDisplay.textContent = newState.tilt.toFixed(1) + '°';
        update();
      }
    },
    container
  });

  btn.addEventListener('click', () => {
    if (challengeEngine.isActive()) {
      challengeEngine.stop();
    } else {
      challengeEngine.start();
    }
  });
}
```

**Step 3: Call in init()**

```javascript
setupChallenges();
```

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js
git commit -m "feat(eclipse-geometry): add 5 challenge mode puzzles

- Solar eclipse conditions
- Lunar eclipse conditions
- Non-eclipse full moon (proves tilt matters)
- Zero tilt experiment
- Long-term simulation statistics

Integrates with ChallengeEngine module"
```

---

## Phase 4: Instructor Tour Mode

### Task 4.1: Create Tour Engine Module

**Files:**
- Create: `demos/_assets/tour-engine.js`

**Step 1: Write the tour engine**

```javascript
/**
 * Tour Engine for Astronomy Demos
 * Provides scripted step-by-step presentations for instructors
 */

(function() {
  'use strict';

  /**
   * Create a tour engine
   * @param {Object} config
   * @param {Array} config.steps - Array of tour step definitions
   * @param {Function} config.setState - Function to set demo state
   * @param {HTMLElement} config.container - Container for tour UI
   */
  function createTourEngine(config) {
    const { steps, setState, container } = config;

    let currentIndex = -1;
    let isActive = false;
    let ui = null;

    function createUI() {
      const wrapper = document.createElement('div');
      wrapper.className = 'tour-panel';
      wrapper.innerHTML = `
        <div class="tour-header">
          <span class="tour-badge">🎓 Instructor Tour</span>
          <button class="tour-close" aria-label="Exit tour">×</button>
        </div>
        <div class="tour-content">
          <div class="tour-step-number"></div>
          <div class="tour-title"></div>
          <div class="tour-description"></div>
        </div>
        <div class="tour-nav">
          <button class="tour-btn prev-btn" disabled>← Back</button>
          <span class="tour-progress"></span>
          <button class="tour-btn next-btn primary">Next →</button>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .tour-panel {
          background: linear-gradient(135deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 35, 0.98));
          border: 2px solid var(--soft-magenta);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 0 30px rgba(199, 146, 234, 0.3);
        }
        .tour-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .tour-badge {
          background: var(--soft-magenta);
          color: var(--space-black);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .tour-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          cursor: pointer;
        }
        .tour-step-number {
          font-size: 0.875rem;
          color: var(--soft-magenta);
          margin-bottom: 0.5rem;
        }
        .tour-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }
        .tour-description {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .tour-description em {
          color: var(--stellar-amber);
          font-style: normal;
        }
        .tour-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .tour-progress {
          flex: 1;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .tour-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background: var(--space-light);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.15s ease;
        }
        .tour-btn:hover:not(:disabled) {
          background: var(--space-medium);
          border-color: var(--soft-magenta);
        }
        .tour-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tour-btn.primary {
          background: var(--soft-magenta);
          color: var(--space-black);
          border-color: var(--soft-magenta);
        }
      `;

      document.head.appendChild(style);
      return wrapper;
    }

    function loadStep(index) {
      if (index < 0 || index >= steps.length) return;

      currentIndex = index;
      const step = steps[index];

      ui.querySelector('.tour-step-number').textContent = `Step ${index + 1} of ${steps.length}`;
      ui.querySelector('.tour-title').textContent = step.title;
      ui.querySelector('.tour-description').innerHTML = step.description;

      ui.querySelector('.prev-btn').disabled = index === 0;
      ui.querySelector('.next-btn').textContent =
        index === steps.length - 1 ? 'Finish' : 'Next →';
      ui.querySelector('.tour-progress').textContent = `${index + 1} / ${steps.length}`;

      // Execute step action
      if (step.action && setState) {
        setState(step.action);
      }
    }

    function start() {
      if (!ui) {
        ui = createUI();
        container.insertBefore(ui, container.firstChild);

        ui.querySelector('.tour-close').addEventListener('click', stop);
        ui.querySelector('.prev-btn').addEventListener('click', () => loadStep(currentIndex - 1));
        ui.querySelector('.next-btn').addEventListener('click', () => {
          if (currentIndex === steps.length - 1) {
            stop();
          } else {
            loadStep(currentIndex + 1);
          }
        });
      }

      isActive = true;
      ui.style.display = 'block';
      loadStep(0);
    }

    function stop() {
      isActive = false;
      if (ui) ui.style.display = 'none';
    }

    return { start, stop, isActive: () => isActive, loadStep };
  }

  if (typeof window !== 'undefined') {
    window.TourEngine = { create: createTourEngine };
  }

})();
```

**Step 2: Commit**

```bash
git add demos/_assets/tour-engine.js
git commit -m "feat(demos): add tour engine module for instructor presentations

- Step-by-step scripted tours
- Automatic state changes per step
- Navigation controls
- Distinct purple styling for instructor mode"
```

---

### Task 4.2: Add Moon Phases Tour

**Files:**
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Add script and button**

In `index.html`, add before `</body>`:

```html
<script src="../_assets/tour-engine.js"></script>
```

Add button:

```html
<button class="anim-btn" id="btn-tour">
  <span class="btn-icon">🎓</span> Instructor Tour
</button>
```

**Step 2: Define tour steps**

In `moon-phases.js`, add before `init()`:

```javascript
// ============================================
// Instructor Tour
// ============================================

const PHASE_TOUR_STEPS = [
  {
    title: "The Sun Lights Half the Moon",
    description: "No matter where the Moon is in its orbit, <em>exactly half is always lit by the Sun</em>. The question is: how much of that lit half can we see from Earth?",
    action: { moonAngle: 270, showShadow: false }
  },
  {
    title: "Full Moon: We See the Entire Lit Half",
    description: "When the Moon is opposite the Sun (from Earth's perspective), we see <em>100% of the lit half</em>. This is a full moon.",
    action: { moonAngle: 0, showShadow: false }
  },
  {
    title: "New Moon: The Lit Half Faces Away",
    description: "When the Moon is between Earth and the Sun, the lit half faces <em>away from us</em>. We see only the dark side — a new moon.",
    action: { moonAngle: 180, showShadow: false }
  },
  {
    title: "Quarter Phases: Seeing Half of the Lit Half",
    description: "At the quarter positions, we see <em>half of the lit half</em> — 50% illumination. First quarter (right half lit) and third quarter (left half lit).",
    action: { moonAngle: 270, showShadow: false }
  },
  {
    title: "But Wait — What About Earth's Shadow?",
    description: "Many students think phases are caused by Earth's shadow. Let's turn on the shadow to see where it actually is...",
    action: { moonAngle: 270, showShadow: true }
  },
  {
    title: "Earth's Shadow Points Away from the Sun",
    description: "Earth's shadow always extends <em>opposite the Sun</em>. At first quarter, the Moon is nowhere near the shadow! Phases are NOT caused by Earth's shadow.",
    action: { moonAngle: 270, showShadow: true }
  },
  {
    title: "When Does the Shadow Matter?",
    description: "Only during a <em>lunar eclipse</em> — when the full Moon happens to pass through Earth's shadow. This is rare because the Moon's orbit is tilted.",
    action: { moonAngle: 0, showShadow: true }
  },
  {
    title: "Summary: It's Geometry, Not Shadow",
    description: "Moon phases are caused by <em>viewing geometry</em>: how much of the lit half faces Earth. Earth's shadow only matters for eclipses, which are rare special events.",
    action: { moonAngle: 315, showShadow: false }
  }
];

let tourEngine = null;

function setupTour() {
  const container = document.querySelector('.demo-content');
  const btn = document.getElementById('btn-tour');

  if (!container || !btn) return;

  tourEngine = TourEngine.create({
    steps: PHASE_TOUR_STEPS,
    setState: (action) => {
      if (action.moonAngle !== undefined) {
        AstroUtils.animateValue(moonAngle, action.moonAngle, 400, (val) => {
          moonAngle = ((val % 360) + 360) % 360;
          update();
        });
      }
      if (action.showShadow !== undefined) {
        const toggle = document.getElementById('show-shadow-toggle');
        const shadowGroup = document.getElementById('earth-shadow-group');
        if (toggle && shadowGroup) {
          toggle.checked = action.showShadow;
          shadowGroup.style.display = action.showShadow ? 'block' : 'none';
        }
      }
    },
    container
  });

  btn.addEventListener('click', () => {
    if (tourEngine.isActive()) {
      tourEngine.stop();
    } else {
      tourEngine.start();
    }
  });
}
```

**Step 3: Call in init()**

```javascript
setupTour();
```

**Step 4: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "feat(moon-phases): add 8-step instructor tour

- Covers sunlit half concept
- Demonstrates full, new, quarter phases
- Explicitly shows shadow is NOT the cause
- Explains when shadow matters (eclipses)
- Animated transitions between steps"
```

---

### Task 4.3: Add Eclipse Tour

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Add script and button**

Add before `</body>`:

```html
<script src="../_assets/tour-engine.js"></script>
```

Add button:

```html
<button class="sim-btn" id="btn-tour">🎓 Instructor Tour</button>
```

**Step 2: Define eclipse tour**

In `eclipse-geometry.js`:

```javascript
// ============================================
// Instructor Tour
// ============================================

const ECLIPSE_TOUR_STEPS = [
  {
    title: "Why Not an Eclipse Every Month?",
    description: "If the Moon orbits Earth every ~29.5 days, why don't we have a solar eclipse every new moon and a lunar eclipse every full moon?",
    action: { moonAngle: 180, tilt: 5.145, nodeAngle: 0 }
  },
  {
    title: "The Moon's Orbit is Tilted",
    description: "The Moon's orbit is tilted <em>about 5°</em> relative to Earth's orbital plane (the ecliptic). Watch the side view — the Moon goes above and below the ecliptic.",
    action: { moonAngle: 90, tilt: 5.145, nodeAngle: 0 }
  },
  {
    title: "Nodes: Where Orbits Cross",
    description: "The <em>nodes</em> are the two points where the Moon's orbit crosses the ecliptic plane. Eclipses can only happen when the Moon is near a node.",
    action: { moonAngle: 0, tilt: 5.145, nodeAngle: 0 }
  },
  {
    title: "New Moon Far from Node = No Eclipse",
    description: "At this new moon, the Moon is <em>far from a node</em>. It passes above (or below) the Sun from our perspective — no solar eclipse.",
    action: { moonAngle: 180, tilt: 5.145, nodeAngle: 90 }
  },
  {
    title: "New Moon Near Node = Solar Eclipse!",
    description: "When new moon happens <em>near a node</em>, the Moon is close to the ecliptic and can block the Sun — a solar eclipse!",
    action: { moonAngle: 180, tilt: 5.145, nodeAngle: 0 }
  },
  {
    title: "Full Moon Near Node = Lunar Eclipse!",
    description: "When full moon happens near a node, the Moon passes through Earth's shadow — a lunar eclipse!",
    action: { moonAngle: 0, tilt: 5.145, nodeAngle: 0 }
  },
  {
    title: "Eclipse Seasons",
    description: "Eclipses cluster into <em>eclipse seasons</em> about every 6 months, when the node line points toward the Sun. Outside these seasons, eclipses are impossible.",
    action: { moonAngle: 0, tilt: 5.145, nodeAngle: 45 }
  },
  {
    title: "Summary: Tilt Makes Eclipses Rare",
    description: "The 5° tilt of the Moon's orbit means alignment is rare. We get only 2-5 eclipses per year globally — each one a special geometric coincidence!",
    action: { moonAngle: 270, tilt: 5.145, nodeAngle: 0 }
  }
];

let tourEngine = null;

function setupTour() {
  const container = document.querySelector('.demo-content');
  const btn = document.getElementById('btn-tour');

  if (!container || !btn) return;

  tourEngine = TourEngine.create({
    steps: ECLIPSE_TOUR_STEPS,
    setState: (action) => {
      if (action.moonAngle !== undefined) {
        state.moonAngle = action.moonAngle;
      }
      if (action.tilt !== undefined) {
        state.orbitalTilt = action.tilt;
        elements.tiltSlider.value = action.tilt * 10;
        elements.tiltDisplay.textContent = action.tilt.toFixed(1) + '°';
      }
      if (action.nodeAngle !== undefined) {
        state.nodeAngle = action.nodeAngle;
      }
      update();
    },
    container
  });

  btn.addEventListener('click', () => {
    if (tourEngine.isActive()) {
      tourEngine.stop();
    } else {
      tourEngine.start();
    }
  });
}
```

**Step 3: Call in init()**

```javascript
setupTour();
```

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js
git commit -m "feat(eclipse-geometry): add 8-step instructor tour

- Explains why not monthly eclipses
- Shows orbital tilt and nodes
- Demonstrates eclipse conditions
- Covers eclipse seasons concept
- Interactive state changes per step"
```

---

## Phase 5: Final Polish

### Task 5.1: Update README Files

**Files:**
- Modify: `demos/moon-phases/README.md`
- Modify: `demos/eclipse-geometry/README.md`

**Step 1: Update moon-phases README**

Add sections for new features:

```markdown
## New Features (v2.0)

### Earth's Shadow Toggle
- Click "Show Earth's Shadow" to visualize Earth's shadow cone
- Demonstrates that phases are NOT caused by the shadow
- Educational popup explains the key insight

### Challenge Mode
- 5 structured puzzles to test understanding
- Covers phase identification, rise/set timing, shadow misconception
- Hints and feedback guide learning

### Instructor Tour
- 8-step guided presentation for lectures
- Automated state changes at each step
- Explains the geometry-not-shadow concept step by step
```

**Step 2: Update eclipse-geometry README similarly**

**Step 3: Commit**

```bash
git add demos/moon-phases/README.md demos/eclipse-geometry/README.md
git commit -m "docs(demos): update READMEs with new feature documentation

- Document shadow toggle, challenges, and tour modes
- Update usage instructions"
```

---

### Task 5.2: Update CHANGELOG

**Files:**
- Modify: `demos/CHANGELOG.md`

**Step 1: Add v2.1.0 entry**

```markdown
## [2.1.0] - 2026-01-23

### Lunar Geometry Lab Upgrade

Major pedagogical upgrade to moon-phases and eclipse-geometry demos based on the Lunar Geometry Lab specification.

#### Added

**Earth's Shadow Visualization (moon-phases)**
- Toggle to show Earth's umbra and penumbra cones
- Educational popup explaining shadow vs. phase distinction
- Targets #1 misconception: "phases are caused by Earth's shadow"

**Challenge Mode (both demos)**
- 5 structured puzzles per demo with hints and feedback
- Challenges target specific learning objectives
- Correct/close/incorrect feedback guides learning
- New shared module: `_assets/challenge-engine.js`

**Instructor Tour Mode (both demos)**
- 8-step scripted presentations for lectures
- Automatic state changes between steps
- Covers key concepts with progressive reveal
- New shared module: `_assets/tour-engine.js`

**UX Improvements**
- Reset buttons on both demos
- Cross-demo navigation links
- Improved button styling

#### Files Added
- `_assets/challenge-engine.js` — Reusable challenge system
- `_assets/tour-engine.js` — Reusable tour system

#### Files Modified
- `moon-phases/index.html` — Shadow cone, challenge/tour buttons, reset
- `moon-phases/moon-phases.js` — Shadow toggle, challenges, tour
- `eclipse-geometry/index.html` — Challenge/tour buttons, reset
- `eclipse-geometry/eclipse-geometry.js` — Challenges, tour
```

**Step 2: Commit**

```bash
git add demos/CHANGELOG.md
git commit -m "docs(demos): add v2.1.0 changelog for Lunar Geometry Lab upgrade"
```

---

## Testing Checklist

After implementing all tasks, verify:

- [ ] Moon phases demo loads without errors
- [ ] Shadow toggle shows/hides cone correctly
- [ ] Shadow insight popup appears on first toggle
- [ ] All 5 moon phase challenges work with correct feedback
- [ ] Instructor tour advances through all 8 steps
- [ ] Reset button returns to initial state
- [ ] Eclipse demo loads without errors
- [ ] All 5 eclipse challenges work correctly
- [ ] Eclipse instructor tour works
- [ ] Cross-navigation links work
- [ ] Reduced motion preference is respected
- [ ] Keyboard navigation works for new controls

---

## Summary

| Phase | Tasks | Key Deliverables |
|-------|-------|------------------|
| **1. Misconception Targeting** | 1.1-1.3 | Earth's shadow cone SVG, toggle, insight popup |
| **2. Core UX** | 2.1-2.3 | Reset buttons, cross-navigation |
| **3. Challenge Mode** | 3.1-3.3 | challenge-engine.js, 10 total challenges |
| **4. Instructor Tour** | 4.1-4.3 | tour-engine.js, 16 total tour steps |
| **5. Polish** | 5.1-5.2 | Documentation updates |

**Total: 13 tasks across 5 phases**

This plan transforms the existing demos into a pedagogically-focused "Lunar Geometry Lab" that directly targets misconceptions and provides structured learning activities.
