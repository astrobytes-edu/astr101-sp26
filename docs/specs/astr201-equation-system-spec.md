# ASTR201 Equation System Spec

*A design/spec contract for how equations, meanings, and references are authored and rendered across ASTR 101 materials.*  
Version: v1.0 • Status: Proposed → Active upon adoption

---

## 1) Purpose

ASTR 101 materials repeatedly use the same physics relations (Kepler scaling, Schwarzschild radius, flux–luminosity–distance, Stefan–Boltzmann, etc.). Students do not struggle primarily with algebra—they struggle with **what an equation is claiming** and **what assumptions make it true**.

This spec standardizes a two-layer system:

- **Equation LaTeX lives locally** (readable, near its teaching context) via includes.
- **Equation meaning scaffolding lives centrally** (predicts/depends/says/assumptions) via data-driven cards.

This prevents copy/paste drift, enforces consistent pedagogical framing, and makes it easy to audit equation usage.

---

## 2) Principles (Non-Negotiable)

1) **Equation LaTeX is authored in Markdown**, not YAML strings, to preserve readability and avoid escaping issues.
2) **Every displayed equation must have an anchor label** (e.g., `{#eq-kepler}`) so it can be referenced.
3) **Every equation shown to students must have a meaning scaffold** (predicts/depends/says + assumptions).
4) **The registry is canonical**: a single equation concept has one id, one anchor, one include, one meaning card id.

---

## 3) Data Model

### 3.1 `eqcards.yml` (Meaning Scaffolds)
Stores **how to read** the equation (not the equation itself).

**Required fields**
- `predicts`: one sentence, outputs + inputs
- `depends`: scaling/monotonicity statements (can include math)
- `says`: plain-English story (one sentence)

**Optional fields**
- `assumptions`: list of conditions (“only if…”) suitable for novices

Example (`data/eqcards.yml`):
```yaml
kepler_period:
  predicts: "Given \\(r, M\\), it predicts the orbital period \\(P\\)."
  depends: "Scales as \\(P \\propto r^{3/2}\\) and \\(P \\propto M^{-1/2}\\)."
  says: "Farther orbits take much longer; more central mass makes orbits faster."
  assumptions:
    - "Orbit is approximately circular"
    - "Central mass dominates (two-body approximation)"
    - "Newtonian gravity"
```

### 3.2 `equations.yml` (Equation Registry)
Maps a stable equation concept id → the include file, anchor, title, and the associated eqcard id.

**Required fields**
- `title`: human-readable name
- `anchor`: anchor label without `#` (e.g., `eq-kepler`)
- `include`: path to include file containing the equation + anchor
- `card`: eqcard id from `eqcards.yml`

Example (`data/equations.yml`):
```yaml
kepler:
  title: "Kepler scaling (circular orbit)"
  anchor: "eq-kepler"
  include: "_includes/equations/kepler.qmd"
  card: "kepler_period"

schwarzschild:
  title: "Schwarzschild radius (non-spinning, uncharged)"
  anchor: "eq-schwarzschild"
  include: "_includes/equations/schwarzschild.qmd"
  card: "schwarzschild_radius"
```

### 3.3 Includes (Equation LaTeX)
Each include file contains the display math and the anchor label.

Example (`_includes/equations/kepler.qmd`):
```markdown
$$
P = 2\pi\sqrt{\frac{r^3}{GM}}
$$ {#eq-kepler}
```

---

## 4) Authoring Workflow

### 4.1 The canonical pattern (recommended)
Whenever a canonical equation is introduced:

```markdown
{{< include _includes/equations/kepler.qmd >}}
{{< eqrefcard kepler >}}
```

This yields:
- the equation (from include)
- a meaning/assumptions card
- a link from the card → the equation anchor

### 4.2 Variants
- If the equation is only referenced (not shown), use `@eq-kepler` (Pandoc crossref) in prose.
- If you want meaning without the reference link (rare), use `eqcard` directly by eqcard id.

---

## 5) Shortcodes

### 5.1 `eqcard` (meaning only)
Input: `eqcard id`  
Output: Predicts/Depends/Says (+ assumptions if provided)

**Usage**
```markdown
{{< eqcard kepler_period >}}
```

### 5.2 `eqrefcard` (meaning + reference)
Input: `equation id` from `equations.yml`  
Output: meaning card + “See: the equation” link to the registry’s anchor.

**Usage**
```markdown
{{< eqrefcard kepler >}}
```

---

## 6) Implementation: `eqrefcard.html`

Place in `_shortcodes/eqrefcard.html`.

```html
{{- $eqid := or (.Get "eq") (.Get 0) -}}
{{- $eq := index site.Data.equations $eqid -}}

{{- /* Fallback mode: allow direct card/ref usage if not in equations.yml */ -}}
{{- $cardId := "" -}}
{{- $anchor := "" -}}
{{- $title := "" -}}

{{- if $eq -}}
  {{- $cardId = $eq.card -}}
  {{- $anchor = $eq.anchor -}}
  {{- $title = $eq.title -}}
{{- else -}}
  {{- $cardId = or (.Get "card") (.Get 0) -}}
  {{- $anchor = or (.Get "anchor") (.Get 1) -}}
  {{- $title = or (.Get "title") "" -}}
{{- end -}}

{{- $card := index site.Data.eqcards $cardId -}}

{{- if not $card -}}
<div class="callout callout-warning eq-gloss" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Missing eqrefcard data.</strong></p>
    <p>eqid: <code>{{ $eqid }}</code> • card: <code>{{ $cardId }}</code> • anchor: <code>{{ $anchor }}</code></p>
  </div>
</div>
{{- else -}}

<div class="callout callout-tip eq-gloss" data-callout="tip">
  <div class="callout-header">
    <div class="callout-title-container flex-fill">
      <p class="callout-title">
        {{- if $title -}}{{ $title }}{{- else -}}Equation meaning{{- end -}}
      </p>
    </div>
  </div>

  <div class="callout-body-container callout-body">
    <p><strong>What it predicts</strong><br/>{{ $card.predicts | markdownify }}</p>
    <p><strong>What it depends on</strong><br/>{{ $card.depends  | markdownify }}</p>
    <p><strong>What it’s saying</strong><br/>{{ $card.says     | markdownify }}</p>

    {{- with $card.assumptions -}}
    <p><strong>Assumptions</strong></p>
    <ul>
      {{- range . -}}<li>{{ . | markdownify }}</li>{{- end -}}
    </ul>
    {{- end -}}

    {{- if $anchor -}}
    <p style="margin-top:0.5rem;">
      <em>See:</em> <a href="#{{ $anchor }}">the equation</a>
    </p>
    {{- end -}}
  </div>
</div>

{{- end -}}
```

---

## 7) CSS Contract (Equation Gloss)

The `eqrefcard` and `eqcard` outputs must include class `eq-gloss` so decks can style them consistently.

Minimum expectation:
- compact font size (~0.85em)
- tight line-height
- visually distinct but not loud

(See `slides.scss` for the recommended baseline styles.)

---

## 8) Definition of Done (Equation Compliance)

An equation concept is compliant when:
- it has an entry in `equations.yml`
- it has a meaning entry in `eqcards.yml`
- its include file exists and contains the anchor label
- slides/notes use either:
  - `include + eqrefcard`, or
  - `@eq-...` reference with a nearby meaning scaffold

---

## 9) Future Extensions (Optional)

- `eqshow` shortcode: prints title + include + eqrefcard in one call.
- Auto-generated Equation Index page from `equations.yml`.
- `constants.yml` + `const` shortcode for values/units and unit-system toggles.

---

## 10) Example (End-to-End)

**Files**
- `data/equations.yml` contains `kepler`
- `data/eqcards.yml` contains `kepler_period`
- `_includes/equations/kepler.qmd` contains `#eq-kepler`

**In a slide**
```markdown
{{< include _includes/equations/kepler.qmd >}}
{{< eqrefcard kepler >}}
```

Result: a canonical equation + a canonical meaning scaffold + stable reference link.



---

## 11) `eqshow` Shortcode Spec (One-call: title + equation + meaning)

### 11.1 Purpose
`eqshow` reduces authoring friction and guarantees compliance by rendering, in order:
1) the equation *title* (from `equations.yml`)
2) the equation itself (via `include` path)
3) the meaning scaffold + assumptions + link (via `eqrefcard` semantics)

Use this whenever a canonical equation is first introduced.

### 11.2 Input
- `equation id` from `data/equations.yml` (e.g., `kepler`)

### 11.3 Output
- A small heading (or bold title)
- Included LaTeX (from the include file)
- The eqrefcard block (meaning + reference link)

### 11.4 Usage
```markdown
{{< eqshow kepler >}}
```

### 11.5 Implementation (`_shortcodes/eqshow.html`)
```html
{{- $eqid := or (.Get "eq") (.Get 0) -}}
{{- $eq := index site.Data.equations $eqid -}}

{{- if not $eq -}}
<div class="callout callout-warning eq-gloss" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Missing eqshow registry entry.</strong></p>
    <p>eqid: <code>{{ $eqid }}</code></p>
  </div>
</div>
{{- else -}}

{{- /* Title */ -}}
<p class="eq-title" style="margin:0.4rem 0 0.35rem 0;"><strong>{{ $eq.title }}</strong></p>

{{- /* Equation include (Markdown) */ -}}
{{- $inc := $eq.include -}}
{{- if $inc -}}
  {{- partial $inc . -}}
{{- else -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p>Missing include path for <code>{{ $eqid }}</code> in <code>equations.yml</code>.</p>
  </div>
</div>
{{- end -}}

{{- /* Meaning + reference */ -}}
{{- /* Inline the eqrefcard logic to avoid nested shortcode issues */ -}}
{{- $cardId := $eq.card -}}
{{- $anchor := $eq.anchor -}}
{{- $card := index site.Data.eqcards $cardId -}}

{{- if not $card -}}
<div class="callout callout-warning eq-gloss" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p><strong>Missing eqcard for equation.</strong></p>
    <p>eqid: <code>{{ $eqid }}</code> • card: <code>{{ $cardId }}</code></p>
  </div>
</div>
{{- else -}}
<div class="callout callout-tip eq-gloss" data-callout="tip">
  <div class="callout-header">
    <div class="callout-title-container flex-fill">
      <p class="callout-title">Equation meaning</p>
    </div>
  </div>
  <div class="callout-body-container callout-body">
    <p><strong>What it predicts</strong><br/>{{ $card.predicts | markdownify }}</p>
    <p><strong>What it depends on</strong><br/>{{ $card.depends  | markdownify }}</p>
    <p><strong>What it’s saying</strong><br/>{{ $card.says     | markdownify }}</p>

    {{- with $card.assumptions -}}
    <p><strong>Assumptions</strong></p>
    <ul>
      {{- range . -}}<li>{{ . | markdownify }}</li>{{- end -}}
    </ul>
    {{- end -}}

    {{- if $anchor -}}
    <p style="margin-top:0.5rem;">
      <em>See:</em> <a href="#{{ $anchor }}">the equation</a>
    </p>
    {{- end -}}
  </div>
</div>
{{- end -}}

{{- end -}}
```

### 11.6 Notes
- This implementation uses `partial` to include Markdown from `_includes/...`. This is the most robust approach when you already use data-driven shortcodes.
- If your project does not use Hugo partials, switch `partial $inc .` to your project’s existing include mechanism (keep the *concept* the same).

---

## 12) Equation Index Page Spec (Zero-maintenance catalog)

### 12.1 Purpose
Provide a browsable course reference page that lists all canonical equations:
- title
- link to equation anchor
- meaning scaffold summary
- assumptions

The index must be generated automatically from `data/equations.yml` + `data/eqcards.yml`.

### 12.2 Authoring
Create a Quarto page, e.g. `course-info/equations.qmd`:

```markdown
---
title: "Equation Index"
format:
  html:
    toc: true
---

{{< eqindex >}}
```

### 12.3 `eqindex` shortcode
`eqindex` renders a structured list (or grid) of all entries in `data/equations.yml`.

**Output requirements**
- Deterministic ordering (default: alphabetical by registry id; optional: by title)
- Each entry shows:
  - Title
  - Link to `#anchor`
  - Predicts/Depends/Says (compact)
  - Assumptions (collapsed if long)

### 12.4 Implementation (`_shortcodes/eqindex.html`)
```html
{{- $eqs := site.Data.equations -}}

{{- if not $eqs -}}
<div class="callout callout-warning" data-callout="warning">
  <div class="callout-body-container callout-body">
    <p>No equations found. Expected <code>data/equations.yml</code>.</p>
  </div>
</div>
{{- else -}}

<div class="eq-index">
  {{- /* Deterministic order: sort by key */ -}}
  {{- $keys := slice -}}
  {{- range $k, $_ := $eqs -}}
    {{- $keys = $keys | append $k -}}
  {{- end -}}
  {{- $keys = sort $keys -}}

  {{- range $i, $k := $keys -}}
    {{- $eq := index $eqs $k -}}
    {{- $card := index site.Data.eqcards $eq.card -}}

    <div class="eq-index-item">
      <h3 class="eq-index-title" style="margin:0 0 0.35rem 0;">
        {{- if $eq.anchor -}}
          <a href="#{{ $eq.anchor }}">{{ $eq.title }}</a>
        {{- else -}}
          {{ $eq.title }}
        {{- end -}}
      </h3>

      {{- if $card -}}
      <div class="eq-index-gloss">
        <p style="margin:0.25rem 0;"><strong>Predicts:</strong> {{ $card.predicts | markdownify }}</p>
        <p style="margin:0.25rem 0;"><strong>Depends:</strong> {{ $card.depends  | markdownify }}</p>
        <p style="margin:0.25rem 0;"><strong>Says:</strong> {{ $card.says     | markdownify }}</p>

        {{- with $card.assumptions -}}
        <details style="margin-top:0.35rem;">
          <summary><strong>Assumptions</strong></summary>
          <ul style="margin-top:0.35rem;">
            {{- range . -}}<li>{{ . | markdownify }}</li>{{- end -}}
          </ul>
        </details>
        {{- end -}}
      </div>
      {{- else -}}
      <div class="callout callout-warning" data-callout="warning">
        <div class="callout-body-container callout-body">
          <p>Missing eqcard: <code>{{ $eq.card }}</code></p>
        </div>
      </div>
      {{- end -}}

      {{- /* Optional: show registry id for debugging */ -}}
      <p class="eq-index-meta" style="opacity:0.7; margin:0.4rem 0 0; font-size:0.85em;">
        id: <code>{{ $k }}</code>
      </p>
    </div>

  {{- end -}}
</div>

{{- end -}}
```

### 12.5 Recommended CSS additions
Add to your `slides.scss` / site CSS:

```scss
.eq-index {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.eq-index-item {
  border-radius: 14px;
  padding: 0.9rem 1.0rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.eq-index-title a {
  text-decoration: none;
}

.eq-index-gloss p {
  line-height: 1.2;
}
```

---

## 13) Definition of Done (Index)

The equation index is compliant when:
- `course-info/equations.qmd` renders without manual edits
- every registry entry appears exactly once
- entries link correctly to anchors
- missing cards render a warning (fail-loud behavior)
- ordering is deterministic

