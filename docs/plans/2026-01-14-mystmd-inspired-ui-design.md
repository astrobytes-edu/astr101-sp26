# ASTR 101 MyST-MD Inspired UI Design

> **Reference Site:** https://astrobytes-edu.github.io/astr596-modeling-universe/

**Goal:** Modernize the ASTR 101 Quarto course website to match MyST-MD's clean, professional aesthetic.

**License:** CC BY-NC-SA 4.0

---

## Implemented Changes

### 1. Sidebar Structure

**Before:** Flat module names on single lines, no header

**After:**
- **ASTR 101 logo** at top of sidebar (links to homepage)
- **Module titles on two lines:**
  - "Module 1:" (smaller, muted)
  - "Foundations" (larger, indigo)
- **More whitespace** between sections (1.5rem margin)
- **Cleaner typography** (1.1rem font, 1.5 line-height)

**Files modified:**
- `_quarto.yml` - Added `logo` and `title` to sidebar config
- `assets/scripts.js` - JavaScript to split "Module X: Title" into two-line format
- `assets/theme/site-light.scss` - Sidebar styling
- `assets/theme/site-dark.scss` - Dark mode sidebar styling

### 2. Right-Side TOC

**Before:** Default Quarto TOC

**After:**
- **"Contents" header** with dropdown indicator (▾)
- **Uppercase, letter-spaced** styling
- **Active section highlighting** with teal left border
- **Smaller font** (0.9rem) for cleaner appearance

**Files modified:**
- `_quarto.yml` - Added `toc-title: "Contents"` and `toc-expand: 2`
- `assets/theme/site-light.scss` - TOC styling with ▾ indicator
- `assets/theme/site-dark.scss` - Dark mode TOC styling

### 3. Dashboard Tiles

**Already implemented in previous session:**
- Grid of navigation cards
- Icon + title format
- Sections: Syllabus, Schedule, Homework, Handouts, Explore, Get Help

### 4. Collapsible Cards (Handouts)

**Already implemented in previous session:**
- MyST-MD inspired left-border accent style
- CSS chevron indicators
- Clean expand/collapse animation

---

## Configuration Reference

### `_quarto.yml` Sidebar Options
```yaml
sidebar:
  style: "docked"
  search: true
  collapse-level: 1
  logo: assets/astr201-logo.png  # Sidebar header logo
  title: "ASTR 101"              # Sidebar title text
```

### `_quarto.yml` TOC Options
```yaml
format:
  html:
    toc: true
    toc-depth: 3
    toc-title: "Contents"  # Header text for TOC
    toc-expand: 2          # Expand first 2 levels
```

---

## JavaScript: Module Title Line Breaks

The `assets/scripts.js` file contains:

```javascript
function applyModuleTitleBreaks() {
  const sidebar = document.querySelector("#quarto-sidebar");
  if (!sidebar) return;

  const sectionTexts = sidebar.querySelectorAll(".sidebar-item-text, .menu-text");
  sectionTexts.forEach((el) => {
    const text = el.textContent || "";
    const match = text.match(/^(Module\s+\d+:)\s*(.+)$/i);
    if (match) {
      const prefix = match[1]; // "Module 1:"
      const title = match[2];  // "Foundations"
      el.innerHTML = `<span class="module-prefix">${prefix}</span><br><span class="module-title">${title}</span>`;
    }
  });
}
```

---

## CSS Classes Added

| Class | Purpose |
|-------|---------|
| `.module-prefix` | "Module X:" styling (smaller, muted) |
| `.module-title` | Module name styling (larger, indigo) |
| `.sidebar-title` | Sidebar header title |
| `.sidebar-subtitle` | Sidebar header subtitle |

---

## Future Enhancements (Not Yet Implemented)

1. **Page Frontmatter Header**
   - Breadcrumb trail
   - Author name with email/ORCID icons
   - Institution name
   - License badges (CC BY-NC-SA 4.0)

2. **Announcement Bar**
   - Prominent dismissible banner for deadlines/updates

3. **Custom 404 Page**
   - Friendly error page with navigation

---

## Validation Checklist

- [x] Module titles display on two lines
- [x] ASTR 101 logo in sidebar
- [x] More whitespace between sections
- [x] TOC has "Contents" header
- [x] Light mode styling works
- [x] Dark mode styling works
- [ ] Page frontmatter header (future)
- [ ] Announcement bar (future)

---

*Design document created: 2026-01-14*
