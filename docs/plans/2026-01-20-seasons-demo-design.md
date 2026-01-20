# Seasons Demo Design

**Date:** 2026-01-20
**Status:** Approved
**Part of:** AstroEd Demos collection

---

## Overview

Interactive visualization demonstrating that **axial tilt causes seasons, NOT distance from the Sun**—the classic misconception that even educated adults get wrong.

**Approach:** Full mechanism with embedded misconception-busters. Students see how tilt creates seasons while explicitly seeing why distance cannot explain the phenomenon.

**Scope:** This demo covers geometric/orbital causes of seasons only. A separate **Planetary Energy Budget** demo will cover flux, albedo, and greenhouse effects.

---

## Core Visualization

### Two-Panel Layout

**Left Panel: Orbital View (top-down)**
- Sun at center (yellow glow)
- Earth's orbital path (ellipse, eccentricity exaggerated for visibility)
- Earth shown with tilted axis (arrow pointing to Polaris)
- Draggable Earth around orbit OR date slider
- Current season labeled
- Distance from Sun displayed (shows it's nearly constant)

**Right Panel: Globe View (surface perspective)**
- 3D-style globe showing current hemisphere illumination
- Sunlight arrows showing incident angle
- Day/night terminator visible
- Latitude bands highlighted (Arctic, Tropic of Cancer, Equator, etc.)
- Selected latitude marker with sun angle visualization

### Visual Elements

- Axial tilt shown as tilted rotation axis with arrow to Polaris
- Sunlight rays parallel (from effectively infinite distance)
- Same-area patches at different latitudes showing flux density difference
- Hemisphere shading showing which gets more direct light

---

## Controls & Interactions

### Primary Controls

| Control | Type | Range | Default |
|---------|------|-------|---------|
| **Date/Position** | Slider or drag | Jan 1 – Dec 31 | Mar 21 (equinox) |
| **Axial Tilt** | Slider | 0° – 90° | 23.5° (Earth) |
| **Latitude** | Slider | -90° – +90° | 40°N |

### Preset Buttons

**Season Presets:**
- March Equinox (Mar 21)
- June Solstice (Jun 21)
- September Equinox (Sep 22)
- December Solstice (Dec 21)

**Planet Presets:**
| Planet | Axial Tilt | Notes |
|--------|------------|-------|
| Earth | 23.5° | Default, familiar seasons |
| Mars | 25.2° | Similar to Earth |
| Uranus | 97.8° | Extreme—poles face Sun |
| Venus | 177.4° | Retrograde, nearly upside-down |
| Jupiter | 3.1° | Almost no tilt—no seasons |
| Saturn | 26.7° | Earth-like seasons |

Planet presets change the tilt slider value AND update the globe appearance (colors, surface features) to match the selected planet.

### Animation

- **Animate Year** button: Watch Earth orbit with seasons changing
- Speed control for animation
- Pause at solstices/equinoxes option

---

## Misconception Mode

### Hemisphere Comparison (Primary Debunk)

Show Northern and Southern hemispheres side-by-side:
- When it's summer in the North, it's winter in the South
- Both hemispheres are the SAME distance from the Sun
- If distance caused seasons, both hemispheres would have summer simultaneously

Visual: Split-screen or toggle showing "If distance caused seasons..." vs "What actually happens"

### Distance Display

- Show Earth-Sun distance throughout the year
- Highlight that Earth is CLOSEST to Sun in January (Northern winter)
- This directly contradicts the distance misconception

---

## Quantitative Readouts

### Day Length Display
Shows hours of daylight at selected latitude for current date.

**Formula:**
```
cosH = -tan(latitude) × tan(sunDeclination)
```

Where H is the half-day angle. Special cases:
- If cosH < -1: 24 hours (midnight sun)
- If cosH > 1: 0 hours (polar night)
- Day length = 2H / 15 hours

### Sun Altitude Display
Shows maximum sun altitude at noon for selected latitude.

**Formula:**
```
altitude = 90° - |latitude - sunDeclination|
```

Where sunDeclination ranges from -23.5° to +23.5° through the year.

### Readout Panel
| Quantity | Display |
|----------|---------|
| Date | "June 21" |
| Season (N) | "Summer" |
| Season (S) | "Winter" |
| Day length | "14h 52m" |
| Sun altitude | "73.5°" |
| Earth-Sun distance | "1.017 AU" |

---

## Overlay Toggles

Five toggleable overlays for multi-purpose teaching:

| Overlay | Default | Purpose |
|---------|---------|---------|
| **Celestial Equator** | OFF | Shows Earth's equator projected onto sky |
| **Ecliptic** | OFF | Shows Sun's apparent path / Earth's orbital plane |
| **Latitude Bands** | ON | Arctic/Antarctic circles, tropics |
| **Day/Night Terminator** | ON | Shows current illumination boundary |
| **Hour Angle Grid** | OFF | For advanced discussion of solar time |

Overlays allow the same demo to serve multiple lectures:
- Seasons lecture: Latitude bands + terminator ON
- Celestial sphere lecture: Equator + ecliptic ON
- Solar time lecture: Hour angle grid ON

---

## Technical Implementation

### File Structure

```
demos/seasons/
├── index.html      # Standalone demo page
├── seasons.js      # Core visualization logic
├── planets.json    # Planet preset data (extensible)
└── README.md       # Pedagogical documentation
```

### Dependencies

Shared assets from `demos/_assets/`:
- `astro-theme.css` — Dark space theme
- `astro-utils.js` — Animation loop, formatting
- `starfield.js` — Animated background

### Key Calculations

```javascript
// Sun's declination for a given day of year
function getSunDeclination(dayOfYear) {
  // Simplified formula (accurate to ~1°)
  const daysFromEquinox = dayOfYear - 80; // March 21 ≈ day 80
  return 23.5 * Math.sin(2 * Math.PI * daysFromEquinox / 365);
}

// Day length at latitude φ when Sun is at declination δ
function getDayLength(latitude, sunDeclination) {
  const φ = latitude * Math.PI / 180;
  const δ = sunDeclination * Math.PI / 180;
  const cosH = -Math.tan(φ) * Math.tan(δ);

  if (cosH < -1) return 24;  // Midnight sun
  if (cosH > 1) return 0;    // Polar night

  const H = Math.acos(cosH) * 180 / Math.PI;
  return 2 * H / 15;  // Hours of daylight
}

// Sun's maximum altitude at noon
function getSunAltitude(latitude, sunDeclination) {
  return 90 - Math.abs(latitude - sunDeclination);
}

// Earth-Sun distance (AU) for day of year
function getEarthSunDistance(dayOfYear) {
  // Perihelion around Jan 3 (day 3), e ≈ 0.017
  const daysFromPerihelion = dayOfYear - 3;
  const angle = 2 * Math.PI * daysFromPerihelion / 365;
  return 1 - 0.017 * Math.cos(angle);  // Approximate
}
```

### Planet Data Structure

```json
{
  "planets": [
    {
      "name": "Earth",
      "tilt": 23.5,
      "color": "#4a90d9",
      "features": "continents",
      "description": "Familiar seasons, 23.5° tilt"
    },
    {
      "name": "Mars",
      "tilt": 25.2,
      "color": "#c1440e",
      "features": "mars",
      "description": "Similar to Earth, longer year"
    },
    {
      "name": "Uranus",
      "tilt": 97.8,
      "color": "#b5e3e3",
      "features": "banded",
      "description": "Extreme tilt—poles face Sun"
    }
  ]
}
```

---

## Pedagogical Notes

### Learning Objectives

Students will understand:
1. Axial tilt, not distance, causes seasons
2. The same hemisphere facing toward the Sun gets more direct light
3. When Northern hemisphere has summer, Southern has winter
4. Day length and sun angle both contribute to seasonal heating
5. Different planets have different seasonal patterns based on their tilt

### Key Misconception Addressed

> "Seasons are caused by Earth being closer to the Sun in summer"

**Why this is wrong:**
1. Earth is closest to Sun in January (Northern winter)
2. If true, both hemispheres would have summer simultaneously
3. The distance variation (±1.7%) is too small to explain temperature swings

### Discussion Questions

1. If Earth had no axial tilt, what would seasons be like?
2. Why does Uranus have such extreme seasons?
3. Mars has similar tilt to Earth—how do its seasons differ?
4. Why is the equator warm year-round despite the same tilt?

---

## Future Enhancements

- [ ] City presets (San Diego, Sydney, Tromsø) with local day length
- [ ] Historical/cultural markers (solstice celebrations)
- [ ] Export day length curve for selected latitude
- [ ] Compare two latitudes side-by-side
- [ ] Link to Planetary Energy Budget demo for climate effects

---

## Related Demos

- **Planetary Energy Budget** (planned): Flux, albedo, greenhouse effect
- **Eclipse Geometry** (existing): Uses similar orbital visualization
- **Angular Size** (existing): Related distance concepts

---

*Part of the AstroEd Demos collection for ASTR 101*
