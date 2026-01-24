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
