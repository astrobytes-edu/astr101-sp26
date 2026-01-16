# Includes

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Some content belongs on multiple pages. The grading scale appears on the syllabus AND the grade breakdown page. Submission instructions appear on every homework. The AI policy lives on both the syllabus and a dedicated policy page.

**Without includes, you have two bad options:**

**Option 1: Copy-paste (maintenance nightmare)**

- Copy the grading scale to `syllabus.qmd`
- Copy the same table to `grades.qmd`
- When you adjust the B+ cutoff from 87% to 88%, update both files
- Inevitably forget one, creating inconsistencies
- Students find conflicting information and lose trust

**Option 2: Only put it in one place (bad UX)**

- Only put the grading scale on the syllabus
- Students looking at the grades page have to navigate elsewhere
- Information isn't where users expect it

**With includes, you get the best of both worlds:**

- Write the grading scale once in `_includes/grading-scale.qmd`
- Include it in both `syllabus.qmd` and `grades.qmd`
- Update the source file once; both pages update automatically
- Information is everywhere students expect it, always consistent

---

## How Includes Work Mechanically

Quarto's `include` shortcode pulls content from another file and inserts it exactly where the shortcode appears. It's like copy-paste, but automatic and always current.

**The flow:**

```
┌─────────────────────────────────────────────────────────────┐
│              _includes/grading-scale.qmd                    │
│                                                             │
│  | Grade | Range |                                         │
│  |-------|-------|                                         │
│  | A     | 93-100% |                                       │
│  | B     | 83-92%  |                                       │
│  | ...   | ...     |                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                │                           │
                │                           │
                ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│     syllabus.qmd         │    │      grades.qmd          │
│                          │    │                          │
│  ## Grading Scale        │    │  ## Grade Breakdown      │
│                          │    │                          │
│  {{< include             │    │  {{< include             │
│    _includes/grading-    │    │    _includes/grading-    │
│    scale.qmd >}}         │    │    scale.qmd >}}         │
│                          │    │                          │
└──────────────────────────┘    └──────────────────────────┘
                │                           │
                │  Quarto renders           │
                ▼                           ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  syllabus.html           │    │  grades.html             │
│                          │    │                          │
│  Grading Scale           │    │  Grade Breakdown         │
│  | A | 93-100% |         │    │  | A | 93-100% |         │
│  | B | 83-92%  |         │    │  | B | 83-92%  |         │
│  (identical content)     │    │  (identical content)     │
│                          │    │                          │
└──────────────────────────┘    └──────────────────────────┘
```

**When you edit `_includes/grading-scale.qmd`, both rendered pages update on the next `quarto render`.**

---

## Directory Structure: Organizing Your Includes

Create an `_includes/` directory at your project root. The underscore prefix is a convention (like `_quarto.yml`) indicating "special/system file."

```
your-course/
├── _quarto.yml
├── _includes/                         # Reusable content blocks
│   │
│   │  # Contact & Logistics
│   ├── instructor-contact.qmd        # Instructor info callout
│   ├── class-logistics.qmd           # Time/location table
│   ├── textbook-info.qmd             # Required textbook details
│   ├── getting-help.qmd              # Where to get help
│   │
│   │  # Policies & Grading
│   ├── course-policies.qmd           # Academic integrity, etc.
│   ├── grading-scale.qmd             # Letter grade table
│   ├── grading-weights.qmd           # Component weights (HW 30%, etc.)
│   ├── ai-policy.qmd                 # AI usage policy
│   ├── exam-rules.qmd                # What to bring, time limits
│   │
│   │  # Assignments
│   ├── hw-submission-instructions.qmd  # How to submit homework
│   ├── submission-reminder.qmd         # Deadline warning callout
│   ├── scholarly-engagement.qmd        # Class participation rubric
│   │
│   │  # Mindset & Support
│   └── growth-mindset.qmd            # Growth mindset message
│
├── course-info/
│   └── syllabus.qmd                  # Uses many includes
└── homework/
    └── hw01.qmd                      # Uses submission instructions
```

---

## Example Include Files

### `_includes/instructor-contact.qmd`

This include uses global variables, making it truly portable:

```markdown
::: {.callout-note icon=false}
## {{< meta params.instructor >}}

| | |
|:--|:--|
| **Email** | [{{< meta params.email >}}](mailto:{{< meta params.email >}}) |
| **Office** | {{< meta params.office >}} |
| **Office Hours** | {{< meta params.office-hours >}} |

:::
```

**Notice:** This include references `{{< meta params.X >}}` — the global variables we defined in [01-global-variables.md](01-global-variables.md). Includes can use all the same features as regular `.qmd` files. This means you can write the include once and it automatically pulls the current instructor info from `_quarto.yml`.

### `_includes/grading-scale.qmd`

A simple table, no variables needed:

```markdown
| Letter | Percentage | Letter | Percentage |
|:------:|:----------:|:------:|:----------:|
| A  | 93-100% | C  | 73-76% |
| A- | 90-92%  | C- | 70-72% |
| B+ | 87-89%  | D+ | 67-69% |
| B  | 83-86%  | D  | 63-66% |
| B- | 80-82%  | D- | 60-62% |
| C+ | 77-79%  | F  | < 60%  |
```

### `_includes/ai-policy.qmd`

A callout with formatted content:

```markdown
::: {.callout-important}
## AI Usage Policy

You may use AI tools (ChatGPT, Claude, GitHub Copilot, etc.) as **learning aids**, but you must follow these rules:

1. **Understand everything you submit.** If you can't explain your work line-by-line, you haven't learned it. The exams will reveal this.

2. **Cite AI assistance.** When AI helps you, add a brief note: "Used ChatGPT to help debug the unit conversion" or "Claude helped me understand the Stefan-Boltzmann law."

3. **Don't copy solutions directly.** Use AI to understand concepts, check your reasoning, or debug—not to avoid thinking. The goal is learning, not task completion.

4. **AI makes mistakes.** Large language models confidently produce wrong answers. Always verify AI output against your textbook, lecture notes, or physical intuition.

**Submitting AI-generated work you don't understand is academic dishonesty** and will be treated as such.
:::
```

### `_includes/submission-reminder.qmd`

A deadline warning to include on every homework:

```markdown
::: {.callout-warning}
## Submission Reminder

- **Submit via Canvas** before 11:59 PM on the due date
- Late submissions: 10% penalty per day, up to 3 days
- After 3 days: no credit (but still submit for feedback)
- Technical issues? Email {{< meta params.email >}} BEFORE the deadline
:::
```

---

## Using Includes in Your Files

The syntax is `{{< include PATH >}}` where PATH is relative to your project root:

```markdown
---
title: "ASTR 201 Syllabus"
---

## Instructor

{{< include _includes/instructor-contact.qmd >}}

## Class Schedule

{{< include _includes/class-logistics.qmd >}}

## Textbook

{{< include _includes/textbook-info.qmd >}}

## Grading

### Component Weights

{{< include _includes/grading-weights.qmd >}}

### Grading Scale

{{< include _includes/grading-scale.qmd >}}

## Policies

{{< include _includes/course-policies.qmd >}}

{{< include _includes/ai-policy.qmd >}}

{{< include _includes/exam-rules.qmd >}}

## Getting Help

{{< include _includes/getting-help.qmd >}}
```

**The syllabus is now a composition of reusable blocks.** Each block can be updated independently, and changes propagate everywhere the block is used.

---

## Include Best Practices

### 1. No YAML frontmatter in includes

Includes are content fragments, not standalone documents. They don't have titles or metadata—that belongs in the parent document.

```markdown
<!-- WRONG - includes don't have frontmatter -->
---
title: "Grading Scale"
---
| Grade | Range |
...

<!-- CORRECT - just the content -->
| Grade | Range |
...
```

### 2. Use relative paths from project root

Always reference includes from the project root, not relative to the current file:

```markdown
<!-- CORRECT - from project root -->
{{< include _includes/grading-scale.qmd >}}

<!-- WRONG - relative path that breaks if file moves -->
{{< include ../../../_includes/grading-scale.qmd >}}
```

### 3. Keep includes focused

One topic per file. Don't combine grading scale + grading weights + late policy into one mega-include. Smaller blocks are more reusable.

### 4. Use global variables in includes

This makes includes truly portable. The `instructor-contact.qmd` include works for any course because it reads from `params`.

### 5. Includes can include includes

But keep nesting shallow (max 2 levels) or debugging becomes difficult.

---

## Common Pitfalls

### 1. Wrong path

```markdown
<!-- WRONG - file doesn't exist at this path -->
{{< include includes/grading-scale.qmd >}}

<!-- CORRECT - underscore prefix -->
{{< include _includes/grading-scale.qmd >}}
```

### 2. Missing closing `>}}`

```markdown
<!-- WRONG -->
{{< include _includes/grading-scale.qmd >

<!-- CORRECT -->
{{< include _includes/grading-scale.qmd >}}
```

### 3. Adding frontmatter to includes

If you add frontmatter to an include file, it will appear as raw text in the parent document.

---

## Next Steps

- [Custom Shortcodes](03-shortcodes.md) — Create reusable markup patterns
- [Global Variables](01-global-variables.md) — Make includes portable with params
