# ASTR 101 — Quarto Slide Pattern Library (RevealJS Output)

Purpose: reusable, consistent slide layouts for Quarto `.qmd` lecture decks. These patterns avoid raw RevealJS `<section>` and bespoke HTML grids. Prefer Quarto blocks (`:::`, `::::`) and small, repeatable class + style choices.

Conventions:
- Default on-slide text target: ≤ ~35 words (unless a table).
  - Up to ~50 words is acceptable when necessary (e.g., a definition slide, a short claim/quote you want them to critique, or when using fragments so students never see all the text at once).
  - Rule of thumb: if you can’t say the slide out loud in ~10–15 seconds without rushing, it’s probably too much text for the screen—move detail into `::: notes`.
- Put teaching script, timing, and misconceptions in `::: notes`.
- Use Quarto columns, not RevealJS layout hacks:
  ```markdown
  ::::{.columns}
  ::: {.column width="40%"}
  Left column
  :::
  ::: {.column width="60%"}
  Right column
  :::
  ::::
  ```
- Figures/videos should use the registry shortcodes (`{{< img ... >}}`, `{{< media ... >}}`) when available.

---

## 1) Full-bleed image (no text overlay)

```markdown
## Informative Title {.full-bleed background-color="black"}

{{< img FIG_ID width="100%" height="100%" >}}

::: notes
Timing.
What to point at.
One misconception to surface.
:::
```

## 2) Full-bleed video (media registry) + bottom-left caption overlay

```markdown
## {.full-bleed background-color="black"}

::: {style="position: relative; height: 100%;"}
{{< media MEDIA_ID width="100%" height="100%" >}}
<div class="text-xs font-semibold text-muted"
     style="position:absolute; left:0.9rem; bottom:2.4rem; text-shadow:0 1px 8px rgba(0,0,0,0.55);">
  Short caption (≤ 8 words)
</div>
:::

::: notes
Timing.
Pause points (if any).
What you want students to notice.
:::
```

## 3) Background image prompt (quiet look + 2 prompts)

```markdown
## {background-image="PATH" background-opacity="1"}

::: {.flex .flex-col .justify-between .w-full .pt-2 .pb-4 style="height: 70vh;"}

::: {.text-center .text-lg .font-medium .text-muted}
When you look up at the night sky,<br> what do you see?
:::

::: {.text-center .text-lg .font-medium .text-muted .mb-0}
What do you *assume* you’re seeing?
:::

:::

::: notes
Silence cue (e.g., 5 seconds).
Think prompt (write 2–3 words).
:::
```

## 4) Learning objectives card (over faint background)

```markdown
## Learning Objectives {background-image="PATH" background-opacity="0.4"}

::: {.bg-muted .p-2}
**By the end of today, you can…**
- LO 1
- LO 2
- LO 3
:::

::: notes
Timebox (≤ 60–90 s).
Name the throughline once.
:::
```

## 5) Roadmap (numbered list) + standout closer line

```markdown
## Today: Roadmap {background-image="PATH" background-opacity="0.4"}

::: {.bg-muted .p-2}
1. Part 1
2. Part 2
3. Part 3

::: {.text-center .text-lg .font-semibold .mt-2}
Focus on: recognition, not mastery.
:::
:::

::: notes
Signal where the first retrieval moment will happen.
:::
```

## 6) Big sentence + definition (thesis slide)

```markdown
## How We Turn Light Into Reality {background-image="PATH" background-opacity="0.2"}

::: {.text-center .text-base .text-muted .mt-0}
One-line framing (not a paragraph).
:::

::: {.text-center .text-xl .font-semibold .mt-2}
Pretty pictures → measurements → models → inferences
:::

::: {.fragment}
::: {.text-center .text-base .text-muted .mt-2}
Inference = one-sentence definition.
:::
:::

::: notes
Say the thesis out loud.
One misconception to preempt.
:::
```

## 7) Two-column: definition + consequence

```markdown
## Term: ____ {background-color="black"}

:::: {.columns}
::: {.column width="45%"}
**Definition**  
One sentence.

- supporting bullet (optional)
:::
::: {.column width="55%"}
**So what?**  
- consequence 1
- consequence 2
:::
::::

::: notes
Misconception + quick check idea.
:::
```

## 8) Two-column: figure left, bullets right (study-friendly)

```markdown
## ____ {background-color="black"}

:::: {.columns}
::: {.column width="60%"}
{{< img FIG_ID class="img-center" >}}
:::
::: {.column width="40%"}
**Key takeaways**
- sentence fragment
- sentence fragment
:::
::::

::: notes
Point to 1–2 specific features in the figure.
:::
```

## 9) Four-card grid (organizer / preview)

```markdown
## ____ {background-image="PATH" background-opacity="0.25"}

::: {.layout-grid-2 .mt-2}

::: {.bg-muted .p-2}
**Measure**  
One sentence.
:::

::: {.bg-muted .p-2}
**Infer**  
One sentence.
:::

::: {.bg-muted .p-2}
**Balance**  
One sentence.
:::

::: {.bg-muted .p-2}
**Evolve**  
One sentence.
:::

:::

::: notes
Use as a “promise” slide; don’t detail everything here.
:::
```

## 10) Triad panel spoiler (Measure / Infer / Physics)

```markdown
## Spoiler X: ____ {background-color="black"}

::: {.bg-muted .p-2}
- **Measure:** …
- **Infer:** …
- **Physics:** …
- **Why it matters later:** …
:::

::: notes
Say the triad in the same order every time.
Surface one misconception.
:::
```

## 11) Triad + image (image dominates; triad stays legible)

```markdown
## Spoiler X: ____ {background-color="black"}

:::: {.columns}
::: {.column width="65%"}
{{< img FIG_ID class="img-center" >}}
:::
::: {.column width="35%"}
::: {.bg-muted .p-2}
- **Measure:** …
- **Infer:** …
- **Physics:** …
:::
:::
::::

::: notes
Keep the triad short; details go here.
:::
```

## 12) Split-screen comparison (two images; labels under each)

```markdown
## ____ {background-color="black"}

:::: {.columns}
::: {.column width="50%"}
{{< img FIG_A class="img-center" >}}
::: {.text-center .text-sm .text-muted}
Label A
:::
:::
::: {.column width="50%"}
{{< img FIG_B class="img-center" >}}
::: {.text-center .text-sm .text-muted}
Label B
:::
:::
::::

::: notes
Ask: “What changes? What stays the same?”
:::
```

## 13) Table slide (controlled size)

```markdown
## ____ {background-color="black"}

::: {.table-scroll .text-sm}
| Column | Column | Column |
|---|---|---|
| … | … | … |
:::

::: notes
Say: “Reference map; don’t memorize today.”
:::
```

## 14) Quiz slide (one concept check; fast)

```markdown
## Quick Check: ____ {background-color="#1a1a2e"}

::: {.quiz}
Question?

- [ ] A
- [x] B
- [ ] C
:::

::: notes
Give 20–30 seconds.
Explain why the correct choice is correct.
:::
```

## 15) Think–Pair–Share (timeboxed; prompt first)

```markdown
## Think–Pair–Share {background-image="PATH" background-opacity="0.15"}

Prompt question?

::: {.incremental}
1. **Think** (30 s): …
2. **Pair** (90 s): …
3. **Share** (2 min): …
:::

::: notes
Expected answers.
One misconception to surface before revealing.
:::
```

## 16) Prediction (commit → reveal)

```markdown
## Prediction: ____ {background-color="black"}

Make a prediction before we calculate.

::: {.fragment}
**Reveal:** one-sentence resolution.
:::

::: notes
Collect 2–3 rationales before you correct anything.
:::
```

## 17) Pipeline (simple, legible; no arrow art)

```markdown
## The Decoder-Ring Pipeline {background-color="black"}

::: {.bg-muted .p-2}
**Signal** → **Measurement** → **Model** → **Inference** → **Prediction** → **Test**
:::

::: notes
Walk one concrete example through each stage.
:::
```

## 18) Orientation equation (equation + meaning; notes do the heavy lift)

```markdown
## Orientation: ____ {background-color="black"}

Equation here.

::: {.text-sm .text-muted}
In words: what the equation is saying (1–2 sentences).
:::

::: notes
Define symbols + meaning + units.
State assumption/validity.
Do one sanity check (units or limiting case).
:::
```

## 19) “What to remember” (end-of-chunk study slide)

```markdown
## What To Remember From This Section {background-color="black"}

::: {.bg-muted .p-2}
- Complete sentence 1.
- Complete sentence 2.
- Complete sentence 3.
:::

::: notes
Point forward: where this gets used next.
:::
```

## 20) Misconception (myth → reality → how we know)

```markdown
## Misconception: “____” {background-color="black"}

::: {.bg-muted .p-2}
**Myth:** …

**Reality:** …

**How we know:** …
:::

::: notes
Quick hands poll: who believed the myth?
:::
```

## 21) Transition (one line; reset attention)

```markdown
## ____ {background-image="PATH" background-opacity="0.2"}

::: {.text-center .text-xl .font-semibold}
One-line transition.
:::

::: notes
10–15 seconds, then advance.
:::
```
