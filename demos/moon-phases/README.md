# Moon Phases Demo

Interactive visualization showing how lunar phases arise from geometry, not shadows.

## Science Background

### What Causes Moon Phases?

Moon phases result from **geometry**, not Earth's shadow. The Moon is always half-lit by the Sun. What changes is *how much of that lit half we can see from Earth*.

Key insight: **Phases are about viewing angle, not shadows.**

Earth's shadow only touches the Moon during lunar eclipses (roughly twice per year). The monthly phase cycle has nothing to do with Earth blocking sunlight.

### The Phase Cycle

The Moon completes one phase cycle (synodic month) in $P_{\text{syn}} = 29.53$ days:

| Phase | Days Since New | Illumination | Rises | Sets |
|-------|----------------|--------------|-------|------|
| New Moon | 0 | 0% | ~Sunrise | ~Sunset |
| Waxing Crescent | ~4 | ~25% | Morning | Evening |
| First Quarter | ~7 | 50% | Noon | Midnight |
| Waxing Gibbous | ~11 | ~75% | Afternoon | After midnight |
| Full Moon | ~15 | 100% | Sunset | Sunrise |
| Waning Gibbous | ~18 | ~75% | Evening | Morning |
| Third Quarter | ~22 | 50% | Midnight | Noon |
| Waning Crescent | ~26 | ~25% | After midnight | Afternoon |

### Geometry Explanation

Imagine standing behind a lamp (the Sun) looking at a ball (the Moon) that someone holds in front of you:

- **Ball directly between you and lamp**: You see only the dark side (New Moon)
- **Ball to your left**: You see the right half lit (First Quarter)
- **Ball on opposite side from lamp**: You see the entire lit face (Full Moon)
- **Ball to your right**: You see the left half lit (Third Quarter)

The Moon orbits Earth, cycling through all these positions every ~30 days.

### Why "Quarter" When Half Is Lit?

"First Quarter" and "Third Quarter" refer to the Moon's position in its orbit ($\frac{1}{4}$ and $\frac{3}{4}$ of the way around), not how much is illuminated.

### Illumination Formula

The fraction of the Moon's disk that appears lit:

$$f = \frac{1 + \cos(\phi)}{2}$$

where $\phi$ is the phase angle (Moon's position relative to the Sun-Earth line):

- $\phi = 0°$: Full Moon → $\cos(0°) = 1$ → $f = 100\%$
- $\phi = 90°$: Quarter → $\cos(90°) = 0$ → $f = 50\%$
- $\phi = 180°$: New Moon → $\cos(180°) = -1$ → $f = 0\%$

## How to Use

### Orbital View (Top-Down)

The left panel shows the Sun-Earth-Moon system from above Earth's north pole:
- **Yellow rays**: Sunlight coming from the left
- **Blue sphere**: Earth (fixed at center)
- **Gray sphere**: Moon (draggable around orbit)

**Drag the Moon** around its orbit to see how its position affects the phase.

### Phase View (As Seen From Earth)

The right panel shows what the Moon looks like from Earth's surface:
- Illuminated portion shown in light gray
- Dark portion shows faint "earthshine" (sunlight reflected off Earth)

Watch this view change as you drag the Moon in the orbital view.

### Information Display

- **Phase name**: Current phase (New, Waxing Crescent, etc.)
- **Illumination**: Percentage of visible disk that's lit
- **Days since New Moon**: Position in the 29.53-day cycle

### Preset Buttons

Click to jump directly to cardinal phases:
- **New Moon**: Moon between Earth and Sun
- **First Quarter**: Moon 90° ahead of Sun
- **Full Moon**: Moon opposite the Sun
- **Third Quarter**: Moon 90° behind Sun

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Phases come from geometry, not Earth's shadow
2. The Moon is always half-lit by the Sun
3. Phase depends on the Moon's orbital position relative to the Sun
4. Rise/set times correlate with phase

### The #1 Misconception

> "Moon phases are caused by Earth's shadow falling on the Moon"

This is **wrong**. Earth's shadow causes lunar eclipses, which happen ~2× per year. Phases happen every month due to our changing view of the lit hemisphere.

**How to address this:**
1. Show the orbital view—Earth's shadow points away from the Sun
2. Note that during First Quarter, Earth's shadow points 90° away from the Moon
3. Ask: "If Earth's shadow caused phases, where would the shadow be during First Quarter?"

### Other Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "We only see one side because it doesn't rotate" | The Moon rotates exactly once per orbit (synchronous rotation) |
| "The dark part is in shadow" | It's just facing away from the Sun—same as Earth's night side |
| "Full Moon is overhead at midnight" | Full Moon is highest at midnight, but "overhead" depends on latitude |
| "Phases take different amounts of time" | Each phase transition takes ~3.7 days |

### Discussion Questions

1. If you see a crescent Moon in the evening sky, is it waxing or waning?
2. Why can't you see a New Moon? (It's up during the day, close to the Sun)
3. If the Moon rose at midnight, what phase is it?
4. Could astronauts on the Moon see "Earth phases"? What would they look like?

### In-Class Activities

**Lamp and ball demonstration:**
- Use a bright lamp (no shade) as the Sun
- Student holds a ball and slowly turns in place
- Class observes how the lit portion changes

**Phase prediction:**
- Given the Moon's rise time, predict the phase
- Given the phase, predict when the Moon is highest in the sky

**Earthshine observation:**
- Best seen during crescent phases
- The "dark" part is faintly visible—lit by Earth reflecting sunlight

## Technical Details

### Files

```
moon-phases/
├── index.html      # Standalone demo page
├── moon-phases.js  # Core visualization logic
└── README.md       # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation)
- `../_assets/starfield.js` — Animated background

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo moon-phases >}}
{{< demo moon-phases height="450px" >}}
```

### Key Constants

| Constant | Value | Description |
|----------|-------|-------------|
| $P_{\text{syn}}$ | $29.53$ days | Synodic month (phase cycle) |
| $P_{\text{sid}}$ | $27.32$ days | Sidereal month (relative to stars) |

```javascript
SYNODIC_MONTH = 29.53    // Days for one phase cycle
ORBITAL_RADIUS = 120     // Pixels (visual only)
```

## Future Features

### Version 2 Ideas

**Enhanced orbital mechanics:**
- [ ] Add Moon's actual orbital eccentricity (5.5% variation in distance)
- [ ] Show libration (Moon's wobble revealing 59% of surface over time)
- [ ] Include Earth's rotation to show Moon rise/set positions
- [ ] Add time controls (animate days/weeks)

**Rise/set time visualization:**
- [ ] Horizon line showing when Moon rises and sets
- [ ] Clock display correlating phase with rise/set times
- [ ] "What time is it?" mode—given Moon position, determine local time

**Earthshine enhancement:**
- [ ] More realistic earthshine intensity (varies with Earth's cloud cover)
- [ ] Show Earth's phase as seen from the Moon
- [ ] Earth-Moon mutual illumination diagram

**Multiple perspectives:**
- [ ] View from Moon's surface (Earth phases!)
- [ ] View from above the ecliptic
- [ ] Southern hemisphere view (phases appear "flipped")

**Educational features:**
- [ ] Quiz mode: "What phase is this?"
- [ ] "Predict the phase" challenge given rise/set time
- [ ] Misconception-buster mode explicitly showing Earth's shadow position
- [ ] Lunar calendar overlay showing real upcoming phases

### Accessibility Improvements

- [ ] Audio descriptions of phase changes
- [ ] Tactile feedback (haptic) for phase transitions
- [ ] High-contrast Moon rendering option
- [ ] Keyboard controls for orbital position

### Observation Planning Integration

- [ ] Real-time Moon phase for tonight
- [ ] "Best viewing" recommendations for current phase
- [ ] Upcoming phase dates
- [ ] Moonrise/moonset times for user's location

### Advanced Topics (Optional Display)

- [ ] Sidereal vs. synodic month explanation
- [ ] Why 29.53 days, not 27.3 days?
- [ ] Lunar nodes and their role in eclipses (link to Eclipse Geometry demo)
- [ ] Tidal locking explanation with animation

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 3
- [NASA Moon Phases](https://moon.nasa.gov/moon-in-motion/phases-eclipses-supermoons/)
- [Lunar Reconnaissance Orbiter - Moon Phases](https://svs.gsfc.nasa.gov/Gallery/moonphase.html)

---

*Part of the AstroEd Demos collection for ASTR 101*
