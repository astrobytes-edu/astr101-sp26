# Demo Improvements Design

**Date:** 2026-01-20
**Status:** Approved
**Scope:** Moon Phases, Angular Size, Seasons, Accessibility (all demos)

---

## Overview

Comprehensive improvements to the ASTR 101 interactive demos addressing:
1. Moon Phases — Enhanced visualization with 3D sphere, timeline, animation
2. Angular Size — Two-panel layout with viewport metaphor
3. Seasons — Fix planet presets for extreme tilts (Venus, Uranus)
4. Accessibility — ARIA labels and keyboard navigation for all demos

---

## 1. Moon Phases Demo Enhancements

### 1.1 Orbital View: 3D-ish Sphere

**Current:** Moon appears as a simple circle with a terminator overlay.

**New:** Moon rendered as a shaded sphere showing:
- Left hemisphere lit (facing Sun)
- Gradient from bright (sunward) to dark (spaceward)
- Visual shows which part of the lit hemisphere faces Earth

**Implementation:**
- SVG gradient: `radialGradient` with offset based on Moon angle
- Or: clip path showing intersection of "lit half" and "Earth-facing half"

**Why:** Shows the KEY relationship — phase = intersection of what's lit AND what faces Earth.

### 1.2 Timeline View: Horizontal Strip

New component below the main visualization:

```
[New] → [🌒] → [🌓] → [🌔] → [Full] → [🌖] → [🌗] → [🌘] → [New]
  ↑
 Current position highlighted
```

**Features:**
- 8 phase icons in sequence (New, Waxing Crescent, First Quarter, Waxing Gibbous, Full, Waning Gibbous, Third Quarter, Waning Crescent)
- Current phase highlighted with glow effect
- "WAXING →" or "← WANING" label shows direction of progression
- Clicking any phase icon jumps Moon to that position
- Day count shown (e.g., "Day 7 of 29.5")

### 1.3 Animation Controls

New control bar with:
- **Play/Pause button** — Animate through full 29.5-day cycle
- **Speed selector** — 1x, 5x, 10x speed options
- **Step buttons** — Move forward/backward one phase at a time

**Animation behavior:**
- Loops continuously when playing
- Shows day counter incrementing
- Updates timeline highlight in sync

### 1.4 Files to Modify

- `demos/moon-phases/moon-phases.js` — Add 3D sphere rendering, animation system
- `demos/moon-phases/index.html` — Add timeline component, animation controls

---

## 2. Angular Size Demo Overhaul

### 2.1 Two-Panel Layout

```
┌────────────────────────────────┬─────────────────────────────────────┐
│      GEOMETRIC VIEW            │         VIEWPORT VIEW               │
│                                │  ┌─────────────────────────────┐    │
│  👁 ────────────(●)            │  │                             │    │
│     ╲  θ = 0.53°  ╱            │  │           ◉                 │    │
│      ╲──────────╱              │  │         (Moon)              │    │
│                                │  │                             │    │
│  Distance: 384,400 km          │  │   Fills 0.5° of your view   │    │
│  Size: 3,474 km                │  └─────────────────────────────┘    │
│                                │                                     │
│  [Thumb reference: ──── 2°]    │  [Compare: Sun ◉ | Moon ◉ ]        │
└────────────────────────────────┴─────────────────────────────────────┘
```

### 2.2 Enhanced Geometric View (Left Panel)

Improvements to current visualization:

1. **Rich object rendering**
   - Sun: glowing corona with radial gradient
   - Moon: gray surface with subtle crater texture
   - Planets: characteristic colors (Mars red, Jupiter banded, etc.)
   - Everyday objects: simple but recognizable icons

2. **Animated transitions**
   - Smooth animation when switching presets
   - Object zooms in/out as distance changes
   - Size pulses briefly when changed

3. **Persistent 2° reference line**
   - "Your thumb at arm's length" benchmark always visible
   - Helps students compare: "Is this bigger or smaller than my thumb?"

4. **Improved distance indicators**
   - Distance shown in most intuitive units (km, AU, light-years)
   - Physical size always displayed alongside angular size

### 2.3 Viewport View (Right Panel, NEW)

Circular "telescope viewfinder" showing:
- How much of field of view the object occupies
- Degree markings around the edge (like a protractor)
- Object scales in real-time as sliders change
- Center crosshairs for reference

**Purpose:** Shows what angular size MEANS experientially — how much of your view an object fills.

### 2.4 Comparison Mode

Toggle button enables side-by-side viewport:
- Left viewport: Object A (e.g., Sun)
- Right viewport: Object B (e.g., Moon)
- Both at same scale showing they fill same amount of view
- Explains why total solar eclipses are possible

### 2.5 Enhanced Interactivity

1. **Drag object** — Click and drag the object in geometric view to change distance
2. **Pinch-to-zoom** — On touch devices, pinch gesture changes distance
3. **Object picker** — Visual grid of object icons for quick selection
4. **Keyboard shortcuts** — 1-6 for astronomical presets, 7-0 for everyday objects

### 2.6 Files to Modify

- `demos/angular-size/angular-size.js` — Add viewport rendering, drag interaction, comparison mode
- `demos/angular-size/index.html` — Add viewport panel, comparison toggle, object picker

---

## 3. Seasons Demo Fix

### 3.1 Problem

Current code caps tilt at 90° for the slider:
```javascript
// BUG: Loses actual tilt value
const displayTilt = Math.min(tilt, 90);
state.axialTilt = displayTilt;
```

Venus (177.4°) and Uranus (97.8°) don't display correctly.

### 3.2 Solution: Extend Slider to 180°

```javascript
// HTML: Change slider max
<input type="range" id="tilt-slider" min="0" max="180" step="0.1">

// JS: Store actual value
state.axialTilt = tilt;  // No capping
elements.tiltSlider.value = tilt;
```

### 3.3 Globe Visualization for >90° Tilts

When tilt exceeds 90°:
- Globe visually flips to show "upside down" orientation
- North pole label moves to bottom
- "RETROGRADE ROTATION" indicator appears
- Terminator and latitude bands adjust accordingly

**Implementation approach:**
- For tilts >90°, apply `transform: scaleY(-1)` to globe or recalculate positions
- Alternatively: treat tilt mathematically (seasons math handles 0-180° naturally)

### 3.4 Educational Callouts

When extreme-tilt planet selected, show info box:

**Venus (177.4°):**
> "Venus rotates BACKWARDS (retrograde) with 177° tilt — it's almost upside down! The Sun rises in the west and sets in the east."

**Uranus (97.8°):**
> "Uranus is tilted 98° — it essentially rolls around its orbit on its side! This creates extreme 42-year seasons where each pole gets decades of continuous sunlight or darkness."

### 3.5 Files to Modify

- `demos/seasons/seasons.js` — Remove tilt capping, add >90° visualization logic
- `demos/seasons/index.html` — Update slider max, add info callout area

---

## 4. Accessibility (All Demos)

### 4.1 ARIA Labels for SVG Elements

Every interactive SVG element gets descriptive attributes:

```html
<!-- Moon Phases: Draggable Moon -->
<g id="moon-group"
   role="slider"
   aria-label="Moon position on orbit"
   aria-valuemin="0"
   aria-valuemax="360"
   aria-valuenow="45"
   aria-valuetext="Waxing Crescent, 25% illuminated, Day 4 of lunar cycle"
   tabindex="0">

<!-- Angular Size: Object -->
<circle id="object-circle"
   role="img"
   aria-label="Moon at distance 384,400 km, angular size 0.52 degrees">

<!-- Seasons: Earth on orbit -->
<g id="earth-orbital"
   role="img"
   aria-label="Earth at March Equinox position, 1.0 AU from Sun">
```

### 4.2 Keyboard Navigation

#### Moon Phases
| Key | Action |
|-----|--------|
| ← / → | Move Moon 5° counter-clockwise / clockwise |
| Shift + ← / → | Move Moon 1° (fine control) |
| Home | Jump to Full Moon (0°) |
| End | Jump to New Moon (180°) |
| Space | Toggle animation play/pause |
| 1-8 | Jump to specific phase |

#### Eclipse Geometry
| Key | Action |
|-----|--------|
| ← / → | Move Moon 5° around orbit |
| Shift + ← / → | Move Moon 1° |
| N | Jump to nearest node |
| Space | Toggle animation |

#### Angular Size
| Key | Action |
|-----|--------|
| ← / → | Decrease / increase distance (logarithmic) |
| ↑ / ↓ | Decrease / increase size (logarithmic) |
| 1-6 | Select astronomical preset (Sun, Moon, Jupiter, etc.) |
| C | Toggle comparison mode |

#### Seasons
| Key | Action |
|-----|--------|
| ← / → | Move backward / forward 1 day |
| Shift + ← / → | Move backward / forward 1 month |
| E | Jump to nearest equinox |
| S | Jump to nearest solstice |
| Space | Toggle year animation |

### 4.3 Focus Management

- **Visible focus ring** — 2px blue outline on all interactive elements
- **Tab order** — Logical flow: main visualization → controls → presets
- **Focus trap** — When modal/overlay open, focus stays within

```css
*:focus-visible {
  outline: 2px solid var(--color-accent-blue);
  outline-offset: 2px;
}
```

### 4.4 Screen Reader Announcements

Live region for dynamic updates:

```html
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status-announce">
  <!-- JS updates this when state changes -->
</div>
```

**Announcement examples:**
- "Phase changed to First Quarter, 50% illuminated"
- "Distance changed to 1 AU, angular size 0.53 degrees"
- "Date changed to June 21, Northern Hemisphere Summer Solstice"

### 4.5 Files to Modify (All Demos)

Each demo needs updates to:
- `index.html` — Add ARIA attributes, live region div
- `*.js` — Add keyboard event handlers, update ARIA values on state change

---

## Implementation Priority

| Priority | Component | Effort | Impact |
|----------|-----------|--------|--------|
| 1 | Seasons tilt fix | Low | High (bug fix) |
| 2 | ARIA labels (all) | Medium | High (accessibility) |
| 3 | Keyboard navigation (all) | Medium | High (accessibility) |
| 4 | Moon Phases 3D sphere | Medium | High (pedagogy) |
| 5 | Moon Phases timeline | Medium | High (pedagogy) |
| 6 | Moon Phases animation | Low | Medium (engagement) |
| 7 | Angular Size viewport panel | High | High (pedagogy) |
| 8 | Angular Size rich rendering | Medium | Medium (engagement) |
| 9 | Angular Size comparison mode | Medium | High (pedagogy) |

---

## Verification

After implementation, verify:

1. **Moon Phases**
   - [ ] 3D sphere shows correct lit portion at all angles
   - [ ] Timeline highlights correct phase
   - [ ] Animation plays smoothly through cycle
   - [ ] Keyboard navigation works (←/→ moves Moon)
   - [ ] Screen reader announces phase changes

2. **Angular Size**
   - [ ] Viewport shows correct relative size
   - [ ] Comparison mode shows Sun and Moon same size
   - [ ] Transitions animate smoothly
   - [ ] Keyboard shortcuts work
   - [ ] Drag interaction feels responsive

3. **Seasons**
   - [ ] Venus (177.4°) and Uranus (97.8°) display correctly
   - [ ] Globe visualization handles >90° tilt
   - [ ] Seasons calculations remain accurate
   - [ ] Educational callouts appear for extreme tilts

4. **Accessibility (all)**
   - [ ] Tab through all controls logically
   - [ ] Arrow keys navigate within draggable elements
   - [ ] Screen reader announces all state changes
   - [ ] Focus visible on all interactive elements
   - [ ] WAVE tool reports no errors