# ASTR 201 Lecture Audit: Lecture 1 Slides (REVISED - POST-FIX)

**File:** `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
**Audit Date:** 2026-01-18 (revised after fixes applied)
**Auditor:** Claude (using astr201-lecture-audit skill + Playwright visual inspection)
**Overall:** **PASS** (critical issues resolved)

---

## Throughline

> **Astronomy is the art of inferring physical reality from constrained measurements. Pretty pictures are datasets we decode using physics. We measure four things (brightness, position, wavelength, timing); everything else is inferred through models.**

---

## Layout & Visual Quality Checklist

| Item | Status | Justification |
|------|--------|---------------|
| Slide overflow | **PASS** | Text clipping fixed on slides 4 and 6 |
| Font size & readability | PASS | Text is readable |
| Text density | PASS | Most slides within word budget |
| Column usage | PASS | Columns used on appropriate slides |
| Image sizing & aspect ratios | ⚠️ | 2x2 grids use raw HTML; acceptable but not ideal |
| Fragment/reveal pacing | PASS | Progressive reveals work |
| Visual variety | **PASS** | All `{{< img >}}` shortcode images now render correctly |
| Alignment & spacing | PASS | Content within slide bounds |

**7 PASS, 1 WARNING**

---

## Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Voice | ✅ | Narrative explanations throughout; bullets only for lists |
| Math grammar | ⚠️ | `c=λν` and `E=hν` have symbol definitions but lack sanity checks |
| Equation system | ⚠️ | Inline LaTeX, not `include + eqrefcard` — acceptable for preview |
| Figure system | ✅ | `{{< img id >}}` shortcode now works with CSS fix |
| Engagement | ✅ | 3 Quiz slides + 1 TPS; cadence meets contract |
| Hook | ✅ | Opening sequence is compelling |
| Observation → inference | ✅ | Every spoiler follows Measure → Infer → Physics pattern |
| Verification | ✅ | Visual inspection confirms all slides render correctly |

---

## Fixes Applied (2026-01-18)

### 1. Image rendering at 0x0 pixels — FIXED

**Root Cause:** The `{{< img >}}` shortcode generates plain `<img>` tags without explicit sizing. In RevealJS with `display: inline`, these collapse to 0x0.

**Fix Applied:** Added CSS intrinsic sizing rules to `assets/theme/slides/_base.scss`:

```scss
.reveal section img:not([width]):not(.logo) {
  display: block;
  width: intrinsic;           // Safari
  width: -moz-max-content;    // Firefox
  width: -webkit-max-content; // Chrome
  width: max-content;         // Standard
  max-width: 100%;
  max-height: 75vh;
  height: auto;
  margin: 0 auto;
}
```

**Result:** All 25+ slides with `{{< img >}}` shortcodes now display images correctly.

---

### 2. Text clipping on slide 4 — FIXED

**Root Cause:** Background image with baked-in footer text overlapped RevealJS navigation bar.

**Fix Applied:** Changed background sizing from `contain` to `88% auto` with `center top` positioning:

```markdown
## {background-image="..." background-size="88% auto" background-position="center top"}
```

**Result:** Footer text "We answer all three using the same superpower: Inference from signals" now visible above navigation.

---

### 3. Text clipping on slide 6 — FIXED

**Root Cause:** `### Modern Astronomy = Astrophysics` heading pushed content into footer when fully revealed.

**Fix Applied:** Changed from h3 heading to bold text:

```markdown
::: {.fragment}
**Modern Astronomy = Astrophysics**
:::
```

**Result:** All text now fits within slide bounds when fully revealed.

---

## Remaining Recommendations (should fix soon)

### 1. Timing note conflicts

**Location:** Speaker notes at lines 188 and 207 both show "8–9 min"

**Fix:** Update to maintain monotonic progression.

### 2. Raw HTML grids are a maintenance burden

**Location:** Lines 115-120 and 151-156 use raw HTML for 2x2 grids

**Issue:** Bypasses figure registry; creates maintenance burden.

**Fix:** Consider creating a grid shortcode or documenting the workaround.

### 3. Math grammar could be stronger

**Location:** Equations `c=λν` and `E=hν` on slides 37-38

**Issue:** Have symbol definitions but lack explicit sanity checks.

**Fix:** Add units/sanity check to speaker notes or frame as "orientation only."

---

## Summary

| Metric | Value |
|--------|-------|
| Total slides | 43 |
| Slides with visible images | ALL |
| Text overflow issues | 0 (fixed) |
| Required scripts present | 6/6 |

### What's Working

1. **ALL images now render correctly** — CSS intrinsic sizing fix in `_base.scss`
2. **Text fits within slide bounds** — Background and content adjustments
3. Speaker notes with all 6 required scripts
4. Quiz/TPS engagement cadence
5. Narrative voice and pedagogical structure
6. Progressive disclosure with fragments

### Minor Issues Remaining

1. 2x2 grids use raw HTML instead of shortcodes (acceptable workaround)
2. Timing notes need cleanup for monotonic progression
3. Equation sanity checks could be added to speaker notes

---

## Ready for Delivery?

**YES.**

The lecture is now deliverable:
- All images display correctly
- All text is visible within slide bounds
- Engagement cadence meets pedagogical contract
- Speaker notes contain all required scripts

---

## Verification Commands

```bash
# Render slides
quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd

# Visual inspection (REQUIRED - do not skip)
quarto preview modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd
# Navigate through ALL slides checking for:
# - Visible images ✓
# - Text within slide bounds ✓
# - Proper alignment ✓
```

**Status:** Renders correctly. Visual inspection PASSED.
