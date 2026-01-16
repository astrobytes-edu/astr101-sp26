# ASTR 201 Pedagogical Contract

*A durable, enforceable quality bar for all ASTR 201 learning artifacts (slides, readings, worksheets, homework, solutions).*  
Version: v1.0 • Status: Active • Owner: Instructor

---

## 0) Roles, Authority, and Scope

**Authority:** The instructor is the pedagogical authority, sequencer, and final editor. Any AI collaborator is a drafting + editing assistant.

**Scope:** This contract applies to:
- Reveal.js slide decks (`.qmd`)
- Lecture readings/notes (`.qmd`)
- Worksheets / in-class activities
- Homework + solutions
- Figure captions, alt text, and micro-guides

**Non-goals:** This contract is not a style guide for branding colors or typography (those live in the design system). This contract is the *pedagogical spec*.

---

## 1) Invariant Conceptual Core

Across the whole course, the same message stays true:

> **Astronomy is the art of inferring physical reality from constrained measurements.**

That implies:
- We observe (usually photons), not the objects directly.
- Models connect observables → physics.
- Uncertainty is intrinsic, not a flaw.
- Math is the **language of constraints**, not a gatekeeping ritual.

**Everything we write must reinforce this core** (explicitly or implicitly).

---

## 2) Truth, Uncertainty, and Sources

### 2.1 No fabrication (absolute)
- No invented numbers, citations, DOIs, URLs, quotes, or “studies show…” claims.
- If a fact or value matters and is not provided, either:
  - use **orders of magnitude / ratios**, or
  - mark as **VERIFY** with concrete verification steps.

### 2.2 Numerical discipline
- Prefer **scaling** over false precision.
- If you use a numerical value, include units and typical magnitude context.
- Avoid “unearned exactness” (e.g., 6 significant figures when 1–2 is warranted).

### 2.3 Pedagogy clause
- Allowed: established practices (retrieval practice, spacing, misconceptions, Bloom’s taxonomy) without specific attribution.
- Disallowed without citation: “Research shows…” / “Neuroscience proves…” / institution-specific claims.

---

## 3) ASTR 201 Math Grammar (Symbolic-with-Interpretation)

### 3.1 Equation contract (every time an equation appears)
Each equation must come with:
1) **Symbol meaning** (define every symbol used that students haven’t already mastered)
2) **What it predicts** (output)
3) **What it depends on** (inputs)
4) **Plain-English story** (what the equation is *saying*)
5) **Assumptions/validity** (hidden “only if…”)
6) **Sanity checks** (units and/or limits)

> **One equation = one idea.** If an equation encodes multiple ideas, split it into multiple slides/steps.

### 3.2 Show-all-steps rule (when solving)
If you solve for exponents, rearrange algebra, or convert units:
- show each transformation line-by-line
- label the operation (“divide both sides by…”, “match exponents of…”) at least once
- do not skip the step that the average student would skip

### 3.3 Units discipline
- Every quantity carries units (unless explicitly “units suppressed for clarity”).
- SI vs CGS: state which system is in play.
- If a conversion is performed, explain the **identity trick** (“multiply by 1”) and exponent handling.

---

## 4) Slide Design Contract (Reveal.js)

### 4.1 Slide purpose
Slides are **teachable**, not readable.

### 4.2 Word budget + cognitive load
- Default: **≤ 35 words per slide**.
- Each slide answers exactly **one question**:
  - What is the idea?
  - Why does it matter?
  - What should we predict?
  - How do we test/sanity-check?

### 4.3 Progressive disclosure
- Use incremental reveals for multi-step reasoning.
- Do not show a full derivation at once.
- “Setup → Solve → Interpret” is the default pattern for quantitative ideas.

### 4.4 Active learning minimum
- At least **one prediction prompt per concept chunk**.
- Minimum viable format:
  - *Predict* (10–30 seconds)
  - *Explain* (instructor)
  - *Revise* (students update model)

### 4.5 Slide-level equation handling
If an equation appears on a slide, the slide must also include (on-slide or in speaker notes):
- symbol meanings (short)
- what changes when variables increase
- one sanity check (units or limit)

---

## 5) Reading / Notes Contract (Pre-class or reference)

### 5.1 Narrative structure
Default section pattern:
1) **Why this matters**
2) **What it is**
3) **How it’s used**
4) **Common pitfalls**
5) **Check yourself**

### 5.2 Retrieval practice cadence
- Include a “Check yourself” prompt every ~5–10 minutes of reading.
- Provide solutions in collapsible blocks.

### 5.3 Layering
- Core reading: what students must know for class.
- Deep dive: optional, collapsible, clearly marked.

---

## 6) Misconceptions and Diagnostic Design

Design to surface the wrong model first:
1) name the likely misconception
2) create a task that makes it fail
3) replace with the correct model

Assessments must diagnose reasoning, not sort students.

---

## 7) Accessibility and Inclusion

- Define acronyms on first use.
- Every plot: label axes + units + what trend to notice.
- Every figure: include alt-text style description.
- Avoid hidden prerequisites: if you use a skill, name it.
- Use inclusive examples; vary contexts and objects (don’t default to the same 3 astronomy tropes).

---

## 8) Design System for Equations and Meaning (Recommended)

### 8.1 Principle
Keep **equation LaTeX local** (where taught), but standardize the **meaning scaffolding** (gloss + assumptions) so it stays consistent course-wide.

### 8.2 Files
Recommended structure:
```
/data/
  eqcards.yml        # meaning scaffolds (predicts/depends/says/assumptions)
  equations.yml      # registry: id → include path + anchor + eqcard id
  constants.yml      # physical constants + units (optional but strongly recommended)
/_includes/
  equations/
    kepler.qmd
    schwarzschild.qmd
/_shortcodes/
  eqcard.html        # meaning-only card (by eqcard id)
  eqrefcard.html     # meaning card + “See equation …” link (by equation id)
```

### 8.3 `eqcards.yml` (meaning scaffolds)
- Stores: predicts / depends / says / assumptions
- Purpose: eliminate copy/paste drift and enforce consistent interpretation language.

### 8.4 `equations.yml` (equation registry)
- Stores: title, anchor id, include file path, linked eqcard id
- Purpose: one canonical place to map “equation concept” → “where the LaTeX lives” → “which meaning scaffold to show”.

### 8.5 Includes for equation LaTeX
Each canonical equation gets an include file that contains:
- the display math
- the anchor label (`{#eq-...}`)

Example include file pattern:
- `_includes/equations/kepler.qmd`
- `_includes/equations/schwarzschild.qmd`

### 8.6 Shortcodes
- `eqcard`: show the meaning scaffold (predicts/depends/says/assumptions)
- `eqrefcard`: show the meaning scaffold **and** link to the labeled equation

---

## 9) Definition of Done (DoD)

### 9.1 Slides DoD
A deck is “done” when:
- each slide answers one question
- text density is controlled
- every equation slide has meaning + assumptions + one sanity check
- at least one prediction prompt per concept chunk
- figures have axes/units + short caption + alt-text description
- no uncited research-y pedagogical claims

### 9.2 Reading DoD
A reading is “done” when:
- each section maps to a learning objective
- check-yourself prompts appear at the right cadence
- solutions are complete and show steps
- deep dives are clearly separated
- units are consistent and explicitly stated

---

## 10) Audit Mode Checklist (Correctness Gate)

When auditing an artifact, check:
- **Math-level violations:** did we sneak in derivations without scaffolding?
- **Fabrication risks:** any asserted numbers, facts, “studies show” claims?
- **Throughline coherence:** are we still telling the same story?
- **Equation compliance:** meaning gloss present? assumptions? unit check?
- **Cognitive load:** are any slides doing two jobs?

---

## 11) Standard Disclaimers (Reusable)

### 11.1 “Borrowed equation” disclaimer (early in module)
We will use a few physics relations *before* deriving them later in the semester. For now, treat them as reliable tools: your job is to understand what each symbol means, what the equation predicts, and how the result scales.

### 11.2 “Scaling success” disclaimer
In astrophysics, being right to a factor of a few is often a win. We use order-of-magnitude reasoning to detect impossible answers quickly.

---

## 12) Maintenance

- Treat this contract as a versioned spec.
- When a new recurring pattern appears (e.g., a new kind of gloss, or a repeated misconception), update the contract and the data files.

*This is not dumbing down. This is professional pedagogy.*

