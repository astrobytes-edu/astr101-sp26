# Expert Review: Lecture 2 Materials

**Reviewer:** Claude (ASTR 101 Skill Audit Mode)
**Date:** 2026-01-16
**Artifacts Reviewed:**
- `readings/lecture-02-foundations.qmd` (~3250 words, 535 lines)
- `slides/lecture-02-foundations.qmd` (~60 slides, 900 lines)

---

## Executive Summary

**Overall Assessment:** Strong foundational materials with excellent explanatory narrative and pedagogical structure. Both artifacts successfully convey the "Measure → Infer" theme and treat students as scientists-in-training. However, both significantly exceed length targets, and several structural improvements would align them better with ASTR 101 skill guidelines.

| Criterion | Reading | Slides |
|-----------|---------|--------|
| Content Quality | ★★★★☆ | ★★★★☆ |
| Math Grammar | ★★★★☆ | ★★★☆☆ |
| Pedagogical Structure | ★★★★☆ | ★★★☆☆ |
| Format Compliance | ★★☆☆☆ | ★★☆☆☆ |
| Voice & Tone | ★★★★★ | ★★★★☆ |

**Priority Fixes:**
1. Add YAML artifact headers to both files
2. Reduce slide deck to 25-30 slides (currently ~60)
3. Add explicit Learning Objectives slide to deck
4. Add 2-3 formal prediction/iClicker slides

---

## Reading Review: `lecture-02-foundations.qmd`

### What Works Well

**Voice & Tone (Excellent)**
- The opening paragraph about "ambiguity of points of light" perfectly sets up the inference theme
- Strong use of signposting: "To see why this matters...", "The key insight here is...", "What makes this remarkable:"
- Treats math as language, not obstacle (e.g., "The equation tells a story")
- Warm but rigorous tone throughout

**Math Grammar (Strong)**
- Most equations follow the required pattern: introduce → equation → unpack → interpret
- Excellent worked examples (dimensions of G, Kepler derivation, Schwarzschild radius)
- Good dimensional analysis verification patterns
- CGS units used consistently

**Retrieval Practice (Good)**
- 5 "Check Yourself" questions = ~1 per 650 words
- Questions test interpretation, not just plug-and-chug
- Collapsible solutions prevent premature peeking

**Content Organization (Strong)**
- Four tools presented in logical sequence
- Case studies build complexity progressively (orbits → black holes → white dwarfs)
- Reference tables at end are useful for homework/exams

### Issues Requiring Attention

#### CRITICAL: Missing Artifact Header

The reading lacks the required YAML header per `artifact-formats.md`:

```yaml
---
Course: ASTR 101
Module: 1 - Foundations
Learning Objectives:
  - Use dimensional analysis to verify equation validity
  - Apply the ratio method to compare astronomical quantities
  - Convert between SI and CGS unit systems
  - Perform order-of-magnitude estimations
Concept Throughline:
  - Measurements are constrained; inference is powerful
  - Math is compressed physical reasoning
  - Tools let us extract physics from limited data
Math Level: symbolic_with_interpretation
Mode: Draft
Prerequisites: Basic algebra, scientific notation familiarity
---
```

**Action:** Add this header to the top of the file.

#### MODERATE: Length Exceeds Target

- **Current:** ~3250 words
- **Target:** 1,200-2,000 words
- **Verdict:** Length is justified by comprehensive coverage of 4 tools + 3 case studies. Per priority order, learning objectives > length targets. However, consider whether some material could move to a supplementary handout.

**Possible Cuts:**
- Case Study C (white dwarf) marked as "Advanced" in slides—could be optional reading
- Reference tables could become a separate handout

#### MODERATE: Inconsistent Equation Unpacking

Some equations don't fully follow the required pattern:

**Good Example (line 61-72):**
```
Newton's law of gravity states:
$$F = \frac{GMm}{r^2}$$

We know the dimensions of everything except $G$:
- $[F] = [MLT^{-2}]$ (force)
- $[M], [m] = [M]$ (mass)
- $[r] = [L]$ (length)
```

**Needs Improvement (line 157-158):**
```
The result: $P_{\rm deg} \propto \hbar^2 n^{5/3} / m_e$
```

This appears without unpacking each term. Add:
```
Let's unpack:
- $\hbar$ is Planck's constant (quantum scale)
- $n$ is number density of electrons
- $m_e$ is electron mass
- The $n^{5/3}$ exponent emerges from quantum statistics
```

**Other equations needing fuller unpacking:**
- Line 119: `$P \approx \sqrt{r^3/GM}$` — add "What this equation is really saying" explicitly
- Line 142: `$R_{\rm sch} \approx GM/c^2$` — has partial interpretation but could be stronger

#### MINOR: Missing "Prerequisites" Section

Per voice-and-tone guidelines, explicitly state prerequisites at the top:

> **Prerequisites:** You should be comfortable with scientific notation (e.g., $10^{33}$), basic algebra, and the concept of units (meters, seconds, grams).

#### MINOR: Example Diversity

The reading relies heavily on:
- Sun/Earth comparisons (3 times)
- Schwarzschild radius (2 times)
- Piano tuners in Chicago (1 time)

Consider varying:
- Add a neutron star or red giant example
- Use Proxima Centauri instead of generic "nearby star"
- Reference a specific Fermi problem relevant to SDSU students

### Specific Line-by-Line Issues

| Line | Issue | Suggested Fix |
|------|-------|---------------|
| 13 | "trillions of miles away" | Use parsecs or light-years per CGS convention |
| 169-175 | Abrupt transition to ratio method | Add bridge: "Having established that dimensions must match, we now ask: how do quantities *compare*?" |
| 231 | "~40 orders of magnitude" | More precisely "over 40 orders of magnitude" (already correct at line 272) |
| 398-428 | Phone number mnemonic is excellent | Consider adding a visual summary card students can screenshot |
| 505-534 | Reference tables | Move to separate handout or make collapsible |

### Verification Checklist Results

| Item | Status | Notes |
|------|--------|-------|
| Main idea clarity | ✓ PASS | Each section has clear focus |
| Math level compliance | ⚠ PARTIAL | 3 equations need fuller unpacking |
| Example relevance | ✓ PASS | All examples serve objectives |
| No hand-waving | ✓ PASS | Claims are supported |
| Example diversity | ⚠ PARTIAL | Could vary astronomical objects |
| Retrieval practice | ✓ PASS | 5 questions, good cadence |
| Throughline consistency | ⚠ CHECK | No throughline declared; add header |
| Learning objective alignment | ⚠ CHECK | Objectives not stated; add header |
| Prerequisites stated | ✗ FAIL | Missing prerequisites |
| Length targets | ⚠ EXCEEDED | Justified but note it |
| No fabrication | ✓ PASS | No invented numbers |
| Analogies accurate | ✓ PASS | Metaphors are physically correct |
| Units present | ✓ PASS | CGS used consistently |

---

## Slides Review: `lecture-02-foundations.qmd`

### What Works Well

**Pacing & Reveals**
- Excellent use of incremental reveals (`. . .` pauses)
- Builds suspense before key insights
- Good use of `{.incremental}` for lists

**Speaker Notes**
- Comprehensive notes with timing cues ("5–6 min", "11–13 min")
- Good pedagogical reminders ("Give students 30 seconds to think")
- Contains answers to Check Yourself questions

**Visual Design**
- Background images used effectively (night sky opener)
- Figure shortcodes work well for visual consistency
- Mermaid flowchart for problem-solving flow is excellent

**Core Message**
- "These aren't math drills—they're *inference tools*" captures the theme perfectly
- "You're about to get superpowers" is engaging without being hype

### Issues Requiring Attention

#### CRITICAL: Slide Count Exceeds Target

- **Current:** ~60 slides
- **Target:** 15-25 slides
- **Problem:** This is a 75-minute class. At 60 slides, you're averaging <1.5 min/slide, which is too fast for student processing.

**Recommended Consolidations:**

1. **Merge "Units vs Dimensions" explanation** (slides 80-108): Combine the table + explanation into 2 slides instead of 4

2. **Consolidate Case Studies:** Each case study uses 3-4 slides. Combine steps:
   - Case A: 3 slides → 2 slides
   - Case B: 2 slides → 1 slide
   - Case C: Mark as "bonus" or remove entirely (it's optional content)

3. **Merge Scientific Notation section:** Lines 422-482 use 5+ slides for notation basics. Students should know this—condense to 2 slides as "quick review."

4. **Reference slides at end:** CGS cheat sheet and Astro constants can be combined into 1 reference slide or moved to handout.

**Target:** Reduce to 30-35 slides for sustainable pacing.

#### CRITICAL: Missing Learning Objectives Slide

Per `artifact-formats.md`, the deck should open with:

```markdown
## Learning Objectives

By the end of this lecture, you will be able to:

- Verify equation validity using dimensional analysis
- Compare quantities using the ratio method
- Convert between SI and CGS units
- Estimate order-of-magnitude values to check answers

::: {.notes}
Read these aloud. Students should write them down.
:::
```

**Action:** Insert after the title slide (line 14).

#### MODERATE: Word Count Violations

Several slides exceed the 35-word limit:

| Slide (approx. line) | Word Count | Content |
|---------------------|------------|---------|
| 26-45 "Points of Light" | ~45 words | Split into 2 slides |
| 309-320 "Problem with Big Numbers" | ~40 words | Move subtraction result to next slide |
| 592-608 "Example 2: Energy" | ~45 words | Split equation and result |

**Target:** No slide should exceed 35 words of readable content (equations count as ~5-10 words).

#### MODERATE: Missing Prediction Prompts

The template specifies slides with the pattern:
```markdown
## Prediction Prompt

**Before I show you the answer:**

[Question that forces prediction]
```

The current deck has Check Yourself questions in speaker notes, but no formal prediction prompt slides. Students need to see the question on screen.

**Recommended additions:**
1. Before revealing $[G]$ dimensions: "What dimensions must G have? Take 30 seconds."
2. Before Kepler derivation: "Without calculating, what quantities should orbital period depend on?"
3. Before Schwarzschild result: "Order of magnitude: Is the Sun's Schwarzschild radius closer to 1 km, 10 km, or 100 km?"

Add 3-4 explicit prediction slides.

#### MODERATE: Missing iClicker Slides

Per template, include at least one multiple-choice check per concept chunk:

```markdown
## iClicker Check

If you double a star's radius while keeping temperature constant, its luminosity:

A. Doubles
B. Quadruples ✓
C. Increases 8×
D. Stays the same

::: {.notes}
Common error: forgetting R enters squared. ~60% should get this.
:::
```

**Recommended additions:**
1. After dimensional analysis: "Which expression has dimensions of velocity?"
2. After ratio method: "The Sun is 109× Earth's radius. How many Earths fit inside?" (test cubic scaling intuition)
3. After OOM: "Your calculation gives 10^40 seconds for the universe's age. Is this reasonable?"

#### MINOR: Equation Unpacking on Slides

Slide equations often show "Key terms" as a list, but don't include the "What this is really saying" interpretation explicitly. Example fix:

**Current (line 154-172):**
```markdown
## Worked Example: What are the dimensions of $G$?

Newton's law of gravity:
$$F = \frac{GMm}{r^2}$$

We know:
- $[F] = [MLT^{-2}]$ (force)
...
```

**Improved:**
```markdown
## Worked Example: What are the dimensions of $G$?

$$F = \frac{GMm}{r^2}$$

**What we know:** Force, mass, distance dimensions

. . .

**Solve for [G]:** Rearrange and cancel

::: {.notes}
Write this derivation on the board. Let students see the algebra.
:::

---

## The Result

$$[G] = [M^{-1}L^3T^{-2}]$$

**Physical meaning:** G connects mass to spacetime. The inverse mass means gravity gets weaker as mass increases... wait, that's backward! The $M$ in Newton's law cancels this.

```

### Specific Slide-by-Line Issues

| Line | Issue | Suggested Fix |
|------|-------|---------------|
| 14-18 | Opening hook is good but no LO slide follows | Insert LO slide |
| 144-145 | Emoji in "🚨" | Remove per voice guidelines (no emojis unless requested) |
| 299-306 | Tool 2 section marker could be stronger | Add a visual icon or transition |
| 716-732 | Phone number explanation split awkwardly | Combine into one visual slide |
| 813-833 | Mermaid flowchart is excellent | Consider making this the synthesis slide |
| 879-899 | Reference tables as slides | Move to handout |

### Slide Verification Checklist Results

| Item | Status | Notes |
|------|--------|-------|
| Main idea clarity | ✓ PASS | Each slide has clear focus |
| Math level compliance | ⚠ PARTIAL | Some equations lack interpretation |
| No hand-waving | ✓ PASS | Builds from first principles |
| Slide density ≤35 words | ✗ FAIL | ~8 slides exceed limit |
| Slide count 15-25 | ✗ FAIL | ~60 slides (2.5× target) |
| Prediction prompts | ✗ FAIL | Missing formal prediction slides |
| Speaker notes | ✓ PASS | Comprehensive |
| No fabrication | ✓ PASS | All numbers verified |
| Units present | ✓ PASS | CGS consistent |

---

## Cross-Artifact Consistency

### Throughline Alignment

Both artifacts should share the same concept throughline. Currently, neither declares one explicitly.

**Recommended Throughline for Lecture 2:**
1. Stars are points of light; we infer physics from limited data
2. Dimensional analysis is the "smoke detector" for invalid equations
3. Ratios eliminate messy constants; scaling reveals physics
4. Order-of-magnitude reasoning catches errors before they propagate

### Content Alignment

| Topic | Reading | Slides | Alignment |
|-------|---------|--------|-----------|
| Dimensional Analysis | Full coverage | Full coverage | ✓ |
| Ratio Method | Full coverage | Full coverage | ✓ |
| Unit Conversions | Full coverage + tables | Full coverage | ✓ |
| OOM Estimation | Full coverage | Full coverage | ✓ |
| Case Study A (Orbits) | 3 figures | 3 slides | ✓ |
| Case Study B (Black Holes) | 2 figures | 2 slides | ✓ |
| Case Study C (White Dwarfs) | 2 figures, marked advanced | 2 slides | ✓ |
| Scientific Notation | Full section | Full section | ✓ |
| Phone Number Mnemonic | Full section | Full section | ✓ |
| Reference Tables | Included | Included | ✓ (move to handout) |

**Gap:** The reading has Check Yourself questions with solutions; the slides should reference these as "see reading for practice problems."

---

## Recommended Action Items

### High Priority (Do Before Teaching)

1. **[READING]** Add YAML artifact header with Learning Objectives, Throughline, Prerequisites
2. **[SLIDES]** Add Learning Objectives slide after title
3. **[SLIDES]** Remove emoji (line 144)
4. **[SLIDES]** Add 3-4 prediction prompt slides

### Medium Priority (Improves Quality)

5. **[READING]** Fully unpack the degeneracy pressure equation (line 157)
6. **[READING]** Add explicit "What this equation is really saying" for lines 119, 142
7. **[SLIDES]** Consolidate slides to ~35 total (merge notation review, combine case study steps)
8. **[SLIDES]** Add 2-3 iClicker multiple choice slides
9. **[BOTH]** Move reference tables to a separate handout

### Low Priority (Polish)

10. **[READING]** Vary examples (add Proxima Centauri, neutron star)
11. **[READING]** Add "trillions of miles → light-years" at line 13
12. **[SLIDES]** Add visual icons for each tool section
13. **[BOTH]** Create matching concept throughline declaration

---

## Technical Accuracy Verification

### Verified Correct

| Claim | Location | Verification |
|-------|----------|--------------|
| $[G] = [M^{-1}L^3T^{-2}]$ | Reading:70, Slides:168 | ✓ Dimensional analysis confirmed |
| $M_\odot / M_\oplus \approx 333,000$ | Reading:173, Slides:326 | ✓ $2×10^{33} / 6×10^{27} = 3.3×10^5$ |
| $R_\odot / R_\oplus = 109$ | Slides:363 | ✓ Standard value |
| $V_\odot / V_\oplus \approx 1.3×10^6$ | Slides:371 | ✓ $109^3 = 1,295,029 \approx 1.3×10^6$ |
| Stefan-Boltzmann CGS: $5.67×10^{-5}$ | Reading:521, Slides:625 | ✓ Conversion verified |
| $R_{sch} \approx 10$ km for $M_\odot$ | Reading:458, Slides:806 | ✓ Exact is ~3 km; factor of 3 is acceptable for OOM |
| 1 J = $10^7$ erg | Reading:332, Slides:604 | ✓ Standard conversion |

### Potential Issue

| Claim | Location | Note |
|-------|----------|------|
| "trillions of miles away" | Reading:13 | Not wrong, but inconsistent with CGS/astronomical units convention. Suggest "light-years away" |

---

## Summary

These are **strong teaching materials** that capture the ASTR 101 voice: warm, rigorous, curious, and empowering. The core pedagogical structure is sound, and the content is technically accurate.

The main issues are **structural compliance** (missing headers, slide count, word limits) rather than content quality. Addressing the high-priority items will bring both artifacts into full compliance with course standards.

**Estimated revision time:** 2-3 hours for high/medium priority items.
