# Midterm 2 Bank Audit — 2026-04-18

**Audited file:** `exams/_prep/midterm-2-bank-draft.md` (v0.1)
**Scope:** All 55 items (51 lecture items L14–L21 + 4 synthesis items)
**Contract:** `exams/_prep/midterm-1-spec.md` §5.4 (distractor pattern) + §7 (stem/answer rules) + §11 (anti-patterns)
**Truth sources:** `modules/module-02/readings/lecture-1[4-9]-*.qmd`, `lecture-2[0-1]-*.qmd`
**Output:** Findings only. **No bank changes applied yet.** Instructor review required before implementing any edits.

---

## 1. Audit Dimensions

Each item is reviewed against three dimensions:

1. **Factual correctness** — Do the claims in the stem, correct answer, and distractors match what the reading actually teaches? Numbers, mechanisms, definitions must be verifiable in the reading.
2. **Pedagogical alignment** — Does the cognitive level (Recognition / Application / Connection) match the question's actual demand? Is the O→M→I tag honest? Is the difficulty tag calibrated?
3. **Distractor diagnosticity** — Per §5.4: do wrong answers map to *identifiable* errors (a specific misconception, a specific scaling mistake, an inverted direction)? Or are they arbitrary/absurd?

**Verdict scale:**

- ✅ **Clean** — no changes needed
- ⚠️ **Minor** — small wording fix or distractor tweak; physics is sound
- 🟠 **Moderate** — meaningful refactor (distractor rewrite, stem clarification, tag change)
- 🔴 **Major** — factually wrong, or question doesn't work as written

---

## 2. Summary Table

*(Populated as each lecture is audited.)*

| Item | Verdict | Primary issue (if any) |
|---|:---:|---|
| Q14-01 | ✅ | — |
| Q14-02 | ⚠️ | Distractor D mixes T threshold with exothermicity |
| Q14-03 | ✅ | — |
| Q14-04 | ✅ | — |
| Q14-05 | ⚠️ | Difficulty tagged M but is Recognition-E |
| Q14-06 | 🔴 | Temperature ~4000 K doesn't match reading's 3,700 K |
| Q15-01 | ⚠️ | Distractors B (2 pc) and D (20 pc) don't map to named student errors |
| Q15-02 | ✅ | — |
| Q15-03 | ⚠️ | Distractor B (6) is non-diagnostic; replace with "1/9" for wrong-direction slot |
| Q15-04 | ✅ | — |
| Q15-05 | ✅ | — |
| Q15-06 | 🔴 | "a few thousand parsecs" wrong for ground-based; reading says ~0.01″ → ~100 pc |
| Q16-01 | ✅ | — |
| Q16-02 | ✅ | — |
| Q16-03 | ✅ | — |
| Q16-04 | ✅ | — |
| Q16-05 | ✅ | — |
| Q16-06 | ✅ | — |
| Q16-07 | ⚠️ | Distractors don't test the Wien ratio; either retag conceptual or rewrite A/B for ratio errors |
| Q16-08 | ✅ | — |
| Q17-01 | ✅ | Slightly weak distractors for $P=a=1$ test case; Q17-02 carries diagnostic weight |
| Q17-02 | ✅ | — |
| Q17-03 | ✅ | — |
| Q17-04 | ✅ | — |
| Q17-05 | ✅ | — |
| Q17-06 | ✅ | — |
| Q18-01 | ✅ | — |
| Q18-02 | ✅ | Consider retag difficulty E (pure terminology recall) |
| Q18-03 | ✅ | Model 2×2 distractor grid |
| Q18-04 | ✅ | Distractor D slightly weak; optional replacement |
| Q18-05 | ✅ | Consider retag difficulty M |
| Q19-01 | ⚠️ | Distractors A and C borderline absurd; optional tightening |
| Q19-02 | ✅ | Flag: near-duplicate of Q17-04 — pick one at assembly |
| Q19-03 | ✅ | — |
| Q19-04 | ✅ | — |
| Q19-05 | ✅ | — |
| Q19-06 | ✅ | Strong Connection item — high assembly priority |
| Q20-01 | ✅ | — |
| Q20-02 | ✅ | — |
| Q20-03 | ✅ | Distractor D (1.4 M☉ ≈ typical NS mass) is intentionally seductive — strong design |
| Q20-04 | ✅ | — |
| Q20-05 | ✅ | — |
| Q20-06 | ✅ | — |
| Q20-07 | ⚠️ | Three distractors absurd per §11; rewrite proposed wiring M17 carry-over into C |
| Q20-08 | ✅ | — |
| Q21-01 | ✅ | — |
| Q21-02 | ✅ | Distractor C (Hawking radiation) borderline; optional replacement suggested |
| Q21-03 | ✅ | Model linear-scaling ratio item |
| Q21-04 | ✅ | Canonical M20 item — strong A/D pair |
| Q21-05 | ✅ | — |
| Q21-06 | ⚠️ | Distractor C ("proved BHs don't exist") absurd per §11; swap to BBH-first-detection confusion |
| S-01 | ✅ | Canonical synthesis — assembly priority |
| S-02 | ✅ | Clean Wien-ratio item — pairs with Q16-07 decision |
| S-03 | ✅ | Optional depth retag Connection → Application |
| S-04 | ✅ | — |

---

## 3. Per-Item Findings

### L14 — Our Star: The Sun

**Reading reference:** `lecture-14-the-sun.qmd`

**Q14-01** — ✅ **Clean.**
- Fact: fusion (4 H → He via PP chain) + $E = mc^2$ — matches reading §Fusion (L111–168, misconception §484–486).
- Pedagogy: Recognition / E / no-OMI / M12 all appropriate.
- Distractors: A targets M12 (chemical burning), C is the Kelvin-Helmholtz naive model, D is a confused "energy from surroundings" model. All diagnostic.
- No changes.

**Q14-02** — ⚠️ **Minor.**
- Fact: Coulomb barrier requires high T — matches reading L214 ("The obstacle is the **Coulomb barrier**").
- Distractor D *"The fusion reaction is exothermic only above 10 million degrees"* is imprecise — the reading cites 15 M K (L83, L216), not 10. More importantly, fusion of H up through Fe is exothermic at *any* T; the T threshold is about *rate*, not about being exothermic. This distractor conflates two ideas.
- Pedagogy: Application is borderline — this is really Recognition of a named concept. Could be M-E difficulty, Recognition.
- **Proposed fix:** Rewrite D as *"The fusion reaction only releases energy at temperatures above 10 million K"* — still wrong, but at least the wrongness is clean (same mechanism confusion, not compounded with a wrong number).
- Alternative: delete D, replace with *"Cool hydrogen cannot store enough kinetic energy to produce visible photons"* — wrong for a different reason (confuses blackbody radiation with fusion).

**Q14-03** — ✅ **Clean.**
- Fact: neutrino oscillation matches reading §429–439.
- Pedagogy: Connection / H / yes-OMI / — all honest. The O→M→I chain is real: observable = measured neutrino flux; model = PP chain; inference = oscillations from fewer-than-expected electron neutrinos.
- Distractors: all three wrong answers are documented historical hypotheses (wrong-model, decay, bad-luminosity).
- No changes.

**Q14-04** — ✅ **Clean.**
- Fact: Sun → red giant → PN → WD — matches reading §Misconception 4 (L498).
- Pedagogy: Recognition / E / M19 appropriate.
- Distractors A/B/D are precisely the M19 misconception menu (SN, BH, NS).
- No changes.

**Q14-05** — ⚠️ **Minor (tag calibration only).**
- Fact: convective zone — matches reading L262–274.
- Distractors: Core, Radiative zone, Corona — all plausible wrong answers a confused student might pick.
- **Issue:** Difficulty tagged M but the question is pure recall of a named layer. Should be **E**, not M. (Spec §11 forbids pure recall, but this is recall of a *mechanism-to-layer mapping*, which is defensible as Recognition.)
- **Proposed fix:** retag difficulty E.

**Q14-06** — 🔴 **Factual mismatch on temperature.**
- **Issue:** Question states sunspot temperature as "~4000 K vs. ~5800 K" but reading L336 states *"about 3,700 K instead of about 5,800 K"* (also reiterated L492–494). The bank's 4000 K does not match the reading.
- **Proposed fix:** Change "~4000 K" → "~3,700 K" in the correct answer to match reading exactly.
- Distractor C (*"Shadows cast by small planets transiting the Sun"*) is borderline absurd per §11. It's not a documented misconception the reading names. Could be replaced with something diagnostic like *"Regions of the photosphere that are venting gas outward and therefore emit less upward"* — wrong, but closer to a plausible student mental model.
- Pedagogy tag: yes-OMI is defensible (observable = dark spot → model = cool spot + magnetic field → inference = magnetic suppression of convection). Keep.
- **Proposed change summary:** (1) correct temperature to 3,700 K; (2) consider replacing distractor C.

### L15 — Measuring the Stars

**Reading reference:** `lecture-15-measuring-the-stars.qmd`

**Q15-01** — ⚠️ **Minor (distractor set could be tighter).**
- Fact: $d = 1/p = 1/0.2 = 5$ pc — matches reading L138–142 and worked example L164–178 (Proxima: $p = 0.768'' \to d = 1.30$ pc).
- Pedagogy: minor-calc / E / Application / yes-OMI is defensible. The OMI chain is genuine here (O = parallax angle, M = geometry $d=1/p$, I = distance in pc).
- Distractors:
  - A (0.2 pc) is clean: classic "forgot to invert" — student quotes $p$ as the distance. Diagnostic.
  - B (2 pc) does not map to a clean error. Not $p \cdot 10$, not $\sqrt{5}$, not any natural mistake.
  - D (20 pc) is similarly unanchored (it would correspond to $p=0.05''$, but there's no scaffolding to nudge a student there).
- Per §5.4 the ideal four-choice distractor set for a ratio/minor-calc item is *correct / linear error / wrong direction / plausible alternative*. Only A satisfies the pattern cleanly.
- **Proposed fix (optional):** replace B with *"0.4 pc"* (student keeps $p$ as distance and then doubles it, or confuses arcsec vs. half-arcsec) — still arbitrary. Stronger fix: replace B with *"0.5 pc"* (wrong-direction: student computes $p/d$ or similar ratio inversion) and D with *"10 pc"* ($d = 1/(p/2)$, where student uses half-parallax meaning half-angle already applied). These at least reflect named student errors.
- Keep verdict as minor — the correct answer is correct and the question still works; distractor tightening is a nicety.

**Q15-02** — ✅ **Clean.**
- Fact: "Position" and "apparent angular shift of the star against … distant background stars" is listed explicitly as the directly-observed quantity (reading L79–88, L129–135: *"For Lecture 15, two observables matter most: Position … Apparent brightness"* and *"Extract the tiny angular shift relative to very distant background stars"*).
- Pedagogy: Recognition / E / yes-OMI / M1 — all honest. M1 (inferred vs. directly observed) is the whole point of this question.
- Distractors:
  - A. distance in pc — *the* M1 target: confuses inferred quantity with observed. Excellent diagnostic.
  - C. intrinsic luminosity — swaps which hidden quantity comes out. Diagnostic.
  - D. Earth's orbital speed — enters the derivation-of-the-parsec historically but isn't measured *during* parallax. Slightly cleverer distractor for a student who has read carefully. Acceptable.
- No changes.

**Q15-03** — ⚠️ **Minor (distractor B is non-diagnostic).**
- Fact: inverse-square law $b \propto 1/d^2$; $d \to 3d$ gives $b \to b/9$. Matches reading L255–285 (*"Double the distance and the same energy is spread over four times the area, so the apparent brightness falls by a factor of four"*).
- Pedagogy: ratio / E / Application / no-OMI / M2 — all honest.
- Distractors:
  - A (3) = linear error (student forgets the square). Diagnostic.
  - C (9) is correct.
  - D (27) = cubic error (student squares *and* cubes, or confuses with volume scaling). Reasonable.
  - B (6) does not map to any clean error — it's not linear, not squared, not cubed, not $2 \cdot 3$ for a named reason.
- **Proposed fix:** replace B with *"1/3"* or *"1/9"* — the *wrong-direction* distractor (student gets magnitude right but sign backwards, thinking farther = brighter per some linear reasoning). This aligns with §5.4's "wrong direction" slot.
- Alternative tighter set: A=3, B=1/9, C=9, D=27 (linear / wrong-direction / correct / cubic-overcorrection) — fully matches §5.4 pattern.

**Q15-04** — ✅ **Clean. Strong item.**
- Fact: $d_A = 1/0.1 = 10$ pc, $d_B = 1/0.01 = 100$ pc; equal flux with $F \propto L/d^2 \Rightarrow L_B/L_A = (d_B/d_A)^2 = 100$. Matches reading L241–253 and worked example L288–307 almost verbatim (the worked example is *exactly* this construction: equal-brightness with different $L$ and $d$).
- Pedagogy: ratio / H / Connection / yes-OMI / M17 — all honest. This is the canonical M17 item (apparent brightness ≠ luminosity) and the OMI chain is explicit.
- Distractors:
  - A (same $L$) — the direct M17 misconception. Diagnostic.
  - B (Star A 100× more luminous) — direction inverted. Classic §5.4 wrong-direction distractor.
  - D (same $T$) — dimension error (temperature isn't in the flux–luminosity–distance system). Acceptable as the "plausible-but-wrong-variable" distractor.
- No changes. This is one of the strongest items in the bank.

**Q15-05** — ✅ **Clean.**
- Fact: same $L$, $d_A/d_B = 10 \Rightarrow b_B/b_A = 100$. Matches reading L255–285 and the Checkpoint callout at L558–571.
- Pedagogy: ratio / M / Application / no-OMI — all honest.
- Distractors:
  - A (10×) = linear error, matches §5.4 pattern.
  - C (same) = "distance doesn't matter" misconception (M17-adjacent).
  - D (1/100) = wrong-direction error.
  - All three are diagnostic and map to named errors.
- No changes.

**Q15-06** — 🔴 **Factual mismatch: "a few thousand parsecs" is wrong for ground-based.**
- **Issue.** The stem opens *"Ground-based parallax measurements are limited to stars within a few thousand parsecs."* Reading L229 states ground-based limit is **"about 0.01 arcseconds,"** which corresponds to $d = 1/0.01 = 100$ pc — **not a few thousand parsecs**. Reading further clarifies (L503–509) that Hipparcos ($\sim 0.001''$) reaches $\sim 1{,}000$ pc $\approx$ "a few thousand pc" only for bright targets, and Gaia ($\sim 10\,\mu\text{as}$) reaches $\sim 100{,}000$ pc. So "a few thousand parsecs" belongs to Hipparcos, not ground-based.
- The correct answer (C) is internally consistent with the (wrong) stem — it says *"beyond a few kpc it falls below achievable angular precision"* — but both the stem premise and the answer's cutoff are factually off by $\sim 10$–$30 \times$ for ground-based.
- Pedagogy: the *concept* being tested (parallax precision as the fundamental limit) is the right concept; only the number is wrong. This is a fixable item.
- **Proposed fix (recommended).** Replace "a few thousand parsecs" → "about 100 parsecs" in the stem; replace "beyond a few kpc" → "beyond $\sim 100$ pc" in answer C. Matches reading L229 exactly.
- **Alternative fix.** Reframe the stem around Gaia rather than ground-based: *"Even Gaia's parallax measurements are limited to stars within about 100 kpc. The fundamental reason is that…"* — keeps the pedagogical target, aligns with reading L509, and makes the distance ceiling feel less arbitrary.
- Distractors A, B, D are all diagnostic (A = M23-adjacent "Milky Way boundary" confusion; B = misreads parallax as requiring proper motion; D = confuses parallax with magnitude extinction). Keep.
- **Verdict:** Major in the sense that a factual claim in the stem is wrong; but the fix is cosmetic (two number changes).

### L16 — The H-R Diagram

**Reading reference:** `lecture-16-hr-diagram.qmd`

**Q16-01** — ✅ **Clean.**
- Fact: reading L192–197 (axes) and L210–220 (reversed axis callout) state explicitly that the x-axis runs hot-left, cool-right; so left → right = decreasing $T$.
- Pedagogy: Recognition / E / no-OMI / M16 — all honest. This is the core M16 target.
- Distractors: A directly realises M16 (wrong direction); C swaps $x$ with $y$; D swaps temperature with mass. All three are named student errors.
- No changes.

**Q16-02** — ✅ **Clean.**
- Fact: reading Table L158–166: O = >30,000 K (hottest); G/K/M progressively cooler. Correct answer A.
- Pedagogy: Recognition / E / no-OMI — honest. Pure spectral-type ordering recall, which is explicitly on the lecture's learning-objective list (L15).
- Distractors B/C/D are progressively cooler types; a student with partial mnemonic recall ("OBAFGKM") could plausibly pick G (Sun-like prior), K, or M.
- No changes.

**Q16-03** — ✅ **Clean.**
- Fact: $L \propto R^2 T^4$ at fixed $R \Rightarrow L \propto T^4$; $2^4 = 16$. Matches reading L328–344.
- Pedagogy: ratio / M / Application / no-OMI — honest.
- Distractors: A=2 (linear in $T$), B=4 (square — $T^2$), C=8 (cube — $T^3$), D=16 (correct). Clean progressive-power structure; each wrong answer maps to an identifiable under-power error.
- No changes. Model ratio distractor set.

**Q16-04** — ✅ **Clean.**
- Fact: $L \propto R^2$ at fixed $T$; $100^2 = 10{,}000$. Matches reading L328–344 and Betelgeuse worked example L398–434.
- Pedagogy: ratio / M / Application / no-OMI / M14 — honest. M14 ("red/cool means dim") is exactly targeted: same $T$, large $R$ still gives huge $L$.
- Distractors: A=100 (linear — forgot square), B=1000 (= $100^{1.5}$, partial squaring), D=100,000 (overshoot). A is the cleanest diagnostic; B and D are softer but plausible "I know it's more than linear but not sure by how much" errors.
- No changes.

**Q16-05** — ✅ **Clean.**
- Fact: red giant is cool but huge; $L = 4\pi R^2 \sigma T^4$ is large because $R^2$ dominates. Matches reading L280–308 and the explicit summary L436–438, L484–488.
- Pedagogy: Connection / M / yes-OMI / M14 — honest. OMI chain: O = observed low $T$ + high $L$; M = Stefan-Boltzmann; I = large $R$.
- Distractors: A (density) — physical-sounding but wrong mechanism; C (IR dominance) — a measurement-artifact misconception; D (external energy) — echoes M12-style "where does the energy come from" confusion. All three map to named failure modes.
- No changes.

**Q16-06** — ✅ **Clean.**
- Fact: main sequence is a mass-ordered snapshot, not an evolutionary track. Matches reading L282–292 (*"As long as a star burns hydrogen, it stays on the main sequence. The more massive the star, the hotter its core…"*) and the explicit Misconception-1 callout L574–576 (*"The main sequence is a snapshot of stars at different masses, not an evolutionary track"*).
- Pedagogy: Connection / H / no-OMI / M15 — honest. This is the canonical M15 item.
- Distractors: A is M15 directly; C is a related misconception (MS as evolutionary sequence in order); D is the "MS = young-stars-only" confusion. All diagnostic.
- No changes.

**Q16-07** — ⚠️ **Minor (distractor set doesn't test the Wien ratio).**
- Fact: Wien's law $\lambda T = \text{const} \Rightarrow T \propto 1/\lambda$; $\lambda_Y/\lambda_X = 580/290 = 2 \Rightarrow T_X = 2\,T_Y$. Matches reading L684–690.
- Pedagogy: The tag says `ratio / M / Application / yes-OMI / M9`. But the *distractors* don't actually test the ratio: A (luminosity only), B (radius only), D (distance) all contest *which variable* matters, not *what ratio* the student computed. The answer C packages "it's a temperature difference" + "factor of 2" together — a student can pick C by ruling out A/B/D without ever doing Wien arithmetic. So the question is really a Connection-level "which variable does Wien give you?" item, not a ratio item.
- **Proposed fix (option 1, mild):** leave the question as-is but retag `ratio → conceptual` and `M9 → M9` still applies (Wien direction).
- **Proposed fix (option 2, stronger — make the ratio actually tested):** keep the stem, rewrite distractors to probe Wien-ratio errors:
  - A. Surface temperature — Star X is twice as *cool* as Star Y (wrong direction: $T \propto \lambda$ misread)
  - B. Surface temperature — Star X is 16× hotter than Star Y (Wien confused with Stefan-Boltzmann: $T^4$ vs $T$)
  - C. Surface temperature — Star X is twice as hot as Star Y **[★]**
  - D. Radius only (distance/location swap plausible in kept form)
- Recommend option 2: this is a Tier-1 lecture and the exam's ratio count benefits from a cleanly-tested Wien-ratio item.

**Q16-08** — ✅ **Clean. Strong item.**
- Fact: WD lower-left means hot + dim; at fixed $T$, $L \propto R^2 \Rightarrow$ lower $L$ implies smaller $R$. Matches reading L302–308 (*"a white dwarf is so hot… but because it's only the size of Earth, its total luminosity is tiny"*) and the Stefan-Boltzmann closing logic L484–488.
- Pedagogy: Connection / H / no-OMI — honest. The question explicitly requires applying Stefan-Boltzmann at fixed $T$, which is pedagogically non-trivial.
- Distractors: A (larger + larger — inverts both), C (larger + smaller — violates Stefan-Boltzmann at fixed $T$: impossible), D (same $R$ + smaller $L$ — also violates Stefan-Boltzmann at fixed $T$). Distractors C and D are particularly diagnostic: a student who picks either is revealing non-application of the $L$-$R$-$T$ constraint.
- No changes. This is a high-value Tier-1 connection item.

### L17 — Binary Stars & Stellar Masses

**Reading reference:** `lecture-17-binary-stars.qmd`

**Q17-01** — ✅ **Clean.**
- Fact: $M_1 + M_2 = a^3/P^2 = 1^3/1^2 = 1\,M_\odot$. Matches reading L154–164 (solar-unit form) verbatim.
- Pedagogy: ratio / E / Application / yes-OMI — honest. OMI chain: O = period + separation; M = Newton's Kepler III; I = total mass.
- Distractors: A (0.5 — arbitrary halving, not a clean error), C (2 — might come from $a/P$), D (4 — student computes $a^3$ without dividing by $P^2$; actually = 1, so this is a stretch). For a Sun-identical test case ($P=a=1$), *all* operations give 1 and none of the distractors are naturally produced by a scaling error. But the item functions as a gateway recall-of-formula check, and the answer is right.
- No changes. Slightly weak distractor set but not worth a verdict downgrade; Q17-02 carries the real diagnostic weight.

**Q17-02** — ✅ **Clean. Diagnostic distractor set.**
- Fact: $M = 2^3/2^2 = 8/4 = 2\,M_\odot$. Matches reading worked example L375–421.
- Pedagogy: ratio / M / Application / yes-OMI — honest.
- Distractors: A (0.5 — student computes $P^2/a^3 = 4/8$, inversion error — diagnostic), B (1 — student forgot to cube $a$: $a^2/P^2 = 1$), D (4 — student forgot to square $P$: $a^3/P = 8/2 = 4$). All three distractors map to named algebra-handling errors on the equation. Strong §5.4 alignment.
- No changes.

**Q17-03** — ✅ **Clean.**
- Fact: $L/L_\odot = 4^{3.5} = 4^3 \cdot 4^{0.5} = 64 \cdot 2 = 128$. Matches reading L532–556.
- Pedagogy: ratio / M / Application / no-OMI — honest.
- Distractors: A (4 = linear), B (16 = $M^2$), D (256 = $M^4$) — clean power-ladder with the correct at $M^{3.5}$. Each distractor is an identifiable exponent error. Model §5.4 distractor set.
- No changes.

**Q17-04** — ✅ **Clean. High-value M13 item.**
- Fact: $\tau = 10\,\text{Gyr} \cdot 4^{-2.5} = 10/32 \approx 0.31$ Gyr. Matches reading L720–810 (worked example uses $2\,M_\odot \to 1.8$ Gyr and $10\,M_\odot \to 32$ Myr; this intermediate is a clean follow-up).
- Pedagogy: ratio / M / Application / no-OMI / M13 — honest.
- Distractors: A (40 Gyr) directly realises M13 ("more fuel = longer life"; student multiplies rather than divides) — the *right* distractor for a M13-tagged item. B (10 Gyr) = "mass doesn't affect lifetime." D (0.003 Gyr) = overcorrection ($M^{-5}$ or similar). A is especially diagnostic.
- No changes.

**Q17-05** — ✅ **Clean.**
- Fact: spectroscopic binary's direct observable is periodic Doppler shifts in spectral lines. Matches reading L263–322 (§Spectroscopic Binaries) and center-of-mass derivation L287–307.
- Pedagogy: conceptual / H / Connection / yes-OMI / M11 — honest. M11 is the Module-1 carryover about radial velocity requiring line-of-sight component.
- Distractors: A (angular separation) — this is the *visual* binary observable, diagnostic of type-confusion; C (color difference) — irrelevant-to-mass observable; D (combined magnitude) — aggregate photometry not kinematics. All three pose plausible "wrong observable" confusions.
- No changes.

**Q17-06** — ✅ **Clean. Another high-value M13 item.**
- Fact: $L \propto M^{3.5}$ grows faster than fuel $\propto M$, so burn rate wins. Matches reading L705–818 and the explicit misconception callout L816–818 (*"More massive stars should live longer because they have more fuel. They do have more fuel, but their luminosities rise even faster. The faster burn rate wins."*).
- Pedagogy: conceptual / M / Connection / no-OMI / M13 — honest.
- Distractors: A (weaker gravity) — physically wrong (higher-mass stars have *stronger* gravity, which compresses the core hotter); C (mass loss) — plausible-sounding but irrelevant to main-sequence lifetime; D (inefficient hydrogen conversion) — inverts the efficiency logic. All three are reasonable "wrong mechanism" choices.
- No changes.

### L18 — From Gas to Stars

**Reading reference:** `lecture-18-from-gas-to-stars.qmd`

**Q18-01** — ✅ **Clean.**
- Fact: ISM is "about 99% gas and 1% dust" and mainly hydrogen + helium — matches reading L133 ("Most of the ISM is gas, mainly hydrogen and helium. A much smaller fraction is dust… By mass, the ISM is about 99% gas and 1% dust.").
- Pedagogy: conceptual / E / Recognition / no-OMI / M23 — honest. M23 ("space between stars is empty") is the canonical target.
- Distractors:
  - A (perfect vacuum) — the *exact* M23 target. Textbook diagnostic.
  - C (pure molecular hydrogen at solar density) — right on molecularity (GMCs are H₂) but wildly wrong on density (ISM averages ~1 particle/cm³ vs. Sun's ~10²³/cm³; reading L135). Diagnostic of scale-confusion.
  - D (plasma hotter than surface of Sun) — conflates hot-ionized-medium phase with the whole ISM. Reading L137 ("Some regions are hot and diffuse") plants the seed; plausible wrong-generalization distractor.
- No changes.

**Q18-02** — ✅ **Clean.**
- Fact: "A region of hot, ionized hydrogen glowing near a young O-type star" is precisely the H II region definition at reading L170 ("H II region — ionized hydrogen produced where ultraviolet radiation from young, hot stars ionizes the surrounding gas") and the emission nebula physical cause at L161 ("Ultraviolet light from hot stars ionizes the surrounding hydrogen gas").
- Pedagogy: conceptual / M / Recognition / no-OMI — mostly honest, but difficulty is arguably E (this is pure terminology recall from a short taxonomy). Keep M if you want to reserve E for the most trivial recall items; retag E if you prefer strict calibration.
- Distractors: B (reflection) and C (dark) are the other two nebula types in the reading's taxonomy — each distinguishable by *how the cloud interacts with light* (L149–193). Diagnostic of type-confusion. D (planetary nebula) targets M22 carry-over: the name sounds similar and belongs to L20, so a student who hasn't disambiguated picks it. Strong forward-link distractor.
- No changes. (Optional: retag difficulty E.)

**Q18-03** — ✅ **Clean. Strong 2×2 distractor design.**
- Fact: dust dims blue more than red, so background stars look both dimmer *and* redder. Matches reading L213–216 verbatim and the Check-Yourself solution at L243–245 ("The star behind the dust cloud will look dimmer and redder. The dimming is extinction. The color shift toward red is reddening.").
- Pedagogy: conceptual / M / Connection / yes-OMI — honest. The OMI chain is genuine: O = observed spectrum + photometry; M = wavelength-dependent scattering; I = dust in sightline.
- Distractors: the four choices span a clean 2×2 (brighter/dimmer × bluer/redder). A inverts both; B inverts only extinction; C inverts only reddening. Each maps to an identifiable partial understanding. Per §5.4 this is a textbook "2-D error grid" distractor set.
- No changes.

**Q18-04** — ✅ **Clean.**
- Fact: "Infrared light passes through dusty regions more effectively than visible light" (reading L220). Correct answer C is this statement.
- Pedagogy: conceptual / M / Application / yes-OMI — honest. The OMI chain is explicit in the reading at L224–228.
- Distractors:
  - A (IR photons more energetic than visible) — physically inverted; this tests whether the student has internalised the EM-spectrum energy ordering from L7. Strong forward-reach.
  - B (only cool newly-formed stars emit IR) — conflates blackbody-peak reasoning with observable availability; a student who only remembers Wien's law could pick it.
  - D ("star formation occurs only when viewed in the infrared") — this one is weaker because it's almost nonsensical (star formation is a physical process, not an observation). Still, it targets the misconception that IR *causes* star formation (vs. merely reveals it). Acceptable.
- No changes. If tightening: replace D with *"Visible telescopes cannot resolve individual protostars, while infrared telescopes can"* — still wrong (resolution is not the issue), but closer to a real student mental model.

**Q18-05** — ✅ **Clean.**
- Fact: "A region of gas will collapse if its mass is greater than the Jeans mass" (reading L304); the competition is gravity vs. pressure (L291–298). Correct answer A is the gravity-beats-pressure statement.
- Pedagogy: conceptual / H / Connection / no-OMI — arguably over-tagged on difficulty. This is direct recognition of a named criterion stated qualitatively in the reading. Could retag M. Connection is defensible because the student must connect "hot/pressure" with "thermal motion" with "support."
- Distractors:
  - B (external radiation pressure pushes inward) — wrong-direction mechanism; radiation pressure from hot stars typically pushes *outward* (future L21 content also). Distractor also tests direction-of-force reasoning.
  - C (rotation slows to zero) — swaps the Jeans criterion (thermal) with an angular-momentum argument (which matters for disk formation, L500–504, not for collapse onset). Diagnostic of stage-confusion.
  - D (dust fraction > 50%) — fails the ISM composition anchor (L133, 1% dust). A student who picks this has not internalised the gas-dominated composition. Targets M23-adjacent numerical confusion.
- No changes. (Optional: retag difficulty M.)

### L19 — Stellar Evolution

**Reading reference:** `lecture-19-stellar-evolution.qmd`

**Q19-01** — ⚠️ **Minor (two distractors are borderline absurd).**
- Fact: hydrostatic equilibrium as gravity-vs-pressure balance — matches reading L124–134 verbatim.
- Pedagogy: conceptual / E / Recognition / no-OMI — honest.
- Distractors:
  - A (*"Its luminosity exactly matches that of nearby stars"*) — meaningless. Not a documented misconception. Borderline §11 anti-pattern.
  - C (*"Reflective atmosphere"*) — absurd; not a student-generated mental model. Borderline §11 anti-pattern.
  - D (*"Magnetic field prevents collapse"*) — plausible wrong mechanism; targets a student who has read about magnetic fields in pulsars/sunspots and over-extrapolates. Diagnostic.
- **Proposed fix (optional):** Replace A with *"It continuously accretes mass from the interstellar medium, replenishing the inward force"* — wrong (MS stars are not in net accretion) but maps to a real student mental model of stellar feeding. Replace C with *"Rotation generates centrifugal support that balances gravity"* — wrong (rotation is secondary) but plausible from intro physics.
- Keep verdict as Minor — correct answer is correct and the question still functions; distractor tightening is a nicety.

**Q19-02** — ✅ **Clean. Flag: near-duplicate of Q17-04.**
- Fact: $4^{-2.5} = 1/32$, so lifetime is $\sim 10/32 \approx 0.3$ of Sun's. Matches reading L259–286 worked example (2 $M_\odot$ → 1.8 Gyr, 5 $M_\odot$ → 180 Myr; this 4 $M_\odot$ case fills in between) and the explicit scaling at L240–260.
- Pedagogy: ratio / M / Application / no-OMI / M13 — honest.
- Distractors:
  - A (4× longer) — direct M13 target ("more fuel → longer life" with linear-inverse scaling).
  - B (same) — "mass doesn't affect lifetime."
  - C (1/4 as long) — linear inverse scaling (student misses the 2.5 exponent).
  - D (1/32 — correct).
- Strong §5.4 alignment: correct / linear error / wrong-direction (here "no scaling" + "linear inverse") / conceptual-M13-anchor.
- **Pedagogy flag:** Q17-04 asks the *absolute* lifetime for a 4 $M_\odot$ star (answer 0.3 Gyr); Q19-02 asks the *ratio* to the Sun for a 4 $M_\odot$ star (answer 1/32). Same physics, same mass. Intentional duplication is fine *in the bank* because you can pick one for the final 25-item form; surface this at assembly time so you don't accidentally include both.

**Q19-03** — ✅ **Clean.**
- Fact: core contracts → heats up → hydrogen shell ignites → envelope expands → red giant. Matches reading L335–347 step-by-step.
- Pedagogy: conceptual / M / Application / no-OMI — honest.
- Distractors:
  - A (supernova) — M18 carryover (all-stars-go-supernova); a sub-8 $M_\odot$ star doesn't core-collapse. Diagnostic.
  - C (white dwarf instantly) — collapses the whole red-giant → AGB → PN → WD chain into one step. Diagnostic of stage-compression.
  - D (fusion stops, black dwarf in years) — combines wrong mechanism with wrong timescale. Acceptable.
- No changes.

**Q19-04** — ✅ **Clean.**
- Fact: "first major move after the main sequence is toward the upper right… upward, because the star becomes more luminous; to the right, because the surface becomes cooler" — reading L407–412.
- Pedagogy: conceptual / M / Application / no-OMI / M15 — honest.
- Distractors:
  - A (lower-left) — inverts both axes.
  - C (lower-right) — gets cooler direction right, luminosity wrong (a student who remembers "cool" but not "luminous" picks this).
  - D (down the MS toward lower mass) — direct M15 target ("stars slide along the MS as they age"). Textbook diagnostic.
- No changes.

**Q19-05** — ✅ **Clean.**
- Fact: thermostat logic — reading L144–149 spells out the exact step sequence: contracts → compressed → hotter → pressure rises → pushes back. Higher core T raises the fusion rate (fusion rate is steeply T-dependent, though reading keeps this qualitative at L135–139 and L162–164).
- Pedagogy: conceptual / H / Connection / no-OMI — honest. The student must chain contraction→T→fusion rate; this is a genuine Connection item.
- Distractors:
  - A (decreases, less fuel) — attributes the effect to fuel supply rather than core conditions; intermediate-mass confusion.
  - B (stays constant, fusion is steady) — "stars are clocks" misconception; contradicts thermostat framework.
  - D (stops entirely) — overshoots; small perturbation doesn't extinguish fusion. Acceptable as an absurd-overshoot option.
- No changes.

**Q19-06** — ✅ **Clean. High-value Connection item.**
- Fact: MS turnoff logic — reading L589–618 explicitly: "As a cluster ages, its most massive stars leave the main sequence first. The point where stars are just beginning to peel away is called the main-sequence turnoff." Older cluster → no massive stars left on MS.
- Pedagogy: conceptual / H / Connection / yes-OMI / M13, M15 — honest. Both M13 (mass-lifetime) and M15 (stars leave MS) are active.
- Distractors:
  - A (O never formed) — ignores the universality of the stellar mass function; plausible "maybe this cluster is weird" response.
  - C (G-type brighter than O) — factually wrong (O stars $\sim 10^5 L_\odot$ vs G at $1 L_\odot$); a student who confuses temperature with intrinsic luminosity.
  - D (too far for O stars) — wrong-direction: O stars are *easier* to detect at distance because they're intrinsically brighter. Diagnostic of brightness-vs-distance confusion (ties back to M17 from Module 2).
- No changes. This is an excellent assembly-priority item — it tests M13, M15, turnoff reasoning, *and* reaches back to M17.

### L20 — How Stars Die

**Reading reference:** `lecture-20-how-stars-die.qmd`

**Q20-01** — ✅ **Clean.**
- Fact: "For a star born below about 8 $M_\odot$ (including the Sun)… white dwarf" — reading L408–427, reinforced at L424–427 ("Section Takeaway: Low-mass stars do not usually die in supernova explosions. They die by losing their outer layers and leaving behind a white dwarf supported by electron degeneracy pressure.").
- Pedagogy: conceptual / E / Recognition / no-OMI / M19 — honest. M19 is the canonical "Sun will become SN/BH" misconception.
- Distractors:
  - B (neutron star) — direct M19 target.
  - C (black hole) — direct M19 target.
  - D (supergiant) — category error: supergiant is a *phase*, not a remnant. Diagnostic of students who confuse evolutionary stages with endpoints.
- No changes.

**Q20-02** — ✅ **Clean.**
- Fact: "Stars more massive than about 8 solar masses follow a radically different evolutionary path" — reading L550. Correct answer (25 $M_\odot$ O-type) is comfortably above threshold.
- Pedagogy: conceptual / E / Application / no-OMI / M18 — honest. Difficulty E is defensible (mass-threshold recall); Application is reasonable since the student must compare each candidate mass against the threshold.
- Distractors:
  - A (0.5 $M_\odot$ red dwarf) — 16× below threshold.
  - B (1 $M_\odot$ Sun-like) — direct M18 target ("Sun will supernova").
  - D (0.8 $M_\odot$ *isolated* white dwarf) — subtle but important: isolated WDs don't supernova; only binary-accretion Type Ia can. Tests whether student has internalised the binary requirement. This is a strong Tier-2 distractor.
- No changes.

**Q20-03** — ✅ **Clean.**
- Fact: "Electron degeneracy pressure can support a white dwarf only up to about 1.4 $M_\odot$, the Chandrasekhar limit" — reading L402–404.
- Pedagogy: conceptual / M / Recognition / no-OMI — honest.
- Distractors:
  - A (max MS mass) — wrong object; confuses WD limit with main-sequence mass limit (~150 $M_\odot$).
  - C (min progenitor mass for any SN) — confuses 1.4 $M_\odot$ with the ~8 $M_\odot$ Type II threshold.
  - D (typical NS mass) — this is subtly seductive: NS masses *do* cluster near 1.4 $M_\odot$ precisely because they form when a degenerate core crosses Chandrasekhar. The distractor targets the student who knows the *number* matches a NS but doesn't know what the limit *defines*. Diagnostic of surface-level memorization.
- No changes. Distractor D is particularly well-chosen.

**Q20-04** — ✅ **Clean.**
- Fact: classic near-Chandrasekhar accretion model — reading L940–953 lays out the exact mechanism in answer B, and L974–975 confirms this is the canonical ASTR 101 framing ("The classic near-Chandrasekhar accretion model is still useful in ASTR 101 because it captures the key idea of thermonuclear runaway in a white dwarf").
- Pedagogy: conceptual / M / Connection / yes-OMI — honest. The student connects binary → accretion → Chandrasekhar → runaway.
- Distractors:
  - A (iron-core collapse of massive star) — exactly the Type II mechanism; tests Type Ia vs. Type II separation.
  - C (two merging neutron stars) — NS-NS mergers produce kilonovae (GW170817, which appears in Q21-06). Distractor cleanly probes boundary with adjacent compact-object physics.
  - D (single Sun-like at end of RG) — combines wrong progenitor + wrong phase.
- No changes.

**Q20-05** — ✅ **Clean.**
- Fact: binding-energy-per-nucleon peaks near iron; fusion past iron absorbs energy — reading L621–681. Key sentences at L655–659 ("Fusion helps support a star only if it releases energy. Once the core becomes iron-rich, fusion is no longer a useful energy source for pressure support. That is why an iron core is a dead end for normal stellar fusion.").
- Pedagogy: conceptual / H / Connection / no-OMI — honest. Genuine Connection: student must link binding-energy curve to support-collapse logic.
- Distractors:
  - A (iron atoms chemically repel) — category error: chemical vs. nuclear scale. Diagnostic of scale-confusion.
  - C (iron too dense to ignite) — density is not the issue; energetics is. Partial-understanding distractor.
  - D (magnetic fields prevent iron fusion) — wrong mechanism, not in reading. Targets the student who conflates pulsar/sunspot magnetism with fusion suppression.
- No changes.

**Q20-06** — ✅ **Clean.**
- Fact: "A planetary nebula is… the ejected outer layers of a dying low-mass star" — reading L221–225 verbatim; correct answer C matches.
- Pedagogy: conceptual / E / Recognition / no-OMI / M22 — honest. M22 is "planetary nebulae = planets" historical-misnomer target.
- Distractors:
  - A (planets forming around young star) — direct M22 target.
  - B (debris disk around MS star) — historical-name-contamination variant.
  - D (planet-bearing disk around WD) — plausible conflation of WD + disk + "planet" into one object.
- No changes.

**Q20-07** — ⚠️ **Minor (three distractors borderline absurd, §11 anti-pattern).**
- Fact: Type Ia light curves are uniform because they come from Chandrasekhar-mass WDs — reading L1007–1009 ("Type Ia light curves are more uniform and can be standardized for distance measurements"). The Chandrasekhar-mass progenitor framing is consistent with L940–942 and L974–975.
- Pedagogy: conceptual / H / Connection / yes-OMI — honest. The OMI chain is real: observable = peak luminosity; model = standardizable progenitor; inference = distance via inverse-square.
- **Distractor issue:** A (*"They all occur at exactly 1 billion light-years"*), C (*"Their light curves are indistinguishable from stellar parallax signals"*), and D (*"Every galaxy contains exactly one per century"*) are all nonsensical-absurd per §11. None maps to an identifiable student error. A student who picks any of these isn't revealing a diagnostic misconception — they're just guessing or picking the "weird-sounding" option.
- **Proposed rewrite:**
  - A. *"They occur only in galaxies of previously known distance"* — circular-reasoning misconception.
  - C. *"Their apparent brightness is always the same regardless of distance"* — direct M17 carry-over (apparent vs. intrinsic brightness confusion — the central Module 2 misconception applied here).
  - D. *"Their spectra directly encode their distance in a shift of wavelength"* — conflates Type Ia calibration with cosmological redshift (a real student confusion at intro level).
- This rewrite makes each distractor a named student failure mode. Strong recommendation to apply before assembly — this is a Tier-1 Connection item and deserves Tier-1 distractors.

**Q20-08** — ✅ **Clean.**
- Fact: "Normal stellar fusion can build elements up to roughly iron. To make many elements heavier than iron, nature needs additional processes such as neutron capture in extreme environments" — reading L848. Reading L842 explicitly attributes heavy elements to "rapid neutron-capture events," and the Misconception Check at L852–856 is precisely about r-process coming from both supernovae *and* NS mergers. Answer B names both.
- Pedagogy: conceptual / M / Connection / no-OMI — honest.
- Distractors:
  - A (steady MS core fusion) — fails the iron-limit logic from Q20-05.
  - C (slow C-O fusion in WDs) — WDs don't fuse (unless destabilized as Ia progenitor); plausible-sounding misconception.
  - D (helium burning → heavier than Fe) — He burning makes C and O, well below iron. Numerical off-by-orders distractor.
- No changes.

### L21 — Neutron Stars & Black Holes

**Reading reference:** `lecture-21-neutron-stars-black-holes.qmd`

**Q21-01** — ✅ **Clean.**
- Fact: "A typical neutron star has a radius of about 10 to 12 km" — reading L86. Correct answer A (10 km) matches.
- Pedagogy: conceptual / E / Recognition / no-OMI — honest. Pure recall of a named length scale.
- Distractors:
  - B (1,000 km) — no specific anchor in the reading, but tests "I know it's small but not how small." Softest of the three.
  - C (10,000 km, Earth-sized) — direct NS-vs-WD confusion; WDs are Earth-sized (Q16-08 companion item). Strong diagnostic.
  - D (700,000 km, Sun-sized) — tests students who think the remnant is the same size as the progenitor. Targets compression-ignorance.
- No changes. Distractor B is soft but the 3-order-of-magnitude fan is physically meaningful.

**Q21-02** — ✅ **Clean (C borderline).**
- Fact: "Radiation is emitted in beams near the magnetic poles. As the star rotates, those beams sweep through space like lighthouse beams" — reading L124, reinforced at L166 misconception check ("A pulsar is not a star that turns on and off").
- Pedagogy: conceptual / M / Application / yes-OMI — honest. OMI chain explicit at reading L150–156.
- Distractors:
  - A (physically oscillate like a beating heart) — tests Cepheid/variable-star confusion; plausible alternative mental model. Diagnostic.
  - C (Hawking radiation bursts) — borderline §11. A student wouldn't genuinely build a "Hawking-radiation pulsar" model, but the distractor does test BH-vs-NS type confusion among "exotic compact objects." Marginal.
  - D (companion-star eclipses) — clean diagnostic of eclipsing-binary vs. pulsar confusion.
- **Optional fix:** replace C with *"Their cores undergo rhythmic fusion cycles that modulate the luminosity"* — wrong (NSs don't fuse; pulses are not luminosity fluctuations) but maps to a real student mental model ("pulse" = energy output variation). Keep verdict as Clean — distractor A and D already do heavy lifting.

**Q21-03** — ✅ **Clean. Model ratio item.**
- Fact: $R_s = 2GM/c^2 \Rightarrow R_s \propto M$; Sun $R_s \approx 3$ km (reading L302–305); for $10\,M_\odot$, $R_s = 30$ km (reading L284 verbatim: *"For a 10 $M_\odot$ black hole, the Schwarzschild radius is about 30 km"*).
- Pedagogy: ratio / E / Application / no-OMI — honest. Canonical linear-scaling problem.
- Distractors:
  - A (3 km) — "mass doesn't scale $R_s$" or "all BHs are the Sun's $R_s$." Diagnostic.
  - B (10 km) — student reads "10" from the mass and quotes it as km; alternatively, confuses NS radius with BH $R_s$. Both are named errors.
  - C (30 km) — correct.
  - D (300 km) — over-scaling (squares the factor or confuses $R_s \propto M$ with $R_s \propto M^2$).
- Distractor quartet is a clean *under-scale / confusion / correct / over-scale* sequence. Model §5.4 alignment.
- No changes.

**Q21-04** — ✅ **Clean. Canonical M20 item.**
- Fact: reading L311–316 verbatim: *"If the Sun were magically replaced by a black hole of exactly the same mass, Earth would still orbit at roughly the same distance. The difference would be that sunlight and heat were gone, not that gravity at Earth's orbit suddenly became stronger."* Reinforced at L314 misconception callout.
- Pedagogy: conceptual / M / Connection / no-OMI / M20 — honest. Canonical M20 ("black holes suck everything in") item.
- Distractors:
  - A (spiral inward, consumed within a year) — direct M20 target. Textbook diagnostic.
  - C (expand to twice current size) — tests "something dramatic must happen when you swap a star for a BH" — arbitrary direction, but still M20-adjacent.
  - D (become chaotic, Earth ejected) — M20-adjacent "BH destabilizes nearby orbits" misconception. Distinct from A: A tests "BH pulls you in," D tests "BH destabilizes everything." Good separation.
- No changes. A and D cover the two main flavors of M20; C is filler but acceptable.

**Q21-05** — ✅ **Clean. Strong M21 item.**
- Fact: reading L400 *"it images hot material just outside the black hole and the dark central region produced by strong gravity and the black hole's shadow"* and L404 misconception callout *"The EHT did not photograph the black hole itself as a glowing object. The bright ring is hot gas outside the event horizon, and the dark center is the black hole's shadow."* Correct answer B exactly matches.
- Pedagogy: conceptual / M / Connection / yes-OMI / M21 — honest. OMI chain: observable = radio-brightness distribution; model = GR + hot accretion disk; inference = event-horizon silhouette.
- Distractors:
  - A (Hawking radiation illuminates BH) — exotic-physics wrong mechanism. Tests "any BH-exotic-concept might be what EHT sees" confusion.
  - C (direct optical photograph of singularity) — triple error (wrong wavelength band; wrong feature; singularity is interior). Direct M21 target.
  - D (computer reconstruction with no observational input) — tests "is this real data?" skepticism-misconception — a known student reaction to the EHT images when first shown. Good diagnostic.
- No changes.

**Q21-06** — ⚠️ **Minor (distractor C absurd per §11).**
- Fact: reading L436 verbatim: *"GW170817, a neutron star merger detected in 2017, was especially important because it was observed both in gravitational waves and in ordinary electromagnetic light. That gave astronomers two kinds of evidence from the same event and helped establish multi-messenger astronomy."* Correct answer B matches.
- Pedagogy: conceptual / H / Connection / yes-OMI — honest. H is defensible because students must disambiguate GW170817 (2017, NS-NS, multi-messenger) from GW150914 (2015, BH-BH, GW-only).
- Distractors:
  - A (first GW ever detected) — strong diagnostic: this is GW150914 (reading L414), not GW170817. Tests event-disambiguation directly.
  - C (*"proved that black holes do not exist"*) — absurd. Not a documented student misconception; violates §11 anti-pattern. No intro astro student will build this mental model.
  - D (first pulsar discovered) — tests historical/categorical confusion. Pulsars = Bell Burnell 1967 (reading L118). Distractor works because both "historic compact-object detection" and "1960s–2010s radio astronomy milestone" overlap in weak student memory. Acceptable.
- **Proposed fix for C:** replace with *"It was the first detection of gravitational waves from a binary *black-hole* merger"* — still wrong (GW170817 was NS-NS; the BBH-first-detection honor belongs to GW150914), and maps to a real confusion students have between the two headline LIGO events. Keeps the "distinguish two LIGO milestones" pedagogical target aligned across A and C.
- Alternative fix for C: *"It was the first direct image of a compact-object merger by the Event Horizon Telescope"* — wrong (EHT images BH shadows, not mergers; LIGO is an interferometer, not an imager) — tests instrument-vs-phenomenon confusion. Weaker than the first proposal.
- Keep verdict ⚠️ Minor: the physics in the correct answer is sound, and the fix is a single distractor swap.

### Synthesis (S-01 to S-04)

**Reading references:** `lecture-15-measuring-the-stars.qmd` (L7+L15), `lecture-16-hr-diagram.qmd` (L8+L16), `lecture-17-binary-stars.qmd` (L17+L9), `lecture-19-stellar-evolution.qmd` (L19), `lecture-20-how-stars-die.qmd` (L20).

**S-01** — ✅ **Clean. High-value synthesis item — assembly priority.**
- Fact: parallax gives distance $d = 1/p$ (reading L15 L138–142); apparent brightness $b$ is directly observed (L15 L129–135); $L = 4\pi d^2 b$ via inverse-square (reading L15 L241–253, Checkpoint at L558–571). The three steps in correct answer A match the canonical Module-1-tool-into-Module-2-inference chain.
- Pedagogy: conceptual / H / Connection / yes-OMI / M1, M17 — honest. Simultaneously targets M1 (observed-vs-inferred) and M17 (apparent $\ne$ luminosity). Canonical synthesis.
- Distractors:
  - B (measure $L$ directly → Stefan-Boltzmann → $T$) — double error: inverts causal arrow (you derive $T$ from $L+R$, not the reverse), *and* treats $L$ as directly measurable (the M1 target). Strong double-diagnostic.
  - C (measure mass directly → mass-luminosity → $L$) — fails the "mass needs a binary" constraint from L17 (reading L17 §Binary Stars is precisely about *why* mass isn't directly measurable for single stars). Tests the "mass is an observable" confusion.
  - D (color → Wien → $L$) — Wien gives $T$, not $L$. Tests the Wien-target confusion directly (M9 adjacent).
- No changes. This is one of the strongest items in the entire bank; every wrong answer maps to a named misconception, and the correct answer is the spine of Module 2's "how do we know $L$?" story.

**S-02** — ✅ **Clean. Wien-ratio item that Q16-07 currently fails to be.**
- Fact: Wien's law $\lambda T = \text{const}$ (reading L16 L684–690 + L8 reading). Ratio: $T_2 = T_\odot \cdot (\lambda_\odot / \lambda_2) = 5800 \cdot (500/1450) = 5800/2.9 \approx 2000$ K. Matches the reasoning line stated in the bank draft verbatim.
- Pedagogy: ratio / H / Application / yes-OMI / M9 — honest. H is warranted because a ratio *and* a direction *and* an anchor-cleanup ("use Sun") all have to be right.
- Distractors:
  - B (5800 K, "temperature doesn't change") — tests students who don't apply Wien at all. Diagnostic of M9 ("wavelength doesn't set $T$").
  - C (17,000 K) — wrong direction: student uses $T \propto \lambda$ instead of $T \propto 1/\lambda$. Classic Wien-direction error. This is the textbook "wrong-direction" slot per §5.4.
  - D (58,000 K) — overshoots by ~10× (could reflect $T^4$-confusion from Stefan-Boltzmann, or a factor-of-10 ratio slip). Diagnostic of scaling-power confusion.
- No changes. This is the clean Wien-ratio item the bank needs; it also answers the Q16-07 concern (§3/L16). **Pairing note:** if you take the Q16-07 "option 1" (leave as-is) fix, keep S-02 in the final form; if you take Q16-07 "option 2" (rewrite distractors for ratio test), S-02 becomes optional.

**S-03** — ✅ **Clean. Structurally a "which is NOT" item.**
- Fact: on the main sequence, mass sets lifetime ($\tau \propto M^{-2.5}$, reading L19 L240–260), luminosity ($L \propto M^{3.5}$, reading L19 L219), and end-state (WD/NS/BH boundary at 8 $M_\odot$, reading L20 L408, L550). Distance is set by where the star happens to be in space, not its mass. Correct answer D.
- Pedagogy tag note: marked `Connection`, but structurally this is Recognition of "what mass determines." A careful student can solve by elimination without the mass-destiny scaling. **Optional retag:** depth → Application.
- Distractors: in a "which is NOT" structure, the three wrong-to-pick options are the three correct mass-determined properties. §5.4 is satisfied because each wrong option is a named consequence of mass (lifetime/luminosity/endpoint), so picking any of them reveals the student has NOT internalised that distance is spatially independent.
- No changes. (Optional: retag depth to Application.)

**S-04** — ✅ **Clean. Good M11 synthesis item.**
- Fact: a face-on spectroscopic binary has zero line-of-sight velocity at all orbital phases, so periodic Doppler shifts vanish. Matches reading L17 §Spectroscopic Binaries (L263–322) and Doppler physics from L9 reading. Correct answer B is physically exact.
- Pedagogy: conceptual / H / Connection / yes-OMI / M11 — honest. H is warranted: the student must project velocity onto the line of sight and reason about what remains.
- Distractors:
  - A (both RVs cleanly) — direct M11 target: student ignores inclination. Textbook diagnostic.
  - C (single strong blueshift throughout orbit) — physically impossible for a bound orbit (blueshift throughout = net approach = not orbital). Tests the "Doppler = speed" misconception that collapses sign/direction.
  - D (identical to eclipsing binary) — double error: face-on has no eclipses (eclipses need edge-on) *and* no Doppler (also needs edge-on). Tests binary-type confusion.
- No changes.

---

## 4. Cross-Cutting Findings

**Verdict tally (55 items):** 🔴 Major 2 · 🟠 Moderate 0 · ⚠️ Minor 8 · ✅ Clean 45.

Six cross-cutting patterns emerged from the per-item audit:

1. **Distractor absurdity is the modal defect.** Four ⚠️ items (Q19-01, Q20-07, Q21-02 borderline, Q21-06) contain at least one distractor that violates §11 anti-patterns — it neither names a documented student misconception nor maps to an identifiable scaling/direction error. The worst case is Q20-07, where *three of four* distractors are absurd. The pattern suggests the drafter reached for "weird-sounding" filler when stuck rather than named-misconception distractors.

2. **Both 🔴 items are factual-number errors, not conceptual wrongness.** Q14-06 (sunspot T = 4000 K vs. reading's 3,700 K) and Q15-06 (ground-based parallax limit = "a few thousand pc" vs. reading's ~100 pc) have the right physics framework and the right pedagogical target — only specific numbers are wrong. Fixes are cosmetic two-number edits, not structural rewrites.

3. **Assembly tension: Q17-04 and Q19-02 are near-duplicates.** Both test 4 $M_\odot$ main-sequence lifetime via $\tau \propto M^{-2.5}$. Q17-04 asks for absolute answer (0.3 Gyr); Q19-02 asks for ratio to Sun (1/32). Same physics, same mass, same misconception target (M13). Having both in the bank is fine (both items are ✅ individually). Pick one for the final 25-item form to avoid testing the same micro-skill twice.

4. **M17 (apparent ≠ intrinsic brightness) is under-represented in distractors.** The central Module 2 misconception is tagged on only 2 items (Q15-04, S-01). The proposed Q20-07 rewrite wires M17 into distractor C and would lift coverage to 3 items with diagnostic distractors. Strong recommendation.

5. **Wien-direction coverage has a redundancy choice.** S-02 is a clean Wien-ratio item with a correct direction-error distractor (C). Q16-07's current distractors don't test the ratio at all. Either (a) keep S-02 as the ratio carrier and relax Q16-07 to `conceptual` tagging, or (b) rewrite Q16-07 distractors (§3 option 2) and have two ratio-level Wien items for assembly flexibility. My recommendation: (b) — redundancy is cheap given a 2.2× oversupply.

6. **OMI coverage and chain labeling are consistent.** 24 of 55 bank items carry `yes-OMI` tags, and the labels match the OMI callouts in the readings wherever I spot-checked (L14-Sun §Observables, L15 §Parallax, L16 §Stefan-Boltzmann, L17 §Spectroscopic Binaries, L18 §Extinction/Reddening, L21 §Pulsars and §EHT). No OMI tag appeared dishonest in a post-check — the chain labeled on each item was actually traceable in the reading.

---

## 5. Recommended Edits — Prioritized

Priorities 1–2 are recommended before assembly. Priorities 3–5 are polish.

### Priority 1 — Factual fixes (REQUIRED before assembly)

| Item | Fix |
|---|---|
| Q14-06 | Change "~4000 K" → "~3,700 K" in the correct answer to match reading L336. |
| Q15-06 | Change "a few thousand parsecs" → "about 100 parsecs" in the stem; change "beyond a few kpc" → "beyond ~100 pc" in answer C. Or reframe around Gaia (§3 alternative). |

### Priority 2 — §11 anti-pattern distractor rewrites (strongly recommended)

| Item | Fix |
|---|---|
| Q19-01 | Replace distractor A ("luminosity matches nearby stars") with *"It continuously accretes mass from the ISM, replenishing the inward force"*. Replace distractor C ("reflective atmosphere") with *"Rotation generates centrifugal support that balances gravity"*. |
| Q20-07 | Rewrite distractors A, C, D as proposed in §3: A → circular-reasoning, C → M17 carry-over (*"apparent brightness always the same regardless of distance"*), D → redshift conflation. |
| Q21-06 | Replace distractor C ("proved black holes don't exist") with *"It was the first detection of gravitational waves from a binary black-hole merger"* (GW150914 confusion — tests event disambiguation). |

### Priority 3 — Distractor tightening (assembly polish)

| Item | Fix |
|---|---|
| Q14-02 | Replace distractor D ("fusion is exothermic only above 10 M K") with *"The fusion reaction only releases energy at temperatures above 10 million K"* — removes the "10" vs. "15" number quibble; isolates the T-threshold-vs-exothermicity conflation cleanly. |
| Q15-01 | Replace distractor B (2 pc) with *"0.5 pc"* and D (20 pc) with *"10 pc"* to align with §5.4 wrong-direction / plausible-alternative slots. |
| Q15-03 | Replace distractor B (6) with *"1/9"* to create a clean §5.4 quartet: linear-error / wrong-direction / correct / cubic-overcorrection. |
| Q16-07 | Apply the option-2 rewrite from §3: keep the stem, rewrite A/B/D to probe Wien-ratio errors directly (X twice cool, X 16× hotter confusing Wien with Stefan-Boltzmann, etc.). |
| Q21-02 | Optional: replace distractor C ("Hawking radiation bursts") with *"Their cores undergo rhythmic fusion cycles that modulate the luminosity"* to swap a borderline-absurd distractor for a diagnostic one. |

### Priority 4 — Tag calibration (cosmetic)

| Item | Fix |
|---|---|
| Q14-05 | Retag difficulty M → E (pure Recognition of a named layer). |
| Q18-02 | Optional: retag difficulty M → E (pure terminology recall). |
| Q18-05 | Optional: retag difficulty H → M (direct recognition of a named criterion; Connection framing is borderline). |
| S-03 | Optional: retag depth Connection → Application (item functions by elimination once students recognise distance is an observational coordinate). |

### Priority 5 — Assembly-time decisions

1. **Q17-04 vs. Q19-02.** Choose one for the final 25-item form (both test the same 4 $M_\odot$ / $\tau \propto M^{-2.5}$ micro-skill). Recommendation: pick Q19-02 (ratio form; pairs cleanly with the §5.4 quartet) unless absolute Gyr is pedagogically important to you, in which case Q17-04.
2. **Q16-07 vs. S-02.** Decide Wien-ratio coverage strategy: both-in (redundant, assembly flexibility), S-02-only (Q16-07 relaxed to conceptual), or Q16-07-only (S-02 replaced with a different L16+L8 synthesis).
3. **Open items carried over from bank draft §8:** equation sheet production, exam date, optional L10–L13 recall section. Independent of this audit.

---

## 6. Verdict on Assembly Readiness

**The bank is assembly-ready conditional on Priority 1 fixes** (2 factual corrections). Priority 2 fixes (3 distractor rewrites that remove §11 anti-pattern violations) should be applied before the student-facing form is frozen — they cost ~15 minutes of work and eliminate all remaining §11 violations in the bank. Priority 3–5 are polish.

**Coverage metrics:**

- **Item pool:** 55 bank items for a 25-item form (2.2× oversupply).
- **Misconception coverage:** all 12 Module 2 misconceptions (M12–M23) have at least one tagged item; all 6 Module 1 carry-overs (M1, M2, M9, M11, M17, M19) have at least one tagged item. After the Q20-07 rewrite, M17 coverage grows from 2 → 3 items.
- **OMI chain coverage:** 24 items carry `yes-OMI` tags — well above the ≥4 required for the final 25-item form.
- **Quality distribution:** 45/55 (82%) ✅ Clean, 8/55 (15%) ⚠️ Minor (cosmetic-to-small fixes), 2/55 (4%) 🔴 Major (both factual-number fixes only), 0/55 🟠 Moderate.

**Items recommended as Tier 1 assembly priority (strongest diagnostic power):**

- **Q15-04** — M17 + inverse-square synthesis; explicit 2-D distractor design; matches a worked example in the reading almost verbatim.
- **Q16-03, Q16-04** — model Stefan-Boltzmann ratio items with clean progressive-power distractor ladders.
- **Q16-08** — Stefan-Boltzmann WD constraint; distractors C and D are *geometrically impossible* in the $L$-$R$-$T$ system, making them uniquely diagnostic.
- **Q17-02** — Kepler III with a fully §5.4-compliant algebra-error distractor set.
- **Q17-03** — model $M^{3.5}$ power-ladder distractor set.
- **Q19-06** — MS turnoff reasoning that exercises M13, M15, *and* reaches back to M17 (Module 1 carry-over).
- **Q21-03** — canonical linear-scaling $R_s \propto M$ ratio item; under-scale / confusion / correct / over-scale quartet.
- **Q21-04** — canonical M20 ("black holes suck everything in") item.
- **S-01** — canonical Module 1 → Module 2 synthesis (parallax → luminosity chain); every wrong answer maps to a named Module 2 misconception.

**Recommended next steps:**

1. Instructor reviews this audit (no edits applied yet).
2. Apply Priority 1 edits in `exams/_prep/midterm-2-bank-draft.md` (bump to v0.2).
3. Apply Priority 2 edits in same pass (bump to v0.3).
4. Assemble final 25-item form; resolve Priority 5 assembly decisions at that point.
5. Apply Priority 3–4 edits opportunistically during assembly where they improve items that make the cut.
6. Cross-verify the assembled form against §7 coverage table before freezing the student-facing PDF.
