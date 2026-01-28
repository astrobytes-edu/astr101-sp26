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
