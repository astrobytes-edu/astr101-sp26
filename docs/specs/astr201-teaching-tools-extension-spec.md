# ASTR 101 Teaching Tools (RevealJS) — Spec + UX Contract

**Status:** Draft  
**Owner:** Anna (instructor)  
**Last updated:** 2026-01-19  

## 0) Task Classification (per `docs/llm-lab-protocol.md`)

Dominant: **Architectural exploration** + **Design system / UX contract** + **Documentation**.

## 1) Problem Statement

ASTR 101 lectures rely on a small set of “teaching affordances” during live presentation:

- a visible pointer (laser)
- a spotlight (attention funnel)
- inking/annotation while talking
- a dedicated **blackboard** and **whiteboard**

Today these exist as separate RevealJS/Quarto plugins with overlapping event handling, competing keybindings, and brittle focus behavior (especially around embedded iframes). This produces unreliable interactions during teaching (e.g., spotlight hijacking drawing).

**Goal:** a single integrated tool that behaves deterministically under a clear priority contract, is easy to control during a live lecture, and is safe to reuse across many decks.

## 2) Prime Directive / Non‑Negotiables

1. **No surprise interactions.** The same input produces the same result in every deck.
2. **Fixed priority rules.** Drawing/boards must not be hijacked by spotlight/pointer.
3. **UI-first controls.** A persistent toolbar is the primary interface; keyboard shortcuts are optional.
4. **Clickability preserved.** Menus/controls (Reveal menu, chalkboard controls, etc.) must remain clickable.
5. **Fast recovery.** One click to exit any mode; one click to clear (with confirm).
6. **No content authoring burden.** Slides should not require per-slide HTML hacks.

## 3) Known / Assumed / Unknown (Phase A/B)

### Known

- Quarto uses `revealjs-plugins:` and extension `_extension.yml` to load plugin JS/CSS.
- Pointer/spotlight and chalkboard-like overlays can compete for mouse/keyboard events.
- Cross-origin iframes (e.g., YouTube) do not reliably forward mouse events to the parent page.

### Assumed (reasonable, VERIFY if wrong)

- RevealJS supports a stable plugin lifecycle (`init`) and access to `Reveal.getConfig()`.
- Reveal menu/chalkboard extensions are present or may be installed per-deck.

### Unknown / TBD

- Exact chalkboard plugin API surface and events we can subscribe to robustly (TBD).
- How much persistence is needed across lecture sessions (per-deck vs per-run vs per-student) (TBD).
- Whether instructors want storage/export by default or only in “instructor build” (TBD).

## 4) UX Contract (the “what happens when I click” rules)

### 4.1 Persistent Toolbar

A toolbar is always visible while presenting (v1). A “hide toolbar” toggle is desired (v2).

**Toolbar controls (v1):**

- Pointer: `On/Off`
- Spotlight: `On/Off`
- Draw on Slide: `On/Off`
- Blackboard: `Open/Close`
- Whiteboard: `Open/Close`
- Eraser tool (for draw/boards): `On/Off`
- Colors palette (at least 6 colors) + thickness (at least 3 sizes)
- Undo / Redo (TBD if feasible in v1)
- Clear… (opens confirm menu; see §4.4)
- Help (opens a “shortcuts + rules” overlay; optional in v1)

**Toolbar visual contract:**

- If an action is currently disallowed by priority rules (e.g., Spotlight while drawing), its button shows a **disabled** state and does nothing.
- Toolbar must never become unclickable because an overlay intercepted pointer events.

### 4.2 Fixed Priority (required)

When any of these are active:

- Draw on Slide **ON**
- Blackboard **OPEN**
- Whiteboard **OPEN**

…the system **forces**:

- Spotlight **OFF**
- Pointer **OFF**

and **prevents** them from turning on via stray mouse-down / key events.

Rationale: drawing/boards are high-risk for accidental activation and must win.

### 4.3 Mutual Exclusivity / Mode Constraints

- Blackboard and Whiteboard are mutually exclusive: opening one closes the other.
- Draw on Slide can be ON with neither board open (default lecture annotation use).
- Draw on Slide is OFF while a board is open (simpler mental model; reduces stacking overlays).

### 4.4 Clear / Erase Contract (required)

User requirement: “clear both A+B”.

- **Clear Slide Annotations:** clears only the current slide’s draw layer.
- **Clear Current Board:** clears the currently open board (blackboard or whiteboard).
- Both must be available from the toolbar.
- Both must require a confirmation click (or a 2-step confirm UI).

Optional (v2):

- “Clear all slide annotations (entire deck)” behind a stronger confirm.
- “Export annotations” (download JSON or PNGs) (TBD).

### 4.5 Interaction Guarantees

- Drawing must never require holding a key (no key+mouse chords as the primary path).
- Spotlight must not block clicking UI (toolbar, menu, chalkboard controls).
- A visible “where am I?” indicator is always available (see §6.3).

## 5) Feature Set

### 5.1 Pointer (laser)

**Functional:**

- visible dot/laser with configurable color + size
- toggle via toolbar

**Constraints:**

- must be above slide content but below toolbar
- must remain visible on dark and light backgrounds

### 5.2 Spotlight

**Functional:**

- dim the slide with a circular spotlight around the cursor
- toggle via toolbar
- configurable radius

**Hard limitation (explicit):**

- Spotlight cannot be guaranteed over cross-origin iframes (e.g., YouTube). The tool must document this and behave gracefully (e.g., spotlight stays on but won’t track inside the iframe; no crashes).

### 5.3 Draw on Slide (inking layer)

**Functional:**

- freehand draw and erase
- color and thickness controls
- undo/redo (if implemented)
- clear current slide annotations

**Storage:**

- default: in-memory for the session (v1)
- optional: persist to localStorage per deck URL hash (v2) (TBD)

### 5.4 Blackboard / Whiteboard

**Functional:**

- full-screen board overlay with distinct background:
  - Blackboard: dark texture or solid near-black
  - Whiteboard: white/off-white background
- draw/erase/colors/thickness
- clear current board

**Optional:**

- grid toggle (useful for graphs/axes)
- import/export

## 6) STEM-Focused “High ROI” Extras

These are common live-teaching needs in STEM; categorize as v1 vs v2.

### 6.1 v1 candidates (small, high value)

- **Big, readable slide position:** show `Deck title • h.v` in a small persistent footer badge.
- **Timer:** simple elapsed timer (start/pause/reset) to keep pacing.
- **Blank screen:** one click to black/white screen (attention reset).

### 6.2 v2 candidates (nice-to-have)

- **Freeze frame:** pause the visible slide while navigating (useful for prep).
- **Zoom/pan:** for dense plots (careful: can be disorienting).
- **Straight-line tool:** for vectors/axes.
- **Shape primitives:** arrow, box, circle (optional; risk of complexity).

### 6.3 “Where Am I?” Contract (required)

Instructor requirement: always know “I’m on the slides”.

- Always-visible indicator (small) showing:
  - deck name (or short code)
  - slide index `h.v` (and optionally total)
- Must be legible but not intrusive.
- Must not collide with Reveal footers/controls (theme-safe).

## 7) Architecture Proposal (Phase C)

### Approach 1 (recommended): One integrated plugin

Build a single RevealJS plugin (Quarto extension) that:

- renders toolbar + overlays (pointer, spotlight, draw, boards)
- owns the state machine and priority rules
- uses Reveal config (`Reveal.getConfig().teachingTools`) for defaults

**Pros:** one source of truth; deterministic; fewer conflicts.  
**Cons:** more initial work; must replicate some chalkboard functionality.

### Approach 2: “Coordinator” wrapper around existing plugins

Build a small plugin that:

- draws toolbar
- toggles existing pointer/spotlight/chalkboard plugins
- enforces priority via API calls and DOM checks

**Pros:** less code; reuse known plugins.  
**Cons:** brittle (plugin API differences, DOM timing), more regressions risk.

### Decision

Prefer **Approach 1** for reliability. Approach 2 is acceptable only as a short-term bridge.

## 8) State Machine (contracted)

Represent the tool as a single state object:

```text
mode: "normal" | "pointer" | "spotlight" | "draw" | "blackboard" | "whiteboard"
tool: "pen" | "eraser"
color: <css-color>
thickness: <number>
```

**State transition invariants:**

- Entering `draw|blackboard|whiteboard` forces `pointer=false` and `spotlight=false`.
- Entering `blackboard` forces `whiteboard` closed, and vice versa.
- `clear` is never a state toggle; it is an explicit action with confirm.

## 9) Quarto Integration Contract

### 9.1 Configuration surface (YAML)

```yaml
format:
  revealjs:
    teachingTools:
      enabled: true
      toolbar:
        position: "top-right"   # TBD
        collapsible: false      # v2: true
      defaults:
        pointer:
          enabled: true
          # Default should come from `_brand.yml` primary/accent (TBD wiring).
          color: "brand-primary"
          size: 18
        spotlight:
          enabled: true
          radius: 80
        draw:
          enabled: true
          # Default palette should be derived from brand + a few high-contrast teaching colors (TBD).
          colors: ["brand-foreground", "brand-primary", "TBD"]
          thickness: [3, 6, 10]
        boards:
          enabled: true
          # Defaults should derive from theme background/foreground tokens (TBD).
          blackboardColor: "brand-background"
          whiteboardColor: "brand-surface"
      safety:
        requireConfirmClear: true
        disableSpotlightWhenDrawing: true  # must be true in v1
```

Values above are illustrative; final keys TBD.

**Compatibility rule (required):**

- When `teachingTools.enabled: true`, decks should **not** also load separate pointer/spotlight/chalkboard plugins, unless explicitly running in “coordinator” mode (Approach 2). The integrated tool must be the single owner of these interactions.

### 9.2 Keyboard shortcuts (optional)

- Default posture: **off** (avoid conflicts and focus issues).
- If enabled, shortcuts must be configurable and documented in the in-deck Help overlay.
- No core feature may require a keyboard shortcut.

### 9.2 Asset packaging

- Provide `teaching-tools.js` and `teaching-tools.css` via Quarto extension.
- Theme should remain independent; tool CSS must be namespaced to avoid global leakage.
- Layering contract:
  - toolbar sits on top of everything (highest `z-index`)
  - boards/draw overlays sit above slide content
  - spotlight/pointer sit above slide content but below the toolbar
  - overlays must not steal click events from the toolbar

## 10) Accessibility / Input Behavior

- Toolbar is keyboard-navigable (tab order) but does not require keyboard usage.
- Cursor visibility must not disappear unexpectedly.
- Touch support: minimum viable (tap toolbar; draw with finger) (TBD).

## 11) Performance / Failure Modes

**Must not:**

- degrade slide rendering when idle
- block pointer events for other UI controls
- crash on slides with iframes

**Graceful failure rules:**

- If a feature can’t run (e.g., pointer lock denied), the UI shows a disabled state and continues.

## 12) Acceptance Criteria (Definition of Done)

1. In a representative deck, instructor can:
   - toggle pointer, spotlight, draw, boards via toolbar
   - draw without spotlight ever turning on
   - clear slide annotations and clear board with confirmation
2. “Where am I?” indicator is always visible and doesn’t collide with footers/controls.
3. Works in Chrome + Firefox + Safari (TBD exact versions) on macOS at minimum.
4. Works with embedded YouTube slides without breaking navigation (spotlight tracking inside iframe is not required).

## 13) Out of Scope (v1)

- Student collaboration / shared whiteboard
- Networked syncing of annotations
- Fancy shape libraries / handwriting recognition
- Per-slide custom UI layouts
