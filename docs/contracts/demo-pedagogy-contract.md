# Demo Pedagogy Contract

*Design principles for maximizing learning impact from interactive astronomy demonstrations.*

Version: v1.1 | Status: Active | Owner: Dr. Anna Rosen

---

## 1. Core Philosophy

### The Observable → Model → Inference Pattern

Every demo must embody this sequence:

1. **Observable:** What can students *see* or *measure*?
2. **Model:** What physical mechanism explains the observation?
3. **Inference:** What can we *conclude* about things we can't directly see?

> A demo that shows "cool physics" without connecting to how we *know* that physics is entertainment, not education.

### Recognition, Not Retention

The goal is not memorization. Students should:

- Recognize patterns when they see them again
- Connect new observations to prior mental models
- Update incorrect intuitions through direct confrontation

### Demos Are Not Self-Teaching

A demo without structured activities is a toy. Impact requires:

- Instructor scaffolding (live-teach scripts)
- Student prediction before observation
- Explicit misconception confrontation
- Assessment that references the demo

---

## 2. Design Requirements

### 2.1 Physics Correctness (Non-Negotiable)

| Requirement | Rationale |
|-------------|-----------|
| **Testable model** | Physics must be verified against known systems |
| **Documented invariants** | Conservation laws, bounds, unit systems explicit |
| **Separated concerns** | Model (testable) separate from UI (visual) |
| **Real astronomical systems** | Presets use actual data, not made-up numbers |

**Anti-pattern:** "It looks right" without verification. Students develop intuitions from demos; wrong physics teaches wrong intuitions.

### 2.2 Cognitive Load Management

| Requirement | Rationale |
|-------------|-----------|
| **Curated presets** | Prevent "lost in parameter space" |
| **Progressive disclosure** | Hide advanced features until needed |
| **Sensible defaults** | Demo works on first load without adjustment |
| **Clear visual hierarchy** | Primary physics > secondary readouts > controls |

**Anti-pattern:** Exposing all parameters simultaneously. Overwhelmed students don't learn; they click randomly.

### 2.3 Misconception Confrontation

| Requirement | Rationale |
|-------------|-----------|
| **Make wrong intuitions visible** | Students must *see* their model fail |
| **Provide cognitive conflict** | Demo should surprise students holding misconceptions |
| **Don't just correct—explain** | Insight box connects observation to mechanism |

**Anti-pattern:** Demo only shows correct physics without activating prior beliefs. Students nod along without updating their mental models.

### 2.4 Prediction Before Observation

| Requirement | Rationale |
|-------------|-----------|
| **Pause points** | Structure that requires prediction before reveal |
| **Clicker integration** | Questions students answer before demo shows answer |
| **Discussion prompts** | "What do you expect to happen when...?" |

**Anti-pattern:** Free exploration without guided prediction. Students observe without engaging.

### 2.5 Layered Complexity Architecture

Each demo serves multiple course levels through progressive disclosure — not separate "intro" and "advanced" versions.

| Layer | Audience | What's Visible | Design Goal |
|-------|----------|----------------|-------------|
| **Conceptual** | ASTR 101/109 | Animation, presets, key observables | Build correct intuitions visually |
| **Quantitative** | ASTR 201, PHYS 195-197 | Equations, derivations, parameter exploration | Connect intuitions to mathematics |
| **Advanced** | Upper-division | Full physics, edge cases, research connections | Extend to authentic science |

**Requirements:**

| Requirement | Rationale |
|-------------|-----------|
| **Same simulation, toggled depth** | Students encounter familiar tools across courses |
| **Physics always correct** | No "watered-down" versions that break at edges |
| **Layer toggles in UI** | Instructors control complexity, not separate URLs |
| **Learning objectives per layer** | Clear goals for each audience |

**Implementation pattern:**

- Default to conceptual layer (works for ASTR 101 out of the box)
- "Show equations" toggle reveals quantitative layer
- "Advanced mode" exposes edge cases, research data, full parameter ranges
- URL parameters allow instructors to link directly to specific layer

**Anti-pattern:** Creating separate "101 version" and "201 version" of the same demo. This fragments the ecosystem and prevents students from building familiarity across courses.

---

## 3. Integration Requirements

### 3.1 Instructor Resources (Mandatory)

Every demo must have:

| Resource | Purpose |
|----------|---------|
| `index.qmd` | Overview, learning goals, live-teach script |
| `model.qmd` | Physics deep dive, assumptions, limitations |
| `activities.qmd` | MW quick, MW short, Friday lab protocols |
| `assessment.qmd` | Clickers, short-answer, exit tickets |
| `backlog.qmd` | Future enhancements, prioritized |

**Rationale:** A demo without instructor resources will be underutilized. Busy instructors won't figure out how to use it effectively.

### 3.2 Activity Types

| Type | Duration | Purpose | When |
|------|----------|---------|------|
| **MW Quick** | 3-5 min | Activate prior knowledge, surface misconceptions | Lecture warm-up |
| **MW Short** | 8-12 min | Guided exploration, pattern discovery | Mid-lecture |
| **Friday Lab** | 20-30+ min | Deep investigation, data collection, claim-evidence | Lab section |
| **Station** | 6-8 min | Self-guided with artifact production | Rotation lab |

### 3.3 Assessment Alignment

Every clicker question should:

- Reference a specific demo setup ("Use the Sun+Jupiter preset...")
- Include distractors tied to known misconceptions
- Have a follow-up explanation connecting to the demo

---

## 4. Visual Design Principles

### 4.1 Information Hierarchy

```
┌─────────────────────────────────────┐
│  PRIMARY: The physics visualization │  ← 60% of visual attention
├─────────────────────────────────────┤
│  SECONDARY: Key readouts            │  ← 25% of visual attention
├─────────────────────────────────────┤
│  TERTIARY: Controls, presets        │  ← 15% of visual attention
└─────────────────────────────────────┘
```

### 4.2 Color Semantics

| Color | Meaning | Example |
|-------|---------|---------|
| Body 1 color | Primary/more massive object | Blue/white star |
| Body 2 color | Secondary/less massive object | Red/orange planet |
| Muted gray | Reference/infrastructure | Barycenter, grid |
| Highlight yellow/orange | Attention needed | Warnings, inside-star |
| Green | Confirmation/normal state | Outside-star, valid input |

### 4.3 Overlay Philosophy

- **Default off:** Only essential elements visible initially
- **Toggle on demand:** Students add complexity as needed
- **Remember state:** Persist overlay choices across sessions

---

## 5. Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | All interactions accessible without mouse |
| **Screen reader support** | ARIA labels, live regions for updates |
| **Color-blind safe** | Don't rely on color alone for meaning |
| **Reduced motion option** | Pause/step for motion-sensitive users |

---

## 6. The Complete Demo Story

A maximally effective demo tells a complete story:

### Example: Binary Orbits → Exoplanet Detection

| Stage | Demo Feature | Learning Goal |
|-------|--------------|---------------|
| 1. Activate | "Does the Sun move?" | Surface stationary-star misconception |
| 2. Confront | Show Sun wobble in Sun+Jupiter | Break misconception |
| 3. Explain | Barycenter concept, inverse mass ratio | Build correct model |
| 4. Extend | 51 Peg b preset, barycenter inside star | Connect to exoplanets |
| 5. Bridge | Doppler RV curve (future) | How we *measure* the wobble |
| 6. Apply | Real RV data from exoplanet archives | Transfer to authentic science |

**Incomplete story:** Stages 1-4 only. Students know *why* stars wobble but not *how* we detect it.

**Complete story:** All 6 stages. Students can explain the full chain from physics to detection to data.

---

## 7. Common Failure Modes

### 7.1 The "Cool Demo" Trap

**Symptom:** Students say "that was cool" but can't explain the physics.

**Cause:** Demo prioritizes visual appeal over conceptual clarity.

**Fix:** Every visual element must connect to a learning goal. Ask: "What misconception does this confront? What prediction does this enable?"

### 7.2 The "Parameter Playground" Trap

**Symptom:** Students click randomly without understanding what they're changing.

**Cause:** Too many exposed controls without guided exploration.

**Fix:** Curated presets, progressive disclosure, structured activities.

### 7.3 The "Passive Observation" Trap

**Symptom:** Students watch without predicting or engaging.

**Cause:** No prediction checkpoints, no required interaction.

**Fix:** Prediction-before-observation structure, pause points, clicker integration.

### 7.4 The "Black Box" Trap

**Symptom:** Students can use the demo but don't understand the underlying model.

**Cause:** Physics hidden, no explicit model discussion.

**Fix:** Model documentation, "what is/isn't modeled" disclosure, sanity checks.

### 7.5 The "Orphan Demo" Trap

**Symptom:** Demo exists but no one uses it effectively.

**Cause:** No instructor resources, no integration with course activities.

**Fix:** Mandatory instructor documentation, activity protocols, assessment bank.

---

## 8. Quality Checklist

Before deploying a demo, verify:

### Physics
- [ ] Model has unit tests against known systems
- [ ] Invariants documented in code
- [ ] Presets use real astronomical data
- [ ] Assumptions and limitations documented

### Pedagogy
- [ ] Targets specific misconception(s)
- [ ] Enables prediction-before-observation
- [ ] Connects to Observable → Model → Inference
- [ ] Has clear learning objectives by course level

### Layered Complexity

- [ ] Conceptual layer works standalone for ASTR 101/109
- [ ] Quantitative layer adds equations without breaking intuitions
- [ ] Layer toggles are clearly labeled in UI
- [ ] URL parameters support direct linking to specific layers
- [ ] No separate "intro" and "advanced" versions exist

### Integration
- [ ] Instructor index.qmd exists
- [ ] Model deep-dive qmd exists
- [ ] Activity protocols exist (MW quick, MW short, Friday lab)
- [ ] Assessment bank exists (clickers, short-answer, exit tickets)
- [ ] README documents all features

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Color not sole indicator of meaning
- [ ] Pause/step available for animations

---

## 9. Metrics for Success

### Immediate (Observable in Class)

- Students make predictions before demo reveals answer
- Students express surprise when misconceptions are confronted
- Students reference demo in subsequent discussions

### Short-term (Assessable)

- Clicker questions show improved post-demo understanding
- Exam questions referencing demo concepts show mastery
- Lab write-ups connect observations to physical mechanisms

### Long-term (Aspirational)

- Students transfer demo intuitions to new contexts
- Students seek out real data to extend demo explorations
- Students explain concepts to peers using demo mental models

---

## 10. Maintenance

- Update misconceptions list as new ones emerge from student questions
- Add activity protocols that work well in practice
- Revise assessment items based on student performance
- Track which presets are most/least used and why

---

*This contract complements the ASTR 101 Course Playbook and Software Engineering Playbook. It defines what makes a demo pedagogically effective, not just technically correct.*
