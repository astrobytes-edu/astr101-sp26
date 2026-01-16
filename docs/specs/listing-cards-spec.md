# Single-Source Listing Cards Specification

**Version:** 2.0
**Status:** Stable
**Last Updated:** 2026-01-14

---

## Why This System Exists

Course websites suffer from a maintenance problem: the same information appears in multiple places.

A lecture title shows up in:

- The slide deck's `<title>` tag
- The sidebar navigation
- The module page's card grid
- Maybe an index page

When you update one, you forget the others. Students see "Lecture 5: Stellar Spectra" in the sidebar but "Lecture 5: How Stars Reveal Their Secrets" on the module page. Small inconsistencies erode trust and create confusion.

**The single-source pattern solves this.** You write metadata once—in the document's frontmatter—and every other display location pulls from that source automatically.

---

## The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    SOURCE OF TRUTH                          │
│                 Document Frontmatter                        │
│  (slides/*.qmd, homework/*.qmd, exams/*.qmd, etc.)         │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌──────────┐    ┌──────────┐    ┌──────────┐
       │ Sidebar  │    │  Module  │    │ Document │
       │   Nav    │    │  Cards   │    │  Header  │
       │ (auto)   │    │ (listing)│    │  (auto)  │
       └──────────┘    └──────────┘    └──────────┘
```

**Three mechanisms work together:**

1. **Sidebar auto-titles:** When you list a file path without `text:`, Quarto reads the document's `title` field
2. **Listings + EJS templates:** Index pages declare what files to include; templates render cards from frontmatter
3. **Document headers:** Quarto renders the document's own frontmatter as its header

Change the title in one place. Everything updates.

---

## How It Works: A Lecture Example

### Step 1: Add metadata to your slide deck

```yaml
# slides/lecture-05-spectra.qmd
---
title: "Lecture 5: Stellar Spectra"
date: "2026-02-03"
description: "How absorption lines reveal temperature, composition, and motion."
format: revealjs
---
```

### Step 2: Reference the file in your sidebar (no `text:`)

```yaml
# _quarto.yml
- section: "Module 2: Stellar Properties"
  href: modules/module-02.qmd
  contents:
    - slides/lecture-05-spectra.qmd    # Quarto pulls "Lecture 5: Stellar Spectra"
    - slides/lecture-06-hr-diagram.qmd
```

### Step 3: Use a listing on your module page

```yaml
# modules/module-02.qmd
---
title: "Module 2: Stellar Properties"
subtitle: "Weeks 4–6"
listing:
  id: module-lectures
  contents: "../slides/lecture-0[5-9]*.qmd"
  template: ../assets/templates/lecture-card.ejs
  sort: "date"
---

## Lectures

::: {.lecture-grid}
::: {#module-lectures}
:::
:::
```

### What happens

- **Sidebar:** Shows "Lecture 5: Stellar Spectra" (from frontmatter)
- **Module page:** Renders a card with title, date, description, and link
- **Slide deck:** Displays "Lecture 5: Stellar Spectra" as its title

You wrote the title once. It appears in three places.

---

## Required Files

### Directory Structure

```
assets/
  templates/
    # Core academic content
    lecture-card.ejs      # Slide decks
    homework-card.ejs     # Assignments
    solution-card.ejs     # Posted solutions
    exam-card.ejs         # Exams
    reading-card.ejs      # Required readings

    # Structural/navigation
    module-card.ejs       # Course modules
    handout-card.ejs      # Reference handouts

    # Media & resources
    video-card.ejs        # Recorded lectures, tutorials
    podcast-card.ejs      # Audio content
    infographic-card.ejs  # Visual explainers
    resource-card.ejs     # External tools, software

    # Generic fallback
    document-card.ejs     # Anything with title + date + description
    project-card.ejs      # Semester projects/milestones

  theme/
    lecture-cards.scss    # All card styling
```

### Copy Checklist

When setting up a new course website:

1. Copy `assets/templates/*.ejs` — all EJS templates
2. Copy `assets/theme/lecture-cards.scss` — card styling
3. Update `_quarto.yml` to include the SCSS in your theme list

---

## Card Types Reference

### Core Academic Content

#### Lectures

For slide decks (RevealJS presentations).

**Frontmatter:**

```yaml
title: "Lecture 5: Stellar Spectra"
date: "2026-02-03"
description: "How absorption lines reveal temperature, composition, and motion."
format: revealjs
```

**Template:** `lecture-card.ejs`
**Grid class:** `.lecture-grid`
**Accent:** Indigo

---

#### Homework

For assignments with due dates.

**Frontmatter:**

```yaml
title: "Homework 3: Parallax"
date: "2026-02-10"           # Due date
description: "Calculate distances to nearby stars using parallax measurements."
```

**Template:** `homework-card.ejs`
**Grid class:** `.homework-grid`
**Accent:** Teal
**Note:** Date displays as "Due: Feb 10, 2026"

---

#### Solutions

For posted assignment solutions.

**Frontmatter:**

```yaml
title: "Homework 3 Solutions"
date: "2026-02-17"           # Posted date
description: "Worked solutions and common mistakes."
```

**Template:** `solution-card.ejs`
**Grid class:** `.solution-grid`
**Accent:** Gold
**Note:** Date displays as "Posted: Feb 17, 2026"

---

#### Exams

For exam information pages.

**Frontmatter:**

```yaml
title: "Midterm 1"
date: "2026-02-28"
location: "Room 101, 2:00-3:15 PM"  # Optional
description: "Covers Modules 1-2: Foundations and Stellar Properties."
```

**Template:** `exam-card.ejs`
**Grid class:** `.exam-grid`
**Accent:** Rose

---

#### Readings

For required or recommended readings.

**Frontmatter:**

```yaml
title: "Chapter 5: Stellar Spectra"
date: "2026-02-01"           # Assigned date
source: "Carroll & Ostlie"   # Optional
description: "Pages 128-145. Focus on the Saha equation."
```

**Template:** `reading-card.ejs`
**Grid class:** `.reading-grid`
**Accent:** Indigo (lighter border)
**Note:** Date displays as "Assigned: Feb 1, 2026"

---

### Structural & Navigation

#### Modules

For module overview pages.

**Frontmatter:**

```yaml
title: "Module 2: Stellar Properties"
subtitle: "Weeks 4–6 | From photons to physical properties"
description: "Learn to extract temperature, composition, and motion from starlight."
page-layout: article
```

**Template:** `module-card.ejs`
**Grid class:** `.module-grid`
**Accent:** Teal
**Note:** Uses `subtitle` instead of `date`

---

#### Handouts

For reference materials, conventions, guides.

**Frontmatter:**

```yaml
title: "Figure Conventions"
date: "2026-01-15"           # Optional
description: "Standards for creating publication-quality figures in this course."
```

**Template:** `handout-card.ejs`
**Grid class:** `.handout-grid`
**Accent:** Gold

---

### Media & Resources

#### Videos

For recorded lectures, tutorials, supplementary videos.

**Frontmatter:**

```yaml
title: "Parallax Demo"
date: "2026-02-05"
duration: "12 min"           # Optional
description: "Visual demonstration of stellar parallax using classroom props."
```

**Template:** `video-card.ejs`
**Grid class:** `.video-grid`
**Accent:** Rose
**Link text:** "Watch Video →"

---

#### Podcasts

For audio content, course podcasts, interview recordings.

**Frontmatter:**

```yaml
title: "Interview: Dr. Smith on Exoplanets"
date: "2026-03-01"
duration: "45 min"           # Optional
episode: 3                   # Optional
description: "Our guest discusses the latest exoplanet discoveries."
```

**Template:** `podcast-card.ejs`
**Grid class:** `.podcast-grid`
**Accent:** Rose
**Link text:** "Listen Now →"

---

#### Infographics

For visual explainers, NotebookLM outputs, concept maps.

**Frontmatter:**

```yaml
title: "The HR Diagram Explained"
date: "2026-02-20"
topic: "Stellar Evolution"   # Optional tag
description: "Visual guide to reading and interpreting the Hertzsprung-Russell diagram."
```

**Template:** `infographic-card.ejs`
**Grid class:** `.infographic-grid`
**Accent:** Indigo
**Link text:** "View Infographic →"

---

#### Resources

For external tools, software, tutorials, datasets.

**Frontmatter:**

```yaml
title: "Stellarium Web"
source: "stellarium-web.org"  # Optional
category: "Software"          # Optional tag
description: "Free browser-based planetarium for exploring the night sky."
```

**Template:** `resource-card.ejs`
**Grid class:** `.resource-grid`
**Accent:** Teal
**Link text:** "View Resource →"

---

### Projects & Generic

#### Projects

For semester projects with phases/milestones.

**Frontmatter:**

```yaml
title: "Project Phase 2: Data Analysis"
date: "2026-03-15"           # Due date
phase: "Phase 2 of 4"        # Optional
description: "Analyze your collected data and produce preliminary results."
```

**Template:** `project-card.ejs`
**Grid class:** `.project-grid`
**Accent:** Gold
**Note:** Date displays as "Due: Mar 15, 2026"

---

#### Documents (Generic Fallback)

For anything that doesn't fit other categories.

**Frontmatter:**

```yaml
title: "Course Policies Update"
date: "2026-02-01"           # Optional
description: "Updated late submission policy effective February 1."
```

**Template:** `document-card.ejs`
**Grid class:** `.document-grid`
**Accent:** Slate (neutral gray)
**Link text:** "View Document →"

---

## Listing Configuration Examples

### Module page with lectures

```yaml
---
title: "Module 2: Stellar Properties"
listing:
  id: module-lectures
  contents: "../slides/lecture-0[5-9]*.qmd"
  template: ../assets/templates/lecture-card.ejs
  sort: "date"
---

::: {.lecture-grid}
::: {#module-lectures}
:::
:::
```

### Homework index with assignments and solutions

```yaml
---
title: "Homework"
listing:
  - id: assignments
    contents: "hw*.qmd"
    template: ../assets/templates/homework-card.ejs
    sort: "date"
  - id: solutions
    contents: "solutions/*.qmd"
    template: ../assets/templates/solution-card.ejs
    sort: "date"
---

## Assignments

::: {.homework-grid}
::: {#assignments}
:::
:::

## Solutions

::: {.solution-grid}
::: {#solutions}
:::
:::
```

### Media gallery with videos and podcasts

```yaml
---
title: "Media Library"
listing:
  - id: videos
    contents: "videos/*.qmd"
    template: ../assets/templates/video-card.ejs
    sort: "date desc"
  - id: podcasts
    contents: "podcasts/*.qmd"
    template: ../assets/templates/podcast-card.ejs
    sort: "date desc"
---

## Videos

::: {.video-grid}
::: {#videos}
:::
:::

## Podcasts

::: {.podcast-grid}
::: {#podcasts}
:::
:::
```

---

## Sidebar Configuration

### Before (Manual - DON'T DO THIS)

```yaml
- text: "Lecture 1: Course Overview"
  href: slides/lecture-01.qmd
```

### After (Auto-pull - DO THIS)

```yaml
- slides/lecture-01.qmd
```

Quarto automatically uses the document's `title` from frontmatter.

---

## EJS Template Reference

### Available Variables

Quarto provides these to EJS templates:

| Variable | Type | Description |
|----------|------|-------------|
| `items` | Array | All matching documents |
| `item.title` | String | Document title |
| `item.date` | String | Formatted date |
| `item.description` | String | Description field |
| `item.path` | String | Path to HTML output |
| `item.*` | Any | Any frontmatter field |

### Template Structure

```ejs
<% for (const item of items) { %>
<div class="TYPE-card">
  <h3 class="TYPE-card-title"><%= item.title %></h3>
  <span class="TYPE-card-date"><%= item.date %></span>
  <p class="TYPE-card-summary"><%= item.description %></p>
  <a href="<%= item.path %>" class="TYPE-card-link">
    Action Text &rarr;
  </a>
</div>
<% } %>
```

---

## Color System

Cards use semantic accent colors:

| Color | Light | Dark | Used By |
|-------|-------|------|---------|
| Indigo | `#5a5a8a` | `#9fa1d4` | Lectures, Readings, Infographics |
| Teal | `#2f6f6f` | `#5dbfbf` | Homework, Modules, Resources |
| Gold | `#7f6d44` | `#d8c08b` | Solutions, Handouts, Projects |
| Rose | `#9a7b7f` | `#c9a5a8` | Exams, Videos, Podcasts |
| Slate | `#5c6470` | `#8892a2` | Documents (generic) |

---

## Troubleshooting

### Cards show wrong/old data

```bash
rm -rf _freeze && quarto render
```

### "Unable to read listing item description"

Add `description:` to the document's frontmatter.

### Cards not appearing

1. Check `contents:` glob pattern matches files
2. Verify template path is relative to the page using it
3. Check listing `id:` matches the div reference

### Date shows "Invalid Date"

Use ISO format: `date: "2026-02-03"` (not "Feb 3, 2026")

---

## Migration Guide

To add this system to an existing course:

1. **Copy templates:** `assets/templates/*.ejs`
2. **Copy styling:** `assets/theme/lecture-cards.scss`
3. **Update `_quarto.yml`:** Add SCSS to theme list
4. **Add frontmatter:** Add `date:` and `description:` to documents
5. **Update index pages:** Replace manual cards with listings
6. **Simplify sidebar:** Remove `text:` entries, use bare file paths
7. **Test:** Run `quarto render` and verify

---

## Changelog

### v2.0 (2026-01-14)

- Added pedagogical introduction and big-picture explanation
- Added 6 new card types: document, resource, video, podcast, project, infographic
- Added slate accent color for generic documents
- Reorganized documentation by card category
- Added color system reference

### v1.1 (2026-01-14)

- Added module-card.ejs template
- Added handout-card.ejs template

### v1.0 (2026-01-14)

- Initial specification
- Lecture, homework, solution, exam, reading templates
