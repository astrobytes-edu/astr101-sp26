/**
 * Stellar Parallax Sandbox
 * Interactive demonstration of stellar parallax distance measurement
 *
 * Physics:
 * - Parallax angle p (arcsec) = 1 / d (pc)
 * - Star appears to shift OPPOSITE to Earth's motion
 * - Maximum baseline: 2 AU (January to July)
 * - 1 parsec = distance where 1 AU baseline subtends 1 arcsecond
 *
 * Key insight: The closer a star, the larger its parallax shift
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  // Canvas sizing
  const OBSERVER_CANVAS_PADDING = 40;
  const TOPDOWN_CANVAS_PADDING = 50;

  // Animation
  const YEAR_DURATION_MS = 10000;  // 10 seconds per orbit

  // Visual scaling
  const BACKGROUND_STAR_COUNT = 80;
  const MAX_VISUAL_SHIFT_PX = 80;  // Max pixel shift for nearby star display

  // Month names for display
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ============================================
  // State
  // ============================================

  const state = {
    // Distance and parallax
    distance_pc: 1.30,       // parsecs (default: Proxima Centauri)
    parallax_arcsec: 0.768,  // arcseconds

    // Animation
    yearFraction: 0,         // 0 = January, 0.5 = July, 1 = next January
    playing: false,
    animationId: null,
    lastTime: null,

    // Settings
    precision: 'gaia',       // 'hipparcos' | 'gaia'
    currentPreset: null,

    // Background stars (generated once)
    backgroundStars: [],

    // Canvas contexts
    observerCtx: null,
    topdownCtx: null,

    // Canvas dimensions
    observerCanvas: null,
    topdownCanvas: null
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // Canvases
      observerCanvas: document.getElementById('observer-canvas'),
      topdownCanvas: document.getElementById('topdown-canvas'),

      // Readouts
      distancePc: document.getElementById('distance-pc'),
      distanceLy: document.getElementById('distance-ly'),
      parallaxValue: document.getElementById('parallax-value'),
      parallaxUnit: document.getElementById('parallax-unit'),
      measurableIcon: document.getElementById('measurable-icon'),
      measurableStatus: document.getElementById('measurable-status'),

      // Animation controls
      btnPlayYear: document.getElementById('btn-play-year'),
      btnPause: document.getElementById('btn-pause'),
      btnJan: document.getElementById('btn-jan'),
      btnJuly: document.getElementById('btn-july'),
      btnReset: document.getElementById('btn-reset'),
      monthDisplay: document.getElementById('month-display'),

      // Distance control
      distanceSlider: document.getElementById('distance-slider'),
      distanceDisplay: document.getElementById('distance-display'),

      // Precision buttons
      btnHipparcos: document.getElementById('btn-hipparcos'),
      btnGaia: document.getElementById('btn-gaia'),

      // Preset containers
      nearbyPresets: document.getElementById('nearby-presets'),
      distantPresets: document.getElementById('distant-presets'),

      // Insight box
      insightBox: document.getElementById('insight-box'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };

    // Store canvas references in state
    state.observerCanvas = elements.observerCanvas;
    state.topdownCanvas = elements.topdownCanvas;
    state.observerCtx = elements.observerCanvas.getContext('2d');
    state.topdownCtx = elements.topdownCanvas.getContext('2d');
  }

  // ============================================
  // Physics Functions
  // ============================================

  /**
   * Calculate parallax angle from distance
   * p (arcsec) = 1 / d (pc)
   */
  function parallaxFromDistance(d_pc) {
    if (d_pc <= 0) return null;
    return 1 / d_pc;
  }

  /**
   * Calculate distance from parallax
   * d (pc) = 1 / p (arcsec)
   */
  function distanceFromParallax(p_arcsec) {
    if (p_arcsec <= 0) return null;
    return 1 / p_arcsec;
  }

  /**
   * Calculate Earth's position on orbit
   * Returns { x, y } in AU, with Sun at origin
   * January (yearFraction=0): Earth at +1 AU on x-axis
   * July (yearFraction=0.5): Earth at -1 AU on x-axis
   */
  function earthPosition(yearFraction) {
    // Angle in radians (0 = positive x-axis = January)
    const angle = yearFraction * 2 * Math.PI;
    return {
      x: Math.cos(angle),  // AU
      y: Math.sin(angle)   // AU
    };
  }

  /**
   * Calculate apparent parallax shift of nearby star
   * Returns shift in arcseconds (positive = shift right, negative = shift left)
   *
   * The star appears to shift OPPOSITE to Earth's motion
   * When Earth is at +x (Jan), star appears shifted to -x (left)
   * When Earth is at -x (July), star appears shifted to +x (right)
   */
  function apparentShift(yearFraction, parallax_arcsec) {
    if (!parallax_arcsec) return 0;
    const earthPos = earthPosition(yearFraction);
    // Shift is opposite to Earth position, scaled by parallax
    // Maximum shift is exactly the parallax angle when at Jan or July
    return -earthPos.x * parallax_arcsec;
  }

  // ============================================
  // Rendering - Observer View (Left Panel)
  // ============================================

  /**
   * Generate random background stars (fixed positions)
   */
  function generateBackgroundStars() {
    state.backgroundStars = [];
    for (let i = 0; i < BACKGROUND_STAR_COUNT; i++) {
      state.backgroundStars.push({
        x: Math.random(),  // Normalized position 0-1
        y: Math.random(),
        size: 0.5 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.5
      });
    }
  }

  /**
   * Draw the observer's view (star field)
   */
  function drawObserverView() {
    const canvas = state.observerCanvas;
    const ctx = state.observerCtx;
    const rect = canvas.getBoundingClientRect();

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with dark space background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);

    // Draw background stars (distant, no parallax shift)
    ctx.fillStyle = '#ffffff';
    state.backgroundStars.forEach(star => {
      const x = star.x * width;
      const y = star.y * height;
      ctx.globalAlpha = star.brightness;
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Calculate nearby star's apparent position
    const shift = apparentShift(state.yearFraction, state.parallax_arcsec);

    // Convert parallax shift to pixel shift
    // Scale: nearby stars (large parallax) should show visible shift
    // Distant stars (small parallax) show minimal shift
    const maxParallax = 1;  // 1 arcsec = 1 pc
    const shiftNormalized = shift / maxParallax;
    const shiftPx = shiftNormalized * MAX_VISUAL_SHIFT_PX;

    const nearbyStarX = centerX + shiftPx;
    const nearbyStarY = centerY;

    // Draw the nearby target star (larger, colored)
    // Glow effect
    const gradient = ctx.createRadialGradient(
      nearbyStarX, nearbyStarY, 0,
      nearbyStarX, nearbyStarY, 20
    );
    gradient.addColorStop(0, 'rgba(244, 208, 63, 0.8)');
    gradient.addColorStop(0.3, 'rgba(244, 208, 63, 0.3)');
    gradient.addColorStop(1, 'rgba(244, 208, 63, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(nearbyStarX, nearbyStarY, 20, 0, Math.PI * 2);
    ctx.fill();

    // Star core
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.arc(nearbyStarX, nearbyStarY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw crosshair reference (fixed)
    ctx.strokeStyle = 'rgba(93, 173, 226, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(centerX - 60, centerY);
    ctx.lineTo(centerX + 60, centerY);
    ctx.stroke();

    // Vertical ticks showing parallax range
    if (state.parallax_arcsec && state.parallax_arcsec > 0.001) {
      const tickShift = (state.parallax_arcsec / maxParallax) * MAX_VISUAL_SHIFT_PX;
      ctx.strokeStyle = 'rgba(93, 173, 226, 0.6)';
      ctx.setLineDash([]);

      // Left tick (July position)
      ctx.beginPath();
      ctx.moveTo(centerX - tickShift, centerY - 15);
      ctx.lineTo(centerX - tickShift, centerY + 15);
      ctx.stroke();

      // Right tick (January position)
      ctx.beginPath();
      ctx.moveTo(centerX + tickShift, centerY - 15);
      ctx.lineTo(centerX + tickShift, centerY + 15);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Label showing shift direction
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('Target Star', nearbyStarX, nearbyStarY + 30);

    // Show current shift
    if (Math.abs(shiftPx) > 1) {
      const direction = shiftPx > 0 ? 'Right' : 'Left';
      ctx.fillStyle = 'rgba(244, 208, 63, 0.8)';
      ctx.fillText(`Shifted ${direction}`, nearbyStarX, nearbyStarY + 45);
    }

    // Month indicator
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#5dade2';
    ctx.textAlign = 'left';
    ctx.fillText(MONTHS[Math.floor(state.yearFraction * 12) % 12], 15, 25);
  }

  // ============================================
  // Rendering - Top-Down View (Right Panel)
  // ============================================

  /**
   * Draw the top-down solar system view
   */
  function drawTopDownView() {
    const canvas = state.topdownCanvas;
    const ctx = state.topdownCtx;
    const rect = canvas.getBoundingClientRect();

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with dark space background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, width, height);

    // Calculate scale: Earth orbit should be visible
    const orbitRadius = Math.min(width, height) / 2 - TOPDOWN_CANVAS_PADDING;

    // Draw Earth's full orbit
    ctx.strokeStyle = 'rgba(93, 173, 226, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw orbit label
    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(93, 173, 226, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText("Earth's Orbit (1 AU radius)", centerX, centerY + orbitRadius + 15);

    // Draw Sun at center
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15);
    sunGradient.addColorStop(0, '#fff5cc');
    sunGradient.addColorStop(0.7, '#ffcc00');
    sunGradient.addColorStop(1, '#ff8c00');
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Sun glow
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'center';
    ctx.fillText('Sun', centerX, centerY + 25);

    // Calculate Earth position
    const earthPos = earthPosition(state.yearFraction);
    const earthX = centerX + earthPos.x * orbitRadius;
    const earthY = centerY - earthPos.y * orbitRadius;  // Flip y for canvas

    // Draw Earth
    const earthGradient = ctx.createRadialGradient(earthX, earthY, 0, earthX, earthY, 8);
    earthGradient.addColorStop(0, '#7ec8e3');
    earthGradient.addColorStop(1, '#4a90d9');
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#5dade2';
    ctx.textAlign = 'center';
    ctx.fillText('Earth', earthX, earthY + 18);

    // Draw January and July positions (baseline markers)
    const janX = centerX + orbitRadius;
    const janY = centerY;
    const julyX = centerX - orbitRadius;
    const julyY = centerY;

    ctx.fillStyle = 'rgba(244, 208, 63, 0.5)';
    ctx.beginPath();
    ctx.arc(janX, janY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('Jan', janX + 12, janY + 4);

    ctx.beginPath();
    ctx.arc(julyX, julyY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('July', julyX - 15, julyY + 4);

    // Draw baseline (2 AU line between Jan and July positions)
    ctx.strokeStyle = 'rgba(244, 208, 63, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(janX, janY);
    ctx.lineTo(julyX, julyY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Baseline label
    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(244, 208, 63, 0.7)';
    ctx.fillText('2 AU baseline', centerX, centerY + 8);

    // Draw direction to distant star (arrow pointing up)
    const starDirection = Math.PI / 2;  // Pointing up
    const arrowLength = 60;
    const arrowStartY = centerY - orbitRadius - 25;

    // Sightlines from Earth to star
    ctx.strokeStyle = 'rgba(236, 112, 99, 0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    // Line from Earth's current position toward star
    ctx.beginPath();
    ctx.moveTo(earthX, earthY);
    ctx.lineTo(earthX, 10);
    ctx.stroke();

    // Draw parallax angle visualization
    if (state.parallax_arcsec && state.parallax_arcsec > 0.0001) {
      // Draw sightlines from Jan and July
      ctx.strokeStyle = 'rgba(244, 208, 63, 0.4)';
      ctx.beginPath();
      ctx.moveTo(janX, janY);
      ctx.lineTo(centerX + 5, 10);  // Slight convergence
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(julyX, julyY);
      ctx.lineTo(centerX - 5, 10);  // Slight convergence
      ctx.stroke();

      // Parallax angle arc
      const angleDisplayRadius = 40;
      const parallaxRadians = state.parallax_arcsec * (Math.PI / 648000);  // arcsec to radians
      const visualAngle = Math.min(parallaxRadians * 1e6, Math.PI / 6);  // Exaggerate for visibility

      ctx.strokeStyle = 'rgba(244, 208, 63, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(centerX, 25, angleDisplayRadius, Math.PI/2 - visualAngle/2, Math.PI/2 + visualAngle/2);
      ctx.stroke();

      // Angle label
      const formatted = STAR_DATA.formatParallax(state.parallax_arcsec);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#f4d03f';
      ctx.textAlign = 'center';
      ctx.fillText(`p = ${formatted.value} ${formatted.unit}`, centerX, 15);
    }

    ctx.setLineDash([]);

    // Draw distant star indicator at top
    ctx.fillStyle = '#f4d03f';
    ctx.beginPath();
    ctx.arc(centerX, 35, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#f4d03f';
    ctx.textAlign = 'center';
    ctx.fillText('To Star', centerX, 55);

    // Distance indicator
    const distFormatted = STAR_DATA.formatDistance(state.distance_pc);
    ctx.fillText(`d = ${distFormatted.value} ${distFormatted.unit}`, centerX, 68);

    // Scale bar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width - 70, height - 20);
    ctx.lineTo(width - 20, height - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 70, height - 25);
    ctx.lineTo(width - 70, height - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 20, height - 25);
    ctx.lineTo(width - 20, height - 15);
    ctx.stroke();

    ctx.font = '9px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('1 AU', width - 45, height - 8);
  }

  // ============================================
  // Update Functions
  // ============================================

  /**
   * Update all readout displays
   */
  function updateReadouts() {
    // Distance in parsecs
    elements.distancePc.textContent = state.distance_pc < 1000
      ? state.distance_pc.toPrecision(3)
      : state.distance_pc.toExponential(2);

    // Distance in light-years
    const d_ly = state.distance_pc * STAR_DATA.PC_TO_LY;
    elements.distanceLy.textContent = d_ly < 1000
      ? d_ly.toPrecision(3)
      : d_ly.toExponential(2);

    // Parallax
    const formatted = STAR_DATA.formatParallax(state.parallax_arcsec);
    elements.parallaxValue.textContent = formatted.value;
    elements.parallaxUnit.textContent = formatted.unit;

    // Measurability
    const measurability = STAR_DATA.getMeasurability(state.parallax_arcsec, state.precision);
    elements.measurableIcon.textContent = measurability.measurable ? 'Yes' : 'No';
    elements.measurableStatus.textContent = measurability.status;

    // Update status class
    elements.measurableStatus.className = 'readout-status';
    if (measurability.class === 'easy') {
      elements.measurableStatus.classList.add('status-measurable');
    } else if (measurability.class === 'yes' || measurability.class === 'limit') {
      elements.measurableStatus.classList.add('status-limit');
    } else {
      elements.measurableStatus.classList.add('status-impossible');
    }

    // Distance slider display
    elements.distanceDisplay.textContent = state.distance_pc < 100
      ? `${state.distance_pc.toFixed(2)} pc`
      : `${state.distance_pc.toFixed(0)} pc`;

    // Month display
    elements.monthDisplay.textContent = MONTHS[Math.floor(state.yearFraction * 12) % 12];
  }

  /**
   * Update insight box based on current state
   */
  function updateInsightBox() {
    const measurability = STAR_DATA.getMeasurability(state.parallax_arcsec, state.precision);

    let title, content;

    if (!measurability.measurable) {
      title = 'Beyond Parallax Limits';
      content = `<p>At ${state.distance_pc.toFixed(0)} pc, the parallax angle is far too small to measure.
        Even Gaia cannot detect shifts smaller than ~0.02 milliarcseconds.</p>
        <p>For such distant objects, astronomers use other methods:
        <strong>standard candles</strong> (Cepheids, Type Ia supernovae) and the <strong>cosmic distance ladder</strong>.</p>`;
    } else if (state.distance_pc > 1000) {
      title = 'Pushing the Limits';
      content = `<p>At ${state.distance_pc.toFixed(0)} pc, this parallax is extremely small
        (${STAR_DATA.formatParallax(state.parallax_arcsec).value} ${STAR_DATA.formatParallax(state.parallax_arcsec).unit}).</p>
        <p>Gaia can measure this, but the uncertainty becomes significant. Beyond ~10,000 pc,
        we need other distance methods.</p>`;
    } else {
      title = 'The Parsec Definition';
      content = `<p>A <strong>parsec</strong> (pc) is the distance at which 1 AU subtends an angle of 1 arcsecond.</p>
        <div class="formula">d (pc) = 1 / p (arcsec)</div>
        <p>This elegant relationship means: <strong>larger parallax = closer star</strong>.</p>
        <p style="color: var(--text-muted); margin-top: 0.75rem;">
          Current star at ${state.distance_pc.toPrecision(3)} pc has parallax ${state.parallax_arcsec.toPrecision(3)}" -
          easily measurable by ${state.precision === 'gaia' ? 'Gaia' : 'Hipparcos'}.
        </p>`;
    }

    elements.insightBox.innerHTML = `<h4>${title}</h4>${content}`;
  }

  /**
   * Main update - redraw both canvases and update displays
   */
  function update() {
    drawObserverView();
    drawTopDownView();
    updateReadouts();
  }

  // ============================================
  // Controls
  // ============================================

  /**
   * Set distance and recalculate parallax
   */
  function setDistance(d_pc) {
    state.distance_pc = Math.max(1, Math.min(1000000, d_pc));
    state.parallax_arcsec = parallaxFromDistance(state.distance_pc);
    updateSliderFromDistance();
    update();
    updateInsightBox();
  }

  /**
   * Update slider position from current distance
   */
  function updateSliderFromDistance() {
    // Logarithmic mapping: 1 pc to 10,000 pc -> 0 to 1000
    const minLog = Math.log10(1);
    const maxLog = Math.log10(10000);
    const distLog = Math.log10(state.distance_pc);
    const sliderVal = ((distLog - minLog) / (maxLog - minLog)) * 1000;
    elements.distanceSlider.value = Math.round(Math.max(0, Math.min(1000, sliderVal)));
  }

  /**
   * Setup distance slider
   */
  function setupDistanceSlider() {
    elements.distanceSlider.addEventListener('input', () => {
      const sliderVal = parseFloat(elements.distanceSlider.value);

      // Logarithmic scale: 0-1000 maps to 1 pc - 10,000 pc
      const minLog = Math.log10(1);
      const maxLog = Math.log10(10000);
      const distLog = minLog + (sliderVal / 1000) * (maxLog - minLog);
      const newDist = Math.pow(10, distLog);

      state.distance_pc = newDist;
      state.parallax_arcsec = parallaxFromDistance(newDist);
      state.currentPreset = null;
      clearPresetHighlight();
      update();
      updateInsightBox();
    });
  }

  /**
   * Clear preset button highlighting
   */
  function clearPresetHighlight() {
    const allPresets = document.querySelectorAll('.preset-btn');
    allPresets.forEach(btn => btn.classList.remove('active'));
  }

  /**
   * Create preset buttons
   */
  function createPresetButtons() {
    // Nearby stars
    const nearbyStars = STAR_DATA.getByCategory('nearby');
    elements.nearbyPresets.innerHTML = '';

    nearbyStars.forEach(star => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.innerHTML = `${star.name} <span class="gaia-indicator gaia-${star.gaia}">${getGaiaIcon(star.gaia)}</span>`;
      btn.title = `${star.description}\nd = ${star.d_pc.toFixed(2)} pc, p = ${(star.p * 1000).toFixed(1)} mas`;

      btn.addEventListener('click', () => {
        selectPreset(star, btn);
      });

      elements.nearbyPresets.appendChild(btn);
    });

    // Distant objects
    const distantStars = STAR_DATA.getByCategory('distant');
    elements.distantPresets.innerHTML = '';

    distantStars.forEach(star => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.innerHTML = `${star.name} <span class="gaia-indicator gaia-${star.gaia}">${getGaiaIcon(star.gaia)}</span>`;

      const pDisplay = star.p ? `${(star.p * 1000).toFixed(2)} mas` : 'unmeasurable';
      btn.title = `${star.description}\nd = ${star.d_pc.toFixed(0)} pc, p = ${pDisplay}`;

      btn.addEventListener('click', () => {
        selectPreset(star, btn);
      });

      elements.distantPresets.appendChild(btn);
    });
  }

  /**
   * Get Gaia status icon
   */
  function getGaiaIcon(gaiaClass) {
    switch (gaiaClass) {
      case 'easy': return '++';
      case 'yes': return '+';
      case 'limit': return '~';
      case 'no': return '-';
      default: return '';
    }
  }

  /**
   * Select a star preset
   */
  function selectPreset(star, button) {
    state.distance_pc = star.d_pc;
    state.parallax_arcsec = star.p;
    state.currentPreset = star.name;

    updateSliderFromDistance();
    clearPresetHighlight();
    button.classList.add('active');

    update();
    updateInsightBox();
    announceChange(star);
  }

  /**
   * Setup precision toggle
   */
  function setupPrecisionToggle() {
    elements.btnHipparcos.addEventListener('click', () => {
      state.precision = 'hipparcos';
      elements.btnHipparcos.classList.add('active');
      elements.btnGaia.classList.remove('active');
      update();
      updateInsightBox();
    });

    elements.btnGaia.addEventListener('click', () => {
      state.precision = 'gaia';
      elements.btnGaia.classList.add('active');
      elements.btnHipparcos.classList.remove('active');
      update();
      updateInsightBox();
    });
  }

  // ============================================
  // Animation
  // ============================================

  /**
   * Start year animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    state.lastTime = performance.now();
    elements.btnPlayYear.disabled = true;
    elements.btnPause.disabled = false;
    elements.btnJan.classList.remove('active');
    elements.btnJuly.classList.remove('active');

    function animate(currentTime) {
      if (!state.playing) return;

      const dt = currentTime - state.lastTime;
      state.lastTime = currentTime;

      // Advance year fraction
      state.yearFraction += dt / YEAR_DURATION_MS;
      state.yearFraction = state.yearFraction % 1;

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
    elements.btnPlayYear.disabled = false;
    elements.btnPause.disabled = true;
  }

  /**
   * Jump to January position
   */
  function jumpToJanuary() {
    stopAnimation();
    state.yearFraction = 0;
    elements.btnJan.classList.add('active');
    elements.btnJuly.classList.remove('active');
    update();
  }

  /**
   * Jump to July position
   */
  function jumpToJuly() {
    stopAnimation();
    state.yearFraction = 0.5;
    elements.btnJuly.classList.add('active');
    elements.btnJan.classList.remove('active');
    update();
  }

  /**
   * Reset to initial state
   */
  function resetAnimation() {
    stopAnimation();
    state.yearFraction = 0;
    elements.btnJan.classList.remove('active');
    elements.btnJuly.classList.remove('active');
    update();
  }

  /**
   * Setup animation controls
   */
  function setupAnimationControls() {
    elements.btnPlayYear.addEventListener('click', startAnimation);
    elements.btnPause.addEventListener('click', stopAnimation);
    elements.btnJan.addEventListener('click', jumpToJanuary);
    elements.btnJuly.addEventListener('click', jumpToJuly);
    elements.btnReset.addEventListener('click', resetAnimation);
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') return;

      switch (event.key) {
        case ' ':
          event.preventDefault();
          if (state.playing) {
            stopAnimation();
          } else {
            startAnimation();
          }
          break;
        case 'j':
        case 'J':
          jumpToJanuary();
          break;
        case 'ArrowRight':
          // Increase distance
          setDistance(state.distance_pc * (event.shiftKey ? 1.01 : 1.1));
          clearPresetHighlight();
          break;
        case 'ArrowLeft':
          // Decrease distance
          setDistance(state.distance_pc * (event.shiftKey ? 0.99 : 0.9));
          clearPresetHighlight();
          break;
        case 'ArrowUp':
          // Advance time
          stopAnimation();
          state.yearFraction = (state.yearFraction + 0.05) % 1;
          update();
          break;
        case 'ArrowDown':
          // Reverse time
          stopAnimation();
          state.yearFraction = (state.yearFraction - 0.05 + 1) % 1;
          update();
          break;
        case 'g':
        case 'G':
          elements.btnGaia.click();
          break;
        case 'h':
        case 'H':
          elements.btnHipparcos.click();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          selectPresetByIndex('nearby', parseInt(event.key) - 1);
          break;
        case '7':
        case '8':
        case '9':
        case '0':
          const idx = event.key === '0' ? 9 : parseInt(event.key) - 7;
          selectPresetByIndex('distant', idx);
          break;
      }
    });
  }

  function selectPresetByIndex(category, index) {
    const presets = category === 'nearby'
      ? elements.nearbyPresets.querySelectorAll('.preset-btn')
      : elements.distantPresets.querySelectorAll('.preset-btn');

    if (index < presets.length) {
      presets[index].click();
    }
  }

  function announceChange(star) {
    if (star) {
      elements.statusAnnounce.textContent =
        `Selected ${star.name}, distance ${star.d_pc.toPrecision(3)} parsecs, ` +
        `parallax ${star.p ? (star.p * 1000).toFixed(2) + ' milliarcseconds' : 'unmeasurable'}`;
    }
  }

  // ============================================
  // Window Resize
  // ============================================

  function setupResize() {
    window.addEventListener('resize', () => {
      update();
    });
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    generateBackgroundStars();
    createPresetButtons();
    setupDistanceSlider();
    setupPrecisionToggle();
    setupAnimationControls();
    setupKeyboard();
    setupResize();

    // Initialize starfield background
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    // Initial state: Proxima Centauri at January
    const proxima = STAR_DATA.getByName('Proxima Centauri');
    if (proxima) {
      state.distance_pc = proxima.d_pc;
      state.parallax_arcsec = proxima.p;
      updateSliderFromDistance();
    }

    update();
    updateInsightBox();

    // Physics validation (check console)
    validatePhysics();

    console.log('Stellar Parallax Sandbox initialized');
  }

  /**
   * Validate physics calculations
   */
  function validatePhysics() {
    console.log('=== Parallax Physics Validation ===');

    // Test: d = 1/p relationship
    const testCases = [
      { name: 'Proxima Centauri', d_pc: 1.30, expected_p: 0.769 },
      { name: 'Vega', d_pc: 7.7, expected_p: 0.130 },
      { name: 'Galactic Center', d_pc: 8000, expected_p: 0.000125 }
    ];

    testCases.forEach(test => {
      const calculated_p = parallaxFromDistance(test.d_pc);
      const error = Math.abs(calculated_p - test.expected_p) / test.expected_p * 100;
      console.log(`${test.name}: d=${test.d_pc} pc`);
      console.log(`  Calculated p = ${calculated_p.toPrecision(4)}"`);
      console.log(`  Expected p = ${test.expected_p}"`);
      console.log(`  d x p = ${(test.d_pc * calculated_p).toPrecision(4)} (should be ~1)`);
      console.log(`  Error: ${error.toFixed(2)}%`);
    });

    console.log('===================================');
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
