/* SpectralLinesModel
 *
 * Utilities for teaching-oriented spectral line pattern matching.
 *
 * Data contract:
 * - Uses SpectraDataV1 (demos/_assets/spectra/spectra-data.v1.js).
 * - Respect `verified` and `sources` for any UI that displays lines.
 *
 * Scope:
 * - v1 supports a small set of “element cards” derived from the seed dataset:
 *   Hydrogen (Balmer), Sodium (D), Calcium (H/K + optional Ca I 422.7).
 * - Intensity values are illustrative unless a future dataset adds sourced probabilities.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./spectra/spectra-data.v1.js'));
  } else {
    root.SpectralLinesModel = factory(root.SpectraDataV1);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (SpectraDataV1) {
  'use strict';

  if (!SpectraDataV1) {
    throw new Error('SpectralLinesModel: missing SpectraDataV1 (load demos/_assets/spectra/spectra-data.v1.js first)');
  }

  function normalizeLinesNm(linesNm) {
    const nums = (linesNm ?? []).filter((x) => Number.isFinite(x));
    nums.sort((a, b) => a - b);
    const out = [];
    for (const x of nums) {
      if (out.length === 0 || Math.abs(out[out.length - 1] - x) > 1e-12) out.push(x);
    }
    return out;
  }

  function _cardForLine(line) {
    const species = String(line?.species ?? '');
    if (species === 'H I') {
      return { id: 'H_I_Balmer', name: 'Hydrogen (Balmer)', species: 'H I' };
    }
    if (species === 'Na I') {
      return { id: 'Na_I_D', name: 'Sodium (D)', species: 'Na I' };
    }
    if (species.startsWith('Ca ')) {
      return { id: 'Ca_lines', name: 'Calcium (H/K)', species: species };
    }
    return null;
  }

  function buildElementCards({ verifiedOnly = true } = {}) {
    const cards = {};
    for (const line of SpectraDataV1.atomicLines ?? []) {
      if (line?.kind !== 'atomic_line') continue;
      if (verifiedOnly && !line.verified) continue;

      const card = _cardForLine(line);
      if (!card) continue;

      if (!cards[card.id]) {
        cards[card.id] = {
          id: card.id,
          name: card.name,
          linesNm: [],
          verifiedOnly,
          sources: [],
        };
      }

      const nm = line?.wavelength?.value;
      if (Number.isFinite(nm)) {
        cards[card.id].linesNm.push(nm);
      }

      for (const s of line?.sources ?? []) {
        if (!s?.name) continue;
        cards[card.id].sources.push(s);
      }
    }

    for (const id of Object.keys(cards)) {
      cards[id].linesNm = normalizeLinesNm(cards[id].linesNm);
    }
    return cards;
  }

  function _scoreOverlap({ a, b, tolNm = 0.2 }) {
    const A = normalizeLinesNm(a);
    const B = normalizeLinesNm(b);
    let i = 0;
    let j = 0;
    let matches = 0;
    while (i < A.length && j < B.length) {
      const da = A[i];
      const db = B[j];
      const diff = da - db;
      if (Math.abs(diff) <= tolNm) {
        matches += 1;
        i += 1;
        j += 1;
      } else if (diff < 0) {
        i += 1;
      } else {
        j += 1;
      }
    }
    return { matches, aCount: A.length, bCount: B.length };
  }

  function matchByLines({ unknownLinesNm, candidates, verifiedOnly = true, tolNm = 0.2 }) {
    const cards = buildElementCards({ verifiedOnly });
    const ids = candidates?.length ? candidates : Object.keys(cards);
    let best = null;
    for (const id of ids) {
      const card = cards[id];
      if (!card) continue;
      const score = _scoreOverlap({ a: unknownLinesNm, b: card.linesNm, tolNm });
      const frac = score.aCount ? score.matches / score.aCount : 0;
      const candidateScore = { id, ...score, frac };
      if (
        !best ||
        candidateScore.matches > best.matches ||
        (candidateScore.matches === best.matches && candidateScore.frac > best.frac)
      ) {
        best = candidateScore;
      }
    }
    return best;
  }

  function combineCardLinesNm({ cardIds, cards }) {
    const out = [];
    for (const id of cardIds ?? []) {
      const c = cards?.[id];
      for (const nm of c?.linesNm ?? []) out.push(nm);
    }
    return normalizeLinesNm(out);
  }

  function matchScorePercent({ unknownLinesNm, guessedLinesNm, tolNm = 0.2 }) {
    const U = normalizeLinesNm(unknownLinesNm);
    const G = normalizeLinesNm(guessedLinesNm);

    // Count matches in both directions to estimate TP/FP/FN.
    const uToG = _scoreOverlap({ a: U, b: G, tolNm });
    const gToU = _scoreOverlap({ a: G, b: U, tolNm });

    const TP = uToG.matches;
    const FN = uToG.aCount - TP;
    const FP = gToU.aCount - gToU.matches;

    const denom = 2 * TP + FP + FN;
    if (denom === 0) return 0;
    return Math.round((100 * (2 * TP)) / denom);
  }

  return {
    normalizeLinesNm,
    buildElementCards,
    matchByLines,
    combineCardLinesNm,
    matchScorePercent,
  };
});

