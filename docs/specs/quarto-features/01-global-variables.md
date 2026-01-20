# Global Variables

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Course information appears everywhere: the syllabus header, homework instructions, the home page, email signatures in contact info blocks. Without global variables, changing your office hours means hunting through 20+ files to update each occurrence.

**The problem in practice:**

Imagine your syllabus says:

```markdown
<!-- course-info/syllabus.qmd -->
Office hours: Fridays 11:00 am-12:00 pm
```

Your homework template says:

```markdown
<!-- homework/hw01.qmd -->
Questions? Visit office hours: Fridays 11:00 am-12:00 pm
```

Your home page says:

```markdown
<!-- index.qmd -->
Office hours are Fridays 11:00 am-12:00 pm
```

Now it's Week 3 and you need to change office hours to Wednesdays. You must:

1. Remember every file that mentions office hours
2. Open each file and find the text
3. Update each occurrence
4. Hope you didn't miss any

Miss one file, and students get conflicting information. Some show up Friday, some Wednesday. Confusion ensues.

**The solution:** Define the value once in a central configuration file. Reference that value everywhere. When you change the source, every reference updates automatically.

---

## How It Works Mechanically

Quarto's `_quarto.yml` file is the central configuration for your entire site. Every time Quarto renders a page, it reads this file first. You can add a `params:` block with arbitrary key-value pairs—think of it as a dictionary of variables.

These variables become accessible in any `.qmd` file using Quarto's `meta` shortcode: `{{< meta params.KEY >}}`.

**The complete flow:**

```
┌─────────────────────────────────────────────────────────────┐
│                      _quarto.yml                            │
│                                                             │
│  params:                                                    │
│    office-hours: "Fridays 11:00 am-12:00 pm"               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Quarto reads config
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Any .qmd file                             │
│                                                             │
│  Office hours: {{< meta params.office-hours >}}             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Quarto substitutes value
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Rendered output                           │
│                                                             │
│  Office hours: Fridays 11:00 am-12:00 pm                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

When you change the value in `_quarto.yml` and re-render, every page that references it shows the new value.

---

## Configuration: Setting Up Global Variables

Add a `params:` block to your `_quarto.yml`. Here's a comprehensive example:

```yaml
# _quarto.yml

# ============================================================
# Course Parameters (Single Source of Truth)
# ============================================================
# Change these values once; they propagate everywhere via
# {{< meta params.X >}} in any .qmd file.
#
# NAMING CONVENTION: Use kebab-case (hyphenated-names)
# This is Quarto's standard and avoids quoting issues.

params:
  # ─────────────────────────────────────────────────────────
  # Course Identity
  # ─────────────────────────────────────────────────────────
  course-code: "ASTR 101"
  course-title: "Principles of Astronomy"
  semester: "Spring 2026"
  year: "2026"

  # ─────────────────────────────────────────────────────────
  # Instructor Information
  # ─────────────────────────────────────────────────────────
  instructor: "Dr. Anna Rosen"
  email: "alrosen@sdsu.edu"
  office: "Physics 239"
  office-hours: "Fridays 11:00 am-12:00 pm (and by appointment)"
  # Note: You can include formatting in values

  # ─────────────────────────────────────────────────────────
  # Class Logistics
  # ─────────────────────────────────────────────────────────
  class-time: "Tues/Thurs 12:30-1:45 pm"
  location: "LH 245"
  first-day: "January 20, 2026"
  last-day: "May 5, 2026"
  final-exam-date: "May 7, 2026"
  final-exam-time: "10:30 am - 12:30 pm"
  final-exam-location: "LH 249"

  # ─────────────────────────────────────────────────────────
  # Important URLs
  # ─────────────────────────────────────────────────────────
  website-url: "https://astrobytes-edu.github.io/astr101-sp26"
  canvas-url: "https://sdsu.instructure.com"
  # Add more as needed: discord-url, piazza-url, github-url

  # ─────────────────────────────────────────────────────────
  # Textbook Information
  # ─────────────────────────────────────────────────────────
  # Note: Markdown formatting (*italics*) works in values
  textbook: "Stan Owocki, *Fundamentals of Astrophysics*, 2nd Edition"
  textbook-isbn: "9781009618007"
  textbook-publisher: "Cambridge University Press"

  # ─────────────────────────────────────────────────────────
  # Assets (paths relative to project root)
  # ─────────────────────────────────────────────────────────
  logo: "assets/astr201-logo.png"
```

**Key points about the configuration:**

1. **Kebab-case naming:** Use `office-hours`, not `officeHours` or `office_hours`. This is Quarto's convention and avoids YAML quoting issues.

2. **String values:** Always quote values, especially those with colons, special characters, or that look like numbers/booleans.

3. **Markdown in values:** You can include Markdown formatting. The `textbook` value uses `*italics*` and it will render correctly.

4. **Nesting is possible:** You could use nested structures like `instructor.name` and `instructor.email`, but flat is simpler.

5. **Comments:** Use `#` for comments. Group related parameters with comment headers for readability.

---

## Usage: Referencing Variables in Content

In any `.qmd` file, use the `{{< meta params.KEY >}}` shortcode to insert a value:

```markdown
---
title: "Course Syllabus"
---

## Instructor Information

**Instructor:** {{< meta params.instructor >}}
**Email:** {{< meta params.email >}}
**Office:** {{< meta params.office >}}
**Office Hours:** {{< meta params.office-hours >}}

## Class Schedule

We meet {{< meta params.class-time >}} in {{< meta params.location >}}.

The first day of class is {{< meta params.first-day >}}.
The last day of class is {{< meta params.last-day >}}.

## Final Exam

**Date:** {{< meta params.final-exam-date >}}
**Time:** {{< meta params.final-exam-time >}}
**Location:** {{< meta params.final-exam-location >}}

## Required Textbook

{{< meta params.textbook >}}
ISBN: {{< meta params.textbook-isbn >}}
```

**This renders as:**

> ## Instructor Information
>
> **Instructor:** Dr. Anna Rosen
> **Email:** alrosen@sdsu.edu
> **Office:** Physics 239
> **Office Hours:** Fridays 11:00 am-12:00 pm (and by appointment)
>
> ## Class Schedule
>
> We meet Tues/Thurs 12:30-1:45 pm in LH 245.
>
> The first day of class is January 20, 2026.
> The last day of class is May 5, 2026.
>
> ## Final Exam
>
> **Date:** May 7, 2026
> **Time:** 10:30 am - 12:30 pm
> **Location:** LH 249
>
> ## Required Textbook
>
> Stan Owocki, *Fundamentals of Astrophysics*, 2nd Edition
> ISBN: 9781009618007

---

## Updating Values: The Single Source of Truth in Action

When office hours change mid-semester:

1. Open `_quarto.yml`
2. Find the line: `office-hours: "Fridays 11:00 am-12:00 pm (and by appointment)"`
3. Change it to: `office-hours: "Wednesdays 2:00-3:00 pm (and by appointment)"`
4. Run `quarto render`
5. Every page now shows the new hours

**No grep. No find-and-replace. No missed instances. One change, everywhere updated.**

---

## Common Parameters to Define

| Category | Suggested Parameters |
|----------|---------------------|
| **Course** | `course-code`, `course-title`, `semester`, `year`, `credits` |
| **Instructor** | `instructor`, `email`, `office`, `office-hours`, `phone` |
| **Logistics** | `class-time`, `location`, `first-day`, `last-day` |
| **Final Exam** | `final-exam-date`, `final-exam-time`, `final-exam-location` |
| **URLs** | `website-url`, `canvas-url`, `discord-url`, `piazza-url` |
| **Textbook** | `textbook`, `textbook-isbn`, `textbook-url`, `textbook-publisher` |
| **Assets** | `logo`, `banner-image`, `favicon` |
| **TA Info** | `ta-name`, `ta-email`, `ta-office`, `ta-office-hours` |

---

## Common Pitfalls

### 1. Forgetting to quote values with colons

```yaml
# WRONG - YAML interprets this as nested structure
class-time: Tues/Thurs: 12:30-1:45 pm

# CORRECT - quoted string
class-time: "Tues/Thurs 12:30-1:45 pm"
```

### 2. Using wrong case in references

```markdown
<!-- WRONG - case must match exactly -->
{{< meta params.Office-Hours >}}

<!-- CORRECT -->
{{< meta params.office-hours >}}
```

### 3. Forgetting the `params.` prefix

```markdown
<!-- WRONG - missing params prefix -->
{{< meta office-hours >}}

<!-- CORRECT -->
{{< meta params.office-hours >}}
```

### 4. Using underscores instead of hyphens

```yaml
# Works but inconsistent with Quarto conventions
office_hours: "..."

# Preferred - kebab-case
office-hours: "..."
```

---

## Next Steps

- [Includes](02-includes.md) — Reusable content blocks that can reference global variables
- [Custom Shortcodes](03-shortcodes.md) — Create shortcodes that read from global variables
