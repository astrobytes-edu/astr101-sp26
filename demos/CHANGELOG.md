# Demos Changelog

All notable changes to the ASTR 101/201 interactive astronomy demos.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [2.0.1] - 2026-01-24

### Demo Suite Finish + Guardrails

#### Added

- Shared demo layout shell: `_assets/demo-shell.css`
- Legacy class bridge for consistent styling without per-demo overrides: `_assets/demo-legacy.css`
- Shared micro-interactions wiring (ripples + slider progress + opt-in slider tooltips): `_assets/demo-polish.js`
- Migration guardrails:
  - `demos/polish-manifest.json` (tracks which demos are “fully migrated”)
  - `scripts/check_demo_polish.py` (enforces required shared assets + blocks legacy inline overrides)

#### Fixed

- Starfield canvas resize scaling bug (prevents transform accumulation on repeated resizes): `_assets/starfield.js`

#### Changed

- All 9 demos now use the shared shell + polish assets (see `demos/polish-manifest.json`):
  - `angular-size`, `blackbody-radiation`, `eclipse-geometry`, `em-spectrum`, `keplers-laws`, `moon-phases`, `parallax-distance`, `seasons`, `telescope-resolution`
- Slider tooltips are opt-in (to avoid showing raw slider values when sliders map to physical values). Add `data-tooltip-source="#some-display-id"` on the slider to display the corresponding formatted readout text.

## [2.0.0] - 2026-01-22

### Visual Polish Release

Major visual overhaul implementing the "Cosmic Nebula" design system for improved readability, accessibility, and user experience across all demos.

#### Added

**Color Palette (Cosmic Nebula)**
- `--cosmic-teal: #4ECDC4` — Primary accent, buttons, active states
- `--soft-magenta: #C792EA` — Hover states, secondary highlights
- `--stellar-amber: #FFB86C` — Warnings, temperature/Sun elements
- `--nebula-green: #50FA7B` — Success states, confirmations
- `--nova-pink: #FF79C6` — Errors, alerts, hot objects
- `--ice-blue: #8BE9FD` — Labels, subtle highlights
- Glow effects: `--glow-teal`, `--glow-magenta`, `--glow-amber`, `--glow-sun`

**Typography**
- Increased minimum font sizes (16px body, 14px labels, 24px values, 28px titles)
- `line-height: 1.5` for improved readability
- Monospace font (`--font-mono`) for numeric values

**Components**
- `.value-card` — Grouped numeric readouts with label/value/secondary hierarchy
- `.toggle-switch` — Accessible toggle component (44x24px)
- `.status-indicator` — Semantic status badges (success/error/warning/info)
- Chart styling classes: `.chart-axis`, `.chart-grid`, `.chart-label`, `.chart-tick`

**Micro-Interactions** (`astro-utils.js`)
- `animateValueChange(element, newValue, formatter, options)` — Smooth number morphing with flash/pulse
- `createAnimatedValue(element, formatter)` — Auto-animating value wrapper
- `addRippleEffect(element, options)` — Material-style click feedback
- `showSuccessIndicator(targetElement, message, options)` — Checkmark popup for discovery moments

**Animation Utilities**
- Easing functions: `easeOutCubic`, `easeInCubic`, `easeOutElastic`, `easeOutBack`
- `keplerianEasing(t, eccentricity)` — Physically accurate orbital motion (Kepler's 2nd law)
- CSS animation classes: `.fade-in`, `.fade-out`, `.pulse`, `.pulse-subtle`, `.glow-pulse`, `.twinkle`, `.pop-in`, `.slide-up`, `.value-flash`

**Starfield Enhancements** (`starfield.js`)
- 3-layer depth system (near 15%, mid 35%, far 50%) with parallax-like effect
- Per-layer sizing, opacity, and twinkle speed
- Shooting star effect (every 30-60 seconds, configurable)
- Option to disable: `Starfield.create(canvas, { shootingStars: false })`

**Accessibility**
- `@media (prefers-reduced-motion: reduce)` — Disables all decorative animations
- `.sr-only` class for screen reader content
- Focus-visible outlines for keyboard navigation
- 44px minimum touch/click targets (Apple HIG compliance)

**Documentation**
- Created README.md for: blackbody-radiation, em-spectrum, parallax-distance, telescope-resolution
- Design specification: `docs/plans/2026-01-22-demo-visual-polish-design.md`
- Implementation plan: `docs/plans/2026-01-22-demo-visual-polish-implementation.md`

#### Changed

**Slider Styling**
- Track: 6px height, rounded ends, `--space-light` background
- Thumb: 20px diameter, `--cosmic-teal` border, glow on hover
- Fill indicator: Shows progress left of thumb (teal fill)
- Hover/active states with scale and glow effects

**Button Styling**
- Pill shape (`border-radius: 9999px`)
- Ghost style default (transparent bg, teal border)
- Glow effect on hover
- 44px minimum height for touch accessibility

**Preset Buttons**
- Pill shape with subtle border
- Hover: border shifts to `--cosmic-teal`, slight lift shadow
- Selected: solid `--cosmic-teal` background

#### Backwards Compatibility

Legacy CSS variable aliases ensure existing demos work without changes:
- `--accent-blue` → `--cosmic-teal`
- `--accent-gold` → `--stellar-amber`
- `--accent-green` → `--nebula-green`
- `--accent-red` → `--nova-pink`

#### Files Modified

| File | Changes |
|------|---------|
| `_assets/astro-theme.css` | +500 lines — Complete visual redesign |
| `_assets/astro-utils.js` | +200 lines — Micro-interactions, easing functions |
| `_assets/starfield.js` | +80 lines — Depth layers, shooting stars |

#### Migration Notes

**For custom sliders not using `createLogSlider`/`createLinearSlider`:**
```javascript
// Call on input event to update fill indicator
AstroUtils.updateSliderProgress(sliderElement);
```

**To disable shooting stars:**
```javascript
Starfield.create(canvas, { shootingStars: false });
```

---

## [1.0.0] - 2026-01-01

### Initial Release

- 9 interactive astronomy demos: angular-size, blackbody-radiation, eclipse-geometry, em-spectrum, keplers-laws, moon-phases, parallax-distance, seasons, telescope-resolution
- Shared assets: `astro-theme.css`, `astro-utils.js`, `starfield.js`
- Dark space theme with basic styling
- KaTeX math rendering support
