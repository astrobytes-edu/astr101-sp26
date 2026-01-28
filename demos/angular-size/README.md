# Angular Size Demo

Interactive visualization demonstrating how angular size depends on both physical size and distance.

## Science Background

### The Angular Size Formula

An object's **angular size** (how large it appears in the sky) depends on two factors:

$$\theta_{\text{rad}} = \frac{d}{D}$$

where $d$ is the physical diameter and $D$ is the distance.

In degrees:

$$\theta_{\text{deg}} = \frac{d}{D} \times \frac{180°}{\pi} \approx \frac{57.3° \times d}{D}$$

For small angles (most astronomical objects), this simplifies to the **small angle formula**:

$$\theta_{\text{arcsec}} = \frac{206265 \times d}{D}$$

where $\theta$ is in arcseconds when $d$ and $D$ use the same units.

This explains why the Sun and Moon appear nearly the same size in our sky despite vastly different physical sizes:

| Object | Diameter $d$ | Distance $D$ | Angular Size $\theta$ |
|--------|--------------|--------------|----------------------|
| Sun | 1,392,000 km | 150,000,000 km | $\sim 0.53°$ |
| Moon | 3,474 km | 384,400 km | $\sim 0.52°$ |

The Sun is $\sim 400\times$ larger but also $\sim 400\times$ farther away, producing nearly identical angular sizes — the cosmic coincidence that makes total solar eclipses possible.

### Common Angular Size References

| Object | Angular Size |
|--------|--------------|
| Your thumb at arm's length | $\sim 2°$ |
| Your fist at arm's length | $\sim 10°$ |
| Full Moon | $\sim 0.5°$ |
| Jupiter (at opposition) | $\sim 50''$ |
| Venus (at closest) | $\sim 1'$ |
| Andromeda Galaxy (bright disk) | $\sim 3°$ ($6\times$ Moon's width!) |

### Units

- **Degrees (°)**: Full circle = $360°$
- **Arcminutes (')**: $1° = 60'$
- **Arcseconds (")**: $1' = 60''$ (thus $1° = 3600''$)

The Moon spans about $30'$ (arcminutes). Most stars appear as points because their angular sizes are tiny fractions of an arcsecond.

## How to Use

### Basic Interaction

1. **Distance slider**: Drag to move the object closer or farther
2. **Size slider**: Drag to change the object's physical diameter
3. **Angular size display**: Shows the resulting apparent size in appropriate units

### Presets

Click preset buttons to load real astronomical objects:
- **Sun**: Our star at 1 AU
- **Moon**: Earth's satellite at mean distance
- **Jupiter**: Gas giant at opposition (~4.2 AU)
- **Venus**: At closest approach (~0.28 AU)
- **Mars**: At opposition (~0.52 AU)
- **Andromeda**: Nearest major galaxy (~2.5 Mly)

### Easter Eggs

Hidden presets demonstrate angular size with everyday objects:
- Basketball at 10 meters
- Soccer ball across a field
- Quarter at arm's length
- Your thumb (the 2° reference)
- Jet airplane at cruising altitude
- International Space Station overhead

### Moon Time Modes (Moon preset only)

When the **Moon** preset is selected, the demo offers two time-related controls:

1. **Orbit (perigee ↔ apogee):** shows the Moon’s *monthly* distance variation and how that changes angular size.
2. **Recession (Myr from today):** a clearly-labeled **toy model** that linearly extrapolates the Moon’s distance using today’s mean recession rate (the real rate varies over time).

This supports the teaching point that as the Moon slowly recedes, its angular size decreases, making “Moon bigger than Sun” alignment less likely in the far future.

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Angular size is NOT the same as physical size
2. Distance and diameter both affect apparent size
3. The same angular size can result from different size/distance combinations
4. Why the Sun-Moon coincidence enables total solar eclipses

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Bigger objects look bigger" | Only if at the same distance |
| "The Moon is huge" | It spans only 0.5° of sky |
| "Stars are tiny" | Stars are huge but incredibly distant |
| "Andromeda is small" | It spans 6× the Moon's width |

### Discussion Questions

1. If you moved the Moon to half its current distance, what would happen to its angular size?
2. Why do we measure distant galaxies in degrees but planets in arcseconds?
3. The Sun is slowly expanding. How does this affect future total solar eclipses?
4. Why do astronomers care so much about a telescope's angular resolution?

### In-Class Activities

**Quick demonstrations:**
- Have students extend their thumb at arm's length — it covers about $2°$ of sky
- Ask: "How many full moons would fit across your thumb?" (Answer: $\sim 4$)
- Compare angular sizes: fist at arm's length ($\sim 10°$) vs. the Big Dipper ($\sim 25°$)

## Technical Details

### Files

```
angular-size/
├── index.html      # Standalone demo page
├── angular-size.js # Core visualization logic
├── angular-size.css # Styles for this demo
└── README.md       # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation, constants)
- `../_assets/starfield.js` — Animated background

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo angular-size >}}
{{< demo angular-size height="500px" >}}
```

### Extending Presets

Edit the `PRESETS` object in `angular-size.js` to add objects (values are in km for both diameter and distance).

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] Side-by-side comparison mode (compare two objects simultaneously)
- [ ] Overlay mode showing object against Moon for scale
- [ ] "What would this look like from..." mode (view from different planets)
- [ ] Angular size ruler overlay on the visualization

**Extended object library:**
- [ ] Deep sky objects (Orion Nebula, Pleiades, globular clusters)
- [ ] Exoplanets (angular size if we could see them)
- [ ] Historical objects (Tycho's supernova, Betelgeuse)
- [ ] Satellites (Hubble, James Webb at L2)

**Educational features:**
- [ ] Quiz mode: "Which is larger in angular size?"
- [ ] Guided tour explaining the Sun-Moon coincidence
- [ ] Interactive proof of the angular size formula
- [ ] Resolution limit visualization (what telescopes can resolve)

**Time evolution expansion:**
- [ ] Solar system formation (protoplanetary disk angular sizes)
- [ ] Stellar evolution (red giant Sun's future angular size from Earth)
- [ ] Universe expansion (angular size-redshift relation)

### Accessibility Improvements

- [ ] Screen reader descriptions of angular relationships
- [ ] Keyboard-only navigation for all controls
- [ ] High-contrast mode option
- [ ] Reduced motion preference support

### Integration Ideas

- [ ] Export current view as image for student notes
- [ ] Share link with preset configuration
- [ ] Embed data in Jupyter notebooks via iframe
- [ ] API for programmatic control (for automated demonstrations)

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 1
- [Angular Diameter - Wikipedia](https://en.wikipedia.org/wiki/Angular_diameter)
- [NASA Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)

---

*Part of the AstroEd Demos collection for ASTR 101*
