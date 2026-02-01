(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  if (!window.SpectralLinesModel) {
    throw new Error('Spectral Lines Lab: missing SpectralLinesModel');
  }

  const state = {
    setup: 'HotDense',
    resolutionNm: 0.2,
    selectedCardIds: new Set(),
    showUnknown: false,
    unknownCardIds: ['H_I_Balmer', 'Na_I_D'],
  };

  const cards = SpectralLinesModel.buildElementCards({ verifiedOnly: true });
  const cardOrder = ['H_I_Balmer', 'Na_I_D', 'Ca_lines'].filter((id) => cards[id]);

  const el = {
    spectrumSvg: document.getElementById('spectrum-svg'),
    stageMeta: document.getElementById('stage-meta'),
    missionText: document.getElementById('mission-text'),

    readoutSetup: document.getElementById('readout-setup'),
    readoutSetupUnit: document.getElementById('readout-setup-unit'),
    readoutSelected: document.getElementById('readout-selected'),
    readoutScore: document.getElementById('readout-score'),
    readoutResolution: document.getElementById('readout-resolution'),

    setupDisplay: document.getElementById('setup-display'),
    cardsDisplay: document.getElementById('cards-display'),
    cardsGrid: document.getElementById('cards-grid'),

    unknownDisplay: document.getElementById('unknown-display'),
    btnToggleUnknown: document.getElementById('btn-toggle-unknown'),
    btnCheckMatch: document.getElementById('btn-check-match'),

    resolutionSlider: document.getElementById('resolution-slider'),
    resolutionDisplay: document.getElementById('resolution-display'),
  };

  function setupToSpectrumType(setup) {
    switch (setup) {
      case 'HotDense':
        return { label: 'Hot dense', type: 'continuous' };
      case 'HotThinGas':
        return { label: 'Hot thin gas', type: 'emission' };
      case 'CoolGasInFront':
        return { label: 'Cool gas in front', type: 'absorption' };
      default:
        return { label: 'Unknown setup', type: 'continuous' };
    }
  }

  function nmToX(nm, minNm, maxNm) {
    const t = (nm - minNm) / (maxNm - minNm);
    return 80 + t * (1000 - 160);
  }

  function clearSvg() {
    while (el.spectrumSvg.firstChild) el.spectrumSvg.removeChild(el.spectrumSvg.firstChild);
  }

  function svgEl(name, attrs = {}) {
    const n = document.createElementNS(SVG_NS, name);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    return n;
  }

  function drawAxes({ minNm, maxNm }) {
    const axis = svgEl('line', { x1: 80, y1: 190, x2: 920, y2: 190, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 2 });
    el.spectrumSvg.appendChild(axis);

    const ticks = [400, 450, 500, 550, 600, 650, 700].filter((x) => x >= minNm && x <= maxNm);
    for (const t of ticks) {
      const x = nmToX(t, minNm, maxNm);
      el.spectrumSvg.appendChild(svgEl('line', { x1: x, y1: 190, x2: x, y2: 198, stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 2 }));
      const label = svgEl('text', {
        x,
        y: 214,
        fill: 'rgba(255,255,255,0.7)',
        'font-size': 16,
        'text-anchor': 'middle',
        'font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      });
      label.textContent = `${t} nm`;
      el.spectrumSvg.appendChild(label);
    }
  }

  function drawContinuous({ minNm, maxNm }) {
    // Stylized continuum (not a physically accurate Planck curve).
    const path = svgEl('path', {
      d: 'M 80 175 C 240 165, 330 50, 520 70 C 700 90, 760 150, 920 175',
      fill: 'none',
      stroke: 'rgba(255,255,255,0.75)',
      'stroke-width': 4,
    });
    el.spectrumSvg.appendChild(path);

    const note = svgEl('text', { x: 80, y: 30, fill: 'rgba(255,255,255,0.65)', 'font-size': 14 });
    note.textContent = 'continuum (stylized)';
    el.spectrumSvg.appendChild(note);
  }

  function drawLines({ linesNm, minNm, maxNm, mode }) {
    const stroke = mode === 'emission' ? 'rgba(93, 173, 226, 0.95)' : 'rgba(0,0,0,0.65)';
    const yTop = mode === 'emission' ? 60 : 70;
    const yBot = 190;

    for (const nm of linesNm) {
      if (nm < minNm || nm > maxNm) continue;
      const x = nmToX(nm, minNm, maxNm);
      const widthPx = Math.max(2, Math.min(16, 3 + state.resolutionNm * 18));
      el.spectrumSvg.appendChild(svgEl('line', { x1: x, y1: yTop, x2: x, y2: yBot, stroke, 'stroke-width': widthPx }));
    }
  }

  function renderSpectrum() {
    const minNm = 380;
    const maxNm = 700;

    const setupInfo = setupToSpectrumType(state.setup);
    el.stageMeta.textContent = `${minNm}–${maxNm} nm`;

    clearSvg();
    el.spectrumSvg.appendChild(svgEl('rect', { x: 0, y: 0, width: 1000, height: 220, fill: 'rgba(10,10,20,0.0)' }));
    drawAxes({ minNm, maxNm });

    const selectedLines = SpectralLinesModel.combineCardLinesNm({
      cardIds: Array.from(state.selectedCardIds),
      cards,
    });

    if (setupInfo.type === 'continuous') {
      drawContinuous({ minNm, maxNm });
    } else if (setupInfo.type === 'emission') {
      el.spectrumSvg.appendChild(svgEl('rect', { x: 80, y: 40, width: 840, height: 150, fill: 'rgba(0,0,0,0.25)' }));
      drawLines({ linesNm: selectedLines, minNm, maxNm, mode: 'emission' });
    } else {
      // absorption
      drawContinuous({ minNm, maxNm });
      drawLines({ linesNm: selectedLines, minNm, maxNm, mode: 'absorption' });
    }

    if (state.showUnknown) {
      const unknownLines = SpectralLinesModel.combineCardLinesNm({ cardIds: state.unknownCardIds, cards });
      drawLines({ linesNm: unknownLines, minNm, maxNm, mode: 'emission' });

      const banner = svgEl('text', { x: 920, y: 30, fill: 'rgba(244, 208, 63, 0.9)', 'font-size': 14, 'text-anchor': 'end' });
      banner.textContent = 'unknown overlay';
      el.spectrumSvg.appendChild(banner);
    }
  }

  function renderReadouts() {
    const setupInfo = setupToSpectrumType(state.setup);
    el.readoutSetup.textContent = setupInfo.label;
    el.readoutSetupUnit.textContent = setupInfo.type;

    const selected = Array.from(state.selectedCardIds);
    el.readoutSelected.textContent = selected.length ? selected.map((id) => cards[id]?.name ?? id).join(', ') : 'none';

    el.readoutResolution.textContent = state.resolutionNm.toFixed(2);
    el.resolutionDisplay.textContent = `${state.resolutionNm.toFixed(2)} nm`;

    el.cardsDisplay.textContent = `${selected.length} selected`;
    el.setupDisplay.textContent = state.setup;
    el.unknownDisplay.textContent = state.showUnknown ? 'on' : 'off';
    el.btnToggleUnknown.textContent = state.showUnknown ? 'Hide Unknown Spectrum' : 'Show Unknown Spectrum';
  }

  function runMatchCheck() {
    const unknownLines = SpectralLinesModel.combineCardLinesNm({ cardIds: state.unknownCardIds, cards });
    const guessedLines = SpectralLinesModel.combineCardLinesNm({ cardIds: Array.from(state.selectedCardIds), cards });
    const score = SpectralLinesModel.matchScorePercent({ unknownLinesNm: unknownLines, guessedLinesNm: guessedLines, tolNm: Math.max(0.2, state.resolutionNm) });
    el.readoutScore.textContent = String(score);
    return score;
  }

  function enforceMaxSelected(max) {
    const ids = Array.from(state.selectedCardIds);
    while (ids.length > max) {
      const removed = ids.shift();
      state.selectedCardIds.delete(removed);
    }
  }

  function renderCards() {
    el.cardsGrid.innerHTML = '';
    for (const id of cardOrder) {
      const c = cards[id];
      const wrapper = document.createElement('label');
      wrapper.className = 'card-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = state.selectedCardIds.has(id);
      input.addEventListener('change', () => {
        if (input.checked) state.selectedCardIds.add(id);
        else state.selectedCardIds.delete(id);
        enforceMaxSelected(3);
        render();
      });

      const label = document.createElement('div');
      label.className = 'card-option-label';
      label.innerHTML = `
        <div class="card-option-name">${c.name}</div>
        <div class="card-option-meta">${c.linesNm.length} line(s)</div>
      `;

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      el.cardsGrid.appendChild(wrapper);
    }
  }

  function wireControls() {
    document.querySelectorAll('.setup-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const setup = btn.getAttribute('data-setup');
        if (!setup) return;
        state.setup = setup;
        document.querySelectorAll('.setup-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render();
      });
    });

    el.btnToggleUnknown.addEventListener('click', () => {
      state.showUnknown = !state.showUnknown;
      render();
    });

    el.btnCheckMatch.addEventListener('click', () => {
      if (!state.showUnknown) state.showUnknown = true;
      render();
      runMatchCheck();
    });

    el.resolutionSlider.addEventListener('input', () => {
      const value = Number(el.resolutionSlider.value);
      state.resolutionNm = value / 100;
      render();
    });
  }

  function render() {
    renderCards();
    renderReadouts();
    renderSpectrum();
  }

  function init() {
    // Default selection: Hydrogen (matches lecture flow).
    state.selectedCardIds.add('H_I_Balmer');
    wireControls();
    render();
  }

  init();
})();

