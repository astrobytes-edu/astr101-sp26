# Plan: Lectures 7–10 — Figures, Spectra Placement, and Demo Hardening

Date: 2026-02-01  
Source audit: `docs/audits/2026-02-01-module-01-lectures-07-10-audit.md`  
Primary goals:
- Remove **all missing-figure errors** in L9–L10 by ensuring every `{{< fig ... >}}` is registered and points to a real asset (SVG or reused image).
- Re-home “spectral lines” visuals so **L8 stays blackbodies** and **L9 owns spectral fingerprints**.
- Fill remaining figure gaps (or add explicit placeholders) so students never see “TODO/placeholder” without a concrete next step.

---

## 0) Task classification (LLM lab protocol)

Dominant: **Documentation / explanation** + **scientific correctness** + **content/figure implementation**.

---

## 1) Hard invariants (do not violate)

- **No deleting/moving/renaming files** without explicit, prior approval (AGENTS.md).
- **Figure system:** every figure used in prose must be registered in `assets/figures.yml` and embedded via `{{< fig id >}}` (or `{{< img id >}}`).
- **Accessibility:** every registry entry must have `alt`; SVGs must include `<title>` + `<desc>` and `role="img"`.
- **Scientific correctness:** geometry and sign conventions must be correct (no “Sun at ellipse center,” correct Doppler sign, etc.).
- **Typography:** spaced em dash in prose: `word — word`.
- **No preview artifacts committed:** `_previews/` stays git-ignored.

---

## 2) Current state (from audit)

### Render blockers (student-facing credibility issues)

L9 and L10 currently render visible error text because figure IDs are missing from the registry:
- L9 missing IDs: `fraunhofer-lines`, `kirchhoff-three-laws`, `energy-level-ladder`, `hydrogen-energy-levels`, `hr-diagram-preview`
- L10 missing IDs: `radial-vs-transverse`, `radial-velocity-method`, `galaxy-rotation-curve`

These show as literal `[ERROR: Figure '...' not found in registry]` because the shortcode hard-fails missing IDs (`_extensions/course/shortcodes.lua`).

### Figure placement issue (curricular coherence)

Spectral-lines teaser figures currently live in L8 and should be moved to L9:
- `absorption-of-light-hydrogen-jwst` and `emission-of-light-hydrogen-jwst` are embedded in the “Enter Spectral Lines” section of L8.

### Remaining placeholders (pedagogical gaps, not render blockers)

- L7 placeholders: `proxima-centauri-info`, `rayleigh-scattering-sky`, `sunset-scattering`
- L8 placeholders: `infrared-thermal-image`, `giant-vs-dwarf`

### Demo correctness issue (unit error)

- `demos/_instructor/binary-orbits/activities.qmd` contains “13 km/s” for the Sun’s wobble due to Jupiter (should be ~13 m/s).

---

## 3) Strategy (two-pass: unblock now, perfect later)

### Pass A — Unblock and stabilize (fast, safe)

Goal: L9/L10 pages contain **no missing-figure error strings**, and the spectral-lines figure story is coherent.

Approach:
- Reuse existing registry figures where they already communicate the intended idea.
- Where no suitable figure exists, add a **high-quality SVG placeholder** that clearly states what will be drawn next (so the reading remains readable and trustworthy).

### Pass B — Replace placeholders with final SVGs (craft pass)

Goal: replace placeholder SVGs and callout placeholders with polished, misconception-resistant figures in the shared course visual language.

Approach:
- Use the repo SVG template `assets/images/module-01/_svg-template.svg`.
- Use palette tokens (aurora/deep) and semantic colors (teal = structure, pink = teaching target, violet = guides).
- Export PDF-first + PNG to `_previews/` for review using `scripts/render_svg_to_png.py`.

---

## 4) Figure mapping table (what to do for each missing slot)

Legend:
- **Reuse** = use an existing registry entry (no new art).
- **SVG** = create a polished SVG now.
- **Placeholder SVG** = create an SVG placeholder now; schedule polished SVG in Pass B.

### Lecture 9 (Spectral Lines)

| Reading slot | Current ID | Best action | Proposed ID/path | Notes |
|---|---|---|---|---|
| Fraunhofer intro | `fraunhofer-lines` | Placeholder SVG → SVG | `assets/images/module-01/lec09/fraunhofer-lines.svg` | Start with a “solar spectrum strip with missing lines” schematic; later upgrade with more realistic line density. |
| Kirchhoff visual summary | `kirchhoff-three-laws` | Reuse | `types-of-spectra-jwst` | Already in `assets/figures.yml`; matches the concept exactly. |
| Ladder analogy | `energy-level-ladder` | SVG | `assets/images/module-01/lec09/energy-level-ladder.svg` | Simple, clean “rungs not ramp” visual; low risk. |
| Hydrogen energy-level diagram | `hydrogen-energy-levels` | Placeholder SVG → SVG | `assets/images/module-01/lec09/hydrogen-energy-levels.svg` | Needs careful labeling (n levels, ΔE arrows, Balmer series). |
| HR preview | `hr-diagram-preview` | Reuse (short-term) → SVG (long-term) | Reuse `hr-diagram` or create `assets/images/module-01/lec09/hr-diagram-preview.svg` | Short-term: alias `hr-diagram-preview` to `hr-diagram`. Long-term: a simplified schematic with labeled regions. |

### Lecture 10 (Doppler + Telescopes)

| Reading slot | Current ID | Best action | Proposed ID/path | Notes |
|---|---|---|---|---|
| Radial vs transverse | `radial-vs-transverse` | SVG | `assets/images/module-01/lec10/radial-vs-transverse.svg` | Two-panel: same speed, different line-of-sight component; explicitly “Doppler sees only LOS.” |
| RV method | `radial-velocity-method` | Placeholder SVG → SVG | `assets/images/module-01/lec10/radial-velocity-method.svg` | Needs a clean schematic: star wobble + line-of-sight + RV curve with phase. |
| Rotation curve | `galaxy-rotation-curve` | Reuse (short-term) → SVG (optional) | Reuse `rotation-curve` (Module 4) | Fast unblock: map this ID to existing `rotation-curve` image; later: a Module 1 styled version. |

### Lecture 7–8 (existing callout placeholders)

These are already called out in the prose; we should convert them to actual figures in Pass B.

| Lecture | Placeholder ID | Best action | Proposed path | Notes |
|---|---|---|---|---|
| L7 | `proxima-centauri-info` | SVG | `assets/images/module-01/lec07/proxima-centauri-info.svg` | “We know X from light” arrows: temperature, composition, planets, motion. Avoid time-sensitive claims or label as “example.” |
| L7 | `rayleigh-scattering-sky` | SVG | `assets/images/module-01/lec07/rayleigh-scattering-sky.svg` | Show blue scattered; red mostly forward; observer sees blue from all directions. |
| L7 | `sunset-scattering` | SVG | `assets/images/module-01/lec07/sunset-scattering.svg` | Compare short vs long atmospheric path length; blue scattered out on long path. |
| L8 | `infrared-thermal-image` | Placeholder SVG → photo | `assets/images/module-01/lec08/infrared-thermal-image.svg` | Prefer a real licensed thermal photo later; placeholder now. |
| L8 | `giant-vs-dwarf` | SVG | `assets/images/module-01/lec08/giant-vs-dwarf.svg` | Same color (same T), different radius and luminosity; emphasize $L \propto R^2$ at fixed T. |

---

## 5) Concrete implementation checklist (mechanical steps)

### A) Registry + reading unblock (Pass A)

1. Add missing figure IDs to `assets/figures.yml`:
   - Point to reused figures where possible (`types-of-spectra-jwst`, `hr-diagram`, `rotation-curve`).
   - Point to newly created placeholder SVGs for the rest.
2. Create directories as needed:
   - `assets/images/module-01/lec09/`
   - `assets/images/module-01/lec10/`
   - (later) `assets/images/module-01/lec07/`, `assets/images/module-01/lec08/`
3. For each placeholder SVG:
   - Use the course SVG template.
   - Include a clear “PLACEHOLDER” banner and a brief “what this will show” list.
4. Update readings only where necessary:
   - L9/L10: keep IDs the same; registry fixes should make them render immediately.
   - L8→L9 move: move the hydrogen absorption/emission pair to L9 and replace L8’s block with a short textual bridge or a single teaser figure (optional).
5. Verify:
   - `quarto render modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`
   - `quarto render modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`
   - Confirm `_site/...` contains no `[ERROR: Figure` strings.

### B) Replace placeholders with polished SVGs (Pass B)

1. Draft SVGs with misconception notes written first (“students think ___; this makes ___ obvious”).
2. Export to `_previews/` as PDF + PNG and review at ~50% size:
   - Check for clipped labels, low contrast, and visual hierarchy.
3. Iterate on:
   - stroke weights, label placement, and minimal text.
4. Replace placeholder SVGs in registry with final SVG paths.
5. Convert L7/L8 callout placeholders into `{{< fig ... >}}` embeds.

### C) Demo hardening and additions

1. Fix unit error in `demos/_instructor/binary-orbits/activities.qmd` (km/s → m/s).
2. Add a new station card for Doppler (when the demo exists) in `demos/_assets/station-cards/`.
3. Implement (or schedule) one high-impact demo:
   - **Binary Orbits RV curve overlay** (already planned in `demos/_instructor/binary-orbits/backlog.qmd`)
   - **Doppler Shift Spectrometer** (new student demo)
   - **Spectral Lines Lab** (new student demo)

---

## 6) Acceptance criteria (“done means done”)

**Render correctness**
- L9 and L10 render with zero missing-figure error strings.
- L8 contains no “spectral lines” figure pair (moved to L9).

**Pedagogical coherence**
- L8 ends with “blackbodies can’t do composition/motion” and points forward, without shifting cognitive load to spectroscopy.
- L9 contains at least one clear “absorption vs emission at same wavelengths” visual, plus one “spectrum-as-data” visual.

**Figure quality**
- Every new SVG is legible at slide scale and reading scale.
- Every SVG includes title/desc and is registered with alt text + pedagogical caption.

---

## 7) Open questions (resolve before final polish)

1. For `infrared-thermal-image`: do you want a licensed photo (preferred) or a fully schematic SVG?
2. For `hr-diagram-preview`: do we want to reuse the ESO `hr-diagram.png`, or build a simplified, course-styled HR diagram SVG with labeled regions?
3. For Fraunhofer lines: do you want a schematic “few representative lines,” or a dense “realistic” spectrum strip (more time)?

