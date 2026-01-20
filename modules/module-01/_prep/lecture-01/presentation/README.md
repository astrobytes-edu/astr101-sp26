# ASTR 101 Lecture 01: Spoiler Alerts — The Universe Is Weird

## Presentation Files

This directory contains the lecture presentation in multiple formats:

### Quarto RevealJS (Ready to use)

- **`ASTR201-Lecture01-SpoilerAlerts.qmd`** - Main Quarto presentation file
- **`custom.scss`** - Custom styling (modern minimalist with muted colors)

To render:
```bash
quarto render ASTR201-Lecture01-SpoilerAlerts.qmd
```

### PowerPoint (HTML source files)

The PowerPoint version is generated from HTML slides using the html2pptx library.

**Files:**
- `slides/slide01.html` through `slides/slide40.html` - Individual HTML slides
- `theme.css` - CSS theme with color palette
- `create-pptx.js` - Conversion script
- `html2pptx/` - html2pptx library (extracted)

**To generate the PowerPoint locally:**

1. Install dependencies:
```bash
npm install playwright pptxgenjs
npx playwright install chromium
```

2. Run the conversion:
```bash
node create-pptx.js
```

This creates `ASTR201-Lecture01-SpoilerAlerts.pptx`

## Design

### Color Palette (Modern Minimalist with Muted Colors)

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#1e3a5f` | Primary - headers, emphasis, backgrounds |
| Muted Gold | `#c9a227` | Accent - highlights, calls to action |
| Warm Off-White | `#faf8f5` | Surface - slide backgrounds |
| Soft Gray | `#e8e4df` | Secondary - cards, subtle backgrounds |
| Charcoal | `#2c2c2c` | Text - body text |
| Muted Gray | `#6b6b6b` | Muted text - footnotes, hints |

### Typography

- **Display/Headings:** Georgia (serif) - academic elegance
- **Body:** Arial (sans-serif) - clean readability

### Slide Count

- **40 slides total**
- Opening: 6 slides
- Framework: 9 slides
- Spoiler Reel: 15 slides
- Synthesis & Tools: 7 slides
- Closing: 3 slides

## Figure Placeholders

The presentation includes placeholder areas for figures that need to be added:

1. Slide 2: Rubin Observatory zoom-out video
2. Slide 5: Decoding the Cosmos Infographic
3. Slide 17: Nebula Forensic Analysis
4. Slide 18: Cosmic Distance Ladder
5. Slide 19: Periodic Table by Origin
6. Slide 21: Prism Spectrum
7. Slide 22: EM Spectrum Temperature Ladder
8. Slide 24: M51 Optical vs Radio
9. Slide 27: Pillars Hubble vs JWST
10. Slide 28: Crab Multiwavelength Composite
11. Slide 29: DESI 3D Map
12. Slide 30: History of the Universe
13. Slide 33: Wave diagram
14. Slide 34: Energy-wavelength diagram
15. Slide 36: Universe Time Machine

These should be replaced with actual figures from the reading or external sources as noted in the slide outline v2.3.
