# ASTR 201 Website Visual Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the ASTR 201 Quarto course website into a modern, visually polished site with unified cosmic branding, custom callouts, dark mode, and improved information architecture.

**Architecture:** Extend existing Quarto site with Inter font, cosmic color palette (matching slides), 9 custom astronomy-themed callouts, dark mode toggle, module-based navigation, auto "This Week" feature, and redesigned homepage inspired by ASTR 596.

**Tech Stack:** Quarto, SCSS, Lua filters, Mermaid diagrams

---

## Task 1: Add Inter Font and Configure Dual Theme

**Files:**

- Modify: `_quarto.yml`
- Rename: `assets/site.scss` → `assets/site-light.scss`
- Create: `assets/site-dark.scss`

**Step 1: Update `_quarto.yml` to use Inter and dual themes**

In `_quarto.yml`, update the format section:

```yaml
format:
  html:
    theme:
      light: [cosmo, assets/site-light.scss]
      dark: [darkly, assets/site-dark.scss]
    mainfont: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif
    toc: true
    toc-depth: 3
```

**Step 2: Rename site.scss to site-light.scss**

Run: `mv assets/site.scss assets/site-light.scss`

**Step 3: Create site-dark.scss**

Create `assets/site-dark.scss`:

```scss
// ASTR 201 Dark Theme
// Cosmic color palette (same as slides)

$cosmic-blue: #1e3a5f;
$stellar-blue: #4a90e2;
$aurora-teal: #26d0ce;
$solar-gold: #ffd700;
$nova-orange: #ff6b35;
$nebula-purple: #6b46c1;

// Dark mode overrides
$body-bg: #0d1117;
$body-color: #e6edf3;

// Headings in stellar blue for dark mode (better contrast)
h1, h2, h3, h4, h5, h6 {
  color: $stellar-blue;
  font-weight: 650;
}

// Links
a {
  color: $aurora-teal;

  &:hover {
    color: lighten($aurora-teal, 15%);
  }
}

// Code blocks
code {
  color: lighten($nebula-purple, 20%);
}

pre {
  background-color: #161b22;
}

// Navbar logo
.navbar-brand img {
  max-height: 64px;
}

@media (max-width: 768px) {
  .navbar-brand img {
    max-height: 48px;
  }
}
```

**Step 4: Update site-light.scss with cosmic colors**

Update `assets/site-light.scss`:

```scss
// ASTR 201 Light Theme
// Cosmic color palette (same as slides)

$cosmic-blue: #1e3a5f;
$stellar-blue: #4a90e2;
$aurora-teal: #26d0ce;
$solar-gold: #ffd700;
$nova-orange: #ff6b35;
$nebula-purple: #6b46c1;

// Typography - keep existing large sizes
$font-size-base: 1.25rem;

// Headings in cosmic blue
h1, h2, h3, h4, h5, h6 {
  color: $cosmic-blue;
  font-weight: 650;
}

// Links in stellar blue with aurora hover
a {
  color: $stellar-blue;

  &:hover {
    color: $aurora-teal;
  }
}

// Code in nebula purple
code {
  color: $nebula-purple;
}

// Navbar logo sizing (keep existing)
.navbar-brand img {
  max-height: 64px;
}

@media (max-width: 768px) {
  .navbar-brand img {
    max-height: 48px;
  }
}

// Sidebar styling (keep existing sizing)
.sidebar {
  font-size: 1.15rem;
  line-height: 1.75;
}

// TOC styling (keep existing)
#TOC {
  font-size: 1.15rem;
  line-height: 1.5;
}

// Responsive grid (keep existing)
@media (min-width: 1200px) {
  .page-layout-custom {
    display: grid;
    grid-template-columns: 300px minmax(500px, 1150px) 320px;
    grid-template-areas: "sidebar body margin";
    gap: 1.5rem;
  }
}
```

**Step 5: Preview and verify**

Run: `quarto preview`

Expected: Site loads with Inter font, cosmic blue headings, stellar blue links. Dark mode toggle appears in navbar.

**Step 6: Commit**

```bash
git add _quarto.yml assets/site-light.scss assets/site-dark.scss
git commit -m "feat: add Inter font, cosmic colors, and dark mode toggle"
```

---

## Task 2: Create Custom Callout Styles

**Files:**

- Create: `assets/callouts.scss`
- Modify: `assets/site-light.scss` (import callouts)
- Modify: `assets/site-dark.scss` (import callouts)

**Step 1: Create callouts.scss with 9 astronomy-themed callouts**

Create `assets/callouts.scss`:

```scss
// ASTR 201 Custom Callouts
// 9 astronomy-themed callout types

// Color variables (use existing cosmic palette)
$cosmic-blue: #1e3a5f;
$stellar-blue: #4a90e2;
$aurora-teal: #26d0ce;
$solar-gold: #ffd700;
$nova-orange: #ff6b35;
$nebula-purple: #6b46c1;

// === Default Callout Restyling ===

// Note - telescope icon, stellar blue
.callout-note {
  border-left-color: $stellar-blue;

  .callout-icon::before {
    content: "🔭";
  }

  .callout-header {
    background-color: rgba($stellar-blue, 0.1);
  }
}

// Tip - star icon, aurora teal
.callout-tip {
  border-left-color: $aurora-teal;

  .callout-icon::before {
    content: "⭐";
  }

  .callout-header {
    background-color: rgba($aurora-teal, 0.1);
  }
}

// Important - sparkles icon, solar gold
.callout-important {
  border-left-color: $solar-gold;

  .callout-icon::before {
    content: "✨";
  }

  .callout-header {
    background-color: rgba($solar-gold, 0.15);
  }
}

// Caution - comet icon, nova orange
.callout-caution {
  border-left-color: $nova-orange;

  .callout-icon::before {
    content: "☄️";
  }

  .callout-header {
    background-color: rgba($nova-orange, 0.1);
  }
}

// Warning - black hole icon, nebula purple
.callout-warning {
  border-left-color: $nebula-purple;

  .callout-icon::before {
    content: "🕳️";
  }

  .callout-header {
    background-color: rgba($nebula-purple, 0.1);
  }
}

// === Custom Callout Types ===

// Problem - shooting star icon, cosmic blue
.callout-problem {
  border-left: 4px solid $cosmic-blue;
  background-color: rgba($cosmic-blue, 0.05);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;

  &::before {
    content: "🌠 Problem";
    font-weight: 600;
    color: $cosmic-blue;
    display: block;
    margin-bottom: 0.5rem;
  }
}

// Solution - sun icon, solar gold (lighter)
.callout-solution {
  border-left: 4px solid $solar-gold;
  background-color: rgba($solar-gold, 0.08);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;

  &::before {
    content: "☀️ Solution";
    font-weight: 600;
    color: darken($solar-gold, 20%);
    display: block;
    margin-bottom: 0.5rem;
  }
}

// Sanity Check - scales icon, aurora teal
.callout-sanity-check {
  border-left: 4px solid $aurora-teal;
  background-color: rgba($aurora-teal, 0.08);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;

  &::before {
    content: "⚖️ Sanity Check";
    font-weight: 600;
    color: darken($aurora-teal, 15%);
    display: block;
    margin-bottom: 0.5rem;
  }
}

// TPS (Think-Pair-Share) - speech bubbles icon, stellar blue
.callout-tps {
  border-left: 4px solid $stellar-blue;
  background-color: rgba($stellar-blue, 0.08);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;

  &::before {
    content: "💬 Think-Pair-Share";
    font-weight: 600;
    color: $stellar-blue;
    display: block;
    margin-bottom: 0.5rem;
  }
}
```

**Step 2: Import callouts in site-light.scss**

Add to end of `assets/site-light.scss`:

```scss
@import "callouts";
```

**Step 3: Import callouts in site-dark.scss**

Add to end of `assets/site-dark.scss`:

```scss
@import "callouts";
```

**Step 4: Create test page to verify all callouts**

Create `_test-callouts.qmd` (temporary):

```markdown
---
title: "Callout Test"
---

::: {.callout-note}
## Note (Telescope)
This is a note callout.
:::

::: {.callout-tip}
## Tip (Star)
This is a tip callout.
:::

::: {.callout-important}
## Important (Sparkles)
This is an important callout.
:::

::: {.callout-caution}
## Caution (Comet)
This is a caution callout.
:::

::: {.callout-warning}
## Warning (Black Hole)
This is a warning callout.
:::

::: {.callout-problem}
Calculate the luminosity of a star with radius 2R☉ and temperature 6000K.
:::

::: {.callout-solution}
Using Stefan-Boltzmann: L = 4πR²σT⁴

Step 1: Convert to CGS...
Step 2: Calculate...
:::

::: {.callout-sanity-check}
Does your answer have the right units? Is it in a reasonable range?
:::

::: {.callout-tps}
Discuss with your neighbor: Why does luminosity scale as T⁴?
:::
```

**Step 5: Preview and verify**

Run: `quarto preview _test-callouts.qmd`

Expected: All 9 callout types render with correct colors and icons.

**Step 6: Commit**

```bash
git add assets/callouts.scss assets/site-light.scss assets/site-dark.scss
git commit -m "feat: add 9 custom astronomy-themed callouts"
```

**Step 7: Remove test file**

Run: `rm _test-callouts.qmd`

---

## Task 3: Create "This Week" Lua Filter

**Files:**

- Create: `_extensions/thisweek/_extension.yml`
- Create: `_extensions/thisweek/thisweek.lua`
- Modify: `_quarto.yml` (add filter and schedule metadata)

**Step 1: Create extension directory**

Run: `mkdir -p _extensions/thisweek`

**Step 2: Create extension metadata**

Create `_extensions/thisweek/_extension.yml`:

```yaml
title: This Week
author: ASTR 201
version: 1.0.0
contributes:
  filters:
    - thisweek.lua
```

**Step 3: Create Lua filter**

Create `_extensions/thisweek/thisweek.lua`:

```lua
-- This Week filter for ASTR 201
-- Automatically displays current week's content based on date

local semester_start = os.time({year=2026, month=1, day=20})
local semester_end = os.time({year=2026, month=5, day=7})

-- Week schedule data
local weeks = {
  {num=1, dates="Jan 20-22", module=1, topics="Course overview; Scaling & units"},
  {num=2, dates="Jan 27-29", module=1, topics="Kepler → Newton; Gravity & orbits"},
  {num=3, dates="Feb 3-5", module=1, topics="Light as information; Blackbodies"},
  {num=4, dates="Feb 10-12", module=2, topics="Distance & parallax; Luminosity & flux"},
  {num=5, dates="Feb 17-19", module=2, topics="Color → temperature; H-R diagram"},
  {num=6, dates="Feb 24-26", module=2, topics="Stellar motions; Binary stars"},
  {num=7, dates="Mar 3-5", module=2, topics="Radiative transfer vocab; EXAM 1"},
  {num=8, dates="Mar 10-12", module=3, topics="Ages & lifetimes; Hydrostatic equilibrium"},
  {num=9, dates="Mar 17-19", module=3, topics="Radiation transport; Convection"},
  {num=10, dates="Mar 24-26", module=3, topics="Fusion; Min/max stellar masses"},
  {num=11, dates="Apr 7-9", module=3, topics="Low-mass evolution; White dwarfs"},
  {num=12, dates="Apr 14-16", module=3, topics="High-mass evolution; EXAM 2"},
  {num=13, dates="Apr 21-23", module=4, topics="ISM; Star formation"},
  {num=14, dates="Apr 28-30", module=4, topics="Milky Way; External galaxies"},
  {num=15, dates="May 5", module=4, topics="Cosmology capstone; Synthesis"}
}

local module_names = {
  [1] = "Foundations",
  [2] = "Stellar Properties",
  [3] = "Structure & Evolution",
  [4] = "Galaxies & Cosmology"
}

function get_current_week()
  local now = os.time()

  if now < semester_start then
    return nil, "before"
  elseif now > semester_end then
    return nil, "after"
  end

  local days_elapsed = math.floor((now - semester_start) / 86400)
  local week_num = math.floor(days_elapsed / 7) + 1

  -- Handle spring break (week between 10 and 11)
  if week_num > 10 then
    week_num = week_num - 1
  end

  if week_num > 15 then week_num = 15 end
  if week_num < 1 then week_num = 1 end

  return weeks[week_num], "during"
end

function Div(el)
  if el.classes:includes("this-week") then
    local week, status = get_current_week()

    local content = ""

    if status == "before" then
      content = [[
<div class="this-week-card">
<h3>📅 Course Begins January 20, 2026</h3>
<p>Check back when the semester starts!</p>
</div>
]]
    elseif status == "after" then
      content = [[
<div class="this-week-card">
<h3>🎓 Semester Complete</h3>
<p>Thanks for a great semester!</p>
</div>
]]
    else
      content = string.format([[
<div class="this-week-card">
<h3>📅 Week %d: %s</h3>
<p><strong>Module %d:</strong> %s</p>
<p><strong>Topics:</strong> %s</p>
<p><a href="modules/module-0%d.qmd">Go to Module →</a></p>
</div>
]], week.num, week.dates, week.module, module_names[week.module], week.topics, week.module)
    end

    return pandoc.RawBlock("html", content)
  end
end
```

**Step 4: Add CSS for this-week card**

Add to `assets/site-light.scss`:

```scss
// This Week card styling
.this-week-card {
  background: linear-gradient(135deg, rgba($cosmic-blue, 0.1), rgba($stellar-blue, 0.1));
  border: 2px solid $stellar-blue;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1.5rem 0;

  h3 {
    margin-top: 0;
    color: $cosmic-blue;
  }

  a {
    font-weight: 600;
  }
}
```

Add equivalent to `assets/site-dark.scss`:

```scss
// This Week card styling (dark mode)
.this-week-card {
  background: linear-gradient(135deg, rgba($stellar-blue, 0.15), rgba($aurora-teal, 0.1));
  border: 2px solid $stellar-blue;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1.5rem 0;

  h3 {
    margin-top: 0;
    color: $stellar-blue;
  }
}
```

**Step 5: Register filter in _quarto.yml**

Add to `_quarto.yml`:

```yaml
filters:
  - _extensions/thisweek/thisweek.lua
```

**Step 6: Preview and verify**

Run: `quarto preview`

Add to index.qmd temporarily: `::: {.this-week}` `:::`

Expected: "This Week" card appears with current week info (or "Course Begins" if before semester).

**Step 7: Commit**

```bash
git add _extensions/thisweek/ assets/site-light.scss assets/site-dark.scss _quarto.yml
git commit -m "feat: add auto 'This Week' feature with Lua filter"
```

---

## Task 4: Create Module One-Stop-Shop Pages

**Files:**

- Modify: `modules/module-01.qmd` (rewrite as one-stop-shop)
- Create: `modules/module-02.qmd`
- Create: `modules/module-03.qmd`
- Create: `modules/module-04.qmd`

**Step 1: Rewrite module-01.qmd**

Update `modules/module-01.qmd`:

```markdown
---
title: "Module 1: Foundations"
subtitle: "Weeks 1-3 | The Tools of Astronomy"
---

## Overview

This module builds your foundational toolkit: scaling, units, dimensional analysis, gravity, orbits, and the physics of light.

**Key theme:** *Measure* — How do we extract information from the cosmos?

## Learning Goals

By the end of this module, you will be able to:

- Apply dimensional analysis to astronomical problems
- Derive Kepler's laws from Newton's gravity
- Explain how blackbody radiation encodes temperature

## Weekly Breakdown

| Week | Dates | Topics |
|------|-------|--------|
| 1 | Jan 20 & 22 | Course overview; Scaling, units, dimensional analysis |
| 2 | Jan 27 & 29 | Kepler → Newton; Gravity, orbits, energy |
| 3 | Feb 3 & 5 | Light as information; Blackbody radiation |

## Slides

- [L01: Course Overview](../slides/lecture-01-course-overview.qmd)
- [L02: Math Fundamentals](../slides/lecture-02-foundations.qmd)
- L03: Gravity & Orbits (coming soon)
- L04: Light & Blackbodies (coming soon)

## Handouts

- [Discourse Kit](../handouts/astr201-discourse-kit.qmd)
- [Figure Kit](../handouts/astr201-figure-kit.qmd)
```

**Step 2: Create module-02.qmd**

Create `modules/module-02.qmd`:

```markdown
---
title: "Module 2: Stellar Properties"
subtitle: "Weeks 4-7 | Inferring What Stars Are"
---

## Overview

How do we measure the unmeasurable? This module covers the techniques astronomers use to determine stellar distances, luminosities, temperatures, compositions, and masses.

**Key theme:** *Infer* — Extracting physical properties from light.

## Learning Goals

By the end of this module, you will be able to:

- Calculate stellar distances using parallax
- Derive stellar temperatures from color/spectra
- Measure stellar masses using binary orbits

## Weekly Breakdown

| Week | Dates | Topics |
|------|-------|--------|
| 4 | Feb 10 & 12 | Distance & parallax; Luminosity & flux |
| 5 | Feb 17 & 19 | Color → temperature; H-R diagram |
| 6 | Feb 24 & 26 | Stellar motions; Binary stars & masses |
| 7 | Mar 3 & 5 | Radiative transfer vocabulary; **EXAM 1** |

## Slides

- Slides will be linked here as the module progresses

## Handouts

- Relevant handouts will be linked here
```

**Step 3: Create module-03.qmd**

Create `modules/module-03.qmd`:

```markdown
---
title: "Module 3: Structure & Evolution"
subtitle: "Weeks 8-12 | How Stars Work and Die"
---

## Overview

What keeps stars in equilibrium? How do they generate energy? What happens when the fuel runs out? This module covers stellar interiors, evolution, and the stellar graveyard.

**Key theme:** *Balance* — Equilibrium, transport, and energy generation.

## Learning Goals

By the end of this module, you will be able to:

- Apply hydrostatic equilibrium to stellar structure
- Explain the physics of fusion ignition
- Describe the endpoints of stellar evolution (WD, NS, BH)

## Weekly Breakdown

| Week | Dates | Topics |
|------|-------|--------|
| 8 | Mar 10 & 12 | Ages & lifetimes; Hydrostatic equilibrium |
| 9 | Mar 17 & 19 | Radiation transport; Convection |
| 10 | Mar 24 & 26 | Fusion; Minimum & maximum stellar masses |
| — | Mar 31 & Apr 2 | **Spring Break** |
| 11 | Apr 7 & 9 | Low-mass evolution; White dwarfs |
| 12 | Apr 14 & 16 | High-mass evolution; NS & BH; **EXAM 2** |

## Slides

- Slides will be linked here as the module progresses

## Handouts

- Relevant handouts will be linked here
```

**Step 4: Create module-04.qmd**

Create `modules/module-04.qmd`:

```markdown
---
title: "Module 4: Galaxies & Cosmology"
subtitle: "Weeks 13-15 | The Largest Scales"
---

## Overview

From the space between stars to the edge of the observable universe. This module covers the ISM, star formation, galactic structure, and cosmology.

**Key theme:** *Evolve* — From gas to galaxies to the universe itself.

## Learning Goals

By the end of this module, you will be able to:

- Describe the phases of the ISM and star formation
- Explain evidence for dark matter from rotation curves
- Outline the thermal history of the universe

## Weekly Breakdown

| Week | Dates | Topics |
|------|-------|--------|
| 13 | Apr 21 & 23 | ISM phases; Star formation; Extinction |
| 14 | Apr 28 & 30 | Milky Way & dark matter; External galaxies |
| 15 | May 5 | Cosmology capstone; Synthesis |

## Slides

- Slides will be linked here as the module progresses

## Handouts

- Relevant handouts will be linked here
```

**Step 5: Preview and verify**

Run: `quarto preview modules/module-01.qmd`

Expected: Module page renders with overview, learning goals, weekly breakdown, and links.

**Step 6: Commit**

```bash
git add modules/
git commit -m "feat: create 4 module one-stop-shop pages"
```

---

## Task 5: Update Sidebar Navigation

**Files:**

- Modify: `_quarto.yml`

**Step 1: Update sidebar structure in _quarto.yml**

Replace the sidebar section in `_quarto.yml`:

```yaml
website:
  title: "ASTR 201"
  navbar:
    logo: assets/astr201-logo.png
    search: true
  sidebar:
    style: docked
    contents:
      - text: "Home"
        href: index.qmd
      - section: "Course Info"
        contents:
          - text: "Syllabus"
            href: course-info/syllabus.qmd
          - text: "Schedule"
            href: course-info/schedule.qmd
      - section: "Modules"
        contents:
          - text: "1: Foundations"
            href: modules/module-01.qmd
          - text: "2: Stellar Properties"
            href: modules/module-02.qmd
          - text: "3: Structure & Evolution"
            href: modules/module-03.qmd
          - text: "4: Galaxies & Cosmology"
            href: modules/module-04.qmd
      - section: "Handouts"
        contents:
          - href: handouts/index.qmd
```

**Step 2: Preview and verify**

Run: `quarto preview`

Expected: Sidebar shows Home, Course Info (with Syllabus/Schedule), Modules (with 4 module links), Handouts.

**Step 3: Commit**

```bash
git add _quarto.yml
git commit -m "feat: restructure sidebar with module-based navigation"
```

---

## Task 6: Redesign Homepage

**Files:**

- Modify: `index.qmd`

**Step 1: Rewrite index.qmd with new design**

Replace contents of `index.qmd`:

```markdown
---
title: "ASTR 201: Astronomy for Science Majors"
subtitle: "SDSU | Spring 2026 | Tue/Thu | Room TBD"
format:
  html:
    toc: false
---

![](/assets/astr201-logo.png){width="400px" fig-align="center"}

**Welcome to ASTR 201!** This is a quantitative astronomy course: we use math and physics to infer what the universe is doing from limited observations. You'll learn to think like an astrophysicist — extracting meaning from light.

::: {.this-week}
:::

## Course Arc: Measure → Infer → Balance → Evolve

```{mermaid}
flowchart LR
    M1["Module 1<br/>Foundations"] --> M2["Module 2<br/>Stellar Properties"]
    M2 --> M3["Module 3<br/>Structure & Evolution"]
    M3 --> M4["Module 4<br/>Galaxies & Cosmology"]

    M1a["MEASURE<br/>Tools & light"] --> M1
    M2a["INFER<br/>Properties from light"] --> M2
    M3a["BALANCE<br/>Equilibrium & energy"] --> M3
    M4a["EVOLVE<br/>Largest scales"] --> M4

    style M1 fill:#e3f2fd,stroke:#1976d2
    style M2 fill:#e1f5fe,stroke:#0288d1
    style M3 fill:#f3e5f5,stroke:#7b1fa2
    style M4 fill:#e8f5e9,stroke:#388e3c
```

**Module 1 (Weeks 1-3):** Build your toolkit — units, gravity, orbits, light
**Module 2 (Weeks 4-7):** Infer stellar properties — distance, luminosity, temperature, mass
**Module 3 (Weeks 8-12):** Stellar structure — equilibrium, transport, fusion, endpoints
**Module 4 (Weeks 13-15):** The big picture — ISM, galaxies, cosmology

## Quick Navigation

::: {.grid}

::: {.g-col-6}
**Course Materials**

- [Syllabus](course-info/syllabus.qmd)
- [Schedule](course-info/schedule.qmd)
- [Handouts](handouts/index.qmd)
:::

::: {.g-col-6}
**Modules**

- [Module 1: Foundations](modules/module-01.qmd)
- [Module 2: Stellar Properties](modules/module-02.qmd)
- [Module 3: Structure & Evolution](modules/module-03.qmd)
- [Module 4: Galaxies & Cosmology](modules/module-04.qmd)
:::

:::

::: {.callout-tip}
## How to Succeed

- **Show your reasoning** — steps, units, assumptions
- **Use the schedule** — check weekly for what's due
- **Ask early** — office hours, Canvas discussions, classmates
:::

::: {.callout-note}
## Where to Get Help

- **Office hours:** [time/location TBD]
- **Canvas discussions:** Questions others may share
- **SDSU Astronomy Help Room:** Free tutoring (schedule on Canvas)
:::

## Instructor

| | |
|---|---|
| **Instructor** | Dr. Anna Rosen |
| **Office** | [TBD] |
| **Email** | alrosen@sdsu.edu |
| **Office Hours** | [TBD] |

---

*All course announcements are posted on Canvas. Check regularly!*
```

**Step 2: Preview and verify**

Run: `quarto preview`

Expected: Homepage shows logo, welcome, "This Week" card, Mermaid flowchart, module summaries, quick navigation grid, success tips, help callout, and instructor info.

**Step 3: Commit**

```bash
git add index.qmd
git commit -m "feat: redesign homepage with hero, course arc, and navigation"
```

---

## Task 7: Add Custom Footer

**Files:**

- Create: `_includes/footer.html`
- Modify: `_quarto.yml`

**Step 1: Create footer partial**

Create `_includes/footer.html`:

```html
<footer class="custom-footer">
  <div class="footer-content">
    <p><strong>ASTR 201: Astronomy for Science Majors</strong> | Spring 2026 | Dr. Anna Rosen</p>
    <p>
      <a href="/course-info/syllabus.html">Syllabus</a> ·
      <a href="/course-info/schedule.html">Schedule</a> ·
      <a href="https://canvas.sdsu.edu" target="_blank">Canvas</a>
    </p>
  </div>
</footer>
```

**Step 2: Add footer CSS to site-light.scss**

Add to `assets/site-light.scss`:

```scss
// Custom footer
.custom-footer {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: rgba($cosmic-blue, 0.05);
  border-top: 1px solid rgba($cosmic-blue, 0.2);
  text-align: center;
  font-size: 0.9rem;

  a {
    color: $stellar-blue;

    &:hover {
      color: $aurora-teal;
    }
  }
}
```

**Step 3: Add footer CSS to site-dark.scss**

Add to `assets/site-dark.scss`:

```scss
// Custom footer (dark mode)
.custom-footer {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: rgba($stellar-blue, 0.1);
  border-top: 1px solid rgba($stellar-blue, 0.3);
  text-align: center;
  font-size: 0.9rem;
}
```

**Step 4: Register footer in _quarto.yml**

Add to `_quarto.yml` under `format: html:`:

```yaml
format:
  html:
    include-after-body: _includes/footer.html
```

**Step 5: Create _includes directory**

Run: `mkdir -p _includes`

**Step 6: Preview and verify**

Run: `quarto preview`

Expected: Custom footer appears at bottom of all pages with course info and links.

**Step 7: Commit**

```bash
git add _includes/footer.html assets/site-light.scss assets/site-dark.scss _quarto.yml
git commit -m "feat: add custom footer with course info and links"
```

---

## Task 8: Final Polish and Verification

**Step 1: Full site preview**

Run: `quarto preview`

**Step 2: Verification checklist**

- [ ] Inter font loads correctly
- [ ] Headings are cosmic blue (light) / stellar blue (dark)
- [ ] Links are stellar blue with aurora teal hover
- [ ] Dark mode toggle works
- [ ] All 9 callout types render correctly
- [ ] "This Week" card displays appropriate content
- [ ] All 4 module pages load and link correctly
- [ ] Sidebar navigation is correct
- [ ] Homepage Mermaid diagram renders
- [ ] Footer appears on all pages
- [ ] Mobile viewport looks good (resize browser)
- [ ] Slides still work: `quarto preview slides/lecture-01-course-overview.qmd`

**Step 3: Build full site**

Run: `quarto render`

Expected: Site builds without errors.

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: complete website visual redesign"
```

---

## Summary of Files Created/Modified

| File | Action |
|------|--------|
| `_quarto.yml` | Theme, font, sidebar, footer, filter config |
| `assets/site-light.scss` | Light theme with cosmic colors |
| `assets/site-dark.scss` | Dark theme variant |
| `assets/callouts.scss` | 9 custom callout styles |
| `_extensions/thisweek/_extension.yml` | Extension metadata |
| `_extensions/thisweek/thisweek.lua` | Auto "This Week" filter |
| `_includes/footer.html` | Custom footer partial |
| `index.qmd` | Redesigned homepage |
| `modules/module-01.qmd` | Module 1 one-stop-shop |
| `modules/module-02.qmd` | Module 2 one-stop-shop |
| `modules/module-03.qmd` | Module 3 one-stop-shop |
| `modules/module-04.qmd` | Module 4 one-stop-shop |
