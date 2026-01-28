# LLM Lab Protocol

**For Large Codebases & Scientific Computing.**

*Purpose: prevent hallucinated structure, preserve physical and numerical invariants, and exploit model strengths without letting them improvise reality.*

---

## 0. Prime Directive

*Paste once per session.*

```text
Prime Directive:
Correctness > invariants > reproducibility > clarity > elegance > speed.

You are not allowed to be helpful if it makes you wrong.
If uncertain, stop and surface uncertainty.
Never invent defaults silently.
```

This establishes epistemic hierarchy up front. Models respect hierarchy.

---

## 1. Task Classification

**MANDATORY — before any work begins:**

```text
Classify this task as one or more of:
- Architectural exploration
- Refactor / restructuring
- Algorithmic change
- Numerical / physical correctness
- Performance optimization
- Documentation / explanation

State which category dominates.
```

*Why: models behave very differently depending on whether they think they're "designing" or "fixing".*

---

## 2. Invariants Declaration

**NON-NEGOTIABLE!**

```text
Hard invariants (must not change):

Physical:
- Conservation laws: [mass, energy, momentum, angular momentum, ...]
- Physical constraints: [positivity, bounds, causality, ...]
- Symmetries: [translation, rotation, permutation, ...]

Mathematical:
- Identities: [normalization, orthogonality, ...]
- Constraints: [positive-definite, bounded, ...]

Dimensional:
- Units for all quantities: [SI, CGS, code units — be explicit]
- Dimensional consistency: [all equations must balance]
- Conversion factors: [document if using non-SI]

**If using code units, document explicitly:**

```text
Code unit system:
- [mass]  = M☉ (solar masses)
- [length] = pc (parsecs)
- [time]   = Myr (megayears)

Derived units:
- [velocity] = pc/Myr = 0.978 km/s
- [density]  = M☉/pc³
- [energy]   = M☉ × pc²/Myr²

Constants in code units:

- G = 4.4985 pc³/(M☉ × Myr²)
- c = 306.6 pc/Myr

```

Numerical:

- Precision requirements: [FP32/FP64, required accuracy]
- Stability constraints: [CFL, condition number bounds, ...]
- Tolerance budgets: [what precision is acceptable?]

Computational:

- Determinism: [same inputs → same outputs]
- Reproducibility: [seeds, ordering, platform independence]
- Public APIs / file formats: [what external contracts exist?]

Statistical:

- Assumptions: [independence, distributions, ...]
- Stochastic controls: [PRNG seeds, sampling methods]

Soft goals (may trade off):

- Readability
- Extensibility
- Performance
- Elegance

**Rules:**

- If an invariant is violated, explain *why* and *how to detect the violation*.
- If units are not specified, **stop and ask**.
- If precision requirements are unknown, **stop and determine them**.
- Never assume "standard" units or precision — be explicit.

---

## 3. Model Role Assignment

*Explicitly assign the model a role. Do not skip this.*

### Codex / GPT-based models

```text
Your role: Architectural referee and invariant enforcer.
Primary failure mode to avoid: premature local optimization.
```

### Claude (Code / Opus)

```text
Your role: Adversarial reviewer and refactor analyst.
Primary failure mode to avoid: aesthetic coherence overriding correctness.
```

---

## 4. Phase Separation

**MOST IMPORTANT SECTION — LLMs fail when phases blur. Enforce hard phase boundaries.**

### Phase A — Understanding (no solutions)

```text
Restate the problem in your own words.
List:
- What is known
- What is assumed
- What is unknown

Do not propose solutions yet.
```

### Phase B — Assumption Audit

```text
List all assumptions you are making.
Label each as:
- Explicitly stated
- Reasonably inferred
- Unknown / underspecified

If any are unknown, stop and surface them.
```

*Claude especially needs this phase.*

### Phase C — Exploration (if applicable)

```text
Propose 2–3 distinct approaches.
For each:
- Preserved invariants
- Risks
- Failure modes
- Why it might be wrong
- Numerical considerations (precision, stability)
```

*No code allowed here.*

### Phase C.5 — Sanity Check (before implementation)

```text
Before writing any code, verify:

1. Dimensional analysis:
   - Do all terms have consistent units?
   - Is the result in expected units?

2. Limiting cases:
   - What happens at boundaries (x→0, x→∞, N=1, empty)?
   - Does behavior match physical intuition?

3. Order of magnitude:
   - What scale should the answer be?
   - What would indicate obviously wrong results?

4. Precision feasibility:
   - Can FP64 achieve required precision?
   - Where might precision be lost?

5. Validation strategy:
   - How will we know if this is correct?
   - What test would catch a bug?
```

*This phase prevents implementing the wrong solution correctly.*

### Phase D — Implementation

```text
Now implement the chosen approach.
Explain how invariants are preserved.
Highlight any edge cases.
```

---

## 5. Scientific Computing Safety Block

*Paste often — especially before committing numerical code.*

```text
Scientific Safety Check:

UNITS & DIMENSIONS:
- Are units explicitly declared for all quantities?
- Are all equations dimensionally consistent?
- Are conversion factors documented?

CONSERVATION & PHYSICS:
- Are conservation laws respected?
- Are physical constraints enforced (positivity, bounds)?
- Do results match physical intuition in limits?

NUMERICAL PRECISION:
- What precision is required vs achieved?
- Where might catastrophic cancellation occur?
- Are condition numbers acceptable?

STABILITY:
- Are stability constraints satisfied (CFL, etc.)?
- Is the method stable for this problem?
- What happens at long times / large N?

REPRODUCIBILITY:
- Are all RNG seeds controlled?
- Is execution order deterministic?
- Are results platform-independent?

GRADIENTS (if autodiff):
- Have gradients been verified with finite differences?
- Are there non-differentiable operations?
- Could gradients overflow/underflow?

If any answer is "unknown", STOP and investigate.
```

This suppresses fantasy physics and catches silent numerical failures.

---

## 6. Anti-Vibes Clause

*Claude kill switch — use when responses sound too confident:*

```text
Rewrite the above assuming:
- The audience is hostile and expert
- The code will be stress-tested at 100x scale
- Reviewers will look for silent assumptions
- A subtle bug exists that produces plausible output
- Someone will try to run this on different hardware
- The paper will be scrutinized for reproducibility
```

**Additional epistemic checks:**

```text
For this solution:
- What would make it silently wrong?
- How would we detect if it's wrong?
- What's the weakest assumption?
- Where is precision most likely to be lost?
```

This forces epistemic humility.

---

## 7. Large Codebase Constraint

*For multi-file repos:*

```text
Before changing anything:
- Identify all affected files/modules
- State how changes propagate
- Confirm no invariants shift across boundaries

If unsure, stop.
```

*Codex excels here when explicitly asked.*

---

## 8. Final Verification Step

**Never skip.**

```text
Summarize:
- What changed
- What did NOT change
- How to detect regressions
- What tests would fail if this is wrong
```

If the model cannot answer this, the work is not done.

---

## Recommended Division of Labor

In NovaGraph or multi-model workflows, explicitly chain roles:

| Step | Model | Purpose |
|------|-------|---------|
| 1 | Codex/GPT | Architectural exploration + invariant reasoning |
| 2 | Claude | Adversarial review + refactor critique |

**Treat disagreement as signal, not noise.**

---

## Mental Model

*Why this works:*

| Model | Respects | Give it | Avoid |
|-------|----------|---------|-------|
| Codex | Constraints | Explicit search space | Vague goals |
| Claude | Narratives | Epistemic friction | Unchecked confidence |

**You are running a lab, not a chat.**

---

## Deployment Options

- Paste as a **NovaGraph project template**
- Keep as a **Codex Web session header**
- Reuse as a **pre-commit AI checklist**
- Include in **Claude Project instructions**

This protocol scales from a single function to a multiphysics simulation codebase — and, crucially, it keeps the models from lying to you *politely*.

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  PRIME DIRECTIVE                                        │
│  Correctness > invariants > reproducibility > clarity   │
├─────────────────────────────────────────────────────────┤
│  PHASES (strict order)                                  │
│  A. Understanding → B. Assumptions → C. Explore →       │
│  C.5 Sanity Check → D. Implementation                   │
├─────────────────────────────────────────────────────────┤
│  CHECKPOINTS                                            │
│  □ Task classified                                      │
│  □ Invariants declared (with units + precision)         │
│  □ Role assigned                                        │
│  □ Phases separated (no premature implementation)       │
│  □ Sanity check passed (dimensions, limits, scale)      │
│  □ Scientific safety checked                            │
│  □ Gradients verified (if autodiff)                     │
│  □ Final verification complete                          │
├─────────────────────────────────────────────────────────┤
│  RED FLAGS (stop immediately)                           │
│  ✗ Units not specified                                  │
│  ✗ Precision requirements unknown                       │
│  ✗ No validation strategy                               │
│  ✗ "It should work" without evidence                    │
│  ✗ Skipping phases                                      │
└─────────────────────────────────────────────────────────┘
```
