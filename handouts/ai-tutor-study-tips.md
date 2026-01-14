---
title: ASTR 201 - Using AI Assistance Wisely + How to Study Like a Scientist
# subtitle: "ASTR 201 — XXX "
author: "Instructor: Dr. Anna Rosen"
format:
  pdf:
    toc: false
    number-sections: false
    geometry: margin=0.9in
    fontsize: 10pt
    include-in-header: _includes/latex-footer.tex
  html:
    toc: false
    number-sections: false
---

**Course Website:** [https://astrobytes-edu.github.io/astr201-sp26](https://astrobytes-edu.github.io/astr201-sp26)
*(Links to the AI tools are posted on the course website homepage and syllabus.)*

---

## Why this handout exists

In ASTR 201, your superpower isn’t memorizing astronomy trivia — it’s **inferring physical reality from limited measurements**. That skill requires you to practice:

- explaining your reasoning clearly,
- carrying units,
- stating assumptions,
- and checking whether a model actually matches the observable.

AI tools can support *studying* and *accelerate* your learning, but they can also short-circuit learning if they do the thinking for you.

## The two tools and their roles

### 1) NotebookLM (Course Notebook) — **Grounded Reference Brain**

**Best for:** finding and summarizing *what our course materials say*.
Because it’s grounded in course sources, it’s the safest way to review content and locate explanations.

Use it to:

- summarize a reading or lecture note section,
- extract key equations and define symbols,
- generate study guides, concept maps, flash cards, podcasts, and retrieval questions,
- locate where a concept is explained in the notes.

### 2) ASTR 201 Socratic Tutor (Custom GPT) — **Practice Coach**

**Best for:** turning passive reading into active reasoning.
The Socratic tutor should:

- ask you questions step-by-step,
- push you to state assumptions and units,
- refuse to hand you final answers for graded work,
- help you debug your thinking (not replace it).

---

## Academic Integrity: the simplest rule set

### ✅ Green-light uses (encouraged for studying)

* “Explain this concept in simpler terms.”
* “Quiz me (no hints first).”
* “Give me a checklist for solving this type of problem.”
* “Help me find the relevant section in the notes / summarize it.”
* “Generate *new* practice problems (not my assigned HW).”

### ⚠️ Yellow-light uses (allowed only if you stay honest and careful)

* “Help me interpret feedback and identify my mistake pattern.”
* “Help me check units / limiting cases / reasonableness.”
* “Help me plan what to study and when.”

### 🚫 Red-light uses (not allowed for graded submissions)

* Generating or rewriting solutions/derivations you submit
* Producing “polished” homework explanations you didn’t author
* Paraphrasing AI text into your submission
* Submitting reasoning you can’t reproduce from memory

**Reality check:** If you can’t explain it aloud on a blank page, you don’t own it.

---

## How to use AI without letting it steal your learning

### The “3-pass” method (recommended workflow)

1. **Pass 1 — Attempt (solo):**
   Start the problem or concept on your own. Write what you know, what you don’t, and where you’re stuck.

2. **Pass 2 — Ask for *process*, not answers:**
   Use AI to ask for *questions, checks, and structure*.

3. **Pass 3 — Verify like a scientist:**
   Re-derive or re-solve it *without the AI screen open*. Then do checks (units, limits, sanity).

---

## Prompt templates + examples

### NotebookLM prompts (course-grounded)

Use NotebookLM when you want “what does the course say?”

**Template A: targeted summary**

* “Summarize the section on **[topic]** from the course notes. List the key ideas, key equations, and define every symbol.”

**Template B: equation meaning + intuition**

* “Extract the main equation(s) for **[topic]** and explain in words what changes when each variable increases/decreases.”

**Template C: study guide**

* “Make a 1-page study guide for **[topic]**: core concepts, common misconceptions, and 8 retrieval questions.”

**Template D: find-it-fast**

* “Where in the notes do we discuss **[concept]**? Quote the relevant passage(s) and explain how they connect.”

---

### Socratic Tutor prompts (practice coach)

Use the Socratic tutor when you want to *build* reasoning skill.

**Template S1: Socratic derivation**

* “Help me derive **[result]** Socratically. Ask one question at a time. Don’t give the final expression until I answer.”

**Template S2: unit discipline drill**

* “Give me a unit-checking drill for **[equation/topic]**. I want 5 quick questions that force me to track units.”

**Template S3: misconception hunter**

* “Ask me questions designed to reveal common misconceptions about **[topic]**. Then explain what mistake each misconception would cause.”

**Template S4: exam-style practice (no solutions)**

* “Give me an exam-style problem on **[topic]** and only give hints after I commit to an approach.”

---

## Verification checklist (use this on everything)

Before you trust an answer — yours or AI’s — do these:

1. **Units:** Do units match on both sides?
2. **Limiting cases:** What happens if a variable → 0 or → ∞? Does it make physical sense?
3. **Order-of-magnitude:** Is the scale reasonable?
4. **Assumptions:** What did you assume (blackbody, LTE, circular orbit, etc.)? When would it fail?
5. **Observable connection:** What would you measure, and how would the model map to that measurement?

---

# How to Study & Learn (Evidence-Based)

A lot of studying *feels* productive and produces almost no durable learning. The reliable approaches are boring in the way seatbelts are boring.

## The big three that actually work

### 1) Retrieval practice (self-testing)

Testing yourself improves long-term retention more than re-reading. ([colinallen.dnsalias.org][1])
**Do:** practice questions, blank-page recall, explaining aloud without notes.
**Don’t:** reread the chapter 4 times and call it “studying.” (It’s mostly familiarity.) ([Westsächsische Hochschule Zwickau][2])

**Astronomy version:**

* “Explain what a spectrum tells you about temperature/composition/velocity.”
* “Write the physical meaning of every symbol in an equation from memory.”

### 2) Spaced practice (distributed study)

Spacing your study beats cramming for long-term learning. ([PubMed][3])
**Do:** short sessions across many days.
**Don’t:** one heroic 6-hour session the night before.

### 3) Desirable difficulties (productive struggle)

Learning improves when it feels effortful (if feedback follows). ([bjorklab.psych.ucla.edu][4])
**Do:** attempt before looking, generate an answer, then correct it.
**Don’t:** watch solutions and nod along.

---

## Techniques that help in *quantitative* courses

### Self-explanation (talk through steps)

Explaining “why this step is valid” improves understanding. ([Westsächsische Hochschule Zwickau][2])
**Practice:** narrate your solution: what principle you’re using, what the model assumes, why units work.

### Interleaving (mix problem types)

Mixing topics improves discrimination (“Which tool applies here?”). ([Westsächsische Hochschule Zwickau][2])
**Astronomy version:** mix Doppler + blackbody + gravity problems in one practice set.

### Worked examples → then fading

Start with a solved example, then redo it with fewer hints, then do a new one. (This prevents “I understand when I’m watching.”)

---

## What *doesn’t* work well (common traps)

* **Highlighting and rereading as your main strategy** → low payoff compared to retrieval/spaced practice. ([Westsächsische Hochschule Zwickau][2])
* **Copying solutions** → you learn the *shape* of the solution, not the skill.
* **Passive video/notes binges** → familiarity ≠ mastery.

---

# A weekly study routine that fits ASTR 201

## Before class (10–15 minutes)

* Do **3 retrieval questions** from last class (no notes).
* Write **one question** you genuinely want answered.

## After class (20–30 minutes, same day if possible)

* Write a **5-sentence summary**: what was observed, what model was used, what was inferred.
* Make **5 flash prompts** (not flashcards full of text):
  “Define ___”, “Derive ___”, “What happens if ___ increases?”, “What assumption is hidden in ___?”, “What would you measure to test ___?”

## Homework week (matches your two-stage workflow)

### Stage 1 (Mon solutions): solve to learn

* Attempt problems without help first.
* If stuck: ask the Socratic tutor for *questions/hints/checklists*, not answers.
* Finish with verification checklist (units/limits/sanity).

### Stage 2 (Wed grade memo): learn from your own mistakes

Your grade memo is not “oops.” It’s a lab report on your thinking:

* Where did I make a decision that was wrong?
* What signal could have caught it earlier (units, limit, sign, scaling)?
* What will I do next time (specific habit change)?

---

# Using AI tools responsibly (quick examples)

## Example: studying spectra

**Bad (graded-work behavior):**
“Solve my homework problem about spectral lines and Doppler shifts.”

**Good (study behavior):**

* NotebookLM: “Summarize the course section on Doppler shifts and spectral lines. Give me 10 retrieval questions.”
* Socratic Tutor: “Quiz me on Doppler shift sign conventions. One question at a time. Don’t reveal answers until I commit.”

## Example: blackbody radiation

**Good prompts:**

* “Ask me to predict how the spectrum changes if temperature doubles.”
* “Help me do a dimensional analysis check on the equation.”

---

## Final note: AI can’t replace your physical judgment

In astronomy, *the point* is linking observables to physics under uncertainty. If AI gives you a clean paragraph, it may still be wrong in the ways that matter (units, assumptions, scaling, falsifiability). Your job is to build the habit of checking.

That habit is what survives the exam — and the rest of your scientific life.

If you’d like, I can also generate a **one-page “AI Disclosure Template”** students can paste into their grade memos (even if the default is “no AI used for graded work”), so the expectations are crystal clear and enforcement is painless.

[1]: https://colinallen.dnsalias.org/Readings/2006_Roediger_Karpicke_PsychSci.pdf?utm_source=chatgpt.com "Test-Enhanced Learning - Colin Allen"
[2]: https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf?utm_source=chatgpt.com "Improving Students' Learning With Effective ..."
[3]: https://pubmed.ncbi.nlm.nih.gov/16719566/?utm_source=chatgpt.com "Distributed practice in verbal recall tasks: A review and ..."
[4]: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf?utm_source=chatgpt.com "Creating Desirable Difficulties to Enhance Learning"
