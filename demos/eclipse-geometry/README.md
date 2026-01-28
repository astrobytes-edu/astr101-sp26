# Eclipse Geometry Demo

Interactive visualization explaining why eclipses don't happen every month — and simulating their frequency over centuries.

## Science Background

### Why Not Every Month?

If the Moon orbits Earth every ~29.5 days, passing between Earth and Sun (New Moon) and behind Earth (Full Moon) each month, why don't we see eclipses every two weeks?

**Answer: The Moon's orbit is tilted 5.145° relative to Earth's orbital plane (the ecliptic).**

This small tilt means the Moon usually passes *above* or *below* the Sun (at New Moon) or Earth's shadow (at Full Moon). Eclipses require precise alignment that only occurs when:

1. The phase is right (New Moon for solar, Full Moon for lunar)
2. The Moon is near a **node** (where its orbit crosses the ecliptic)

### Orbital Tilt and Nodes

The Moon's orbit is tilted $i = 5.145°$ from the ecliptic plane. The two points where the Moon's orbit crosses the ecliptic are called **nodes**:

- **Ascending node**: Moon crosses from south to north of the ecliptic
- **Descending node**: Moon crosses from north to south

Eclipses can only occur when the Moon is within $\sim 18°$ of a node (for solar) or $\sim 12°$ of a node (for lunar) during the appropriate phase.

### Node Regression

The nodes are not fixed — they slowly drift westward (regress) around the ecliptic, completing one full cycle in $P_{\text{node}} = 18.6$ years. This is why eclipse seasons shift earlier by about $19$ days each year.

The regression rate is approximately $19.3°$ per year:

$$\dot{\Omega} = -\frac{360°}{18.6 \text{ yr}} \approx -19.3°/\text{yr}$$

### Eclipse Frequency

With the real $5.1°$ tilt:

| Eclipse Type | Per Year (avg) | Notes |
|--------------|----------------|-------|
| All solar | $2$–$5$ | At least 2 guaranteed |
| Total/annular solar | $\sim 0.5$ | One every $\sim 18$ months |
| All lunar | $0$–$3$ | None some years |
| Total lunar | $\sim 0.3$ | One every $\sim 2.5$ years |

**Why more solar than lunar?** The Moon's shadow is small, so any solar eclipse is only visible from a narrow path. Lunar eclipses are visible from half the Earth. But geometrically, solar eclipses occur more often because the eclipse "zone" for blocking the Sun is slightly larger than for entering Earth's shadow.

### Eclipse Limits

Eclipses occur when the Moon is sufficiently close to a node during the right phase:

| Type | Distance from Node $\Delta\lambda$ | Height Above Ecliptic $\beta$ |
|------|-----------------------------------|-------------------------------|
| Total solar | $< 10.5°$ | $< 0.94°$ |
| Partial solar | $< 18.5°$ | $< 1.63°$ |
| Total lunar | $< 4.6°$ | $< 0.41°$ |
| Partial lunar | $< 12.2°$ | $< 1.09°$ |

The relationship between distance from node and ecliptic height:

$$\beta = i \cdot \sin(\Delta\lambda)$$

where $i = 5.145°$ is the orbital inclination. The tighter requirements for total eclipses explain their rarity.

### If the Tilt Were Zero...

With no orbital tilt:
- Solar eclipse every New Moon (~monthly)
- Lunar eclipse every Full Moon (~monthly)
- Total eclipses much more common

Use the **tilt slider** to explore this counterfactual scenario.

## How to Use

### Views

**Top-down view (left):**
- Earth at center, Moon's orbit shown as a circle
- Golden markers show the two nodes where orbit crosses the ecliptic
- Dashed line shows the ecliptic plane
- Drag the Moon around its orbit

**Side view (right):**
- Shows the Moon's height above or below the ecliptic
- Sinusoidal path represents one complete orbit
- Height indicator shows current displacement in degrees

### Controls

**Orbital Tilt slider:**
- Adjust from 0° to 10°
- Real value is 5.1°
- At 0°, eclipses occur every month
- Higher tilts make eclipses rarer

**Phase buttons:**
- **New Moon**: Position for potential solar eclipse
- **Full Moon**: Position for potential lunar eclipse

**Animation buttons:**
- **Animate 1 Month**: Watch one complete lunar orbit
- **Animate 1 Year**: Watch ~12.4 orbits with node regression

### Long-Term Simulation

**Years slider:** Select simulation duration (1–1000 years, logarithmic scale)

**Run Simulation:** Counts all eclipses over the selected period:
- Total solar and partial solar (shown separately)
- Total lunar and partial lunar (shown separately)

**Show Log:** Displays a table of every eclipse with:
- Year (decimal)
- Type (Total Solar, Partial Lunar, etc.)
- Moon's height from ecliptic at that moment

### Eclipse Status Indicator

The colored banner shows current conditions:
- **Red "NO ECLIPSE"**: Moon too far from ecliptic or wrong phase
- **Gold "TOTAL/PARTIAL SOLAR ECLIPSE"**: Solar eclipse conditions met
- **Green "TOTAL/PARTIAL LUNAR ECLIPSE"**: Lunar eclipse conditions met

## Pedagogical Notes

### Learning Objectives

Students should understand:
1. Eclipses require alignment of phase AND orbital position
2. The ~5° orbital tilt prevents monthly eclipses
3. Nodes are the key locations where eclipses become possible
4. Eclipse frequency follows predictable statistical patterns

### Key Concept: Two Conditions Required

An eclipse needs **both**:
1. **Right phase**: New Moon (solar) or Full Moon (lunar)
2. **Near a node**: Moon close to crossing the ecliptic

Either condition alone is insufficient. This is why eclipses are relatively rare despite favorable phases occurring monthly.

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "The Moon's orbit is very tilted" | Only 5° — almost in the ecliptic plane |
| "Eclipses are random" | They follow precise patterns (Saros cycles) |
| "Solar eclipses are rarer than lunar" | More solar eclipses occur, but each is visible from less of Earth |
| "The Moon's orbit is fixed" | Nodes regress, completing a cycle every 18.6 years |

### Discussion Questions

1. If you could adjust the Moon's orbital tilt, what value would make eclipses monthly?
2. Why does the eclipse "season" occur twice per year?
3. Why are total solar eclipses rarer than partial solar eclipses?
4. The nodes complete one full regression in 18.6 years. How does this relate to the Saros cycle (18 years, 11 days)?

### In-Class Activities

**Simulation experiments:**
- Run 100-year simulation with real tilt (5.1°) — note eclipse counts
- Reduce tilt to 0° and re-run — observe dramatic increase
- Increase tilt to 10° — eclipses become very rare

**Pattern discovery:**
- Run 10-year simulation with log visible
- Notice eclipses cluster in "seasons" ~6 months apart
- Calculate average eclipses per year

**Critical thinking:**
- Given the eclipse log, can students predict when the next eclipse will occur?
- What patterns do they notice in the spacing?

## Technical Details

### Files

```
eclipse-geometry/
├── index.html           # Standalone demo page
├── eclipse-geometry.js  # Core visualization and simulation logic
└── README.md            # This file
```

### Dependencies

- `../_assets/astro-theme.css` — Shared dark space theme
- `../_assets/astro-utils.js` — Utilities (formatting, animation)
- `../_assets/starfield.js` — Animated background

### Embedding

Use the Quarto shortcode:
```markdown
{{< demo eclipse-geometry >}}
{{< demo eclipse-geometry height="600px" >}}
```

### Key Constants

| Parameter | Symbol | Value | Description |
|-----------|--------|-------|-------------|
| Orbital tilt | $i$ | $5.145°$ | Moon's inclination to ecliptic |
| Node regression | $\dot{\Omega}$ | $-19.3°$/yr | Westward drift of nodes |
| Synodic month | $P_{\text{syn}}$ | $29.53$ days | New Moon to New Moon |
| Draconic month | $P_{\text{dra}}$ | $27.21$ days | Node to same node |

**Eclipse thresholds** (maximum $\beta$ for eclipse):

| Type | Threshold |
|------|-----------|
| Total solar | $< 0.94°$ |
| Partial solar | $< 1.63°$ |
| Total lunar | $< 0.41°$ |
| Partial lunar | $< 1.09°$ |

```javascript
// Implementation values
ORBITAL_TILT = 5.145        // Degrees (adjustable via slider)
NODE_REGRESSION = 19.3      // Degrees per year
SYNODIC_MONTH = 29.53       // Days
MONTHS_PER_YEAR = 12.37     // Synodic months per solar year
```

### Simulation Algorithm

The simulation steps through each synodic month:
1. Calculate node position (accounting for regression)
2. At each New Moon, check if Moon's ecliptic height < solar threshold
3. At each Full Moon, check if Moon's ecliptic height < lunar threshold
4. Accumulate counts by eclipse type
5. Log each eclipse with timestamp and geometry

## Future Features

### Version 2 Ideas

**Enhanced visualization:**
- [ ] Shadow cone visualization during eclipses
- [ ] Earth's actual shadow (umbra + penumbra) for lunar eclipses
- [ ] Path of totality projection on Earth for solar eclipses
- [ ] 3D view option (three.js) for better spatial understanding

**Realistic orbital mechanics:**
- [ ] Elliptical orbits (lunar eccentricity affects eclipse types)
- [ ] Distinguish annular vs. total solar eclipses (Moon distance matters)
- [ ] Include lunar apogee/perigee effects on eclipse magnitude
- [ ] Seasonal variation in eclipse visibility

**Saros cycle exploration:**
- [ ] Highlight Saros series in eclipse log
- [ ] Show how similar eclipses repeat every 18 years, 11 days
- [ ] Interactive Saros family tree
- [ ] Predict next eclipse in a series

**Historical and future eclipses:**
- [ ] Load real eclipse data from NASA catalogs
- [ ] Show historical eclipses (e.g., 1919 Eddington expedition)
- [ ] Upcoming eclipse preview with dates and locations
- [ ] "When is the next eclipse visible from my location?"

**Advanced simulation options:**
- [ ] Export eclipse log as CSV for data analysis
- [ ] Monte Carlo mode with randomized starting conditions
- [ ] Comparison mode (run two simulations with different parameters)
- [ ] Speed control for long simulations

### Educational Enhancements

- [ ] Guided tutorial mode explaining each component
- [ ] Quiz: "Will there be an eclipse this month?" given Moon position
- [ ] Challenge mode: predict eclipse count before running simulation
- [ ] Misconception-buster explanations embedded in UI

### Accessibility Improvements

- [ ] Screen reader announcements for eclipse events
- [ ] Keyboard controls for all interactions
- [ ] Color-blind friendly eclipse indicators (patterns + colors)
- [ ] Reduced motion mode for animations

### Integration Ideas

- [ ] Link to Moon Phases demo (explain phase prerequisite)
- [ ] Link to Angular Size demo (explain Sun-Moon size coincidence)
- [ ] Real-time indicator of current node positions
- [ ] Calendar integration for eclipse planning

### Research Extensions

- [ ] Tidal effects on Moon's orbital evolution
- [ ] Earth-Moon distance over geological time (eclipses in the past/future)
- [ ] Eclipse frequency on other planets (Mars, Jupiter's moons)
- [ ] Binary star eclipse simulations

## References

- Freedman, Geller & Kaufmann, *Universe*, 11th Edition, Chapter 3
- [NASA Eclipse Website](https://eclipse.gsfc.nasa.gov/)
- [Fred Espenak's Eclipse Pages](http://www.eclipsewise.com/)
- Meeus, Jean. *Astronomical Algorithms*, Chapter 54 (Eclipse calculations)

---

*Part of the AstroEd Demos collection for ASTR 101*
