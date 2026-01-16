# Custom Shortcodes

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Course websites have recurring patterns that aren't built into Markdown:

- Due dates with consistent formatting
- Point values for assignments
- Reading references with chapter and page numbers
- Links to Canvas sections
- Instructor name/email that updates from params

**Without shortcodes, you write inconsistent markup:**

```markdown
<!-- Different people write due dates differently -->
**Due: February 15, 2026**
*Due: 2/15/26*
Due date: Feb 15
**Due Date:** 15 February 2026

<!-- Point values all over the place -->
(10 points)
[10 pts]
10 points
Worth 10 points
```

This inconsistency looks unprofessional and makes global changes impossible.

**With shortcodes, you enforce consistency:**

```markdown
{{< due "2026-02-15" >}}      <!-- Always renders the same way -->
{{< points 10 >}}             <!-- Always renders the same way -->
{{< reading "Ch. 3" "45-62" >}}  <!-- Consistent format -->
```

Change how due dates display? Edit one Lua function. Every due date on your site updates.

---

## How Shortcodes Work Mechanically

Quarto shortcodes are Lua functions that run during the render process. When Quarto sees `{{< name args >}}`, it:

1. Looks for a Lua function with that name
2. Passes the arguments to the function
3. Replaces the shortcode with whatever the function returns

**The complete flow:**

```
┌─────────────────────────────────────────────────────────────┐
│                     Your .qmd file                          │
│                                                             │
│   Assignment 1 {{< points 10 >}}                           │
│   {{< due "2026-02-15" >}}                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Quarto parses shortcodes
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            _extensions/course/shortcodes.lua                │
│                                                             │
│   function points(args)                                     │
│     local pts = args[1] or "?"                             │
│     return pandoc.Emph(pandoc.Str("(" .. pts .. " pts)"))  │
│   end                                                       │
│                                                             │
│   function due(args)                                        │
│     local date = args[1] or "TBD"                          │
│     return pandoc.Strong(pandoc.Str("Due: " .. date))      │
│   end                                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Lua functions return Pandoc elements
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Rendered HTML output                      │
│                                                             │
│   Assignment 1 <em>(10 pts)</em>                           │
│   <strong>Due: 2026-02-15</strong>                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Setting Up Shortcodes: Complete Walkthrough

### Step 1: Create the Extension Directory Structure

Quarto extensions live in `_extensions/`. Create this structure:

```
your-course/
├── _quarto.yml
└── _extensions/
    └── course/                  # Your extension name (arbitrary)
        ├── _extension.yml       # Extension metadata (required)
        └── shortcodes.lua       # Your shortcode definitions
```

**Why this structure?** Quarto's extension system expects:

- `_extensions/` directory at project root
- Subdirectory for each extension (here: `course`)
- `_extension.yml` declaring what the extension provides
- Lua files with the actual code

### Step 2: Create the Extension Metadata File

```yaml
# _extensions/course/_extension.yml

title: Course Shortcodes
author: Your Name
version: 1.0.0
contributes:
  shortcodes:
    - shortcodes.lua
```

**What this file does:**

- `title`, `author`, `version`: Metadata (for documentation/debugging)
- `contributes.shortcodes`: Lists Lua files that define shortcodes
- Quarto reads this to know which Lua files to load

### Step 3: Create the Shortcodes File

```lua
-- _extensions/course/shortcodes.lua
-- Custom shortcodes for course websites
-- Each function name becomes a shortcode: {{< name args >}}

-- ═══════════════════════════════════════════════════════════════
-- ASSIGNMENT SHORTCODES
-- ═══════════════════════════════════════════════════════════════

-- Due date: {{< due "2026-02-15" >}}
-- Renders as: **Due: 2026-02-15**
function due(args)
  -- args is a list of arguments passed to the shortcode
  -- args[1] is the first argument, args[2] the second, etc.
  local date = args[1] or "TBD"  -- Default to "TBD" if no date given

  -- Return a Pandoc "Strong" element (renders as bold)
  -- containing a "Str" element (plain text)
  return pandoc.Strong(pandoc.Str("Due: " .. date))
end


-- Point value: {{< points 10 >}}
-- Renders as: *(10 points)*
function points(args)
  local pts = args[1] or "?"

  -- Return a Pandoc "Emph" element (renders as italics)
  return pandoc.Emph(pandoc.Str("(" .. pts .. " points)"))
end


-- Reading reference: {{< reading "Ch. 3" "pp. 45-62" >}}
-- Renders as: Ch. 3, pp. 45-62
function reading(args)
  local chapter = args[1] or ""
  local pages = args[2] or ""

  if pages ~= "" then
    return pandoc.Str(chapter .. ", " .. pages)
  else
    return pandoc.Str(chapter)
  end
end


-- Week reference: {{< week 3 >}}
-- Renders as: **Week 3**
function week(args)
  local num = args[1] or "?"
  return pandoc.Strong(pandoc.Str("Week " .. num))
end


-- ═══════════════════════════════════════════════════════════════
-- PARAM-BASED SHORTCODES
-- These read from _quarto.yml params for single-source-of-truth
-- ═══════════════════════════════════════════════════════════════

-- Instructor name: {{< instructor >}}
-- Reads from params.instructor in _quarto.yml
function instructor(args)
  -- Access document metadata (includes params from _quarto.yml)
  local meta = quarto.doc.metadata

  -- Navigate to params.instructor, with fallback
  local name = meta.params and meta.params.instructor or "Instructor"

  -- stringify converts Pandoc MetaValue to plain string
  return pandoc.Str(pandoc.utils.stringify(name))
end


-- Email link: {{< email >}}
-- Reads from params.email, renders as mailto: link
function email(args)
  local meta = quarto.doc.metadata
  local addr = meta.params and meta.params.email or "email@example.com"
  addr = pandoc.utils.stringify(addr)

  -- Return a Pandoc Link: Link(text, url)
  return pandoc.Link(addr, "mailto:" .. addr)
end


-- Semester: {{< semester >}}
-- Reads from params.semester
function semester(args)
  local meta = quarto.doc.metadata
  local sem = meta.params and meta.params.semester or "Current Semester"
  return pandoc.Str(pandoc.utils.stringify(sem))
end


-- Canvas link: {{< canvas "assignments" >}}
-- Renders as: [Canvas](https://sdsu.instructure.com/assignments)
function canvas(args)
  local meta = quarto.doc.metadata
  local base_url = meta.params and meta.params["canvas-url"]
                   or "https://canvas.edu"
  base_url = pandoc.utils.stringify(base_url)

  local section = args[1] or ""
  local url = base_url
  if section ~= "" then
    url = base_url .. "/" .. section
  end

  return pandoc.Link("Canvas", url)
end


-- ═══════════════════════════════════════════════════════════════
-- HTML-RETURNING SHORTCODES
-- For more complex output, return raw HTML
-- ═══════════════════════════════════════════════════════════════

-- Warning badge: {{< warning "Important message here" >}}
-- Renders as styled HTML span
function warning(args)
  local msg = args[1] or "Warning!"

  -- RawInline inserts raw HTML (not processed as Markdown)
  return pandoc.RawInline('html',
    '<span style="color: #856404; background: #fff3cd; ' ..
    'padding: 0.2em 0.5em; border-radius: 3px; font-weight: bold;">' ..
    '⚠️ ' .. msg .. '</span>')
end
```

### Step 4: Register the Extension in `_quarto.yml`

Add to your `_quarto.yml`:

```yaml
# Tell Quarto to load the 'course' extension
filters:
  - course
```

**Why "filters"?** Technically, shortcode extensions are implemented as Pandoc filters. Quarto abstracts this, but the configuration key is still `filters`.

### Step 5: Verify It Works

Create a test file:

```markdown
---
title: "Shortcode Test"
---

## Test: Due Date
{{< due "2026-02-15" >}}

## Test: Points
This assignment is worth {{< points 10 >}}.

## Test: Reading
Required: {{< reading "Ch. 3" "pp. 45-62" >}}

## Test: Instructor
Contact {{< instructor >}} at {{< email >}}.

## Test: Semester
This course is offered {{< semester >}}.
```

Run `quarto render test.qmd` and verify the output.

---

## Available Shortcodes Reference

| Shortcode | Usage | Output |
|-----------|-------|--------|
| `{{< due "2026-02-15" >}}` | Assignment due date | **Due: 2026-02-15** |
| `{{< points 10 >}}` | Point value | *(10 points)* |
| `{{< reading "Ch. 3" "pp. 45-62" >}}` | Textbook reference | Ch. 3, pp. 45-62 |
| `{{< week 3 >}}` | Week reference | **Week 3** |
| `{{< instructor >}}` | From params | Dr. Anna Rosen |
| `{{< email >}}` | Mailto link | [alrosen@sdsu.edu](mailto:...) |
| `{{< semester >}}` | From params | Spring 2026 |
| `{{< canvas "assignments" >}}` | Canvas link | [Canvas](https://...) |
| `{{< warning "msg" >}}` | Warning badge | (styled span) |

---

## Understanding Pandoc Elements

Shortcodes return Pandoc elements. Here are the most useful:

| Element | Lua Code | Renders As |
|---------|----------|------------|
| Plain text | `pandoc.Str("hello")` | hello |
| Bold | `pandoc.Strong(pandoc.Str("hello"))` | **hello** |
| Italic | `pandoc.Emph(pandoc.Str("hello"))` | *hello* |
| Link | `pandoc.Link("text", "https://...")` | [text](https://...) |
| Raw HTML | `pandoc.RawInline('html', '<span>...</span>')` | (raw HTML) |
| Line break | `pandoc.LineBreak()` | (newline) |
| Multiple elements | `pandoc.Inlines({elem1, elem2})` | (sequence) |

---

## Adding New Shortcodes

To add a new shortcode:

1. Open `_extensions/course/shortcodes.lua`
2. Add a new function where the function name = shortcode name
3. The function receives `args` (list of arguments)
4. Return a Pandoc element

**Example: New shortcode for assignment links:**

```lua
-- Assignment link: {{< assignment 3 >}}
-- Renders as: [Assignment 3](homework/hw03.html)
function assignment(args)
  local num = args[1] or "1"
  local padded = string.format("%02d", tonumber(num))  -- "3" -> "03"
  local url = "homework/hw" .. padded .. ".html"
  local text = "Assignment " .. num

  return pandoc.Link(text, url)
end
```

---

## Common Pitfalls

### 1. Function name must match shortcode name exactly

```lua
-- This creates shortcode {{< myshortcode >}}, not {{< my_shortcode >}}
function myshortcode(args) ... end
```

### 2. Arguments are strings, even numbers

```lua
function points(args)
  -- args[1] is "10" (string), not 10 (number)
  -- For math, convert: tonumber(args[1])
end
```

### 3. Accessing nested params requires careful nil-checking

```lua
-- WRONG - crashes if params doesn't exist
local name = quarto.doc.metadata.params.instructor

-- CORRECT - safe access with fallback
local meta = quarto.doc.metadata
local name = meta.params and meta.params.instructor or "Default"
```

### 4. Forgetting to register the extension

If shortcodes aren't working, check that `_quarto.yml` has:

```yaml
filters:
  - course
```

---

## Next Steps

- [Global Variables](01-global-variables.md) — Define the params that shortcodes read
- [Computed Schedules](04-computed-schedules.md) — More complex automation with Python
