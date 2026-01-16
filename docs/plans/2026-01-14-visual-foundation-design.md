# Visual Foundation Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden the ASTR 201 course site aesthetic with stronger visual hierarchy, improved typography, and polished UI components before adding content.

**Architecture:** Layer improvements onto existing Observatory Slate theme. Add new CSS components (hero callout, dashboard tiles, collapsible cards) while fixing base typography and spacing. No breaking changes to existing content.

**Tech Stack:** Quarto, SCSS (Quarto layer format), vanilla JavaScript, HTML/Markdown

---

## Design Decisions

### Aesthetic Direction
- **Typography-forward** — No decorative imagery for now
- **Space telescope imagery deferred** — Future Phase 4 will add faded JWST/Rubin backgrounds
- **Observatory Slate palette preserved** — Teal=interactive, Indigo=structure, Gold=emphasis, Rose=warning

### Color Usage (90/9/1 Rule)
- 90% neutral (backgrounds, body text)
- 9% semantic accents (headings=Indigo, links=Teal, emphasis=Gold, warnings=Rose)
- 1% high-contrast moments (active states, hero elements)

---

## Phase 1: Visual Foundation

### 1.1 Hero Callout Component

**Purpose:** Make "Start Here" unmissable on syllabus and home page.

**New class:** `.callout-hero`

**Styling (differs from regular callouts):**
```scss
.callout-hero {
  border-left: 6px solid $gold-light;      // vs 4px for regular
  background: rgba($gold-light, 0.04);     // subtle gold tint
  padding: 1.5rem;                          // vs 1rem
  border-radius: $radius-md;
  margin: 1.5rem 0;
}

.callout-hero .callout-title {
  font-size: 1.4rem;                        // vs 1.2rem
  font-weight: 700;
  color: $gold-light;
  margin-bottom: 0.75rem;
}

.callout-hero .callout-body {
  font-size: 1.25rem;                       // vs 1.2rem
}

// Dark mode
[data-bs-theme="dark"] .callout-hero {
  border-left-color: $gold-dark;
  background: rgba($gold-dark, 0.06);
}

[data-bs-theme="dark"] .callout-hero .callout-title {
  color: $gold-dark;
}
```

**Usage in Quarto:**
```markdown
::: {.callout-hero}
## Start Here

- **Where to find things:** Canvas + course website
- **Weekly cadence:** HW Mon 11:59pm, memo Wed 11:59pm
- ...
:::
```

**Files to modify:**
- `assets/theme/callouts.scss` — Add `.callout-hero` styles
- `course-info/syllabus.qmd` — Change `.callout-important` to `.callout-hero`
- `index.qmd` — Change `.callout-important` to `.callout-hero`

---

### 1.2 Sidebar Active State

**Purpose:** Make current page location unmistakable.

**Styling:**
```scss
#quarto-sidebar .sidebar-item.active > .sidebar-item-container,
#quarto-sidebar .sidebar-item-text.active {
  // Left accent bar
  border-left: 4px solid $teal-light;
  margin-left: -4px;
  padding-left: 0.5rem;

  // Text treatment
  font-weight: 650;
  color: $text-light;

  // Background highlight
  background: rgba($teal-light, 0.06);
  border-radius: 0 $radius-sm $radius-sm 0;
}

// Dark mode
[data-bs-theme="dark"] #quarto-sidebar .sidebar-item.active > .sidebar-item-container,
[data-bs-theme="dark"] #quarto-sidebar .sidebar-item-text.active {
  border-left-color: $teal-dark;
  color: $text-dark;
  background: rgba($teal-dark, 0.08);
}
```

**Files to modify:**
- `assets/theme/site-light.scss` — Add sidebar active styles
- `assets/theme/site-dark.scss` — Add dark mode sidebar active styles

---

### 1.3 Quieter TOC (Right Sidebar)

**Purpose:** Reduce visual competition from "On this page" section.

**Styling:**
```scss
#quarto-margin-sidebar {
  font-size: 0.95rem;           // down from 1.15rem
  line-height: 1.4;
}

#TOC a {
  font-size: 0.95rem;           // down from 1.15rem
  color: $muted-light;
}

#TOC a:hover {
  color: $teal-light;
}

#toc-title {
  font-size: 1rem;              // down from 1.25rem
  font-weight: 600;
  color: $muted-light;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Dark mode uses $muted-dark and $teal-dark
```

**Files to modify:**
- `assets/theme/site-light.scss` — Update TOC styles
- `assets/theme/site-dark.scss` — Update dark mode TOC styles

---

### 1.4 Typography & Spacing Fixes

**Callout text size:**
```scss
.callout {
  font-size: 1.25rem;           // up from 1.15rem
}

.callout .callout-header {
  font-size: 1.3rem;
  font-weight: 650;
}

.callout .callout-body {
  font-size: 1.25rem;
}
```

**Link underlines (persistent):**
```scss
a {
  text-decoration: underline;
  text-decoration-color: rgba($teal-light, 0.3);
  text-underline-offset: 2px;
}

a:hover {
  text-decoration-color: $teal-light;
}

// Exception: nav links, buttons
.navbar a,
.sidebar-item a,
.btn,
.lecture-card-link {
  text-decoration: none;
}
```

**Table styling:**
```scss
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5rem 0;
}

th, td {
  padding: 0.75rem 1rem;        // up from tight
  border-bottom: 1px solid $border-light;
  text-align: left;
}

th {
  font-weight: 650;
  color: $indigo-light;
  border-bottom: 2px solid $border-light;
}

tr:hover {
  background: rgba($teal-light, 0.02);
}
```

**Section spacing:**
```scss
h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

h3, h4 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
```

**Heading weight hierarchy:**
```scss
h1 { font-weight: 700; }
h2 { font-weight: 650; }
h3, h4, h5, h6 { font-weight: 600; }
```

**Files to modify:**
- `assets/theme/callouts.scss` — Callout sizing
- `assets/theme/site-light.scss` — Links, tables, headings, spacing
- `assets/theme/site-dark.scss` — Dark mode equivalents

---

## Phase 2: Home Dashboard

### 2.1 Dashboard Tile Grid

**Purpose:** Replace text link columns with visual navigation tiles.

**New component:** `.dashboard-grid` and `.dashboard-tile`

**Styling:**
```scss
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.dashboard-tile {
  background: $surface-light;
  border: 1px solid $border-light;
  border-radius: $radius-md;
  padding: 1.5rem;
  text-align: center;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.dashboard-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dashboard-tile-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.dashboard-tile-title {
  font-size: 1.1rem;
  font-weight: 650;
  color: $indigo-light;
  margin: 0;
}

.dashboard-tile-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.dashboard-tile-link:hover {
  text-decoration: none;
}
```

**Usage in Quarto:**
```markdown
::: {.dashboard-grid}

::: {.dashboard-tile}
[📍 **Start Here**](course-info/syllabus.qmd#start-here){.dashboard-tile-link}
:::

::: {.dashboard-tile}
[📅 **This Week**](course-info/schedule.qmd){.dashboard-tile-link}
:::

::: {.dashboard-tile}
[📚 **Modules**](modules/index.qmd){.dashboard-tile-link}
:::

::: {.dashboard-tile}
[🆘 **Get Help**](course-info/syllabus.qmd#sec-getting-help){.dashboard-tile-link}
:::

::: {.dashboard-tile}
[📋 **Syllabus**](course-info/syllabus.qmd){.dashboard-tile-link}
:::

:::
```

**Files to create/modify:**
- `assets/theme/dashboard.scss` — New file for dashboard styles
- `_quarto.yml` — Add dashboard.scss to theme list
- `index.qmd` — Replace quick links with dashboard grid

---

## Phase 3: Interactive Handouts

### 3.1 Collapsible Card Component

**Purpose:** Make Discourse Kit scannable with expandable sections.

**Approach:** Use Quarto's native `<details>` element with custom styling.

**Styling:**
```scss
.collapsible-card {
  border: 1px solid $border-light;
  border-left: 4px solid $indigo-light;
  border-radius: $radius-md;
  margin: 1rem 0;
  background: $surface-light;
}

.collapsible-card summary {
  padding: 1rem 1.25rem;
  cursor: pointer;
  font-weight: 650;
  font-size: 1.15rem;
  color: $indigo-light;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapsible-card summary::after {
  content: "▶";
  font-size: 0.8em;
  transition: transform 200ms ease;
}

.collapsible-card[open] summary::after {
  transform: rotate(90deg);
}

.collapsible-card .card-content {
  padding: 0 1.25rem 1rem 1.25rem;
  border-top: 1px solid $border-light;
}

.collapsible-card summary::-webkit-details-marker {
  display: none;
}
```

**Usage in Quarto (Discourse Kit):**
```markdown
<details class="collapsible-card">
<summary>Claim (what you think is true)</summary>
<div class="card-content">

- "A conservative interpretation is that…"
- "The figure suggests that…"
- "My current best claim is…"

</div>
</details>
```

**Files to create/modify:**
- `assets/theme/collapsible-cards.scss` — New file for collapsible card styles
- `_quarto.yml` — Add collapsible-cards.scss to theme list
- `handouts/astr201-discourse-kit.qmd` — Convert sections to collapsible cards

---

## Phase 4: Visual Identity (Deferred)

**Future work:** Add faded space telescope imagery (JWST, Rubin) as background elements.

**Not in scope for this implementation.**

---

## Implementation Order

### Phase 1 Tasks (Visual Foundation)
1. Update `callouts.scss` — Increase text size, add `.callout-hero`
2. Update `site-light.scss` — Sidebar active state, TOC styling, links, tables, headings
3. Update `site-dark.scss` — Dark mode equivalents
4. Update `syllabus.qmd` — Change Start Here to `.callout-hero`
5. Update `index.qmd` — Change Start Here to `.callout-hero`
6. Run `quarto render` and verify

### Phase 2 Tasks (Home Dashboard)
7. Create `assets/theme/dashboard.scss`
8. Update `_quarto.yml` — Add dashboard.scss
9. Update `index.qmd` — Replace quick links with dashboard grid
10. Run `quarto render` and verify

### Phase 3 Tasks (Interactive Handouts)
11. Create `assets/theme/collapsible-cards.scss`
12. Update `_quarto.yml` — Add collapsible-cards.scss
13. Update `handouts/astr201-discourse-kit.qmd` — Convert to collapsible cards
14. Run `quarto render` and verify

---

## Validation Checklist

After each phase:
- [ ] `quarto render` completes without errors
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Links are accessible (visible underlines)
- [ ] Active sidebar state is visible
- [ ] Hero callout stands out from regular callouts
- [ ] Tables have adequate spacing
- [ ] Callout text is readable (not too small)

---

## Files Summary

### New Files
- `assets/theme/dashboard.scss` (Phase 2)
- `assets/theme/collapsible-cards.scss` (Phase 3)

### Modified Files
- `assets/theme/callouts.scss` — Hero callout, text sizing
- `assets/theme/site-light.scss` — Sidebar, TOC, links, tables, headings
- `assets/theme/site-dark.scss` — Dark mode equivalents
- `_quarto.yml` — Add new SCSS files to theme
- `course-info/syllabus.qmd` — Use `.callout-hero`
- `index.qmd` — Use `.callout-hero`, dashboard grid
- `handouts/astr201-discourse-kit.qmd` — Collapsible cards

---

*Design complete. Ready for implementation.*
