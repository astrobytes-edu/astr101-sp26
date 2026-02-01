# Lectures 5 & 6 Perfection Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate L5 (Kepler's Laws) and L6 (Newton's Gravity) readings from A-/A to publication-perfect, implementing all review recommendations.

**Architecture:**
- L5: Distribute demo missions inline with content, add O→M→I label, add primary source quote
- L6: Add demo exploration using `binary-orbits` (motion reveals mass) + reference Kepler demo Newton Mode, add Sketch It prompt, add O→M→I label
- Both: Deduplicate glossary, cross-reference module glossary shortcode

**Tech Stack:** Quarto Markdown, existing demos (`keplers-laws`, `binary-orbits`)

---

## Task 1: L5 — Add Explicit Observable→Model→Inference Callout

**Files:**
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd` (around line 71, after retrograde warning)

**Step 1: Locate insertion point**

Find the section after "This puzzle — explaining retrograde motion — drove astronomical thinking for two millennia." (around line 71)

**Step 2: Add O→M→I callout**

Insert after the retrograde warning callout, before the figure placeholder:

```markdown
::: {.callout-note title="Observable → Model → Inference: Retrograde Motion"}
**Observable:** Mars appears to reverse direction against the background stars for several weeks each year. (Position observation)

**Model:** Earth and Mars both orbit the Sun; Earth orbits faster. When Earth "passes" Mars, Mars appears to drift backward — like passing a car on the highway.

**Inference:** Retrograde is an **apparent** motion caused by geometry, not a real reversal. This supports the heliocentric model.
:::
```

**Step 3: Verify render**

Run: `quarto render modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`
Expected: No errors, callout renders correctly

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-05-keplers-laws-reading.qmd
git commit -m "feat(L5): add explicit Observable→Model→Inference callout for retrograde"
```

---

## Task 2: L5 — Add Primary Source Quote (Kepler)

**Files:**
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd` (after line 222, Kepler's ellipse breakthrough)

**Step 1: Locate insertion point**

Find the paragraph ending "Kepler later wrote that he felt like he had 'awoken from a sleep.'" (around line 222)

**Step 2: Add epigraph callout**

Replace the paraphrase with a proper quote block:

```markdown
::: {.callout-tip title="In Kepler's Own Words" collapse="true"}
> "I was almost driven to madness in considering and calculating this matter. I could not find out why the planet would rather go on an elliptical orbit... With reasoning derived from physical principles, agreeing with experience, there is no figure left for the orbit of the planet but a perfect ellipse."
>
> — Johannes Kepler, *Astronomia Nova* (1609)

Kepler's breakthrough wasn't a flash of insight — it was twenty years of grueling calculation. He tried circles, offset circles, ovals, and dozens of variations before the ellipse finally fit.
:::
```

**Step 3: Verify render**

Run: `quarto render modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`
Expected: Collapsible callout with blockquote renders correctly

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-05-keplers-laws-reading.qmd
git commit -m "feat(L5): add primary source quote from Kepler's Astronomia Nova"
```

---

## Task 3: L5 — Move Demo Missions 1-2 to Inline Positions

**Files:**
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`

**Step 1: Extract Demo Mission 1 (Sun Not at Center)**

Cut the entire Demo Mission 1 section (lines ~569-591) and prepare for relocation.

**Step 2: Insert after First Law content**

Insert Demo Mission 1 immediately after "Check Yourself 4 — The Sun's Position" solution (after line ~327), before the "---" separator. Add transition text:

```markdown
---

### 🔭 Try It: First Law in the Demo

**Open the Kepler's Laws Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/keplers-laws/](https://astrobytes-edu.github.io/astr101-sp26/demos/keplers-laws/)

**Demo Mission: The Sun Is Not at the Center**

*Predict before you explore:* If you make an orbit highly elliptical (high eccentricity), where will the Sun be relative to the orbit's center?

::: {.callout-note title="My Prediction" collapse="true"}
Write your prediction here before continuing: _______________
:::

**Do this:**

1. Set **Eccentricity** to about 0.6 (fairly elliptical)
2. Toggle on **Show Foci** and **Show Apsides**
3. Observe where the Sun sits relative to the ellipse's geometric center

**Key question:** Is the Sun at the center of the ellipse?

::: {.callout-tip title="What You Should Have Found" collapse="true"}
The Sun sits at one **focus**, not at the center. The higher the eccentricity, the more offset the Sun is from center. The other focus is empty — nothing sits there.

**Claim:** Kepler's First Law says orbits are ellipses with the Sun at one focus, not at the center.

**Evidence:** With eccentricity ~0.6, the Sun is clearly offset from the ellipse's geometric center. The distance from perihelion (closest point) to the Sun is much shorter than from aphelion (farthest point) to the Sun.
:::

---
```

**Step 3: Extract and relocate Demo Mission 2 (Faster When Closer)**

Move Demo Mission 2 to after "Check Yourself 6 — Equal Areas Interpretation" (after line ~404), with similar transition header "### 🔭 Try It: Second Law in the Demo".

**Step 4: Update consolidated demo section**

The remaining demo section (after Kepler III) should now only contain:
- Brief intro referencing the demo was already introduced
- Mission 3 (Testing P² ∝ a³)
- Mission 4 (Star Mass preview)

Update the intro text:

```markdown
## 🔭 Demo Exploration: Kepler's Third Law

You've already explored the First and Second Laws in the demo above. Now let's test the Third Law.

---

**Demo Mission 3: Testing $P^2 \propto a^3$**
[... rest of Mission 3 ...]

**Demo Mission 4: What Changes With Star Mass? (Preview of Newton)**
[... rest of Mission 4 ...]
```

**Step 5: Verify render**

Run: `quarto render modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`
Expected: All demo sections render, no broken references

**Step 6: Commit**

```bash
git add modules/module-01/readings/lecture-05-keplers-laws-reading.qmd
git commit -m "refactor(L5): distribute demo missions inline with corresponding laws"
```

---

## Task 4: L6 — Add Demo Exploration Section (Binary Orbits)

**Files:**
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd` (insert after line ~845, after Check Yourself 13)

**Step 1: Locate insertion point**

Find the end of "Check Yourself 13 — Different Stars" solution (after line ~845), before the Deep Dive on orbital velocity.

**Step 2: Add demo exploration section**

Insert the following new section:

```markdown
---

## 🔭 Demo Exploration: Motion Reveals Mass

**Open the Binary Orbits Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/binary-orbits/](https://astrobytes-edu.github.io/astr101-sp26/demos/binary-orbits/)

This demo shows the full physics of two-body orbits. Both the star AND the planet orbit their common center of mass (barycenter). This is how astronomers "weigh" distant objects.

**What you'll see:**

- **Both bodies move** — the star wobbles too (this is how we detect exoplanets!)
- **Mass sliders** for both objects
- **Period readout** that changes with total mass
- **Presets** for real systems (Sun-Jupiter, exoplanets, binary stars)

---

**Demo Mission 1: The Star Wobbles**

*Predict before you explore:* When Jupiter orbits the Sun, does the Sun stay perfectly still?

::: {.callout-note title="My Prediction" collapse="true"}
Write your prediction here: _______________
:::

**Do this:**

1. Select the **Sun + Jupiter** preset
2. Click **Play** and watch both bodies move
3. Toggle on **Show Barycenter**
4. Observe: Is the Sun stationary?

::: {.callout-tip title="What You Should Have Found" collapse="true"}
The Sun is NOT stationary — it wobbles in a tiny orbit around the barycenter (center of mass). Jupiter's mass is small compared to the Sun's, so the Sun's wobble is small but real.

**Claim:** Newton's Third Law requires both bodies to move. If Jupiter pulls on the Sun, the Sun pulls back — and both accelerate.

**Evidence:** The demo shows the Sun's small orbit. In fact, the Sun-Jupiter barycenter is actually just outside the Sun's surface! This wobble is how we detect exoplanets around distant stars (radial velocity method).
:::

---

**Demo Mission 2: Measuring Mass from Orbits**

*Predict before you explore:* If you double the total mass of the system while keeping the separation fixed, what happens to the orbital period?

::: {.callout-note title="My Prediction" collapse="true"}
From $P^2 = a^3/M_{total}$: If $M$ doubles, $P^2$ becomes half as large, so $P$ becomes...?
:::

**Do this:**

1. Select **Equal Mass** binary preset (1 $M_\odot$ + 1 $M_\odot$)
2. Note the orbital period
3. Increase M₁ to 2 $M_\odot$ (now 2 + 1 = 3 $M_\odot$ total)
4. Compare the new period to the original

| Configuration | Total Mass | Period | $P^2$ |
|---------------|------------|--------|-------|
| 1 + 1 $M_\odot$ | 2 $M_\odot$ | | |
| 2 + 1 $M_\odot$ | 3 $M_\odot$ | | |

::: {.callout-tip title="What You Should Have Found" collapse="true"}
Increasing total mass → shorter period. More mass = stronger gravity = faster orbits.

**Claim:** $P^2 \propto 1/M_{total}$ at fixed separation. This is Newton's version of Kepler III.

**Evidence:** The period readout shows faster orbits with more mass. The ratio should match: $P_2/P_1 = \sqrt{M_1/M_2} = \sqrt{2/3} \approx 0.82$.

**The Payoff:** Flip this around — if we MEASURE the period and separation, we can CALCULATE the total mass. That's how we weigh stars, black holes, and galaxies!
:::

---

**Demo Mission 3: Exoplanet Detection (Why the Wobble Matters)**

**Do this:**

1. Select the **51 Peg b** preset (first exoplanet discovered, 1995)
2. Observe the star's wobble
3. Now select **Sun + Earth**
4. Compare the star wobble size

::: {.callout-tip title="What You Should Have Found" collapse="true"}
51 Peg b (a "hot Jupiter") causes a MUCH larger stellar wobble than Earth does. Why? It's more massive AND closer to its star.

**Claim:** We detect exoplanets by measuring their host star's wobble. Bigger planets cause bigger wobbles.

**Evidence:** The demo shows 51 Peg b causing obvious stellar motion, while Earth's effect on the Sun is nearly invisible. This is why hot Jupiters were discovered first — they cause the largest, easiest-to-detect wobbles.
:::

---

::: {.callout-note title="Also Try: Kepler Demo Newton Mode"}
The [Kepler's Laws Demo](https://astrobytes-edu.github.io/astr101-sp26/demos/keplers-laws/) has a **Newton Mode** that shows velocity and acceleration vectors. Try it to see how centripetal acceleration always points toward the Sun.
:::

---
```

**Step 3: Verify render**

Run: `quarto render modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`
Expected: Demo section renders with all callouts

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd
git commit -m "feat(L6): add Binary Orbits demo exploration section"
```

---

## Task 5: L6 — Add Sketch It Prompt (Newton's Cannon)

**Files:**
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd` (after Newton's Cannon figure placeholder, around line ~86)

**Step 1: Locate insertion point**

Find the figure placeholder for `newtons-cannon` (around line 80-86).

**Step 2: Add Sketch It callout**

Insert immediately after the figure placeholder:

```markdown
::: {.callout-note title="✏️ Sketch It: Newton's Cannon" collapse="true"}
Draw a circular Earth. On top of it, draw a tall mountain with a cannon pointing horizontally (parallel to the ground).

Now draw four trajectories for cannonballs fired at increasing speeds:

1. **Low speed:** Curves down, hits ground nearby
2. **Medium speed:** Curves down, hits ground farther away
3. **Orbital speed:** Curves down, but Earth curves away at the same rate — continuous fall around Earth!
4. **Escape speed:** Curves but never comes back — escapes to infinity

Label which trajectory represents an orbit. The key insight: **orbiting is falling, but moving sideways fast enough to keep missing.**
:::
```

**Step 3: Verify render**

Run: `quarto render modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`
Expected: Collapsible Sketch It callout renders correctly

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd
git commit -m "feat(L6): add Sketch It prompt for Newton's cannon"
```

---

## Task 6: L6 — Add Explicit Observable→Model→Inference Callout

**Files:**
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd` (in Part 3, around line ~810, near mass-measuring content)

**Step 1: Locate insertion point**

Find "The Mass-Measuring Power Tool" section (around line ~796).

**Step 2: Add O→M→I callout**

Insert after the "Translation: Measure orbital period and distance → Calculate the central mass" line:

```markdown
::: {.callout-note title="Observable → Model → Inference: Weighing the Sun"}
**Observable:** Earth's orbital period is 1 year, and its orbital distance (semi-major axis) is 1 AU. (Timing + Position observations)

**Model:** Newton's version of Kepler III: $M = 4\pi^2 a^3 / (GP^2)$

**Inference:** The Sun's mass is approximately $2 \times 10^{30}$ kg — about 330,000 times Earth's mass.

We never touched the Sun. We just watched how Earth moves around it.
:::
```

**Step 3: Verify render**

Run: `quarto render modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`
Expected: Callout renders correctly

**Step 4: Commit**

```bash
git add modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd
git commit -m "feat(L6): add explicit Observable→Model→Inference callout for mass measurement"
```

---

## Task 7: Both — Deduplicate Glossary Entries

**Files:**
- Modify: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`
- Modify: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`

**Step 1: Identify duplicates**

Terms appearing in BOTH L5 and L6 glossaries:
- Angular momentum
- Empirical law

**Step 2: Update L5 glossary**

Add note pointing to module glossary for terms also defined elsewhere. Keep L5 glossary focused on Kepler-specific terms.

At the end of L5's glossary table, ensure this line exists:
```markdown
{{< glossary module=1 >}}
```

**Step 3: Update L6 glossary**

In L6, the terms "Angular momentum" and "Empirical law" should reference L5:

Change L6's glossary entries to:
```markdown
| **Angular momentum** | A measure of rotational motion; conserved under central forces. (See also [Lecture 5](lecture-05-keplers-laws-reading.qmd#glossary)) |
| **Empirical law** | A pattern from data; tells us *what* without explaining why. (Defined in [Lecture 5](lecture-05-keplers-laws-reading.qmd#glossary)) |
```

**Step 4: Verify both render**

Run: `quarto render modules/module-01/readings/`
Expected: Both files render, links work

**Step 5: Commit**

```bash
git add modules/module-01/readings/lecture-05-keplers-laws-reading.qmd modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd
git commit -m "docs(L5,L6): cross-reference duplicate glossary terms"
```

---

## Task 8: Final Verification

**Step 1: Render entire module**

Run: `quarto render modules/module-01/`
Expected: All files render without errors

**Step 2: Check word counts**

Run: `wc -w modules/module-01/readings/lecture-05-keplers-laws-reading.qmd modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`
Expected: L5 ~7,500-8,500 words, L6 ~9,000-10,000 words (after demo additions)

**Step 3: Spot-check key elements**

Verify:
- [ ] L5 has O→M→I callout (Task 1)
- [ ] L5 has Kepler quote (Task 2)
- [ ] L5 demo missions are inline (Task 3)
- [ ] L6 has Binary Orbits demo section (Task 4)
- [ ] L6 has Sketch It prompt (Task 5)
- [ ] L6 has O→M→I callout (Task 6)
- [ ] Glossaries cross-reference (Task 7)

**Step 4: Final commit**

```bash
git add -A
git commit -m "docs(L5,L6): complete perfection pass - demos, O→M→I, quotes, sketches"
```

---

## Summary of Changes

| Task | File | Change | Impact |
|------|------|--------|--------|
| 1 | L5 | Add O→M→I callout for retrograde | Connects to course-wide pattern |
| 2 | L5 | Add Kepler primary source quote | Historical gravitas |
| 3 | L5 | Move demo missions inline | Engagement during reading |
| 4 | L6 | Add Binary Orbits demo section | Major engagement boost |
| 5 | L6 | Add Sketch It for Newton's cannon | Parity with L5 activities |
| 6 | L6 | Add O→M→I callout for mass measurement | Connects to course-wide pattern |
| 7 | Both | Cross-reference glossary duplicates | Clean documentation |
| 8 | Both | Final verification | Quality assurance |

**Estimated total effort:** 45-60 minutes for full implementation.
