# Profiles (Student vs. Instructor Views)

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

You want a single source of truth for course materials, but different audiences need different views:

- **Students** see: assignments, instructions, due dates
- **Instructors** see: solutions, answer keys, teaching notes, common misconceptions

**Without profiles, you have three bad options:**

**Option 1: Two separate sites (double maintenance)**

- Maintain `course-public/` for students
- Maintain `course-instructor/` with solutions
- Every change must be made twice
- Sites inevitably drift apart
- You forget to add a solution, or add it to the wrong site

**Option 2: Post everything publicly (academic integrity disaster)**

- Solutions are on the public site
- Students find them before homework is due
- Defeats the purpose of assignments

**Option 3: Comment/uncomment before each render (error-prone)**

- Comment out solutions in source files
- Render for students
- Uncomment solutions
- Render for instructors
- Inevitably forget, publishing solutions publicly

**Profiles solve all of this:**

- Write everything once in single source files
- Mark instructor-only content with CSS classes
- `quarto render` → student version (solutions hidden)
- `quarto render --profile instructor` → instructor version (solutions visible)
- Two outputs from one source, always in sync

---

## How Profiles Work: The Complete Mechanical Explanation

Quarto profiles let you **override any configuration** based on which profile you're rendering. The system works through configuration file layering:

```
┌─────────────────────────────────────────────────────────────────┐
│                       _quarto.yml                               │
│                  (BASE configuration)                           │
│                                                                 │
│  - Always loaded first                                          │
│  - Contains everything shared by both profiles                  │
│  - Declares which profiles exist                                │
│                                                                 │
│  profile:                                                       │
│    default: student    <- used when no --profile specified      │
│    group:                                                       │
│      - student                                                  │
│      - instructor                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
              Quarto checks which profile is active
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│    _quarto-student.yml        │     │   _quarto-instructor.yml      │
│    (OVERRIDE configuration)   │     │   (OVERRIDE configuration)    │
│                               │     │                               │
│  Loaded when:                 │     │  Loaded when:                 │
│  - quarto render              │     │  - quarto render              │
│  - quarto render              │     │      --profile instructor     │
│      --profile student        │     │                               │
│                               │     │                               │
│  What it overrides:           │     │  What it overrides:           │
│  - Injects CSS to HIDE        │     │  - Injects CSS to SHOW        │
│    .instructor-only           │     │    .instructor-only           │
│    .solution-block            │     │    .solution-block            │
│    .answer-key                │     │    .answer-key                │
│                               │     │  - Changes output directory   │
│                               │     │  - Adds "[INSTRUCTOR]" to     │
│                               │     │    site title                 │
└───────────────────────────────┘     └───────────────────────────────┘
        │                                           │
        ▼                                           ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│         _site/                │     │     _site-instructor/         │
│    (PUBLIC output)            │     │     (PRIVATE output)          │
│                               │     │                               │
│  - Deploy to public server    │     │  - Keep on your machine       │
│  - Students see this          │     │  - Or private server          │
│  - Solutions: HIDDEN          │     │  - Solutions: VISIBLE         │
└───────────────────────────────┘     └───────────────────────────────┘
```

**The key insight:** Profile files only contain **overrides**. They don't repeat the base configuration—they just change specific settings.

---

## The Three Configuration Files in Detail

### File 1: `_quarto.yml` (Base Configuration)

This contains everything shared by both profiles:

```yaml
# _quarto.yml

# ═══════════════════════════════════════════════════════════════
# GLOBAL PARAMETERS (shared by both profiles)
# ═══════════════════════════════════════════════════════════════
params:
  course-code: "ASTR 101"
  course-title: "Principles of Astronomy"
  semester: "Spring 2026"
  instructor: "Dr. Anna Rosen"
  email: "alrosen@sdsu.edu"
  # ... other params

# ═══════════════════════════════════════════════════════════════
# PROFILE DECLARATION
# This tells Quarto what profiles exist and which is default
# ═══════════════════════════════════════════════════════════════
profile:
  default: student    # Used when you run `quarto render` with no --profile
  group:
    - student         # Activates _quarto-student.yml
    - instructor      # Activates _quarto-instructor.yml

# ═══════════════════════════════════════════════════════════════
# PROJECT STRUCTURE (shared by both profiles)
# ═══════════════════════════════════════════════════════════════
project:
  type: website
  render:
    - index.qmd
    - course-info/*.qmd
    - modules/*.qmd
    - slides/*.qmd
    - homework/*.qmd
    - exams/*.qmd

# ═══════════════════════════════════════════════════════════════
# WEBSITE CONFIGURATION (shared base, can be overridden)
# ═══════════════════════════════════════════════════════════════
website:
  title: "ASTR 101: Principles of Astronomy (Spring 2026)"
  navbar:
    logo: assets/astr201-logo.png
  sidebar:
    style: "docked"
    search: true
    contents:
      - href: index.qmd
        text: Home
      # ... rest of sidebar

# ═══════════════════════════════════════════════════════════════
# FORMAT CONFIGURATION (shared base, can be overridden)
# ═══════════════════════════════════════════════════════════════
format:
  html:
    theme:
      light: [cosmo, assets/theme/site-light.scss]
      dark: [darkly, assets/theme/site-dark.scss]
    toc: true
    toc-depth: 3

# ═══════════════════════════════════════════════════════════════
# EXTENSIONS
# ═══════════════════════════════════════════════════════════════
filters:
  - course
```

### File 2: `_quarto-student.yml` (Student Profile Overrides)

This file is loaded when rendering the student version. It **only contains overrides**:

```yaml
# _quarto-student.yml
# ═══════════════════════════════════════════════════════════════
# STUDENT PROFILE
# Loaded when: quarto render (default) OR quarto render --profile student
# Purpose: Hide instructor-only content from public website
# ═══════════════════════════════════════════════════════════════

# Override params to indicate what's visible
# (These can be used in conditionals within content if needed)
params:
  show-solutions: false
  show-answer-keys: false
  show-instructor-notes: false

# Keep the standard title (explicit for clarity)
website:
  title: "ASTR 101: Principles of Astronomy (Spring 2026)"

# ═══════════════════════════════════════════════════════════════
# THE KEY PART: CSS that HIDES instructor content
# ═══════════════════════════════════════════════════════════════
#
# How this works:
# 1. In your .qmd files, you wrap instructor content in fenced divs
#    with classes like .instructor-only, .solution-block, .answer-key
#
# 2. This CSS sets display: none on those classes
#
# 3. The content is NOT visible in the rendered HTML
#
# ═══════════════════════════════════════════════════════════════

format:
  html:
    include-in-header:
      - text: |
          <style>
          /* ─────────────────────────────────────────────────────
             HIDE all instructor-only content
             The !important ensures this overrides any other styles
             ───────────────────────────────────────────────────── */
          .instructor-only {
            display: none !important;
          }

          .solution-block {
            display: none !important;
          }

          .answer-key {
            display: none !important;
          }
          </style>
```

**What's happening here:**

- The `format.html.include-in-header` setting injects CSS into every page
- The CSS uses `display: none` to completely hide any element with these classes
- `!important` ensures the hiding can't be accidentally overridden

### File 3: `_quarto-instructor.yml` (Instructor Profile Overrides)

This file is loaded when rendering with `--profile instructor`:

```yaml
# _quarto-instructor.yml
# ═══════════════════════════════════════════════════════════════
# INSTRUCTOR PROFILE
# Loaded when: quarto render --profile instructor
# Purpose: Show all content with distinctive styling
# ═══════════════════════════════════════════════════════════════

# Override params
params:
  show-solutions: true
  show-answer-keys: true
  show-instructor-notes: true

# ═══════════════════════════════════════════════════════════════
# CLEARLY MARK this as instructor version
# Anyone looking at the site immediately knows it's not public
# ═══════════════════════════════════════════════════════════════
website:
  title: "ASTR 101 [INSTRUCTOR VERSION]"

# ═══════════════════════════════════════════════════════════════
# OUTPUT TO SEPARATE DIRECTORY
# This is CRITICAL - don't overwrite the public student site!
# ═══════════════════════════════════════════════════════════════
project:
  output-dir: _site-instructor

# ═══════════════════════════════════════════════════════════════
# THE KEY PART: CSS that SHOWS and STYLES instructor content
# ═══════════════════════════════════════════════════════════════

format:
  html:
    include-in-header:
      - text: |
          <style>
          /* ═════════════════════════════════════════════════════
             INSTRUCTOR-ONLY CONTENT
             Yellow/gold styling to stand out
             ════════════════════════════════════════════════════= */
          .instructor-only {
            display: block !important;  /* Override any hiding */
            background: #fff3cd;        /* Light yellow background */
            border-left: 4px solid #ffc107;  /* Gold left border */
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 4px 4px 0;
          }

          /* Add label before the content */
          .instructor-only::before {
            content: "INSTRUCTOR ONLY";
            display: block;
            font-weight: bold;
            color: #856404;
            margin-bottom: 0.5rem;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* ═════════════════════════════════════════════════════
             SOLUTION BLOCKS
             Green styling for solutions
             ════════════════════════════════════════════════════= */
          .solution-block {
            display: block !important;
            background: #d4edda;        /* Light green background */
            border-left: 4px solid #28a745;  /* Green left border */
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 4px 4px 0;
          }

          .solution-block::before {
            content: "SOLUTION";
            display: block;
            font-weight: bold;
            color: #155724;
            margin-bottom: 0.5rem;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* ═════════════════════════════════════════════════════
             ANSWER KEYS
             Blue styling for answer keys
             ════════════════════════════════════════════════════= */
          .answer-key {
            display: block !important;
            background: #cce5ff;        /* Light blue background */
            border-left: 4px solid #004085;  /* Dark blue left border */
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0 4px 4px 0;
          }

          .answer-key::before {
            content: "ANSWER KEY";
            display: block;
            font-weight: bold;
            color: #004085;
            margin-bottom: 0.5rem;
            font-size: 0.85em;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          /* ═════════════════════════════════════════════════════
             DARK MODE SUPPORT
             Adjust colors for dark theme
             ════════════════════════════════════════════════════= */
          [data-bs-theme="dark"] .instructor-only {
            background: #332701;
            border-left-color: #ffc107;
          }
          [data-bs-theme="dark"] .instructor-only::before {
            color: #ffc107;
          }

          [data-bs-theme="dark"] .solution-block {
            background: #0d2818;
            border-left-color: #28a745;
          }
          [data-bs-theme="dark"] .solution-block::before {
            color: #28a745;
          }

          [data-bs-theme="dark"] .answer-key {
            background: #001a33;
            border-left-color: #66b3ff;
          }
          [data-bs-theme="dark"] .answer-key::before {
            color: #66b3ff;
          }
          </style>
```

---

## Marking Content in Your Source Files

Use Quarto's fenced div syntax to mark instructor-only content:

```markdown
## Problem 1 (10 points)

A star has radius R = 2R_sun and surface temperature T = 6000 K.
Calculate its luminosity in solar luminosities.

::: {.solution-block}
**Solution:**

Using the Stefan-Boltzmann law:

$$L = 4\pi R^2 \sigma T^4$$

Substituting values (being careful to use CGS units):

- R = 2R_sun = 2 x (6.96 x 10^10 cm) = 1.39 x 10^11 cm
- T = 6000 K
- sigma = 5.67 x 10^-5 erg cm^-2 s^-1 K^-4

$$L = 4\pi (1.39 \times 10^{11})^2 (5.67 \times 10^{-5})(6000)^4$$
$$L = 5.2 \times 10^{33} \text{ erg s}^{-1}$$

In solar luminosities (L_sun = 3.83 x 10^33 erg/s):

$$L = \frac{5.2 \times 10^{33}}{3.83 \times 10^{33}} = 1.36 L_\odot$$
:::

::: {.instructor-only}
**Common mistakes to watch for:**

1. Forgetting to convert R_sun to centimeters
2. Using SI units (Watts) instead of CGS (erg/s)
3. Not squaring the radius
4. Confusing T^4 with 4T

**Grading notes:**

- Full credit if final answer is between 1.3 and 1.4 L_sun
- Partial credit (7/10) for correct setup with arithmetic error
- Partial credit (5/10) for correct formula with wrong substitution
:::
```

**What each profile renders:**

| Content | Student Version | Instructor Version |
|---------|-----------------|-------------------|
| Problem statement | Visible | Visible |
| `.solution-block` | Hidden | Green box with "SOLUTION" header |
| `.instructor-only` | Hidden | Yellow box with "INSTRUCTOR ONLY" header |

---

## Rendering Commands

```bash
# ═══════════════════════════════════════════════════════════════
# STUDENT VERSION (public)
# ═══════════════════════════════════════════════════════════════

# These are equivalent (student is default):
quarto render
quarto render --profile student

# Output goes to: _site/
# Solutions: HIDDEN

# ═══════════════════════════════════════════════════════════════
# INSTRUCTOR VERSION (private)
# ═══════════════════════════════════════════════════════════════

quarto render --profile instructor

# Output goes to: _site-instructor/
# Solutions: VISIBLE with distinctive styling

# ═══════════════════════════════════════════════════════════════
# PREVIEWING
# ═══════════════════════════════════════════════════════════════

# Preview student version
quarto preview

# Preview instructor version
quarto preview --profile instructor
```

---

## Deployment Strategy

```bash
# 1. Build both versions
quarto render                      # -> _site/
quarto render --profile instructor # -> _site-instructor/

# 2. Deploy student version publicly
# (GitHub Pages, Netlify, your university server)
# Point deployment at _site/

# 3. Keep instructor version private
# Options:
#   - Just keep _site-instructor/ on your laptop
#   - Deploy to password-protected server
#   - Share via private GitHub repo

# 4. Add _site-instructor/ to .gitignore
echo "_site-instructor/" >> .gitignore
```

---

## Profile Summary

| Aspect | Student Profile | Instructor Profile |
|--------|-----------------|-------------------|
| **Command** | `quarto render` | `quarto render --profile instructor` |
| **Config file** | `_quarto-student.yml` | `_quarto-instructor.yml` |
| **Output directory** | `_site/` | `_site-instructor/` |
| **`.instructor-only`** | Hidden | Yellow box |
| **`.solution-block`** | Hidden | Green box |
| **`.answer-key`** | Hidden | Blue box |
| **Website title** | Normal | "[INSTRUCTOR VERSION]" |
| **Purpose** | Public student website | Private instructor reference |

---

## Common Pitfalls

### 1. Forgetting to set output-dir in instructor profile

Without `project: output-dir: _site-instructor`, the instructor build overwrites the student build!

### 2. Missing the `!important` in CSS

```css
/* WRONG - might be overridden */
.solution-block { display: none; }

/* CORRECT - guarantees hiding */
.solution-block { display: none !important; }
```

### 3. Typos in class names

```markdown
<!-- WRONG - typo means it won't be hidden -->
::: {.solution-bloc}

<!-- CORRECT -->
::: {.solution-block}
```

### 4. Accidentally committing _site-instructor/

Add to `.gitignore`:

```
_site-instructor/
```

---

## Next Steps

- [Conditional Content](06-conditional-content.md) — Format-specific content (HTML vs PDF)
- [Global Variables](01-global-variables.md) — More single-source-of-truth patterns
