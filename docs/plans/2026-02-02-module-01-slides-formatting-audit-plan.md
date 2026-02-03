# Module 1 Slides — Formatting Audit Plan (Lectures 1–13)

Date: 2026-02-02

## Goal

Make every Module 1 slide deck render cleanly and be teachable (no broken builds, no unreadable overflow, no quiz answer leaks, consistent LaTeX math, and consistent visual styling).

## Scope

- Slide decks: `modules/module-01/slides/lecture-01` through `lecture-13` (`*-slides.qmd`)
- Hard invariant: `D` = diameter, `d` = distance (fix all violations).

## Constraints

- Correctness > invariants > reproducibility > clarity > elegance > speed.
- Do not invent facts, citations, URLs, or numerical values. Use `VERIFY` / `[TBD]` when unsure.
- Do not delete/move/rename files without explicit approval.
- No slide-level random `background-color` styling.
- LaTeX in `.qmd` body uses **single** backslashes (no `\\times`, `\\mathrm`, etc.); avoid unicode “math lookalikes” (`×`, `→`, `λ`, `²`, …).

## Current State (known)

- Lecture 5: previously had an unclosed fenced div around the “Kepler’s Laws” section; now fixed and renders.
- Scanner across `modules/module-01/slides/lecture-*-slides.qmd` still reports (especially in Lectures 1–4, 12–13):
  - `## ... {background-color=...}` slide headings
  - old quiz pattern `::: {.quiz}` + task list answers `- [x] ...` (reveals answers)
  - unicode math-like glyphs (should be LaTeX)

## Acceptance Criteria (definition of “done”)

For every slide deck in scope:

1. Render succeeds: `./scripts/quarto-sandbox render <deck> --to revealjs` with no errors.
2. No unbalanced fenced divs (`:::` / `::::`).
3. No slide heading `background-color=` attributes.
4. No old quiz blocks: no `::: {.quiz}` and no `- [x]` task-list answers in quiz slides.
5. No “double-backslash commands” in body math (e.g., no `\\times`, `\\mathrm`, `\\lambda`, `\\sqrt`, `\\approx`).
6. No unicode math lookalikes (replace with LaTeX), except typographic em dash ` — ` in prose.
7. D/d invariant respected (`D` only for diameter, `d` only for distance).
8. Slides are readable:
   - Figure + text uses columns when needed.
   - Dense content is split or moved to `::: {.notes}`.
   - Use `.text-sm` globally (already via `_metadata.yml`) plus local `.text-sm`/columns where needed.

## Audit Workflow (repeat per deck)

### 1) Structural + style scan (fast, mechanical)

Run these checks per file and record findings:

- Unbalanced fenced divs (stack-based scan).
- Background styles:
  - `rg -n "background-color=|background-image=|data-background" <deck>`
- Quiz answer leaks:
  - `rg -n "::: \\{\\.quiz\\}|^\\s*- \\[x\\]" <deck>`
- LaTeX backslash correctness:
  - `rg -nF "\\\\" <deck>` (should be empty in slide body)
  - `rg -n "\\\\\\\\(times|cdot|mathrm|lambda|sqrt|approx|to)" <deck>` (should be empty)
- Unicode math lookalikes:
  - `rg -n "×|→|·|λ|μ|Δ|θ|²|³|⁴|…|✓|❌" <deck>`
- D/d invariant:
  - `rg -n "\\bD\\b|\\bd\\b" <deck>` then spot-check nearby text for meaning.

### 2) Render verification (truth gate)

Render the single deck:

- `./scripts/quarto-sandbox render <deck> --to revealjs`

If it fails, capture:
- exact error message
- the smallest source span that triggers it
- whether it’s a structural (`:::`), shortcode, or LaTeX issue

## Fix Playbook (mechanical edits; minimize rewriting)

Apply fixes in this order (root-cause first):

1. **Fenced div correctness**
   - Ensure every `::: {...}` opener has a matching `:::` closer before `---`.
2. **Remove slide-level background styling**
   - Delete `{background-color="..."}` / `{background-image=...}` from `##` headings.
3. **Quiz conversion (no answer leakage)**
   - Convert old blocks to the quiz plugin’s “question slide” pattern:
     - `## ... {.quiz-question}`
     - choices like `- [Correct answer text]{.correct}`
   - Move solutions/explanations into `::: {.notes}` only.
4. **Unicode → LaTeX**
   - Replace `×` → `\times`, `→` → `\to`, `·` → `\cdot` (or `\,`), `λ` → `\lambda`, `μ` → `\mu`, `²`/`⁴` → `^2`/`^4`, `✓` → `(\checkmark)` or plain text.
5. **LaTeX single-backslash rule**
   - Replace `\\times` → `\times`, `\\mathrm` → `\mathrm`, etc. (in `.qmd` body text).
6. **Readability / overflow**
   - Prefer: split into multiple slides + move detail to notes.
   - Use columns (`:::: {.columns} ... ::: {.column}`) for figure + text.
   - Use `.text-sm` on tables and dense blocks.
7. **Figures**
   - In slides, prefer `{{< img ... >}}` for images (avoid big captions on-slide).
   - Ensure the figure id exists in `assets/figures.yml` (don’t hardcode paths).
8. **D/d invariant**
   - Fix any slide that uses `d` to mean diameter or `D` to mean distance.

## Tracking / Deliverables

Create a checklist table (one row per lecture) with columns:

- Render status (pass/fail)
- Fenced divs (ok/fix)
- Background styling (ok/fix)
- Quiz system (ok/fix)
- Unicode math (ok/fix)
- Double-backslash LaTeX (ok/fix)
- D/d invariant (ok/fix)
- Overflow/readability (ok/fix)

## Final Verification

- Fast: `./scripts/quarto-sandbox render --to html`
- Course-standard: `conda run -n astro make render-fast`
- Full: `conda run -n astro make render` (only when ready, because it is slower)

## Notes

- `_quarto.yml` currently limits Module 1 rendering to keep iteration fast; undo that once lecture decks are clean.
