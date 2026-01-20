# "What We Don't Know" Feature — Pedagogical Spec

**Goal:** Add "Open Questions" callouts to each module page highlighting unsolved problems in astrophysics. Reminds students they're learning a living science, not settled facts.

---

## Pedagogical Rationale

1. **Combats "science is done" misconception** — Students often think physics/astronomy is a closed book of facts
2. **Models scientific thinking** — Real scientists work at the frontier of the unknown
3. **Sparks curiosity** — Unsolved problems are more interesting than solved ones
4. **Connects to course theme** — "The universe is weird" from why-astr101-is-different.qmd

---

## Open Questions by Module

### Module 1: Foundations (Light, Gravity, Scales)

```markdown
::: {.callout-frontier}
## Open Questions

- **What is dark energy?** It makes up ~68% of the universe and drives accelerating expansion, but we don't know what it actually *is*.
- **Why does gravity exist?** We can describe it (Newton, Einstein), but we don't know *why* mass curves spacetime.
- **Is the speed of light truly constant?** Some theories suggest it may have varied in the early universe.
:::
```

### Module 2: Inferring Star Properties (Spectra, HR Diagram, Distance)

```markdown
::: {.callout-frontier}
## Open Questions

- **What causes the solar abundance problem?** Helioseismology and spectroscopy give different answers for the Sun's composition.
- **Why do stellar models struggle with convection?** We still use mixing-length theory from the 1950s because convection is so hard to model.
- **Are there stars older than the universe?** Some age estimates exceed 13.8 Gyr — systematic errors or new physics?
:::
```

### Module 3: Stellar Structure & Evolution (Fusion, Death, Compact Objects)

```markdown
::: {.callout-frontier}
## Open Questions

- **What triggers core-collapse supernovae?** We know massive stars explode, but the exact mechanism that revives the stalled shock is still debated.
- **Why do some massive stars collapse directly to black holes?** The "island of explodability" is not fully understood.
- **What is the maximum neutron star mass?** Above ~2-3 M☉ they collapse to black holes, but the exact limit depends on unknown nuclear physics.
- **What is the equation of state of ultra-dense matter?** We can't recreate neutron star cores in labs.
:::
```

### Module 4: Galaxies & Cosmology (Dark Matter, Expansion, Large-Scale Structure)

```markdown
::: {.callout-frontier}
## Open Questions

- **What is dark matter?** It makes up ~27% of the universe. We've never detected a dark matter particle directly.
- **Why is there more matter than antimatter?** The Big Bang should have made equal amounts — where did the antimatter go?
- **What happened before the Big Bang?** Our physics breaks down at t = 0.
- **Is the Hubble tension real?** Local and CMB measurements of H₀ disagree by ~5σ. Systematic error or new physics?
- **Why do galaxies spin faster than expected?** Dark matter or modified gravity (MOND)?
:::
```

---

## Implementation Options

### Option A: Custom Callout Style

**How it works:** Add a new callout type to your SCSS that renders with distinctive "frontier" styling.

#### Step 1: Add SCSS to `assets/theme/callouts.scss`

```scss
/* ============================================
   Frontier Callout - "What We Don't Know"
   ============================================ */

.callout-frontier {
  border-left: 4px solid var(--frontier-color, #9333ea); /* purple - mystery/unknown */
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.05) 0%,
    rgba(59, 130, 246, 0.05) 100%);

  .callout-header {
    background: transparent;

    &::before {
      content: "🔭"; /* or use a question mark icon */
      margin-right: 0.5em;
    }
  }

  .callout-title {
    color: var(--frontier-color, #9333ea);
    font-weight: 600;
  }
}

/* Dark mode */
[data-bs-theme="dark"] .callout-frontier {
  background: linear-gradient(135deg,
    rgba(147, 51, 234, 0.15) 0%,
    rgba(59, 130, 246, 0.1) 100%);
}
```

#### Step 2: Usage in module pages

```markdown
::: {.callout-frontier}
## Open Questions

- **What is dark energy?** It makes up ~68% of the universe...
- **Why does gravity exist?** We can describe it, but...
:::
```

#### Pros
- ✅ Native Quarto — no custom Lua needed
- ✅ Simple to write — just add class to any callout
- ✅ Consistent with existing callout infrastructure
- ✅ Easy to customize appearance
- ✅ Works immediately after adding SCSS

#### Cons
- ❌ Content is duplicated in each module file
- ❌ No central management of questions
- ❌ To update a question, must edit each module file
- ❌ No programmatic access to questions list

---

### Option B: Custom Shortcode with YAML Data

**How it works:** Store all open questions in a central YAML file. A Lua shortcode pulls the relevant questions for each module.

#### Step 1: Create data file `_data/open-questions.yml`

```yaml
# Open questions by module
# Each entry has: question, explanation, optional link

module-01:
  title: "Foundations"
  questions:
    - question: "What is dark energy?"
      explanation: "It makes up ~68% of the universe and drives accelerating expansion, but we don't know what it actually *is*."
      link: "https://science.nasa.gov/astrophysics/focus-areas/what-is-dark-energy"

    - question: "Why does gravity exist?"
      explanation: "We can describe it (Newton, Einstein), but we don't know *why* mass curves spacetime."

    - question: "Is the speed of light truly constant?"
      explanation: "Some theories suggest it may have varied in the early universe."

module-02:
  title: "Inferring Star Properties"
  questions:
    - question: "What causes the solar abundance problem?"
      explanation: "Helioseismology and spectroscopy give different answers for the Sun's composition."
      link: "https://arxiv.org/abs/2001.00000"  # placeholder

    - question: "Why do stellar models struggle with convection?"
      explanation: "We still use mixing-length theory from the 1950s because convection is so hard to model."

    - question: "Are there stars older than the universe?"
      explanation: "Some age estimates exceed 13.8 Gyr — systematic errors or new physics?"

module-03:
  title: "Stellar Structure & Evolution"
  questions:
    - question: "What triggers core-collapse supernovae?"
      explanation: "We know massive stars explode, but the exact mechanism that revives the stalled shock is still debated."
      link: "https://arxiv.org/abs/2312.00000"  # placeholder

    - question: "Why do some massive stars collapse directly to black holes?"
      explanation: "The 'island of explodability' is not fully understood."

    - question: "What is the maximum neutron star mass?"
      explanation: "Above ~2-3 M☉ they collapse to black holes, but the exact limit depends on unknown nuclear physics."

    - question: "What is the equation of state of ultra-dense matter?"
      explanation: "We can't recreate neutron star cores in labs."

module-04:
  title: "Galaxies & Cosmology"
  questions:
    - question: "What is dark matter?"
      explanation: "It makes up ~27% of the universe. We've never detected a dark matter particle directly."
      link: "https://science.nasa.gov/astrophysics/focus-areas/what-is-dark-matter"

    - question: "Why is there more matter than antimatter?"
      explanation: "The Big Bang should have made equal amounts — where did the antimatter go?"

    - question: "What happened before the Big Bang?"
      explanation: "Our physics breaks down at t = 0."

    - question: "Is the Hubble tension real?"
      explanation: "Local and CMB measurements of H₀ disagree by ~5σ. Systematic error or new physics?"
      link: "https://arxiv.org/abs/2311.00000"  # placeholder

    - question: "Why do galaxies spin faster than expected?"
      explanation: "Dark matter or modified gravity (MOND)?"
```

#### Step 2: Create Lua shortcode `_extensions/course/frontier.lua`

```lua
-- frontier.lua: Shortcode for "Open Questions" callouts
-- Usage: {{< frontier module="01" >}}

local yaml = require("tinyyaml")  -- or use pandoc's built-in YAML

function frontier(args)
  local module_id = "module-" .. (args.module or "01")

  -- Read the YAML data file
  local f = io.open("_data/open-questions.yml", "r")
  if not f then
    return pandoc.Str("[Error: open-questions.yml not found]")
  end
  local content = f:read("*all")
  f:close()

  local data = yaml.parse(content)
  local module_data = data[module_id]

  if not module_data then
    return pandoc.Str("[Error: Module " .. module_id .. " not found]")
  end

  -- Build the callout content
  local items = {}
  for _, q in ipairs(module_data.questions) do
    local item_text = "**" .. q.question .. "** " .. q.explanation
    if q.link then
      item_text = item_text .. " [→ Learn more](" .. q.link .. ")"
    end
    table.insert(items, pandoc.BulletList({pandoc.Plain(pandoc.read(item_text, "markdown").blocks[1].content)}))
  end

  -- Create callout div
  local callout = pandoc.Div(
    {
      pandoc.Header(2, "Open Questions"),
      pandoc.BulletList(items)
    },
    {class = "callout-frontier"}
  )

  return callout
end

return {
  ["frontier"] = frontier
}
```

#### Step 3: Register in `_extensions/course/_extension.yml`

```yaml
title: Course
author: Dr. Anna Rosen
version: 1.0.0
contributes:
  shortcodes:
    - shortcodes.lua
    - frontier.lua  # Add this line
```

#### Step 4: Usage in module pages

```markdown
{{< frontier module="03" >}}
```

That's it — one line per module, content pulled from central YAML.

#### Pros
- ✅ Single source of truth — update once, changes everywhere
- ✅ Easy to add/remove/reorder questions
- ✅ Could generate a "master list" page automatically
- ✅ Programmatic access for other tools (stats, exports)
- ✅ Clean separation of content and presentation
- ✅ Could add metadata (difficulty, keywords, related lectures)

#### Cons
- ❌ More complex initial setup
- ❌ Requires Lua knowledge to modify shortcode
- ❌ YAML parsing in Lua can be finicky
- ❌ Harder to debug if something breaks
- ❌ Another file to maintain

---

## Recommendation

| Scenario | Recommended Option |
|----------|-------------------|
| Want it working TODAY | **Option A** (SCSS callout) |
| Plan to frequently update questions | **Option B** (shortcode) |
| Only 4 modules, rarely change | **Option A** |
| Want to generate "all questions" page | **Option B** |
| Teaching assistant will help maintain | **Option A** (lower barrier) |
| You enjoy tinkering with infrastructure | **Option B** |

**My recommendation:** Start with **Option A** now. If you find yourself frequently editing questions across modules and wishing for centralization, migrate to **Option B** later. The callout content is markdown either way, so migration is straightforward.

---

## Additional Enhancement Ideas

### Collapsible by default
```markdown
::: {.callout-frontier collapse="true"}
## Open Questions
...
:::
```

### Add "Difficulty" badges
```markdown
- **What is dark energy?** {{< badge "Fundamental" >}} It makes up ~68%...
```

### Link to research papers
```markdown
- **What triggers core-collapse supernovae?** ([Burrows 2021](https://arxiv.org/abs/2104.00000))
```

### Add "Last updated" date
```yaml
module-03:
  updated: 2026-01-15
  questions: ...
```

---

## Next Steps

1. [ ] Choose Option A or B
2. [ ] Add SCSS styles for `.callout-frontier`
3. [ ] Write/refine open questions for each module
4. [ ] Add callouts to module pages
5. [ ] Test rendering in both light and dark mode
6. [ ] Review with fresh eyes — are questions accessible to undergrads?
