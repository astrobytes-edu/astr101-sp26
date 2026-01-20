# ASTR201 Figure System Spec

*A design/spec contract for how figures are stored, referenced, rendered, attributed, and audited across ASTR 101 materials.*  
Version: v1.0 • Status: Proposed → Active upon adoption

---

## 1) Purpose

Figures are not decoration. In ASTR 101 they function as **data**: diagrams, plots, images, tables-as-figures, and annotated schematics that students must learn to read.

This spec standardizes a figure system that:
- enforces **accessibility** (alt text)
- enforces **pedagogical captions** (what to notice)
- enforces **attribution/licensing** (credit lines)
- enables **consistent cross-references** (anchors)
- prevents **copy/paste drift** (single registry)
- works identically in **slides + readings**

---

## 2) Principles (Non-Negotiable)

1) **One canonical figure concept = one id.** Never “recreate” the same figure metadata in multiple places.
2) **Alt text is required** for every figure asset.
3) **Captions are pedagogical**: they must tell students what to look for.
4) **Attribution is first-class**: credit + license are stored and renderable.
5) **Rendering is deterministic**: a figure id always renders the same content unless the registry changes.
6) **Fail loud**: missing figure ids or missing required fields must render a visible warning.

---

## 3) Taxonomy: What counts as a figure?

A “figure” id may point to any of:
- **Image** (`.png`, `.jpg`, `.svg`, `.webp`)
- **Plot** (static image, or embedded HTML widget)
- **Diagram** (SVG preferred)
- **Table-as-figure** (HTML/Markdown include treated as a figure)
- **Multi-panel figure** (A/B panels)

If it needs an anchor, caption, alt text, and/or attribution, it belongs in the figure system.

---

## 4) File Layout (Recommended)

```
/data/
  figures.yml            # canonical registry: id → metadata
/_includes/
  figures/
    ...                  # optional: complex figures, tables, multi-panel layouts
/_shortcodes/
  fig.html               # render figure by id
  figref.html            # render “See Fig. …” reference link by id
  figshow.html           # one-call: title + figure + credit (optional)
  figindex.html          # auto-generated figure catalog (optional)
/assets/
  figures/
    module-01/
    module-02/
    ...
```

Notes:
- Keep assets organized by module/unit so refactors don’t break mental mapping.
- SVG is preferred for line art/diagrams; PNG/WebP for photos.

---

## 5) Data Model: `data/figures.yml`

### 5.1 Required fields
- `path`: file path to the asset OR include path for complex figures
- `alt`: accessibility text (1–2 sentences)

### 5.2 Strongly recommended fields
- `title`: short human-readable title
- `cap`: pedagogical caption (what to notice) — see caption contract below
- `anchor`: stable anchor id (e.g., `fig-kepler-orbits`)
- `credit`: creator/organization name
- `license`: SPDX-like string or human readable (e.g., `CC-BY-4.0`, `Public Domain`, `NASA (public domain)`)
- `source`: canonical source (URL or citation key)

### 5.3 Optional rendering fields
- `type`: `image | include | svg | table | multipanel | embed`
- `width`: e.g. `75%` or `900px`
- `class`: CSS class names
- `align`: `center | left | right`
- `theme`: `light | dark | auto`
- `variants`: light/dark mode variants
- `note`: instructor-only note (not rendered unless debugging)

### 5.4 Example entries

```yaml
kepler_orbits_overview:
  type: image
  title: "Planetary orbits schematic"
  path: "assets/figures/module-02/kepler-orbits.png"
  anchor: "fig-kepler-orbits"
  alt: "A schematic showing a small planet orbiting a much more massive star at radius r, labeling orbital period P."
  cap: "**What to notice:** period depends on orbit size and central mass; this figure defines the symbols we use in the derivation."
  credit: "ASTR 101"
  license: "CC-BY-4.0"

schwarzschild_cartoon:
  type: svg
  title: "Black hole horizon cartoon"
  path: "assets/figures/module-02/schwarzschild.svg"
  anchor: "fig-schwarzschild"
  alt: "A diagram of a black hole with a labeled event horizon radius Rs and an arrow indicating light cannot escape from inside the horizon."
  cap: "**What to notice:** the horizon is a radius scale; our goal is to predict how it scales with mass."
  credit: "ASTR 101"
  license: "CC-BY-4.0"

unit_reference_table:
  type: include
  title: "Common unit conversions"
  path: "_includes/figures/unit-table.qmd"
  anchor: "fig-unit-table"
  alt: "A reference table listing common SI and CGS unit conversions used in the course."
  cap: "Use this table to translate between SI and CGS; watch for squared/cubed factors."
  credit: "ASTR 101"
  license: "CC-BY-4.0"
```

---

## 6) Caption Contract (Pedagogical)

A figure caption must do at least one of:
- **What to notice** (trend/feature/relationship)
- **Why it matters** (what concept it supports)
- **How to read it** (axes, units, conventions)

Minimum viable caption pattern:

> **What to notice:** …

For plots, also include:
- axis variable names + units
- direction of the key trend
- what counts as “supporting evidence” vs “noise”

---

## 7) Rendering Contract

### 7.1 Output expectations
Rendering must produce one of:
- a semantic `<figure>` with `<img>` (or `<svg>`) + `<figcaption>`
- or, for includes, a `<figure>` wrapper around the included content

### 7.2 Attribution line
If `credit` and/or `license` exist, render a small attribution line in the caption area:

> *Credit: … • License: …*

If a source exists, optionally include a “Source” link.

### 7.3 Anchor behavior
If `anchor` is present, the `<figure>` must include an `id` so links and crossrefs work.

---

## 8) Shortcodes

### 8.1 `fig` (render a figure by id)
Input: `figure id` (key in `figures.yml`)  
Output: figure element (asset/include) + caption + attribution

**Usage**
```markdown
{{< fig kepler_orbits_overview >}}
```

### 8.2 `figref` (reference link)
Input: `figure id`  
Output: a stable link to the figure anchor

**Usage**
```markdown
See {{< figref kepler_orbits_overview >}}.
```

### 8.3 `figshow` (one-call: title + figure)
Input: `figure id`  
Output: title (optional) + `fig`

**Usage**
```markdown
{{< figshow kepler_orbits_overview >}}
```

### 8.4 `figindex` (auto-generated catalog)
Generates a browsable index from `figures.yml`.

**Usage**
```markdown
{{< figindex >}}
```

---

## 9) Implementation: `_shortcodes/fig.html`

```html
{{- $id := or (.Get "id") (.Get 0) -}}
{{- $f := index site.Data.figures $id -}}

{{- if not $f -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Missing figure id:</strong> <code>{{ $id }}</code></p>
  </div>
</div>
{{- else -}}

{{- $path := $f.path -}}
{{- $alt := $f.alt -}}
{{- $cap := $f.cap -}}
{{- $anchor := $f.anchor -}}
{{- $type := or $f.type "image" -}}
{{- $width := $f.width -}}
{{- $class := $f.class -}}
{{- $align := or $f.align "center" -}}

{{- if not $alt -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Figure missing required alt text:</strong> <code>{{ $id }}</code></p>
  </div>
</div>
{{- end -}}

<figure {{ if $anchor }}id="{{ $anchor }}"{{ end }} class="astr-fig {{ $align }} {{ $class }}">

  {{- if eq $type "include" -}}
    {{- partial $path . -}}
  {{- else -}}
    <img src="{{ $path }}" alt="{{ $alt }}" {{ if $width }}style="width:{{ $width }};"{{ end }} />
  {{- end -}}

  {{- if or $cap $f.credit $f.license $f.source -}}
  <figcaption>
    {{- if $cap -}}
      <div class="astr-fig-cap">{{ $cap | markdownify }}</div>
    {{- end -}}

    {{- if or $f.credit $f.license $f.source -}}
      <div class="astr-fig-attrib" style="opacity:0.75; font-size:0.85em; margin-top:0.25rem;">
        {{- if $f.credit -}}<span><em>Credit:</em> {{ $f.credit }}</span>{{- end -}}
        {{- if and $f.credit $f.license -}}<span> • </span>{{- end -}}
        {{- if $f.license -}}<span><em>License:</em> {{ $f.license }}</span>{{- end -}}
        {{- if $f.source -}}
          <span> • </span><span><em>Source:</em> <a href="{{ $f.source }}">link</a></span>
        {{- end -}}
      </div>
    {{- end -}}
  </figcaption>
  {{- end -}}

</figure>

{{- end -}}
```

Notes:
- Uses `partial` for includes, mirroring the equation stack.
- If you are not using Hugo partials, replace `partial $path .` with your project’s include mechanism.

---

## 10) `_shortcodes/figref.html`

```html
{{- $id := or (.Get "id") (.Get 0) -}}
{{- $f := index site.Data.figures $id -}}

{{- if not $f -}}
<code>[missing figure: {{ $id }}]</code>
{{- else -}}
{{- $anchor := $f.anchor -}}
{{- if $anchor -}}
<a href="#{{ $anchor }}">Figure</a>
{{- else -}}
<code>[figure has no anchor: {{ $id }}]</code>
{{- end -}}
{{- end -}}
```

Optional: if you want “Figure 2.3” numbering, prefer Pandoc figure crossrefs (`{#fig-...}`) and reference with `@fig-...`. This stack is for consistent rendering + attribution; numbering can be layered later.

---

## 11) `figshow` and `figindex` (Optional)

### 11.1 `_shortcodes/figshow.html`

```html
{{- $id := or (.Get "id") (.Get 0) -}}
{{- $f := index site.Data.figures $id -}}

{{- if not $f -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Missing figure id:</strong> <code>{{ $id }}</code></p>
  </div>
</div>
{{- else -}}
{{- if $f.title -}}
<p class="fig-title" style="margin:0.4rem 0 0.35rem 0;"><strong>{{ $f.title }}</strong></p>
{{- end -}}
{{- /* Delegate to fig */ -}}
{{- partial "_shortcodes/fig.html" . -}}
{{- end -}}
```

### 11.2 `_shortcodes/figindex.html`

Renders a grid catalog of figures for debugging and course reference.

```html
{{- $fs := site.Data.figures -}}

{{- if not $fs -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p>No figures found. Expected <code>data/figures.yml</code>.</p>
  </div>
</div>
{{- else -}}

<div class="fig-index">
  {{- $keys := slice -}}
  {{- range $k, $_ := $fs -}}
    {{- $keys = $keys | append $k -}}
  {{- end -}}
  {{- $keys = sort $keys -}}

  {{- range $i, $k := $keys -}}
    {{- $f := index $fs $k -}}

    <div class="fig-index-item">
      <h3 style="margin:0 0 0.35rem 0;">
        {{- if $f.anchor -}}
          <a href="#{{ $f.anchor }}">{{ or $f.title $k }}</a>
        {{- else -}}
          {{ or $f.title $k }}
        {{- end -}}
      </h3>

      {{- /* Show thumbnail */ -}}
      {{- if and $f.path (ne (or $f.type "image") "include") -}}
        <img src="{{ $f.path }}" alt="{{ $f.alt }}" style="width:100%; border-radius:12px;" />
      {{- else -}}
        <div style="opacity:0.75; font-size:0.9em;">(non-image or include figure)</div>
      {{- end -}}

      {{- if $f.cap -}}
        <p style="margin:0.45rem 0 0;">{{ $f.cap | markdownify }}</p>
      {{- end -}}

      <p style="opacity:0.7; margin:0.45rem 0 0; font-size:0.85em;">
        id: <code>{{ $k }}</code>
      </p>
    </div>

  {{- end -}}
</div>

{{- end -}}
```

---

## 12) CSS Contract

Add to site CSS (or reuse your existing design system):

```scss
.astr-fig {
  margin: 0.7rem 0;
}

.astr-fig.center { text-align: center; }
.astr-fig.left   { text-align: left; }
.astr-fig.right  { text-align: right; }

.astr-fig img {
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.10);
}

.astr-fig-cap {
  margin-top: 0.45rem;
  line-height: 1.25;
}

.fig-index {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.fig-index-item {
  border-radius: 14px;
  padding: 0.9rem 1.0rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
```

---

## 13) Definition of Done (Figures)

A figure is compliant when:
- it has an entry in `figures.yml`
- it has `path` and **alt** populated
- it has `anchor` if it will be referenced
- it has a pedagogical caption (`cap`) for student-facing use
- it has credit/license/source if not original
- it renders without warnings

A deck/reading is compliant when:
- every included figure is rendered via `{{< fig ... >}}` (or approved native Quarto figure with equivalent metadata)
- plots have axes labels + units
- no figure appears without a stated purpose (“what to notice”)

---

## 14) Future Extensions (Optional)

- `figpair` / `figpanel` for multi-panel figures with subcaptions (A/B/C)
- light/dark variants (swap assets based on theme)
- auto-checker script: validate registry completeness (alt/cap/license)
- integration with bibliography: `source: "@Smith2020"` rendering instead of links

---

## 15) End-to-End Example

**Registry**: `data/figures.yml` contains `kepler_orbits_overview` with anchor `fig-kepler-orbits`.

**In a slide**
```markdown
{{< fig kepler_orbits_overview >}}
```

**Reference it later**
```markdown
As shown in {{< figref kepler_orbits_overview >}}, period depends on orbit size and central mass.
```

Result: one canonical figure + consistent caption + accessible alt text + correct attribution.

