# Quarto RevealJS Slides Contract (Spec-Locked)

## 0) Scope

Applies to all Quarto `revealjs` decks in this repo: lecture slides, activity slides, review sessions, demo walk-throughs, and research talks (unless overridden in the task).

## 1) Prime Directive

**Render-ready, classroom-ready, and visually stable.**
If something would cause overflow, misalignment, or crowded-slide syndrome, it must be split or redesigned.

## 2) Non-Negotiables (Hard Rules)

1. **No wall of text.** Max 6 lines of body text per slide (excluding titles). If more, split.
2. **Visual cadence:** max 2 text-only slides in a row. Concept blocks must include a visual, diagram, or structured table.
3. **Figures always get layout support:** any slide with a figure uses a 2-column layout (text + visual) unless explicitly exempt.
4. **No overflow:** nothing clips off-screen; nothing requires the audience to scroll. Overflow mitigation classes exist but are emergency-only (see Section 7). ([Quarto][1])
5. **No image-only slides** unless explicitly requested.
6. **No design drift:** keep existing theme, fonts, spacing conventions, and section structure for the course.
7. **Every major section ends with a check:** quick check, concept question, or short prompt.

## 3) Slide Types (Use These Patterns)

Codex must implement slides using explicit types, not random layouts:

- **Concept slide:** 2-column. Left = 3-5 bullets. Right = diagram or figure.
- **Worked example:** 2-column. Left = steps (at most 5). Right = annotated figure or “values -> result” table.
- **Misconception check:** prompt + two competing explanations + “what would we observe?”
- **Quick check (MCQ):** consistent format (see Section 5).
- **Summary slide:** 3-5 takeaways + “what you should be able to do now.”

## 4) Layout Contract (Quarto revealjs)

### 4.1 Columns Are Mandatory for Figure Slides

Use Quarto revealjs columns syntax (canonical pattern):

```markdown
:::: {.columns}
::: {.column width="45%"}
- 3-5 bullets max
:::
::: {.column width="55%"}
![](path/to/figure.svg){fig-alt="..." width="100%"}
:::
::::
```

(Columns are a first-class Quarto pattern; keep widths explicit to prevent overflow.)

### 4.2 Image Sizing Rules (Must Not Overflow)

- Images must set either `width="100%"` within a column or a max-height style in CSS.
- Avoid giant labels inside figures; prefer readable, minimal annotations.

## 5) MCQ / iClicker Quiz Format (Consistent Every Time)

All multiple-choice slides must follow this structure:

- **Title:** “Quick Check:” + topic
- **Prompt:** 1-2 lines
- **Choices:** A-D (short; one line each)
- **Correct answer** goes in speaker notes, not on the slide.

Example:

```markdown
## Quick Check: Retrograde Motion

Which statement best explains apparent retrograde motion?

A. Planets reverse direction in their orbits.
B. It’s caused by Earth passing another planet in its orbit.
C. It’s caused by epicycles in the geocentric model.
D. It’s caused by Earth’s axial precession.

::: {.notes}
Correct: B. Key idea: relative motion + viewing geometry.
:::
```

Speaker notes are supported by reveal.js and Quarto. ([reveal.js][2])

## 6) Fragments and Incremental Reveals (Use Sparingly, Intentionally)

- Default: incremental lists ON at the deck level (unless a deck is meant to be static). ([Quarto][1])
- Use fragments only when it improves pedagogy (for example, reveal one assumption at a time). Reveal fragments are supported, but do not overanimate. ([Quarto][3])
- Known pitfall: do not mix `.callout-*` and `.fragment` on the same block; Quarto has had issues with that combo. ([GitHub][4])

## 7) Overflow Policy (When a Slide Is Too Dense)

Primary fix: split the slide.
Secondary fix: convert text to a structured table or diagram.
Emergency-only: apply revealjs slide classes:

- `.smaller` (reduce type)
- `.scrollable` (scroll) discouraged in class ([Quarto][1])

If Codex uses `.scrollable`, it must justify it and propose a better split.

## 8) Accessibility and Student Usability

- Every image includes meaningful `fig-alt`.
- Avoid tiny text in figures; if unavoidable, split into a zoom-in slide.
- Color is supportive, not the sole carrier of meaning (use labels, line styles, markers).

## 9) RevealJS Deck Defaults (YAML Baseline)

Codex must start decks from a stable baseline and not freestyle options.

```yaml
---
title: "..."
format:
  revealjs:
    slide-number: true
    incremental: true
    preview-links: auto
    transition: slide
    background-transition: fade
    width: 1280
    height: 720
    margin: 0.08
    css: slides.css
---
```

RevealJS and Quarto support these options; keep them consistent unless asked otherwise. ([Quarto][5])

## 10) Definition of Done (Codex Must Satisfy)

A deck is done only if:

1. `quarto render` succeeds without breaking layout.
2. No slide overflows (no clipped content).
3. Visual cadence rule satisfied (no more than 2 text-only slides in a row).
4. Every major section ends with a quick check.
5. Figures have alt text and fit their columns.
6. Output includes: Summary, Files changed, How to verify (exact commands).

## 11) Codex Wrapper (Paste Above Any Slide Task)

Use this as the first lines of your Codex prompt:

```text
Follow docs/contracts/quarto-revealjs-slides-contract.md exactly.
Do not ask permission for routine steps; make reasonable assumptions and proceed.
If ambiguity is truly blocking, ask ONE A/B question; otherwise decide and implement.
Deliver render-ready .qmd + assets + exact verification commands.
```

## 12) Optional: slides.css Guardrails

A tiny `slides.css` (or `.scss`) can enforce image max-height and sane spacing so layouts do not blow up. This single file eliminates much of the RevealJS overflow pain.

If you want, I can draft a minimalist `slides.css` that:

- caps figure heights,
- improves column spacing,
- standardizes Quick Check styling,
- and makes too-much-text look obviously wrong so it gets fixed.

[1]: https://quarto.org/docs/presentations/revealjs/?utm_source=chatgpt.com "Revealjs"
[2]: https://revealjs.com/speaker-view/?utm_source=chatgpt.com "Speaker View"
[3]: https://quarto.org/docs/presentations/revealjs/advanced.html?utm_source=chatgpt.com "Advanced Reveal"
[4]: https://github.com/quarto-dev/quarto-cli/issues/6853?utm_source=chatgpt.com "The .callout-note Block Rejects the .fragment Class #6853"
[5]: https://quarto.org/docs/reference/formats/presentations/revealjs.html?utm_source=chatgpt.com "Revealjs Options"
