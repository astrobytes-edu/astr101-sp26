/**
 * Kepler's Laws Sandbox
 * Interactive orbital mechanics demonstration
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  // Physical constants
  const G = 6.674e-11;                    // N⋅m²/kg² (SI)
  const M_SUN = 1.989e30;                 // kg
  const AU_KM = 1.496e8;                  // km per AU
  const AU_M = 1.496e11;                  // m per AU
  const YEAR_S = 3.156e7;                 // seconds per year

  // SVG layout
  const SVG_CENTER = { x: 300, y: 200 };
  const SVG_SCALE = 150;                  // pixels per AU at a=1

  // Slider ranges
  const A_MIN = 0.3;                      // AU
  const A_MAX = 40;                       // AU
  const E_MIN = 0;
  const E_MAX = 0.99;
  const M_MIN = 0.1;                      // M☉
  const M_MAX = 10;                       // M☉

  // ============================================
  // State
  // ============================================

  const state = {
    mode: 'kepler',          // 'kepler' | 'newton'
    units: '101',            // '101' | '201'
    a: 1.0,                  // semi-major axis (AU)
    e: 0.017,                // eccentricity
    M: 1.0,                  // star mass (M☉)
    theta: 0,                // true anomaly (radians)
    t: 0,                    // time (years)
    playing: false,
    speed: 1.0,
    animationId: null,

    // Overlay visibility
    overlays: {
      foci: true,
      apsides: true,
      equalAreas: false,
      vectors: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // SVG elements
      orbitSvg: document.getElementById('orbit-svg'),
      orbitPath: document.getElementById('orbit-path'),
      planetGroup: document.getElementById('planet-group'),
      planet: document.getElementById('planet'),
      star: document.getElementById('star'),

      // Foci and apsides
      fociGroup: document.getElementById('foci-group'),
      focus1: document.getElementById('focus-1'),
      focus2: document.getElementById('focus-2'),
      focus1Label: document.getElementById('focus-1-label'),
      apsidesGroup: document.getElementById('apsides-group'),
      perihelionMarker: document.getElementById('perihelion-marker'),
      perihelionLabel: document.getElementById('perihelion-label'),
      aphelionMarker: document.getElementById('aphelion-marker'),
      aphelionLabel: document.getElementById('aphelion-label'),

      // Overlays
      equalAreasGroup: document.getElementById('equal-areas-group'),
      equalAreasWedge: document.getElementById('equal-areas-wedge'),
      velocityVector: document.getElementById('velocity-vector'),
      velocityLine: document.getElementById('velocity-line'),
      forceVector: document.getElementById('force-vector'),
      forceLine: document.getElementById('force-line'),

      // Distance line
      distanceLine: document.getElementById('distance-line'),
      distanceText: document.getElementById('distance-text'),

      // Mode buttons
      btnKeplerMode: document.getElementById('btn-kepler-mode'),
      btnNewtonMode: document.getElementById('btn-newton-mode'),

      // Unit buttons
      btnUnit101: document.getElementById('btn-unit-101'),
      btnUnit201: document.getElementById('btn-unit-201'),

      // Readouts
      distanceValue: document.getElementById('distance-value'),
      velocityValue: document.getElementById('velocity-value'),
      velocityUnit: document.getElementById('velocity-unit'),
      accelValue: document.getElementById('accel-value'),
      accelUnit: document.getElementById('accel-unit'),
      periodValue: document.getElementById('period-value'),

      // Timeline
      timelineTrack: document.getElementById('timeline-track'),
      timelineProgress: document.getElementById('timeline-progress'),
      timelineHandle: document.getElementById('timeline-handle'),
      phaseDisplay: document.getElementById('phase-display'),

      // Animation controls
      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnReset: document.getElementById('btn-reset'),
      speedSelect: document.getElementById('speed-select'),

      // Sliders
      aSlider: document.getElementById('a-slider'),
      aDisplay: document.getElementById('a-display'),
      eSlider: document.getElementById('e-slider'),
      eDisplay: document.getElementById('e-display'),
      massSlider: document.getElementById('mass-slider'),
      massDisplay: document.getElementById('mass-display'),
      massControl: document.getElementById('mass-control'),

      // Presets
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Overlay toggles
      toggleFoci: document.getElementById('toggle-foci'),
      toggleApsides: document.getElementById('toggle-apsides'),
      toggleEqualAreas: document.getElementById('toggle-equal-areas'),
      toggleVectors: document.getElementById('toggle-vectors'),

      // Insight box
      insightBox: document.getElementById('insight-box'),
      newtonValues: document.getElementById('newton-values'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // Physics Calculations
  // ============================================

  /**
   * Calculate orbital radius from true anomaly
   * r = a(1 - e²) / (1 + e⋅cos(θ))
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @param {number} theta - True anomaly (radians)
   * @returns {number} Orbital radius (AU)
   */
  function orbitalRadius(a, e, theta) {
    if (e === 0) return a;
    return a * (1 - e * e) / (1 + e * Math.cos(theta));
  }

  /**
   * Calculate orbital velocity using vis-viva equation
   * v = √(GM(2/r - 1/a))
   * @param {number} a - Semi-major axis (AU)
   * @param {number} r - Current radius (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Velocity (km/s)
   */
  function orbitalVelocity(a, r, M) {
    // GM in km³/s² for M☉ at 1 AU
    const GM_km3_s2 = 1.327e11 * M;  // GM_sun = 1.327e11 km³/s²
    const a_km = a * AU_KM;
    const r_km = r * AU_KM;
    const v_kms = Math.sqrt(GM_km3_s2 * (2 / r_km - 1 / a_km));
    return v_kms;
  }

  /**
   * Calculate orbital period
   * P = 2π√(a³/GM) — simplifies to P² = a³ for M = 1 M☉
   * @param {number} a - Semi-major axis (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Period (years)
   */
  function orbitalPeriod(a, M) {
    // P² = a³/M for M in solar masses, a in AU, P in years
    return Math.sqrt(a * a * a / M);
  }

  /**
   * Calculate gravitational acceleration
   * a = GM/r²
   * @param {number} r - Distance (AU)
   * @param {number} M - Star mass (M☉)
   * @returns {number} Acceleration (m/s²)
   */
  function gravitationalAccel(r, M) {
    // GM in m³/s² for calculations
    const GM_m3_s2 = 1.327e20 * M;  // GM_sun in m³/s²
    const r_m = r * AU_M;
    return GM_m3_s2 / (r_m * r_m);
  }

  /**
   * Calculate focus offset (c = ae)
   * @param {number} a - Semi-major axis
   * @param {number} e - Eccentricity
   * @returns {number} Distance from center to focus
   */
  function focusOffset(a, e) {
    return a * e;
  }

  /**
   * Calculate semi-minor axis
   * b = a√(1 - e²)
   * @param {number} a - Semi-major axis
   * @param {number} e - Eccentricity
   * @returns {number} Semi-minor axis
   */
  function semiMinorAxis(a, e) {
    return a * Math.sqrt(1 - e * e);
  }

  /**
   * Calculate perihelion distance
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @returns {number} Perihelion distance (AU)
   */
  function perihelion(a, e) {
    return a * (1 - e);
  }

  /**
   * Calculate aphelion distance
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity
   * @returns {number} Aphelion distance (AU)
   */
  function aphelion(a, e) {
    return a * (1 + e);
  }

  /**
   * Convert true anomaly to mean anomaly (for time calculations)
   * @param {number} theta - True anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} Mean anomaly (radians)
   */
  function trueToMeanAnomaly(theta, e) {
    // Eccentric anomaly: tan(E/2) = √((1-e)/(1+e)) × tan(θ/2)
    const tanHalfTheta = Math.tan(theta / 2);
    const factor = Math.sqrt((1 - e) / (1 + e));
    const E = 2 * Math.atan(factor * tanHalfTheta);
    // Mean anomaly: M = E - e⋅sin(E)
    return E - e * Math.sin(E);
  }

  /**
   * Convert mean anomaly to true anomaly (Kepler's equation)
   * Uses Newton-Raphson iteration
   * @param {number} M - Mean anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} True anomaly (radians)
   */
  function meanToTrueAnomaly(M, e) {
    // Solve Kepler's equation: M = E - e⋅sin(E)
    let E = M;  // Initial guess
    for (let i = 0; i < 10; i++) {
      const dE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
      E += dE;
      if (Math.abs(dE) < 1e-10) break;
    }
    // True anomaly: tan(θ/2) = √((1+e)/(1-e)) × tan(E/2)
    const factor = Math.sqrt((1 + e) / (1 - e));
    return 2 * Math.atan(factor * Math.tan(E / 2));
  }

  /**
   * Calculate velocity direction angle (perpendicular to radius + flight path angle)
   * @param {number} theta - True anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} Velocity direction angle (radians)
   */
  function velocityAngle(theta, e) {
    // Flight path angle: γ = atan(e⋅sin(θ) / (1 + e⋅cos(θ)))
    const gamma = Math.atan2(e * Math.sin(theta), 1 + e * Math.cos(theta));
    // Velocity is perpendicular to radius + flight path angle
    return theta + Math.PI / 2 + gamma;
  }

  // ============================================
  // Rendering
  // ============================================

  /**
   * Convert orbital coordinates to SVG coordinates
   * Origin at star, x points right, y points up in orbital plane
   */
  function orbitalToSvg(r, theta) {
    // Calculate focus offset for star position
    const c = focusOffset(state.a, state.e);
    // Scale factor: shrink large orbits, expand small ones
    const scale = SVG_SCALE / Math.max(state.a, 1);

    // Orbital position relative to ellipse center
    const x_orb = r * Math.cos(theta);
    const y_orb = r * Math.sin(theta);

    // SVG coordinates (star at focus, which is offset from center)
    return {
      x: SVG_CENTER.x + (x_orb) * scale,
      y: SVG_CENTER.y - (y_orb) * scale  // Flip y for SVG
    };
  }

  /**
   * Update the orbit ellipse path
   */
  function updateOrbitPath() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const rx = state.a * scale;
    const ry = semiMinorAxis(state.a, state.e) * scale;
    const c = focusOffset(state.a, state.e) * scale;

    // Ellipse centered so star is at left focus
    elements.orbitPath.setAttribute('cx', SVG_CENTER.x + c);
    elements.orbitPath.setAttribute('cy', SVG_CENTER.y);
    elements.orbitPath.setAttribute('rx', rx);
    elements.orbitPath.setAttribute('ry', ry);
  }

  /**
   * Update planet position
   */
  function updatePlanetPosition() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);

    elements.planet.setAttribute('cx', pos.x);
    elements.planet.setAttribute('cy', pos.y);
  }

  /**
   * Update foci markers
   */
  function updateFociMarkers() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const c = focusOffset(state.a, state.e) * scale;

    // Star at focus 1 (left focus for our orientation)
    elements.star.setAttribute('cx', SVG_CENTER.x);
    elements.star.setAttribute('cy', SVG_CENTER.y);
    elements.focus1.setAttribute('cx', SVG_CENTER.x);
    elements.focus1.setAttribute('cy', SVG_CENTER.y);
    elements.focus1Label.setAttribute('x', SVG_CENTER.x);
    elements.focus1Label.setAttribute('y', SVG_CENTER.y + 35);

    // Focus 2 (empty focus, right side)
    elements.focus2.setAttribute('cx', SVG_CENTER.x + 2 * c);
    elements.focus2.setAttribute('cy', SVG_CENTER.y);

    elements.fociGroup.style.display = state.overlays.foci ? 'block' : 'none';
  }

  /**
   * Update apsides markers
   */
  function updateApsidesMarkers() {
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const c = focusOffset(state.a, state.e) * scale;
    const rx = state.a * scale;

    // Perihelion (closest, left side of ellipse, θ = 0)
    const periX = SVG_CENTER.x - (rx - c);
    elements.perihelionMarker.setAttribute('cx', periX);
    elements.perihelionMarker.setAttribute('cy', SVG_CENTER.y);
    elements.perihelionLabel.setAttribute('x', periX);
    elements.perihelionLabel.setAttribute('y', SVG_CENTER.y + 15);

    const periDist = perihelion(state.a, state.e);
    elements.perihelionLabel.textContent = `Perihelion (${periDist.toFixed(2)} AU)`;

    // Aphelion (farthest, right side, θ = π)
    const aphX = SVG_CENTER.x + (rx + c);
    elements.aphelionMarker.setAttribute('cx', aphX);
    elements.aphelionMarker.setAttribute('cy', SVG_CENTER.y);
    elements.aphelionLabel.setAttribute('x', aphX);
    elements.aphelionLabel.setAttribute('y', SVG_CENTER.y + 15);

    const aphDist = aphelion(state.a, state.e);
    elements.aphelionLabel.textContent = `Aphelion (${aphDist.toFixed(2)} AU)`;

    elements.apsidesGroup.style.display = state.overlays.apsides ? 'block' : 'none';
  }

  /**
   * Update distance line from star to planet
   */
  function updateDistanceLine() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);

    elements.distanceLine.setAttribute('x1', SVG_CENTER.x);
    elements.distanceLine.setAttribute('y1', SVG_CENTER.y);
    elements.distanceLine.setAttribute('x2', pos.x);
    elements.distanceLine.setAttribute('y2', pos.y);

    // Position label at midpoint
    const midX = (SVG_CENTER.x + pos.x) / 2;
    const midY = (SVG_CENTER.y + pos.y) / 2 - 10;
    elements.distanceText.setAttribute('x', midX);
    elements.distanceText.setAttribute('y', midY);
    elements.distanceText.textContent = `r = ${r.toFixed(2)} AU`;
  }

  /**
   * Update velocity and force vectors (Newton mode)
   */
  function updateVectors() {
    if (state.mode !== 'newton' || !state.overlays.vectors) {
      elements.velocityVector.style.display = 'none';
      elements.forceVector.style.display = 'none';
      return;
    }

    const r = orbitalRadius(state.a, state.e, state.theta);
    const pos = orbitalToSvg(r, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    const vAngle = velocityAngle(state.theta, state.e);

    // Scale vectors for visibility
    const vScale = 2;  // pixels per km/s
    const vLen = v * vScale;

    // Velocity vector (tangent to orbit)
    elements.velocityVector.style.display = 'block';
    elements.velocityLine.setAttribute('x1', pos.x);
    elements.velocityLine.setAttribute('y1', pos.y);
    elements.velocityLine.setAttribute('x2', pos.x + vLen * Math.cos(vAngle));
    elements.velocityLine.setAttribute('y2', pos.y - vLen * Math.sin(vAngle));

    // Force vector (toward star)
    const forceAngle = Math.atan2(SVG_CENTER.y - pos.y, SVG_CENTER.x - pos.x);
    const fLen = 40;  // Fixed length for visibility
    elements.forceVector.style.display = 'block';
    elements.forceLine.setAttribute('x1', pos.x);
    elements.forceLine.setAttribute('y1', pos.y);
    elements.forceLine.setAttribute('x2', pos.x + fLen * Math.cos(forceAngle));
    elements.forceLine.setAttribute('y2', pos.y + fLen * Math.sin(forceAngle));
  }

  /**
   * Update equal areas wedge visualization (Kepler's 2nd Law)
   * Shows that equal areas are swept in equal times
   */
  function updateEqualAreas() {
    if (!state.overlays.equalAreas) {
      elements.equalAreasGroup.style.display = 'none';
      return;
    }

    elements.equalAreasGroup.style.display = 'block';

    // Draw a wedge from a fixed time ago to current position
    const P = orbitalPeriod(state.a, state.M);
    const sweepTime = P * 0.1;  // 10% of orbit

    const currentM = trueToMeanAnomaly(state.theta, state.e);
    const startM = currentM - (sweepTime / P) * 2 * Math.PI;
    const startTheta = meanToTrueAnomaly(startM, state.e);

    // Build SVG path for wedge
    const scale = SVG_SCALE / Math.max(state.a, 1);
    const numPoints = 30;
    let pathD = `M ${SVG_CENTER.x} ${SVG_CENTER.y}`;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const theta = startTheta + t * (state.theta - startTheta);
      const r = orbitalRadius(state.a, state.e, theta);
      const pos = orbitalToSvg(r, theta);
      pathD += ` L ${pos.x} ${pos.y}`;
    }

    pathD += ' Z';
    elements.equalAreasWedge.setAttribute('d', pathD);
  }

  /**
   * Update readout displays
   */
  function updateReadouts() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    const acc = gravitationalAccel(r, state.M);
    const P = orbitalPeriod(state.a, state.M);

    elements.distanceValue.textContent = r.toFixed(2);
    elements.periodValue.textContent = P.toFixed(2);

    // Velocity and acceleration depend on unit mode
    if (state.units === '101') {
      elements.velocityValue.textContent = v.toFixed(1);
      elements.velocityUnit.textContent = 'km/s';

      // Convert m/s² to mm/s² for readability
      elements.accelValue.textContent = (acc * 1000).toFixed(2);
      elements.accelUnit.textContent = 'mm/s²';
    } else {
      // 201 mode: CGS
      elements.velocityValue.textContent = (v * 1e5).toExponential(2);
      elements.velocityUnit.textContent = 'cm/s';

      elements.accelValue.textContent = (acc * 100).toExponential(2);
      elements.accelUnit.textContent = 'cm/s²';
    }

    // Update Newton mode values in insight box
    if (state.mode === 'newton') {
      elements.newtonValues.innerHTML =
        `v = √(GM(2/r - 1/a)) = ${v.toFixed(1)} km/s<br>` +
        `a = GM/r² = ${(acc * 1000).toFixed(2)} mm/s²`;
    }
  }

  /**
   * Update timeline display
   */
  function updateTimeline() {
    const P = orbitalPeriod(state.a, state.M);
    const fraction = (state.t % P) / P;

    elements.timelineProgress.style.width = `${fraction * 100}%`;
    elements.timelineHandle.style.left = `${fraction * 100}%`;
    elements.phaseDisplay.textContent = `${state.t.toFixed(2)} / ${P.toFixed(2)} yr`;
  }

  /**
   * Update slider displays
   */
  function updateSliderDisplays() {
    elements.aDisplay.textContent = `${state.a.toFixed(2)} AU`;
    elements.eDisplay.textContent = state.e.toFixed(3);
    elements.massDisplay.textContent = `${state.M.toFixed(1)} M☉`;
  }

  /**
   * Main update function
   */
  function update() {
    updateOrbitPath();
    updatePlanetPosition();
    updateFociMarkers();
    updateApsidesMarkers();
    updateDistanceLine();
    updateVectors();
    updateEqualAreas();
    updateReadouts();
    updateTimeline();
    updateSliderDisplays();
  }

  // ============================================
  // Controls
  // ============================================

  /**
   * Convert slider value (0-1000) to logarithmic actual value
   */
  function logSliderToValue(sliderVal, min, max) {
    const minLog = Math.log10(min);
    const maxLog = Math.log10(max);
    const fraction = sliderVal / 1000;
    return Math.pow(10, minLog + fraction * (maxLog - minLog));
  }

  /**
   * Convert actual value to slider position (0-1000)
   */
  function valueToLogSlider(value, min, max) {
    const minLog = Math.log10(min);
    const maxLog = Math.log10(max);
    const logVal = Math.log10(value);
    return Math.round(((logVal - minLog) / (maxLog - minLog)) * 1000);
  }

  /**
   * Setup orbital parameter sliders
   */
  function setupSliders() {
    // Semi-major axis (logarithmic)
    elements.aSlider.addEventListener('input', () => {
      state.a = logSliderToValue(parseFloat(elements.aSlider.value), A_MIN, A_MAX);
      clearPresetHighlight();
      update();
    });

    // Eccentricity (linear, 0-990 maps to 0-0.99)
    elements.eSlider.addEventListener('input', () => {
      state.e = parseFloat(elements.eSlider.value) / 1000;
      clearPresetHighlight();
      update();
    });

    // Star mass (linear in Newton mode)
    elements.massSlider.addEventListener('input', () => {
      state.M = parseFloat(elements.massSlider.value) / 100;
      update();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    elements.presetButtons.forEach(btn => btn.classList.remove('active'));
  }

  /**
   * Setup preset buttons
   */
  function setupPresets() {
    elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const a = parseFloat(btn.dataset.a);
        const e = parseFloat(btn.dataset.e);

        state.a = a;
        state.e = e;
        state.theta = 0;  // Reset to perihelion
        state.t = 0;

        // Update sliders to match
        elements.aSlider.value = valueToLogSlider(a, A_MIN, A_MAX);
        elements.eSlider.value = Math.round(e * 1000);

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        update();
      });
    });
  }

  /**
   * Setup overlay toggles
   */
  function setupOverlays() {
    elements.toggleFoci.addEventListener('change', () => {
      state.overlays.foci = elements.toggleFoci.checked;
      update();
    });

    elements.toggleApsides.addEventListener('change', () => {
      state.overlays.apsides = elements.toggleApsides.checked;
      update();
    });

    elements.toggleEqualAreas.addEventListener('change', () => {
      state.overlays.equalAreas = elements.toggleEqualAreas.checked;
      elements.equalAreasGroup.style.display = state.overlays.equalAreas ? 'block' : 'none';
      update();
    });

    elements.toggleVectors.addEventListener('change', () => {
      state.overlays.vectors = elements.toggleVectors.checked;
      update();
    });
  }

  /**
   * Setup mode toggle (Kepler/Newton)
   */
  function setupModeToggle() {
    elements.btnKeplerMode.addEventListener('click', () => {
      state.mode = 'kepler';
      elements.btnKeplerMode.classList.add('active');
      elements.btnNewtonMode.classList.remove('active');

      // Hide Newton-only elements
      elements.massControl.style.display = 'none';
      elements.toggleVectors.parentElement.style.display = 'none';
      document.body.classList.remove('newton-mode');

      // Update insight box
      elements.insightBox.classList.add('kepler-mode');
      elements.insightBox.classList.remove('newton-mode');
      elements.insightBox.querySelector('.kepler-content').style.display = 'block';
      elements.insightBox.querySelector('.newton-content').style.display = 'none';

      update();
    });

    elements.btnNewtonMode.addEventListener('click', () => {
      state.mode = 'newton';
      elements.btnNewtonMode.classList.add('active');
      elements.btnKeplerMode.classList.remove('active');

      // Show Newton-only elements
      elements.massControl.style.display = 'block';
      elements.toggleVectors.parentElement.style.display = 'flex';
      document.body.classList.add('newton-mode');

      // Update insight box
      elements.insightBox.classList.remove('kepler-mode');
      elements.insightBox.classList.add('newton-mode');
      elements.insightBox.querySelector('.kepler-content').style.display = 'none';
      elements.insightBox.querySelector('.newton-content').style.display = 'block';

      update();
    });
  }

  /**
   * Setup unit toggle (101/201)
   */
  function setupUnitToggle() {
    elements.btnUnit101.addEventListener('click', () => {
      state.units = '101';
      elements.btnUnit101.classList.add('active');
      elements.btnUnit201.classList.remove('active');
      update();
    });

    elements.btnUnit201.addEventListener('click', () => {
      state.units = '201';
      elements.btnUnit201.classList.add('active');
      elements.btnUnit101.classList.remove('active');
      update();
    });
  }

  /**
   * Setup animation controls
   */
  function setupAnimation() {
    elements.btnPlay.addEventListener('click', startAnimation);
    elements.btnPause.addEventListener('click', stopAnimation);
    elements.btnReset.addEventListener('click', resetAnimation);

    elements.speedSelect.addEventListener('change', () => {
      state.speed = parseFloat(elements.speedSelect.value);
    });
  }

  /**
   * Start orbital animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    let lastTime = performance.now();

    function animate(currentTime) {
      if (!state.playing) return;

      const dt = (currentTime - lastTime) / 1000;  // seconds
      lastTime = currentTime;

      // Advance time
      const P = orbitalPeriod(state.a, state.M);
      state.t += dt * state.speed;

      // Convert time to mean anomaly, then to true anomaly
      const meanAnomaly = (2 * Math.PI * state.t / P) % (2 * Math.PI);
      state.theta = meanToTrueAnomaly(meanAnomaly, state.e);

      update();

      state.animationId = requestAnimationFrame(animate);
    }

    state.animationId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   */
  function stopAnimation() {
    state.playing = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    elements.btnPlay.disabled = false;
    elements.btnPause.disabled = true;
  }

  /**
   * Reset to perihelion
   */
  function resetAnimation() {
    stopAnimation();
    state.theta = 0;
    state.t = 0;
    update();
  }

  /**
   * Setup planet drag interaction
   */
  function setupPlanetDrag() {
    let isDragging = false;

    function getAngleFromEvent(event) {
      const svg = elements.orbitSvg;
      const pt = svg.createSVGPoint();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

      // Angle from star to cursor
      return Math.atan2(SVG_CENTER.y - svgP.y, svgP.x - SVG_CENTER.x);
    }

    elements.planetGroup.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    elements.planetGroup.addEventListener('touchstart', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      state.theta = getAngleFromEvent(e);
      // Update time to match position
      const P = orbitalPeriod(state.a, state.M);
      const M = trueToMeanAnomaly(state.theta, state.e);
      state.t = (M / (2 * Math.PI)) * P;
      if (state.t < 0) state.t += P;
      update();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      state.theta = getAngleFromEvent(e);
      const P = orbitalPeriod(state.a, state.M);
      const M = trueToMeanAnomaly(state.theta, state.e);
      state.t = (M / (2 * Math.PI)) * P;
      if (state.t < 0) state.t += P;
      update();
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  /**
   * Setup timeline scrubbing
   */
  function setupTimeline() {
    let isDragging = false;

    function updateFromPosition(clientX) {
      const rect = elements.timelineTrack.getBoundingClientRect();
      let fraction = (clientX - rect.left) / rect.width;
      fraction = Math.max(0, Math.min(1, fraction));

      const P = orbitalPeriod(state.a, state.M);
      state.t = fraction * P;
      const meanAnomaly = 2 * Math.PI * fraction;
      state.theta = meanToTrueAnomaly(meanAnomaly, state.e);
      update();
    }

    elements.timelineTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      updateFromPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateFromPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    // Planet group keyboard controls
    elements.planetGroup.addEventListener('keydown', (event) => {
      const P = orbitalPeriod(state.a, state.M);
      let delta = 0;
      let jumpAngle = null;

      switch (event.key) {
        case 'ArrowLeft':
          delta = event.shiftKey ? -0.01 : -0.05;
          break;
        case 'ArrowRight':
          delta = event.shiftKey ? 0.01 : 0.05;
          break;
        case 'Home':
          jumpAngle = 0;  // Perihelion
          break;
        case 'End':
          jumpAngle = Math.PI;  // Aphelion
          break;
        case ' ':
          event.preventDefault();
          if (state.playing) {
            stopAnimation();
          } else {
            startAnimation();
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      stopAnimation();

      if (jumpAngle !== null) {
        state.theta = jumpAngle;
        const M = trueToMeanAnomaly(state.theta, state.e);
        state.t = ((M + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * P;
      } else if (delta !== 0) {
        // Convert current position to mean anomaly, adjust, convert back
        const M = trueToMeanAnomaly(state.theta, state.e);
        const newM = (M + delta * 2 * Math.PI + 2 * Math.PI) % (2 * Math.PI);
        state.theta = meanToTrueAnomaly(newM, state.e);
        state.t = newM / (2 * Math.PI) * P;
      }

      update();
      announcePosition();
    });

    // Focus styling
    elements.planetGroup.addEventListener('focus', () => {
      elements.planet.setAttribute('stroke', 'var(--accent-gold)');
      elements.planet.setAttribute('stroke-width', '3');
    });

    elements.planetGroup.addEventListener('blur', () => {
      elements.planet.removeAttribute('stroke');
      elements.planet.removeAttribute('stroke-width');
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case 'k':
        case 'K':
          elements.btnKeplerMode.click();
          break;
        case 'n':
        case 'N':
          elements.btnNewtonMode.click();
          break;
        case '1':
          selectPresetByIndex(0);
          break;
        case '2':
          selectPresetByIndex(1);
          break;
        case '3':
          selectPresetByIndex(2);
          break;
        case '4':
          selectPresetByIndex(3);
          break;
        case '5':
          selectPresetByIndex(4);
          break;
        case '6':
          selectPresetByIndex(5);
          break;
      }
    });
  }

  function selectPresetByIndex(index) {
    const presets = Array.from(elements.presetButtons);
    if (index < presets.length) {
      presets[index].click();
    }
  }

  function announcePosition() {
    const r = orbitalRadius(state.a, state.e, state.theta);
    const v = orbitalVelocity(state.a, r, state.M);
    // Normalize theta to [0, 2*PI) to avoid negative percentages
    const normalizedTheta = ((state.theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const phasePct = ((normalizedTheta / (2 * Math.PI)) * 100).toFixed(0);

    let position = 'orbit';
    if (Math.abs(state.theta) < 0.1) position = 'perihelion';
    else if (Math.abs(state.theta - Math.PI) < 0.1) position = 'aphelion';

    elements.statusAnnounce.textContent =
      `${position}, distance ${r.toFixed(2)} AU, velocity ${v.toFixed(1)} km/s, ${phasePct}% through orbit`;

    // Update ARIA attributes
    elements.planetGroup.setAttribute('aria-valuenow', Math.round(state.theta * 180 / Math.PI));
    elements.planetGroup.setAttribute('aria-valuetext',
      `${position}, ${r.toFixed(2)} AU from star`);
  }

  // ============================================
  // Physics Validation
  // ============================================

  /**
   * Validate physics calculations against known values
   * Uncomment the call in init() for debugging
   */
  function validatePhysics() {
    console.log('=== Physics Validation ===');

    // Earth: P = 1 year, v = 29.78 km/s, a = 5.93 mm/s²
    const earthP = orbitalPeriod(1.0, 1.0);
    const earthV = orbitalVelocity(1.0, 1.0, 1.0);
    const earthA = gravitationalAccel(1.0, 1.0);
    console.log(`Earth (a=1AU, M=1M☉):`);
    console.log(`  Period: ${earthP.toFixed(4)} yr (expected: 1.0000)`);
    console.log(`  Velocity: ${earthV.toFixed(2)} km/s (expected: 29.78)`);
    console.log(`  Accel: ${(earthA*1000).toFixed(2)} mm/s² (expected: 5.93)`);

    // Jupiter: P = 11.86 years
    const jupP = orbitalPeriod(5.203, 1.0);
    console.log(`Jupiter (a=5.203AU): Period = ${jupP.toFixed(2)} yr (expected: 11.86)`);

    // Kepler's 3rd Law: P² = a³
    const p2 = earthP * earthP;
    const a3 = 1.0 * 1.0 * 1.0;
    console.log(`Kepler 3rd Law: P²=${p2.toFixed(4)}, a³=${a3.toFixed(4)} (should match)`);

    console.log('=========================');
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupSliders();
    setupPresets();
    setupOverlays();
    setupModeToggle();
    setupUnitToggle();
    setupAnimation();
    setupPlanetDrag();
    setupTimeline();
    setupKeyboard();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    update();
    console.log('Kepler\'s Laws Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
