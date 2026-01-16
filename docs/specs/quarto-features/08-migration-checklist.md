# Migration Checklist

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Overview

This checklist walks you through adding all the Quarto features documented in this spec series to an existing course website. Follow it in order—later steps depend on earlier ones.

**Time estimate:** 2-4 hours for a typical course site

**Prerequisites:**

- A working Quarto project with `_quarto.yml`
- Basic familiarity with YAML, Markdown, and Lua
- Python 3.8+ (for computed schedules)

---

## Phase 1: Global Variables

**Goal:** Establish single-source-of-truth for course metadata.

### Step 1.1: Add params block to `_quarto.yml`

Open `_quarto.yml` and add the `params` block under the `website` section:

```yaml
website:
  title: "Your Course Title"
  # ... existing config ...

  params:
    # Course identification
    course-number: "ASTR 201"
    course-title: "Astronomy for Science Majors"
    semester: "Spring 2026"

    # Instructor
    instructor: "Dr. Your Name"
    email: "you@university.edu"
    office: "Building 123"
    office-hours: "Mon/Wed 2-3pm or by appointment"

    # Links
    canvas-url: "https://canvas.university.edu/courses/12345"
    textbook: "An Introduction to Modern Astrophysics (Carroll & Ostlie)"

    # Dates
    semester-start: "2026-01-20"
    semester-end: "2026-05-15"
```

### Step 1.2: Test that params work

Create a test file `_test-params.qmd`:

```markdown
---
title: "Params Test"
---

Course: {{< meta params.course-number >}}
Instructor: {{< meta params.instructor >}}
Email: {{< meta params.email >}}
```

Render it:

```bash
quarto render _test-params.qmd
open _test-params.html
```

**Verify:** The page shows your actual values, not the literal `{{< meta ... >}}` text.

### Step 1.3: Update existing files to use params

Search your project for hardcoded values:

```bash
grep -r "your@email.edu" *.qmd
grep -r "Dr. Your Name" *.qmd
grep -r "Spring 2026" *.qmd
```

Replace each hardcoded value with the corresponding `{{< meta params.X >}}` reference.

**Checkpoint:** Delete `_test-params.qmd` and `_test-params.html`. Run `quarto render` and verify no errors.

---

## Phase 2: Includes

**Goal:** Create reusable content blocks for multi-page content.

### Step 2.1: Create the includes directory

```bash
mkdir _includes
```

### Step 2.2: Create instructor contact include

Create `_includes/instructor-contact.qmd`:

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

### Step 2.3: Create grading scale include

Create `_includes/grading-scale.qmd`:

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

### Step 2.4: Create AI policy include

Create `_includes/ai-policy.qmd`:

```markdown
::: {.callout-important}
## AI Usage Policy

You may use AI tools (ChatGPT, Claude, GitHub Copilot, etc.) as **learning aids**, but:

1. **Understand everything you submit.** If you can't explain your work line-by-line, you haven't learned it.

2. **Cite AI assistance.** Add a brief note: "Used ChatGPT to help debug the unit conversion."

3. **Don't copy solutions directly.** Use AI to understand concepts, not avoid thinking.

4. **AI makes mistakes.** Always verify AI output against your textbook or lecture notes.

**Submitting AI-generated work you don't understand is academic dishonesty.**
:::
```

### Step 2.5: Use includes in your syllabus

Open your syllabus file and add includes:

```markdown
## Instructor

{{< include _includes/instructor-contact.qmd >}}

## Grading Scale

{{< include _includes/grading-scale.qmd >}}

## AI Policy

{{< include _includes/ai-policy.qmd >}}
```

### Step 2.6: Verify includes work

```bash
quarto render course-info/syllabus.qmd
open _site/course-info/syllabus.html
```

**Verify:** The included content appears correctly. The instructor callout shows your actual name and email from params.

**Checkpoint:** Run `quarto render` on the full site. No errors.

---

## Phase 3: Custom Shortcodes

**Goal:** Create consistent formatting for common patterns.

### Step 3.1: Create extension directory structure

```bash
mkdir -p _extensions/course
```

### Step 3.2: Create extension metadata

Create `_extensions/course/_extension.yml`:

```yaml
title: Course Shortcodes
author: Your Name
version: 1.0.0
contributes:
  shortcodes:
    - shortcodes.lua
```

### Step 3.3: Create shortcodes file

Create `_extensions/course/shortcodes.lua`:

```lua
-- Course shortcodes

-- Due date: {{< due "2026-02-15" >}}
function due(args)
  local date = args[1] or "TBD"
  return pandoc.Strong(pandoc.Str("Due: " .. date))
end

-- Point value: {{< points 10 >}}
function points(args)
  local pts = args[1] or "?"
  return pandoc.Emph(pandoc.Str("(" .. pts .. " points)"))
end

-- Reading: {{< reading "Ch. 3" "pp. 45-62" >}}
function reading(args)
  local chapter = args[1] or ""
  local pages = args[2] or ""
  if pages ~= "" then
    return pandoc.Str(chapter .. ", " .. pages)
  else
    return pandoc.Str(chapter)
  end
end

-- Instructor name from params: {{< instructor >}}
function instructor(args)
  local meta = quarto.doc.metadata
  local name = meta.params and meta.params.instructor or "Instructor"
  return pandoc.Str(pandoc.utils.stringify(name))
end

-- Email link from params: {{< email >}}
function email(args)
  local meta = quarto.doc.metadata
  local addr = meta.params and meta.params.email or "email@example.com"
  addr = pandoc.utils.stringify(addr)
  return pandoc.Link(addr, "mailto:" .. addr)
end
```

### Step 3.4: Register the extension

Add to `_quarto.yml`:

```yaml
filters:
  - course
```

### Step 3.5: Test shortcodes

Create `_test-shortcodes.qmd`:

```markdown
---
title: "Shortcode Test"
---

## Test Results

- Due date: {{< due "2026-02-15" >}}
- Points: {{< points 10 >}}
- Reading: {{< reading "Ch. 3" "pp. 45-62" >}}
- Instructor: {{< instructor >}}
- Email: {{< email >}}
```

```bash
quarto render _test-shortcodes.qmd
open _test-shortcodes.html
```

**Verify:** All shortcodes render correctly. Email is a clickable mailto link.

**Checkpoint:** Delete test file. Run `quarto render`. No errors.

---

## Phase 4: Computed Schedules (Optional)

**Goal:** Generate lecture dates automatically from semester start date.

### Step 4.1: Create data directory and schedule file

```bash
mkdir -p data
mkdir -p scripts
```

Create `data/schedule.yml`:

```yaml
semester_start: 2026-01-20
lectures_per_week: 2
days: [Tue, Thu]

breaks:
  - date: 2026-03-16
    name: "Spring Break"
    duration: 5

modules:
  - name: "Module 1: Foundations"
    lectures:
      - title: "Course Overview"
        reading: "Syllabus"
      - title: "Scaling & Units"
        reading: "Ch. 1, pp. 3-7"
      # Add more lectures...
```

### Step 4.2: Create schedule generator script

Create `scripts/schedule_generator.py` with the code from [04-computed-schedules.md](04-computed-schedules.md).

### Step 4.3: Test the generator

```bash
cd /path/to/your/project
python scripts/schedule_generator.py
```

**Verify:** A Markdown table with dates prints to the console.

### Step 4.4: Use in your schedule page

Update `course-info/schedule.qmd`:

````markdown
---
title: "Course Schedule"
---

```{python}
#| echo: false
#| output: asis

import sys
sys.path.insert(0, '..')

from scripts.schedule_generator import generate_schedule, format_schedule_table

schedule, _ = generate_schedule('../data/schedule.yml')
print(format_schedule_table(schedule))
```
````

```bash
quarto render course-info/schedule.qmd
```

**Checkpoint:** Schedule renders with computed dates.

---

## Phase 5: Profiles (Optional)

**Goal:** Create student and instructor versions from same source.

### Step 5.1: Create student profile

Create `_quarto-student.yml`:

```yaml
project:
  output-dir: _site-student

format:
  html:
    include-in-header:
      text: |
        <style>
        .instructor-only { display: none !important; }
        </style>
```

### Step 5.2: Create instructor profile

Create `_quarto-instructor.yml`:

```yaml
project:
  output-dir: _site-instructor

format:
  html:
    include-in-header:
      text: |
        <style>
        .instructor-only {
          display: block !important;
          border-left: 3px solid #dc3545;
          background-color: #fff5f5;
          padding: 0.5em 1em;
          margin: 1em 0;
        }
        .instructor-only::before {
          content: "🔒 INSTRUCTOR ONLY";
          font-weight: bold;
          color: #dc3545;
          display: block;
          margin-bottom: 0.5em;
        }
        </style>
```

### Step 5.3: Add instructor-only content to a page

```markdown
## Grading

The grading scale is shown below.

::: {.instructor-only}
**Answer Key Notes:**
- Problem 3 has two valid solutions
- Accept 3.14 or π for the constant
:::
```

### Step 5.4: Build both versions

```bash
quarto render --profile student
quarto render --profile instructor
```

**Verify:**

- `_site-student/` has no instructor content visible
- `_site-instructor/` has instructor content with red styling

**Checkpoint:** Both sites build without errors.

---

## Phase 6: Conditional Content (Optional)

**Goal:** Different content for HTML vs PDF output.

### Step 6.1: Add conditional content to a page

In any `.qmd` file:

```markdown
## Stellar Evolution Video

::: {.content-visible when-format="html"}
Watch the animation:

<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
:::

::: {.content-visible when-format="pdf"}
**Video:** Stellar Evolution Animation

*See the course website for the video.*
:::
```

### Step 6.2: Test both formats

```bash
quarto render mypage.qmd --to html
quarto render mypage.qmd --to pdf
```

**Verify:**

- HTML shows the embedded video
- PDF shows the "See the course website" message

---

## Phase 7: Cross-References

**Goal:** Auto-numbered figures, tables, and equations.

### Step 7.1: Enable section numbering

Add to `_quarto.yml`:

```yaml
format:
  html:
    number-sections: true
```

### Step 7.2: Add labels to existing figures

Find all your figures and add labels:

```markdown
<!-- Before -->
![H-R Diagram](figures/hr.png)

<!-- After -->
![H-R Diagram](figures/hr.png){#fig-hr-diagram}
```

### Step 7.3: Add labels to tables

```markdown
| Col 1 | Col 2 |
|-------|-------|
| Data  | Data  |

: My caption {#tbl-my-table}
```

### Step 7.4: Add labels to equations

```markdown
$$
E = mc^2
$$ {#eq-einstein}
```

### Step 7.5: Add cross-references

Replace hardcoded references:

```markdown
<!-- Before -->
See Figure 3 above.

<!-- After -->
See @fig-hr-diagram above.
```

### Step 7.6: Verify cross-references

```bash
quarto render
```

**Verify:** No warnings about unresolved cross-references. Figures/tables/equations are numbered. References show correct numbers.

---

## Final Verification

Run the complete site build:

```bash
quarto render
```

Check for:

- [ ] No YAML parsing errors
- [ ] No missing file errors
- [ ] No unresolved cross-reference warnings
- [ ] All includes resolve correctly
- [ ] All shortcodes render correctly
- [ ] Params substitute correctly throughout

Open the site in a browser and spot-check:

- [ ] Syllabus shows correct instructor info
- [ ] Grading scale appears on all relevant pages
- [ ] AI policy callout renders correctly
- [ ] Schedule dates are correct
- [ ] Figure/table/equation numbers are correct
- [ ] Cross-references link to correct targets

---

## Troubleshooting

### "Unknown filter: course"

You forgot to add the extension to `_quarto.yml`:

```yaml
filters:
  - course
```

### Shortcodes render as literal text

Check that:

1. `_extensions/course/_extension.yml` exists
2. `_extensions/course/shortcodes.lua` exists
3. `filters: [course]` is in `_quarto.yml`
4. No syntax errors in the Lua file

### Include file not found

Check the path is relative to the project root:

```markdown
<!-- Wrong -->
{{< include grading-scale.qmd >}}

<!-- Correct -->
{{< include _includes/grading-scale.qmd >}}
```

### Cross-reference shows "??"

The label doesn't exist. Check:

1. Spelling of the label: `{#fig-hr-diagram}` vs `@fig-hr-diagam`
2. The label is attached to the element (no space between image and `{#...}`)
3. The prefix matches the element type (`fig-` for figures, `tbl-` for tables)

### Params show as literal `{{< meta params.X >}}`

Check that:

1. The `params` block is under `website` in `_quarto.yml`
2. No YAML syntax errors (proper indentation)
3. The param name matches exactly (case-sensitive, hyphens vs underscores)

---

## Maintenance Calendar

After initial setup, these are the only updates needed each semester:

| When | What | Where |
|------|------|-------|
| Before semester | Update semester dates | `_quarto.yml` params |
| Before semester | Update office hours | `_quarto.yml` params |
| Before semester | Update Canvas URL | `_quarto.yml` params |
| Before semester | Update schedule | `data/schedule.yml` |
| If grading changes | Update grading scale | `_includes/grading-scale.qmd` |
| If policies change | Update AI policy | `_includes/ai-policy.qmd` |

Everything else propagates automatically.

---

## Files Created in This Migration

```
your-course/
├── _quarto.yml                    # Modified (params, filters)
├── _quarto-student.yml            # New (Phase 5)
├── _quarto-instructor.yml         # New (Phase 5)
├── _includes/
│   ├── instructor-contact.qmd     # New (Phase 2)
│   ├── grading-scale.qmd          # New (Phase 2)
│   └── ai-policy.qmd              # New (Phase 2)
├── _extensions/
│   └── course/
│       ├── _extension.yml         # New (Phase 3)
│       └── shortcodes.lua         # New (Phase 3)
├── data/
│   └── schedule.yml               # New (Phase 4)
└── scripts/
    └── schedule_generator.py      # New (Phase 4)
```

---

**Migration complete.** Your course site now has single-source-of-truth metadata, reusable includes, custom shortcodes, computed schedules, profile-based rendering, conditional content, and auto-numbered cross-references.
