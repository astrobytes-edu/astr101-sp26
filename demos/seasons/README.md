# Seasons Demo

Interactive visualization demonstrating that **axial tilt causes seasons, NOT distance from the Sun**—the classic misconception that even educated adults get wrong.

## Science Background

### Why Tilt Causes Seasons (Not Distance)

Earth's seasons arise from the tilt of its rotational axis, not from changes in distance from the Sun. In fact, Earth is **closest to the Sun in January** (Northern winter)—the opposite of what the distance misconception predicts.

**Key insight: The same hemisphere that faces toward the Sun receives more direct sunlight.**

When the Northern Hemisphere is tilted toward the Sun (summer), sunlight arrives at a steep angle and concentrates energy per unit area. When tilted away (winter), sunlight arrives at a shallow angle and spreads over a larger area. Meanwhile, the Southern Hemisphere experiences the opposite season simultaneously—both at essentially the same distance from the Sun.

### The Geometry of Sunlight at Different Latitudes

The intensity of sunlight per unit area depends on the angle at which it strikes the surface:

$$\text{Intensity} \propto \cos(\text{incident angle})$$

At a given latitude, the Sun's maximum elevation angle above the horizon at noon varies with the season:

$$\text{altitude} = 90° - |\text{latitude} - \text{sunDeclination}|$$

The higher the Sun in the sky, the steeper the incident angle and the more concentrated the energy.

### Key Formulas

**Sun's declination for a given day of year:**

$$\delta = 23.5° \times \sin\left(\frac{2\pi(d-80)}{365}\right)$$

where $d$ is the day number (1–365) and the baseline is March 21 (day 80) at the vernal equinox.

**Day length at latitude $\phi$ when Sun is at declination $\delta$:**

$$\cos(H) = -\tan(\phi) \times \tan(\delta)$$

where $H$ is the half-day angle. Special cases:
- If $\cos(H) < -1$: 24 hours (midnight sun)
- If $\cos(H) > 1$: 0 hours (polar night)
- Day length = $\frac{2H}{15}$ hours

**Sun's maximum altitude at noon:**

$$\text{altitude} = 90° - |\phi - \delta|$$

**Earth-Sun distance (in AU) for day of year:**

$$r = 1 - 0.017 \cos\left(\frac{2\pi(d-3)}{365}\right)$$

This shows Earth is closest (perihelion) around January 3 and farthest (aphelion) around July 4. The $\pm 1.7\%$ variation is too small to explain seasonal temperature swings of 20–40°C.

## How to Use

### Orbital View (Left Panel)

The left panel shows Earth's orbit around the Sun as viewed from above:

- **Sun**: Yellow glow at center
- **Earth's orbit**: Ellipse with exaggerated eccentricity for visibility
- **Earth**: Shown with tilted rotation axis (arrow pointing to Polaris)
- **Current position**: Labeled with date and season names for both hemispheres
- **Distance display**: Shows Earth-Sun distance in AU (notice it barely changes)

Drag Earth around its orbit or use the date slider to move through the year.

### Globe View (Right Panel)

The right panel shows Earth from space with current illumination:

- **3D globe**: Shaded to show which hemisphere receives more direct light
- **Sunlight rays**: Parallel rays showing incident angle
- **Terminator**: The day/night boundary
- **Latitude bands**: Arctic circles, tropics, equator clearly marked
- **Selected latitude**: Highlighted with sun angle visualization showing the difference between seasons

### Primary Controls

| Control | Type | Range | Default |
|---------|------|-------|---------|
| **Date/Position** | Slider | Jan 1 – Dec 31 | Mar 21 (equinox) |
| **Axial Tilt** | Slider | 0° – 90° | 23.5° (Earth) |
| **Latitude** | Slider | –90° – +90° | 40°N |

**Why 40°N?** This latitude passes through Philadelphia, Denver, Madrid, and Beijing—cities students may recognize. At 40°N, seasons are distinct (not too polar, not too equatorial), making it an ideal teaching reference.

Adjust each to explore how seasons change.

### Season Presets

Quick-jump buttons to the cardinal seasons:
- **March Equinox** (Mar 21): Equal day and night
- **June Solstice** (Jun 21): Longest day in Northern Hemisphere
- **September Equinox** (Sep 22): Equal day and night again
- **December Solstice** (Dec 21): Shortest day in Northern Hemisphere

### Planet Presets

Compare Earth's seasons to other worlds by changing the axial tilt:

| Planet | Axial Tilt | Notes |
|--------|------------|-------|
| **Earth** | 23.5° | Familiar seasons, moderate tilt |
| **Mars** | 25.2° | Similar to Earth, longer year |
| **Saturn** | 26.7° | Earth-like seasons |
| **Jupiter** | 3.1° | Almost no tilt—minimal seasons |
| **Uranus** | 97.8° | Extreme tilt—poles face Sun for part of orbit |
| **Venus** | 177.4° | Retrograde rotation, nearly upside-down |

Each preset updates the tilt slider and globe appearance to reflect the chosen world.

### Animation

- **Animate Year** button: Watch Earth orbit through a complete year with seasons changing smoothly
- **Speed control**: Adjust animation playback speed
- **Pause at solstices/equinoxes**: Option to hold at key dates for examination

### Overlay Toggles

Five optional overlays for multi-purpose teaching:

| Overlay | Default | Purpose |
|---------|---------|---------|
| **Celestial Equator** | OFF | Shows Earth's equator projected onto sky |
| **Ecliptic** | OFF | Shows Sun's apparent path / Earth's orbital plane |
| **Latitude Bands** | ON | Arctic/Antarctic circles, tropics |
| **Day/Night Terminator** | ON | Shows current illumination boundary |
| **Hour Angle Grid** | OFF | For advanced discussion of solar time |

## Quantitative Readouts

### Information Panel

Real-time displays for the selected date and latitude:

| Quantity | Example |
|----------|---------|
| **Date** | "June 21" |
| **Season (N)** | "Summer" |
| **Season (S)** | "Winter" |
| **Day length** | "14h 52m" |
| **Sun altitude** | "73.5°" |
| **Earth-Sun distance** | "1.017 AU" |

### Hemisphere Comparison Display

Side-by-side comparison showing Northern and Southern hemispheres:
- When it's summer in the North, it's winter in the South
- Both hemispheres are at the **same distance from the Sun**
- This directly contradicts the distance misconception

## Pedagogical Notes

### Learning Objectives

Students will understand:
1. **Axial tilt, not distance, causes seasons**
2. The same hemisphere facing toward the Sun receives more direct sunlight
3. When Northern hemisphere has summer, Southern has winter
4. Day length and sun angle both contribute to seasonal heating
5. Different planets have different seasonal patterns based on their axial tilt

### The #1 Misconception

> "Seasons are caused by Earth being closer to the Sun in summer"

**Why this is wrong:**

| Observation | Reality |
|-------------|---------|
| Earth is closest to Sun in... | **January** (Northern winter) |
| Distance variation | Only ±1.7% (too small for 20–40°C swings) |
| Both hemispheres same distance | Yet have opposite seasons simultaneously |
| What actually matters | Incident angle of sunlight |

### Other Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "Seasons happen because of Earth's elliptical orbit" | Eccentricity is only 1.7%—too small to explain seasons |
| "Summer is the same season everywhere on Earth" | Opposite in Northern vs. Southern hemispheres |
| "Equator is coldest because it's farthest from the Sun" | Equator is warmest year-round due to direct sunlight |
| "Polar regions are always dark" | Poles have midnight sun (24h daylight) in summer |
| "Day length doesn't vary near the equator" | True—day/night are always ~12h at the equator |

### Discussion Questions

1. **If Earth had no axial tilt**, what would seasons be like?
   - *Answer: No seasons. Temperature would depend only on latitude, and would be constant year-round.*

2. **Why does Uranus have such extreme seasons?**
   - *Answer: Its 98° tilt means poles face the Sun directly for half its 84-year orbit.*

3. **Mars has similar tilt to Earth—how do its seasons differ?**
   - *Answer: Longer (Mars year = 687 days) and more extreme (eccentricity = 9.3% vs. Earth's 1.7%).*

4. **Why is the equator warm year-round despite the same tilt?**
   - *Answer: The tilt angle (23.5°) means the Sun is never more than 23.5° away from directly overhead at the equator, so incident angles are always steep.*

5. **When is the next solstice or equinox, and which hemisphere benefits?**
   - *Answer: Encourages students to predict using the demo.*

### In-Class Activities

**Hemisphere comparison challenge:**
- Set date to June 21
- Ask: "Why is it summer in the North but winter in the South?"
- Have students identify why distance cannot explain this

**Tilt variation experiment:**
- Set tilt to 0° and observe (no seasons!)
- Gradually increase tilt and watch seasons intensify
- Discuss how extreme tilts (Jupiter, Uranus) would affect habitable zones

**Day length prediction:**
- Set latitude to 60°N
- Ask students to predict day length on June 21
- Verify with the demo; discuss why high latitudes have longer summer days

**Latitude comparison:**
- Select three latitudes: Equator (0°), Mid-latitude (40°), Polar (70°)
- Compare day length and sun altitude through the year
- Plot results to see seasonal variation by latitude

## Technical Details

### Files

```
demos/seasons/
├── index.html      # Standalone demo page
├── seasons.js      # Core visualization logic
├── planets.json    # Planet preset data
└── README.md       # This file
```

### Dependencies

Shared assets from `demos/_assets/`:
- `astro-theme.css` — Dark space theme with astronomy styling
- `astro-utils.js` — Animation loop, number formatting, utilities
- `starfield.js` — Animated starfield background

### Embedding in Quarto

Use the demo shortcode in Quarto slides or readings:

```markdown
{{< demo seasons >}}
{{< demo seasons height="500px" >}}
```

### Key Constants

| Constant | Symbol | Value | Description |
|----------|--------|-------|-------------|
| Axial tilt | $\Theta$ | 23.5° | Earth's current tilt |
| Eccentricity | $e$ | 0.0167 | Earth's orbital eccentricity |
| Perihelion date | $d_p$ | Jan 3 | Day of closest approach |
| Vernal equinox | $d_0$ | Mar 21 | Reference date (day 80) |
| Solar declination amplitude | $\delta_{\max}$ | 23.5° | Max deviation from ecliptic |

### Implementation Constants

```javascript
// Orbital mechanics
AXIAL_TILT = 23.5           // Degrees (adjustable)
ECCENTRICITY = 0.0167
PERIHELION_DAY = 3           // Day of year

// Coordinates
EARTH_RADIUS = 100           // Pixels (visual only)
ORBITAL_RADIUS = 300         // Pixels
AU_IN_PIXELS = 2             // Scale for distance display

// Thresholds
EQUINOX_TOLERANCE = 1        // Day (for identifying cardinal dates)
```

## Future Features

### Version 2 Enhancements

**City presets:**
- [ ] Quick-select for major cities (San Diego, Sydney, Tromsø, etc.)
- [ ] Display local day length and seasonal temperature ranges
- [ ] Show sunrise/sunset times for comparison

**Export capabilities:**
- [ ] Export day length curve for selected latitude
- [ ] CSV export of seasonal data (temperature, daylight hours, altitude)
- [ ] Printable observing guides

**Comparison mode:**
- [ ] Compare two latitudes side-by-side
- [ ] Show day length curves overlaid
- [ ] Highlight seasonal differences

**Integration with Planetary Energy Budget demo:**
- [ ] Link to radiation, albedo, and greenhouse effects
- [ ] Show how day length + sun angle → thermal energy input
- [ ] Visualize atmospheric effects on heating

**Advanced features:**
- [ ] Historical eclipse markers on orbit
- [ ] Real-time mode (today's date)
- [ ] Precession visualization (axial precession cycle: 26,000 years)
- [ ] Compare to theoretical "no tilt" Earth

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 2
- [NASA: Why Do We Have Seasons?](https://spaceplace.nasa.gov/all_about_Earth/en/)
- [NOAA: Earth's Tilt and Seasons](https://www.ncei.noaa.gov/products/climate-indices-monthly/earth-s-tilt-seasons)
- [ESA: Understanding Seasons](https://www.esa.int/Science_Exploration/Space_Science/Why_do_we_have_seasons)
- [Stellarium](https://stellarium.org/) — Open-source planetarium software for verification

---

*Part of the AstroEd Demos collection for ASTR 101*
