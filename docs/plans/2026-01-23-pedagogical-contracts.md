# ASTR 101 Pedagogical Contracts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create two new contracts that ensure consistency across all ASTR 101 course artifacts — problems/solutions and activities.

**Architecture:** Two standalone Markdown contracts in `docs/contracts/` that complement existing pedagogical contracts. Each contract defines taxonomies, formats, and audit checklists for their respective content types.

**Tech Stack:** Markdown documentation, integrates with existing Quarto-based course site.

---

## Background: Design Decisions

This plan implements the problem taxonomy framework developed through brainstorming:

### Problem Framework (4 Dimensions)

| Dimension | Options | Purpose |
|-----------|---------|---------|
| **TYPE** | Conceptual, Calculation, Synthesis | What format the problem takes |
| **DEPTH** | Recognition, Application, Connection | How deep the thinking goes |
| **O→M→I** | Yes / No | Does it trace Observable→Model→Inference? |
| **DIFFICULTY** | ⭐ / ⭐⭐ / ⭐⭐⭐ | Effort/challenge level |

### Calculation Sub-Types (for scaffolding)

| Sub-Type | Description | When to Use |
|----------|-------------|-------------|
| **Setup** | Write equation, identify knowns/unknowns, don't solve | Early practice, diagnose gaps |
| **Execute** | Carry out calculation with given setup | Practice mechanics |
| **Interpret** | Given result, explain physical meaning | Test understanding |
| **Full** | Setup + Execute + Interpret | Standard assessment |

### Activity Types

| Type | Description | Duration |
|------|-------------|----------|
| **Demo-driven** | Uses `demos/` interactive tools | 15-30 min |
| **Worksheet** | Paper-based scaffolded problems | 20-45 min |
| **Discussion** | Think-pair-share or small group | 10-20 min |
| **Lab** | Extended investigation with data | 45-60 min |

### Available Demos

```
demos/
├── angular-size/
├── blackbody-radiation/
├── eclipse-geometry/
├── em-spectrum/
├── keplers-laws/
├── moon-phases/
├── parallax-distance/
├── seasons/
└── telescope-resolution/
```

---

## Task 1: Create Problems & Solutions Contract

**Files:**
- Create: `docs/contracts/astr101-problems-solutions-contract.md`

**Step 1: Write the contract file**

```markdown
# ASTR 101 Problems & Solutions Contract

*Taxonomy, format, and quality standards for all practice problems and solutions.*

Version: v1.0 • Status: Active • Owner: Instructor

---

## 0) Purpose and Scope

This contract ensures consistency across all ASTR 101 problems:
- Practice problems in readings
- Homework assignments
- Exam questions
- Solution files

**Philosophy:** Problems should diagnose understanding and reinforce the Observable → Model → Inference pattern, not test memorization.

---

## 1) Problem Taxonomy (4 Dimensions)

Every problem is classified along four dimensions:

### 1.1 TYPE — What format the problem takes

| Type | Description | Example |
|------|-------------|---------|
| **Conceptual** | No calculation; tests understanding of ideas | "Is distance measured or inferred?" |
| **Calculation** | Apply a tool to get a number | "Convert 4.2 ly to parsecs" |
| **Synthesis** | Combine multiple ideas or trace full inference chains | "Explain the evidence for dark matter" |

### 1.2 DEPTH — How deep the thinking goes

| Depth | What It Demands | Indicator |
|-------|-----------------|-----------|
| **Recognition** | Identify, recall, classify | "Which of these is an observable?" |
| **Application** | Use tool correctly in familiar context | "Calculate light travel time" |
| **Connection** | Link ideas, justify reasoning, critique claims | "What's wrong with 'we see hydrogen'?" |

### 1.3 O→M→I Tag — Does it trace the inference chain?

| Tag | Meaning | Audit Use |
|-----|---------|-----------|
| **O→M→I** | Problem requires tracing from Observable → Model → Inference | Ensures course thesis is reinforced |
| ** — ** | Problem doesn't require inference chain | Tool drill or mechanics practice |

**Requirement:** At least 2 problems per reading/homework MUST have the O→M→I tag.

### 1.4 DIFFICULTY — Effort/challenge level

| Stars | Meaning | Typical Use |
|-------|---------|-------------|
| ⭐ | Straightforward, builds confidence | Warmup, first exposure |
| ⭐⭐ | Requires thought, typical exam level | Standard practice |
| ⭐⭐⭐ | Challenging, requires synthesis or transfer | Stretch goals |

---

## 2) Problem Label Format

Every problem MUST include a label in this format:

```
Type / Depth / O→M→I / ⭐⭐
```

**Examples:**
- `Conceptual / Recognition / — / ⭐`
- `Calculation / Application / O→M→I / ⭐⭐`
- `Synthesis / Connection / O→M→I / ⭐⭐⭐`

**Placement:** Label appears in a comment or metadata, not visible to students in rendered output.

```markdown
<!-- Problem: Conceptual / Connection / O→M→I / ⭐⭐ -->
**Problem 3.** Why can't astronomers directly measure the temperature of a distant star?
```

---

## 3) Calculation Sub-Types (Optional Scaffolding)

For **Calculation** problems, optionally specify a sub-type to scaffold skills:

| Sub-Type | Description | When to Use |
|----------|-------------|-------------|
| **Setup** | Write equation, identify knowns/unknowns, don't solve | Early practice, diagnose conceptual gaps |
| **Execute** | Carry out calculation with given setup | Practice mechanics |
| **Interpret** | Given result, explain physical meaning | Test understanding of answer |
| **Full** | Setup + Execute + Interpret | Standard assessment |

**Format with sub-type:**
```
Calculation:Setup / Application / — / ⭐
Calculation:Full / Application / O→M→I / ⭐⭐
```

**Pedagogical note:** Setup problems diagnose whether students understand *what* to do before checking if they can do it correctly. Interpret problems diagnose whether students understand *why* the answer matters.

---

## 4) Solution Format Requirements

Every solution MUST include:

### 4.1 For Conceptual Problems

1. **Restatement** (1 sentence — what the question is asking)
2. **Key insight** (the core idea being tested)
3. **Answer** (clear, complete response)
4. **Common misconception** (if applicable — what wrong answer to expect)

### 4.2 For Calculation Problems

1. **Given/Find** (list knowns and unknowns with units)
2. **Equation** (identify the relevant relationship)
3. **Step-by-step solution** (show all algebra, no skipped steps)
4. **Unit check** (verify dimensions match)
5. **Sanity check** (order of magnitude, physical reasonableness)
6. **Answer summary** (boxed or bold, with units)

**Example:**

```markdown
**Given:**
- Distance to star: $d = 10$ pc
- Apparent brightness: $b = 2.5 \times 10^{-9}$ W/m²

**Find:** Luminosity $L$

**Equation:** $b = \frac{L}{4\pi d^2}$ → $L = 4\pi d^2 b$

**Solution:**
$$L = 4\pi (10 \text{ pc})^2 (2.5 \times 10^{-9} \text{ W/m}^2)$$

Convert pc to m: $10 \text{ pc} = 3.09 \times 10^{17}$ m

$$L = 4\pi (3.09 \times 10^{17})^2 (2.5 \times 10^{-9})$$
$$L = 4\pi (9.55 \times 10^{34})(2.5 \times 10^{-9})$$
$$L = 3.0 \times 10^{27} \text{ W}$$

**Unit check:** $\frac{\text{W}}{\text{m}^2} \times \text{m}^2 = \text{W}$ ✓

**Sanity check:** Sun's luminosity is $3.8 \times 10^{26}$ W, so this star is ~8× more luminous than the Sun. Reasonable for a nearby star.

**Answer:** $L = 3.0 \times 10^{27}$ W (about 8 L☉)
```

### 4.3 For Synthesis Problems

1. **Restatement** (what the question is asking)
2. **Key elements** (checklist of points a complete answer must address)
3. **Sample response** (model answer demonstrating expected depth)
4. **Grading guidance** (what earns full/partial credit)

---

## 5) Homework Recipe

Each homework assignment SHOULD include:

| Requirement | Minimum |
|-------------|---------|
| Conceptual problems | 2 |
| Calculation problems | 2 |
| Synthesis problems | 1 |
| Problems with O→M→I tag | 2 |
| Difficulty mix | At least 1 ⭐, mostly ⭐⭐, max 1 ⭐⭐⭐ |

**Total:** 5-7 problems per homework is typical.

---

## 6) Reading Practice Problems

Each reading SHOULD include:

| Requirement | Minimum |
|-------------|---------|
| Total problems | 8-12 |
| Conceptual | 3-4 |
| Calculation | 3-4 |
| Synthesis | 2-3 |
| O→M→I tagged | 3+ |

**Organization:** Group problems by type (Conceptual → Calculation → Synthesis) or by topic.

---

## 7) Audit Checklist

When auditing problems, verify:

- [ ] Every problem has TYPE / DEPTH / O→M→I / Stars label
- [ ] Every calculation shows units throughout
- [ ] Every solution has sanity check (calculations) or key insight (conceptual)
- [ ] At least 2 problems per reading/homework trace O→M→I
- [ ] Problem types are balanced per the recipe
- [ ] Problems map to stated learning objectives
- [ ] No fabricated numbers or "studies show" claims
- [ ] SI units used throughout (no CGS)

---

## 8) Anti-Patterns (FORBIDDEN)

- ❌ Problems testing pure recall ("What is the speed of light?")
- ❌ Calculations without unit checks in solutions
- ❌ "Plug and chug" without interpretation
- ❌ All problems at the same difficulty level
- ❌ No O→M→I problems in a reading
- ❌ Solutions that skip algebraic steps
- ❌ Problems unconnected to learning objectives

---

## 9) Example Problem Set (Annotated)

### Conceptual Problems

<!-- Problem: Conceptual / Recognition / — / ⭐ -->
**1.** Which of the following can astronomers *directly measure* for a distant star?
- (a) Temperature
- (b) Apparent brightness
- (c) Mass
- (d) Age

<!-- Problem: Conceptual / Connection / O→M→I / ⭐⭐ -->
**2.** A classmate says "Astronomers have observed that the star Betelgeuse is 700 light-years away." What's misleading about this statement, and how would you correct it?

### Calculation Problems

<!-- Problem: Calculation:Full / Application / O→M→I / ⭐⭐ -->
**3.** Star A appears 4× brighter than Star B. If both stars have the same luminosity, how much farther away is Star B than Star A?

<!-- Problem: Calculation:Setup / Recognition / — / ⭐ -->
**4.** (Setup only) Light from the Sun takes 8.3 minutes to reach Earth. Write the equation you would use to find the Earth-Sun distance, and identify all known and unknown quantities. Do NOT solve.

### Synthesis Problems

<!-- Problem: Synthesis / Connection / O→M→I / ⭐⭐⭐ -->
**5.** Explain how astronomers infer the presence of dark matter in galaxies, even though dark matter emits no light. Your answer should explicitly trace from observables to inference.

---

## 10) Maintenance

- Update this contract when new problem types emerge
- Review problem balance across modules each semester
- Calibrate difficulty stars based on student performance data
```

**Step 2: Verify file was created**

Run: `head -50 docs/contracts/astr101-problems-solutions-contract.md`
Expected: See contract header and first section

**Step 3: Commit the contract**

```bash
git add docs/contracts/astr101-problems-solutions-contract.md
git commit -m "docs(contracts): add problems & solutions contract

Defines problem taxonomy (TYPE/DEPTH/O→M→I/Stars), solution format
requirements, homework recipe, and audit checklist for ASTR 101."
```

---

## Task 2: Create Activities Contract

**Files:**
- Create: `docs/contracts/astr101-activities-contract.md`

**Step 1: Write the contract file**

```markdown
# ASTR 101 Activities Contract

*Types, formats, and quality standards for in-class activities and labs.*

Version: v1.0 • Status: Active • Owner: Instructor

---

## 0) Purpose and Scope

This contract ensures consistency across all ASTR 101 activities:
- In-class worksheets
- Demo-driven explorations
- Discussion activities
- Extended labs

**Philosophy:** Activities should make abstract concepts concrete through direct engagement, not passive observation.

---

## 1) Activity Types

| Type | Description | Typical Duration | Primary Mode |
|------|-------------|------------------|--------------|
| **Demo-driven** | Interactive exploration using `demos/` tools | 15-30 min | Hands-on |
| **Worksheet** | Paper-based scaffolded problems | 20-45 min | Individual/Pair |
| **Discussion** | Think-pair-share or small group | 10-20 min | Collaborative |
| **Lab** | Extended investigation with data | 45-60 min | Investigation |

---

## 2) Time Budget Categories

Plan activities using these standard durations:

| Category | Duration | Use Case |
|----------|----------|----------|
| **Quick** | 10-15 min | Lecture break, single concept check |
| **Standard** | 20-30 min | Lecture + activity day |
| **Full** | 40-45 min | Activity-focused day |
| **Extended** | 50-60 min | Lab or multi-part investigation |

**Rule:** Never plan an activity that exceeds its time category by >10%.

---

## 3) Demo Registry

The following interactive demos are available in `demos/`:

| Demo | Path | Module | Key Concepts |
|------|------|--------|--------------|
| Angular Size | `demos/angular-size/` | 1 | Apparent vs physical size, distance |
| Blackbody Radiation | `demos/blackbody-radiation/` | 2 | Temperature-color relationship, Wien's law |
| Eclipse Geometry | `demos/eclipse-geometry/` | 1 | Scale, alignment, shadow geometry |
| EM Spectrum | `demos/em-spectrum/` | 2 | Wavelength, frequency, energy |
| Kepler's Laws | `demos/keplers-laws/` | 3 | Orbital motion, period-distance |
| Moon Phases | `demos/moon-phases/` | 1 | Illumination geometry, observer perspective |
| Parallax Distance | `demos/parallax-distance/` | 1 | Triangulation, baseline, angle |
| Seasons | `demos/seasons/` | 1 | Axial tilt, solar angle, day length |
| Telescope Resolution | `demos/telescope-resolution/` | 2 | Aperture, diffraction, resolving power |

---

## 4) Demo-Driven Activity Format

### 4.1 Header (Required)

```markdown
# [Activity Title]

**Type:** Demo-driven
**Duration:** [Time category] ([X] minutes)
**Demo:** `demos/[demo-name]/`
**Learning Objective:** [One sentence — what students will be able to do]
**Materials:** [List: demo URL, worksheet if any, other items]
```

### 4.2 Structure

1. **Warmup** (2-3 min)
   - Prediction question before using demo
   - Activates prior knowledge

2. **Guided Exploration** (main time - 5 min)
   - Step-by-step instructions for demo interaction
   - Specific observations to record
   - Clear checkpoints ("Before continuing, verify that...")

3. **Challenge** (5-10 min)
   - Open-ended question requiring demo manipulation
   - Connects to lecture content

4. **Synthesis** (3-5 min)
   - "What pattern did you discover?"
   - Connection to Observable → Model → Inference

### 4.3 Demo Reference Format

When referencing a demo, include:

```yaml
demo: demos/parallax-distance/
demo-features-used:
  - star selection
  - parallax angle display
  - distance calculation
```

---

## 5) Worksheet Activity Format

### 5.1 Header (Required)

```markdown
# [Worksheet Title]

**Type:** Worksheet
**Duration:** [Time category] ([X] minutes)
**Learning Objective:** [One sentence]
**Materials:** [Printed worksheet, calculator, etc.]
**Preparation:** [What instructor should prepare/announce]
```

### 5.2 Structure

1. **Header Section** (on worksheet)
   - Title, date, name field
   - Learning objective (1 sentence)
   - Time estimate

2. **Warmup** (2-3 min)
   - Recall or prediction question
   - Low stakes, builds confidence

3. **Core Problems** (main time)
   - Scaffolded sequence (easier → harder)
   - Clear instructions at each step
   - Space for student work
   - Checkpoints: "Check with your neighbor before continuing"

4. **Synthesis Question** (3-5 min)
   - "How does this connect to [lecture topic]?"
   - Short written response

5. **Extension** (optional)
   - Challenge problem for fast finishers
   - Clearly marked as optional

### 5.3 Scaffolding Principles

- First problem should be solvable by 90% of students
- Middle problems are the target difficulty
- Last problem stretches top students
- Include "hint boxes" for common stuck points

---

## 6) Discussion Activity Format

### 6.1 Header (Required)

```markdown
# [Discussion Title]

**Type:** Discussion (Think-Pair-Share)
**Duration:** Quick ([X] minutes)
**Learning Objective:** [One sentence]
**Materials:** None / [Slide with prompt]
```

### 6.2 Structure

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **Think** | 1-2 min | Individual reflection, write response |
| **Pair** | 2-3 min | Discuss with neighbor, compare answers |
| **Share** | 3-5 min | Instructor calls on pairs, builds class consensus |

### 6.3 Prompt Design

Good discussion prompts:
- Have multiple defensible answers
- Connect to common misconceptions
- Require reasoning, not recall
- Can be answered in 2-3 sentences

**Example:**
> "A student says: 'Light-years measure how long it takes light to travel.' What's right and wrong about this statement?"

---

## 7) Lab Activity Format

### 7.1 Header (Required)

```markdown
# [Lab Title]

**Type:** Lab
**Duration:** Extended ([X] minutes)
**Learning Objective:** [One sentence]
**Materials:** [Full list including data files, software, etc.]
**Preparation:** [Detailed setup instructions]
**Submission:** [What students turn in, due when]
```

### 7.2 Structure

1. **Introduction** (5 min)
   - Context and motivation
   - Learning objective
   - Overview of procedure

2. **Procedure** (main time)
   - Numbered steps with clear actions
   - Data collection points clearly marked
   - Checkpoints with instructor sign-off

3. **Analysis** (10-15 min)
   - Guided questions about collected data
   - Graph or calculation requirements
   - Interpretation prompts

4. **Conclusions** (5 min)
   - Summary question
   - Connection to lecture content
   - "What would you do differently?"

---

## 8) Activity-Lecture Alignment

Plan activities to reinforce lecture topics:

| Module | Lecture Topic | Suggested Demo | Activity Type |
|--------|---------------|----------------|---------------|
| 1 | Intro / Observables | — | Discussion |
| 1 | Math Foundations | — | Worksheet |
| 1 | Distance & Scale | `demos/parallax-distance/` | Demo-driven |
| 1 | Moon & Eclipses | `demos/moon-phases/` | Demo-driven |
| 1 | Seasons | `demos/seasons/` | Demo-driven |
| 2 | EM Spectrum | `demos/em-spectrum/` | Demo-driven |
| 2 | Blackbody Radiation | `demos/blackbody-radiation/` | Demo-driven |
| 2 | Telescopes | `demos/telescope-resolution/` | Demo-driven |
| 3 | Kepler's Laws | `demos/keplers-laws/` | Demo-driven |
| 4 | Angular Size / Distance | `demos/angular-size/` | Demo-driven |

---

## 9) Audit Checklist

When auditing activities, verify:

- [ ] Activity has clear type and time budget
- [ ] Learning objective stated in 1 sentence
- [ ] Demo reference includes path and features used (if demo-driven)
- [ ] Worksheet has warmup → core → synthesis structure
- [ ] Extension provided for variable pacing (worksheets)
- [ ] Activity aligns with lecture topic
- [ ] Instructions are specific enough for a substitute to run
- [ ] Materials list is complete
- [ ] Time estimates are realistic (tested if possible)

---

## 10) Anti-Patterns (FORBIDDEN)

- ❌ Activities without clear learning objectives
- ❌ Demo exploration without guided questions
- ❌ Worksheets that are just problem sets (no scaffolding)
- ❌ Discussions with single "correct" answers
- ❌ Labs without data analysis component
- ❌ Activities that exceed time budget by >10%
- ❌ Instructions that assume prior knowledge of demo

---

## 11) Activity File Organization

```
modules/
  module-01/
    activities/
      activity-01-distance-parallax.qmd    # Demo-driven
      activity-02-unit-conversions.qmd     # Worksheet
      worksheet-01-scientific-notation.pdf # Printable
  module-02/
    activities/
      activity-03-spectrum-exploration.qmd
      ...
```

**Naming convention:** `activity-NN-topic.qmd` for Quarto files, `worksheet-NN-topic.pdf` for printables.

---

## 12) Maintenance

- Update demo registry when new demos are added
- Review time budgets based on actual class performance
- Collect student feedback on activity clarity
- Archive activities that don't meet learning objectives
```

**Step 2: Verify file was created**

Run: `head -50 docs/contracts/astr101-activities-contract.md`
Expected: See contract header and first section

**Step 3: Commit the contract**

```bash
git add docs/contracts/astr101-activities-contract.md
git commit -m "docs(contracts): add activities contract

Defines activity types (demo-driven, worksheet, discussion, lab),
time budgets, demo registry, and format templates for ASTR 101."
```

---

## Task 3: Final Verification and Push

**Step 1: Verify both contracts exist and are well-formed**

Run: `ls -la docs/contracts/astr101-*.md`
Expected: See both new contract files plus existing ones

**Step 2: Render site to check for any issues**

Run: `quarto render docs/contracts/`
Expected: No errors or warnings

**Step 3: Push to remote**

```bash
git push origin main
```

---

## Summary

| File | Purpose |
|------|---------|
| `docs/contracts/astr101-problems-solutions-contract.md` | Problem taxonomy, solution formats, homework recipe |
| `docs/contracts/astr101-activities-contract.md` | Activity types, demo registry, time budgets |

**Total tasks:** 3 (each with multiple steps)

**Estimated implementation time:** 15-20 minutes

---

Plan complete and saved to `docs/plans/2026-01-23-pedagogical-contracts.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
