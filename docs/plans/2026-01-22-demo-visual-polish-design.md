# Demo Visual Polish Design

**Date:** 2026-01-22
**Status:** Approved
**Author:** Anna Rosen + Claude

## Overview

Design specifications for improving the visual polish, typography, and user experience of the 9 ASTR 101/201 interactive astronomy demos while maintaining scientific accuracy.

**Target Context:** Dual-use — primarily student laptops/tablets, also projected in lectures.

**Priority Order:**
1. Typography & Data Clarity
2. Control Styling
3. Micro-Interactions
4. Smoother Animations
5. Atmospheric Polish

---

## 1. Typography & Readability

### Problem

Current demos have font sizes too small for comfortable reading, especially when projected. Text descriptions, axis labels, and value readouts lack hierarchy and sufficient contrast.

### Specifications

#### Base Font Sizes (Minimum)

| Element | Current | New Minimum | Rationale |
|---------|---------|-------------|-----------|
| Body text / descriptions | 14px | **16px** | WCAG AA minimum for body text |
| Control labels | 12px | **14px** | Readable at arm's length |
| Value readouts (key numbers) | 16px | **20-24px** | Must be scannable at a glance |
| Axis labels | 10-12px | **14px** | Critical for data comprehension |
| Chart tick values | 10px | **12px** | Secondary but necessary |
| Titles / headers | 20px | **24-28px** | Clear hierarchy |

#### Line Height & Spacing

- Body text: `line-height: 1.5` (currently ~1.3)
- Increase `letter-spacing: 0.01em` for small caps and labels
- Minimum touch/click target: 44×44px (Apple HIG)

#### Contrast Requirements

- Text on dark background: minimum 4.5:1 ratio (WCAG AA)
- Key values: use `--text-primary` (#F8F8F2), never `--text-muted`
- Consider subtle text-shadow for projection: `0 1px 2px rgba(0,0,0,0.5)`

---

## 2. Color Palette: Cosmic Nebula

Inspired by Hubble/JWST imagery — rich, immersive, scientifically evocative.

### Primary Palette

| Role | Name | Hex | CSS Variable | Use |
|------|------|-----|--------------|-----|
| **Primary Accent** | Cosmic Teal | `#4ECDC4` | `--cosmic-teal` | Primary buttons, active states, key values |
| **Secondary Accent** | Soft Magenta | `#C792EA` | `--soft-magenta` | Hover states, secondary highlights |
| **Warm Accent** | Stellar Amber | `#FFB86C` | `--stellar-amber` | Warnings, temperature-related, Sun elements |
| **Success/Go** | Nebula Green | `#50FA7B` | `--nebula-green` | Confirmations, "resolved" states |
| **Alert/Stop** | Nova Pink | `#FF79C6` | `--nova-pink` | Errors, eclipse conditions, hot objects |
| **Cool Neutral** | Ice Blue | `#8BE9FD` | `--ice-blue` | Labels, subtle highlights |

### Text Colors

| Role | Name | Hex | CSS Variable |
|------|------|-----|--------------|
| **Primary Text** | Starlight | `#F8F8F2` | `--text-primary` |
| **Secondary Text** | Dust | `#BFBFBF` | `--text-secondary` |
| **Muted Text** | Void | `#6272A4` | `--text-muted` |

### Glow Effects

```css
--glow-teal:    0 0 20px rgba(78, 205, 196, 0.4);
--glow-magenta: 0 0 20px rgba(199, 146, 234, 0.4);
--glow-amber:   0 0 30px rgba(255, 184, 108, 0.5);
--glow-sun:     0 0 60px rgba(255, 184, 108, 0.6),
                0 0 120px rgba(255, 184, 108, 0.3);
```

---

## 3. Data Visualization Clarity

### Axis & Grid Styling

| Element | Specification |
|---------|---------------|
| Axis lines | 2px stroke, `--text-secondary` color |
| Grid lines | 1px stroke, `rgba(255,255,255,0.08)` — subtle, not distracting |
| Tick marks | 6px length, same color as axis |
| Axis titles | 14px bold, positioned with 12px padding from ticks |

### Key Value Highlighting

- **Peak markers** (Wien's law, etc.): `--stellar-amber` with label
- **Current value indicators**: Vertical/horizontal reference lines, 2px dashed
- **Threshold indicators**: Subtle color bands (e.g., "visible spectrum" region)

### Numeric Readouts

```
┌─────────────────────────┐
│  Angular Size           │  ← Label: 14px, --text-secondary
│  0.52°                  │  ← Value: 24px bold, --text-primary
│  (31.2 arcmin)          │  ← Secondary: 14px, --text-muted
└─────────────────────────┘
```

- Group related values in cards with subtle borders
- Primary value always largest, secondary conversions smaller
- Use monospace font (`--font-mono`) for numbers to prevent layout shift

### Units & Precision

- Always show units adjacent to values (never separate line)
- Consistent significant figures per demo (typically 2-3)
- Use SI prefixes appropriately (nm, μm, km, AU, pc)

---

## 4. Control Styling

### Sliders (Range Inputs)

```
Track:   ════════════════════════════
         │ 6px height, rounded ends         │
         │ Background: --space-light        │
         │ Fill (left of thumb): --cosmic-teal │

Thumb:   ●  20px diameter (44px touch target via padding)
            Border: 2px solid --cosmic-teal
            Background: --space-deep
            Hover: glow effect (--glow-teal)
            Active: scale(1.1) + brighter glow
```

### Preset Buttons (Chips)

```
┌──────────────┐
│  ☉ Sun       │  ← 14px text, icon optional
└──────────────┘
```

| State | Style |
|-------|-------|
| Default | `background: --space-light`, `border: 1px solid --border-color` |
| Hover | `background: --space-medium`, `border-color: --cosmic-teal` |
| Active | `background: --cosmic-teal` (20% opacity), `border: --cosmic-teal` |
| Selected | Solid `--cosmic-teal` background, white text |

- Minimum size: 44px height, padding 12px horizontal
- Pill shape (fully rounded ends)
- Group related presets with subtle separator or label

### Action Buttons (Play/Pause, Reset)

| State | Style |
|-------|-------|
| Default | Ghost style — transparent bg, `--cosmic-teal` border & text |
| Hover | `--cosmic-teal` background (15% opacity) |
| Active | `--cosmic-teal` background (30% opacity), slight `scale(0.98)` |
| Disabled | 40% opacity, `cursor: not-allowed` |

### Toggle Switches

- Use for binary options (show/hide overlays, comparison mode)
- 44px wide × 24px tall track, 20px circular thumb
- Off: `--space-light` track
- On: `--nebula-green` track
- Include visible label — never toggle-only

---

## 5. Micro-Interactions

### Value Change Animations

```javascript
// When a numeric value updates:
- Number morphs smoothly (0.3s ease-out)
- Brief color flash: --cosmic-teal → white → back (0.15s)
- Subtle scale pulse: scale(1.0) → scale(1.05) → scale(1.0)
```

### Hover States

| Element | Hover Effect |
|---------|--------------|
| Buttons | Background lightens 15%, subtle glow appears |
| Sliders | Thumb grows slightly, glow intensifies |
| Presets | Border color shifts to `--cosmic-teal`, lift shadow |
| Clickable objects (celestial) | Soft outer glow pulses once |

### Click/Tap Feedback

- Ripple effect from click point (Material-style, subtle)
- Or: brief `scale(0.97)` "press" then release
- Duration: 150ms max — snappy, not sluggish

### Slider Dragging

```
Drag start:  Thumb scales up, value tooltip appears above
Dragging:    Value updates in real-time, tooltip follows
Drag end:    Thumb scales back, tooltip fades (0.2s)
```

### Loading/Computing States

- For heavy calculations (long-term eclipse sim): subtle pulsing glow on visualization
- Never freeze without feedback — always show something is happening

### Success Indicators

When reaching notable states (eclipse condition met, Rayleigh resolved):
- Brief checkmark icon fade-in
- Status text color shifts to `--nebula-green`
- Optional subtle confetti for "discovery moments" (toggle-able)

---

## 6. Smoother Animations

### Easing Curves

| Motion Type | Easing | Rationale |
|-------------|--------|-----------|
| Orbital motion | `linear` | Physically correct for circular orbits |
| Elliptical orbits | Custom bezier matching Kepler's 2nd law | Faster at perihelion, slower at aphelion |
| UI transitions | `ease-out` (0.3s) | Snappy start, gentle stop |
| Value changes | `ease-in-out` (0.2s) | Smooth number morphing |
| Zoom/scale | `ease-out` (0.4s) | Feels like camera movement |

### Celestial Object Motion

```
Stars:     Subtle twinkling (opacity 0.7–1.0, random 2-4s cycles)
Sun:       Gentle corona pulse (scale 1.0–1.02, 4s cycle)
Moon:      Earthshine subtle flicker when applicable
Earth:     Rotation visible when zoomed (24hr = ~3s animation cycle)
Planets:   Atmospheric shimmer on gas giants (blur edge pulse)
```

### Orbital Animations

- Default speed: 1 orbit = 3-5 seconds (adjustable)
- Pause shows current position clearly (no fade)
- Speed controls: 0.25x, 0.5x, 1x, 2x, 4x presets
- Smooth speed transitions (don't jump, ramp over 0.3s)

### Transition Between States

| Transition | Effect |
|------------|--------|
| Preset selection | Cross-fade (0.4s) — old values fade, new appear |
| View switching | Slide or morph (0.5s) — maintains spatial context |
| Reset | Quick snap (0.15s) — intentionally abrupt for "reset" feeling |

### Performance Guardrails

- Use `requestAnimationFrame` for all animations
- Respect `prefers-reduced-motion`: disable decorative animations, keep functional ones
- Target 60fps; drop decorative effects before functional if needed

---

## 7. Atmospheric Polish (Lower Priority)

### Starfield Enhancements

```
Current:   Static random dots
Enhanced:
  - 3 depth layers (near=bright/fast, far=dim/slow parallax)
  - Subtle twinkling (staggered, not synchronized)
  - Occasional "shooting star" (1 per 30-60s, subtle)
  - Density varies by demo context
```

### Contextual Backgrounds

| Demo | Background Suggestion |
|------|----------------------|
| Blackbody / EM Spectrum | Subtle nebula gradient (relates to thermal emission) |
| Parallax | Denser star field (emphasizes background stars concept) |
| Kepler's Laws | Clean, minimal (focus on orbital mechanics) |
| Eclipse Geometry | Earth-view horizon glow option |
| Seasons | Keep clean — globe is the focus |

### "Discovery Moment" Highlights

When students find key states (total eclipse, Wien's peak, Rayleigh limit):
- Brief radial glow pulse from the relevant element
- Optional tooltip: "You discovered: [concept]!"
- Instructor mode: can disable for assessment

### Lens Flare / Light Bloom (Optional)

- Sun objects: subtle hexagonal flare when bright
- Toggle-able — off by default, on for "cinematic" demos
- Never obscures data or controls

---

## Implementation

### Affected Files

| File | Changes |
|------|---------|
| `demos/_assets/astro-theme.css` | Updated CSS variables, typography, color palette, control styles |
| `demos/_assets/astro-utils.js` | Animation utilities, easing functions, micro-interaction helpers |
| `demos/_assets/starfield.js` | Enhanced parallax layers, twinkling, occasional meteors |
| `demos/*/index.html` | Minor markup updates for new control classes |
| `demos/*/*.js` | Integrate animation utilities, value-change callbacks |

### Implementation Phases

| Phase | Focus | Demos Affected |
|-------|-------|----------------|
| **Phase 1** | Typography + Color palette | All (shared CSS) |
| **Phase 2** | Control styling | All (shared CSS) |
| **Phase 3** | Data visualization clarity | Blackbody, EM Spectrum, Kepler's Laws |
| **Phase 4** | Micro-interactions | All (shared utilities) |
| **Phase 5** | Smoother animations | Moon Phases, Eclipse, Seasons, Kepler's |
| **Phase 6** | Atmospheric polish | Selective per demo |

### Testing Checklist

- [ ] All text readable at 100% zoom on 13" laptop
- [ ] Demos project clearly in lecture hall (test on projector)
- [ ] Controls meet 44px minimum touch target
- [ ] Contrast ratios pass WCAG AA (4.5:1 minimum)
- [ ] `prefers-reduced-motion` respected
- [ ] 60fps maintained on mid-range hardware
- [ ] No regressions in scientific accuracy

---

## References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Apple Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Motion](https://m3.material.io/styles/motion/overview)
- Dracula Theme (inspiration for Cosmic Nebula palette)
