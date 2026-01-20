# Instructor Guide: Interactive Demos

**For:** ASTR 101 instructors
**Location:** This file is in `demos/_instructor/` and is NOT published to students.

---

## Using Demos in Class

These demos are designed for flexibility:

- **Lecture mode**: Open fullscreen on the projector, demonstrate concepts live
- **Student exploration**: Share links for homework or in-class activities
- **Embedded in activities**: Demos appear inline in worksheets using shortcodes

### Direct Links for Students

Share these URLs directly:

| Demo | URL |
|------|-----|
| Angular Size | `https://[site]/demos/angular-size/` |
| Moon Phases | `https://[site]/demos/moon-phases/` |
| Eclipse Geometry | `https://[site]/demos/eclipse-geometry/` |
| Seasons | `https://[site]/demos/seasons/` |

---

## Embedding in Quarto Documents

Use the `demo` shortcode to embed any demo in activities, readings, or slides:

```markdown
{{< demo angular-size >}}
{{< demo moon-phases height="400px" >}}
{{< demo eclipse-geometry height="600px" >}}
{{< demo seasons height="600px" >}}
```

The `height` parameter is optional (default: 500px).

---

## Technical Notes

**Stack:** Pure HTML/CSS/JavaScript — no frameworks, no build tools, no server required.

**Portability:** Each demo is self-contained. Copy the folder anywhere and it works.

**Accessibility:**
- Keyboard navigable
- Screen reader labels
- Respects `prefers-reduced-motion`

**Source code:** Each demo lives in its own folder under `/demos/`.

---

## Pedagogical Suggestions

### Angular Size
- Start with "Why do the Sun and Moon look the same size?"
- Use presets to compare astronomical objects
- The Moon recession slider connects to geological time

### Moon Phases
- Address misconception: phases are NOT caused by Earth's shadow
- Have students predict phase before dragging
- Connect to eclipse geometry demo

### Eclipse Geometry
- Key insight: tilt is why eclipses don't happen monthly
- Run the 1000-year simulation to show eclipse frequency
- Set tilt to 0° to see what would happen without tilt

### Seasons
- Address misconception: NOT caused by distance from Sun
- Compare Earth to other planets (especially Uranus at 98°)
- Show that Northern summer = closest to Sun (January perihelion)

---

## Future Demos

See `demos/README.md` for the full roadmap and build priority list.

Next priorities:
1. Kepler's Laws Sandbox (Week 3)
2. Blackbody Radiation (Week 4)
3. Electromagnetic Spectrum (Week 4)
