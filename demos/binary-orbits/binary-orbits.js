/**
 * Binary Orbits Demo - Two-Body Physics Visualization
 * Interactive demonstration of proper center-of-mass orbital mechanics
 *
 * Both bodies orbit the barycenter with correct physics - even planets
 * cause measurable stellar wobble.
 *
 * Physics is delegated to BinaryOrbitsModel (binary-orbits-model.js)
 * for testability and reuse.
 */

(function() {
  'use strict';

  // ============================================
  // Model Import
  // ============================================

  const Model = typeof window !== 'undefined' ? window.BinaryOrbitsModel : null;
  if (!Model) {
    console.error('Binary Orbits: missing window.BinaryOrbitsModel (did you load demos/_assets/binary-orbits-model.js?)');
    return;
  }

  const AstroConstants = typeof window !== 'undefined' ? window.AstroConstants : null;
  const AstroUnits = typeof window !== 'undefined' ? window.AstroUnits : null;
  const TwoBody = typeof window !== 'undefined' ? window.TwoBodyAnalytic : null;
  if (!AstroConstants || !AstroUnits || !TwoBody) {
    console.error(
      'Binary Orbits: missing shared physics modules (did you load demos/_assets/physics/astro-constants.js, units.js, and two-body-analytic.js?)'
    );
    return;
  }

  // ============================================
  // Constants
  // ============================================

  // Import from model for backward compatibility
  const G_SOLAR = Model.G_SOLAR;
  const AU_KM = Model.AU_KM;
  const YEAR_SECONDS = Model.YEAR_SECONDS;

  // Body visualization constants
  const BODY_SIZE = {
    MIN: 5,           // Minimum body radius (px)
    MAX: 30,          // Maximum body radius (px)
    BASE: 12,         // Base radius for 1 M☉
    LOG_SCALE: 6,     // Scaling factor for log(mass)
    MIN_MASS: 0.01    // Minimum mass for size calculation
  };

  // ============================================
  // State
  // ============================================

  const state = {
    // Masses (M☉)
    M1: 1.0,
    M2: 1.0,

    // Orbital parameters
    a: 1.0,        // Relative separation semi-major axis (AU)
    e: 0.0,        // Eccentricity
    theta: 0,      // True anomaly (radians), body 1's angle
    t: 0,          // Time (years)

    // Mode selection
    mode: 'kepler',           // 'kepler' or 'newton'
    systemType: 'binary-star', // 'binary-star' or 'star-planet'

    // Display units
    units: {
      velocity: 'km/s',
      period: 'days'
    },

    // Overlay visibility
    overlays: {
      barycenter: true,
      orbits: true,
      velocity: false,
      acceleration: false,
      force: false
    },

    // View controls
    view: {
      zoom: 10,         // dimensionless multiplier applied to view scale (capped to fit)
      markerScale: 1    // dimensionless multiplier applied to body marker radii
    },

    // Animation state
    playing: false,
    speed: 1.0,
    animationId: null
  };

  // ============================================
  // Physics Functions (delegated to Model)
  // ============================================

  // Thin wrappers around Model functions for backward compatibility
  // and to maintain the demo's existing API.

  function barycenterFraction(M1, M2) {
    return Model.barycenterFraction({ M1, M2 });
  }

  function individualSemiMajor(a_rel, M1, M2) {
    return Model.individualSemiMajorAu({ aRel: a_rel, M1, M2 });
  }

  function orbitalPeriod(a_rel, M1, M2) {
    return Model.orbitalPeriodYr({ aRel: a_rel, M1, M2 });
  }

  function orbitalRadius(a, e, theta) {
    return Model.orbitalRadiusAu({ aAu: a, e, thetaRad: theta });
  }

  function orbitalVelocity(r, a, M1, M2) {
    return Model.orbitalVelocityKms({ rAu: r, aAu: a, M1, M2 });
  }

  function gravAcceleration(r, M_other) {
    return Model.gravAccelerationMs2({ rAu: r, M: M_other });
  }

  function orbitTangentAngle(a, e, theta) {
    return Model.orbitTangentAngleRad({ aAu: a, e, thetaRad: theta });
  }

  function meanAnomalyToTrue(M_anom, e) {
    return Model.meanToTrueAnomalyRad({ meanAnomalyRad: M_anom, e });
  }

  function trueToMeanAnomaly(theta, e) {
    return Model.trueToMeanAnomalyRad({ thetaRad: theta, e });
  }

  // ============================================
  // Position & Velocity Calculations
  // ============================================

  /**
   * Compute current positions of both bodies relative to barycenter
   *
   * Key physics:
   * - Body 1 is at angle θ from barycenter
   * - Body 2 is at angle θ + π from barycenter (opposite side)
   * - Each body's distance scales with its orbit size (a1 or a2)
   *
   * @returns {{body1: {x, y, r}, body2: {x, y, r}}} Positions in AU
   */
  function computePositions() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);

    // Body 1's position (angle = θ)
    const r1 = orbitalRadius(a1, state.e, state.theta);
    const x1 = r1 * Math.cos(state.theta);
    const y1 = r1 * Math.sin(state.theta);

    // Body 2's position (opposite side of barycenter, same orbital phase)
    // Both bodies share the same true anomaly - when body 1 is at perihelion,
    // body 2 is also at ITS perihelion (on the opposite side of barycenter).
    // So use same theta for radius, but position angle is theta + π.
    const r2 = orbitalRadius(a2, state.e, state.theta);
    const x2 = r2 * Math.cos(state.theta + Math.PI);
    const y2 = r2 * Math.sin(state.theta + Math.PI);

    // Relative separation (should equal orbitalRadius(a, e, theta))
    const separation = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return {
      body1: { x: x1, y: y1, r: r1 },
      body2: { x: x2, y: y2, r: r2 },
      separation: separation
    };
  }

  /**
   * Compute velocity vectors for both bodies
   *
   * Velocity is tangent to the orbit, perpendicular to the radius vector
   * Speed follows vis-viva equation, scaled by mass ratio
   *
   * @returns {{v1: {vx, vy, speed}, v2: {vx, vy, speed}}} Velocities in km/s
   */
  function computeVelocities() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);
    const positions = computePositions();

    // Relative orbital velocity (as if one body were stationary)
    const v_rel = orbitalVelocity(positions.separation, state.a, state.M1, state.M2);

    // Each body's velocity is proportional to its orbit size / total
    // v1/v_rel = a1/a, v2/v_rel = a2/a
    const M_tot = state.M1 + state.M2;
    const v1_speed = v_rel * state.M2 / M_tot;  // Body 1's speed
    const v2_speed = v_rel * state.M1 / M_tot;  // Body 2's speed

    // Velocity direction: tangent to elliptical orbit
    // For eccentric orbits, velocity is NOT perpendicular to radius!
    // Use calculus: tangent angle = atan2(dy/dθ, dx/dθ)
    // Both bodies use same theta (same orbital phase), but body 2's tangent
    // is rotated 180° since it's on the opposite side moving in same direction.
    const vAngle1 = orbitTangentAngle(a1, state.e, state.theta);
    const vAngle2 = orbitTangentAngle(a2, state.e, state.theta) + Math.PI;

    return {
      v1: {
        vx: v1_speed * Math.cos(vAngle1),
        vy: v1_speed * Math.sin(vAngle1),
        speed: v1_speed
      },
      v2: {
        vx: v2_speed * Math.cos(vAngle2),
        vy: v2_speed * Math.sin(vAngle2),
        speed: v2_speed
      }
    };
  }

  /**
   * Compute acceleration vectors for both bodies
   *
   * @returns {{a1: {ax, ay, mag}, a2: {ax, ay, mag}}} Accelerations in m/s²
   */
  function computeAccelerations() {
    const positions = computePositions();
    const r = positions.separation;

    // Gravitational acceleration magnitude
    const a1_mag = gravAcceleration(r, state.M2);  // Body 1 accelerated by M2
    const a2_mag = gravAcceleration(r, state.M1);  // Body 2 accelerated by M1

    // Direction: toward the other body (toward barycenter for each)
    // Body 1 accelerates toward body 2
    const a1_angle = state.theta + Math.PI;  // Toward body 2
    const a2_angle = state.theta;            // Toward body 1

    return {
      a1: {
        ax: a1_mag * Math.cos(a1_angle),
        ay: a1_mag * Math.sin(a1_angle),
        mag: a1_mag
      },
      a2: {
        ax: a2_mag * Math.cos(a2_angle),
        ay: a2_mag * Math.sin(a2_angle),
        mag: a2_mag
      }
    };
  }

  // ============================================
  // Animation & Update
  // ============================================

  /**
   * Main update function - advance time and update true anomaly
   * Called on each animation frame
   *
   * @param {number} dt - Time step (seconds of real time)
   */
  function update(dt) {
    if (!state.playing) return;

    // Convert real-time dt to simulation time
    const P = orbitalPeriod(state.a, state.M1, state.M2);
    const simDt = (dt / 1000) * state.speed;  // dt in ms → years
    state.t += simDt;

    // Compute mean anomaly from time
    const meanAnomaly = (2 * Math.PI * state.t / P) % (2 * Math.PI);

    // Convert mean anomaly to true anomaly
    state.theta = meanAnomalyToTrue(meanAnomaly, state.e);
  }

  /**
   * Step the simulation by a fixed angle (for manual control)
   *
   * @param {number} dTheta - Angle step (radians)
   */
  function stepByAngle(dTheta) {
    const P = orbitalPeriod(state.a, state.M1, state.M2);

    // Convert current true anomaly to mean anomaly
    let M = trueToMeanAnomaly(state.theta, state.e);

    // Step mean anomaly (equal time steps give equal angle steps in M)
    M += dTheta;
    M = ((M % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // Convert back to true anomaly
    state.theta = meanAnomalyToTrue(M, state.e);

    // Update time to match
    state.t = (M / (2 * Math.PI)) * P;
  }

  // ============================================
  // Utility Functions
  // ============================================

  /**
   * Set default units based on system type
   * Star+Planet: AU/yr makes orbital motion intuitive
   * Binary Star: km/s and days more practical for observations
   */
  function setDefaultUnits(systemType) {
    if (systemType === 'star-planet') {
      state.units.velocity = 'AU/yr';
      state.units.period = 'yr';
    } else {
      state.units.velocity = 'km/s';
      state.units.period = 'days';
    }
    state.systemType = systemType;
  }

  /**
   * Get summary of current orbital configuration
   * Useful for debugging and display
   */
  function getOrbitalSummary() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);
    const P = orbitalPeriod(state.a, state.M1, state.M2);
    const positions = computePositions();
    const velocities = computeVelocities();

    return {
      M1: state.M1,
      M2: state.M2,
      massRatio: state.M2 / state.M1,
      a_rel: state.a,
      a1: a1,
      a2: a2,
      e: state.e,
      period_yr: P,
      period_days: P * 365.25,
      barycenterFraction: barycenterFraction(state.M1, state.M2),
      currentSeparation: positions.separation,
      v1_kms: velocities.v1.speed,
      v2_kms: velocities.v2.speed,
      theta: state.theta,
      t: state.t
    };
  }

  // ============================================
  // Presets
  // ============================================

  const PRESETS = {
    // Star + Planet systems
    'sun-earth': {
      M1: 1.0,
      M2: 3e-6,  // ~1 Earth mass
      a: 1.0,
      e: 0.017,
      systemType: 'star-planet',
      name: 'Sun + Earth'
    },
    'sun-jupiter': {
      M1: 1.0,
      M2: 9.5e-4,  // ~1 Jupiter mass
      a: 5.2,
      e: 0.049,
      systemType: 'star-planet',
      name: 'Sun + Jupiter'
    },
    'hot-jupiter': {
      M1: 1.0,
      M2: 1e-3,
      a: 0.05,
      e: 0.02,
      systemType: 'star-planet',
      name: 'Hot Jupiter'
    },
    'proxima-b': {
      M1: 0.12,
      M2: 4e-6,
      a: 0.049,
      e: 0.11,
      systemType: 'star-planet',
      name: 'Proxima b'
    },

    // Binary Star systems
    'equal-mass': {
      M1: 1.0,
      M2: 1.0,
      a: 1.0,
      e: 0.0,
      systemType: 'binary-star',
      name: 'Equal Mass'
    },
    'alpha-centauri': {
      M1: 1.1,
      M2: 0.91,
      a: 23.4,
      e: 0.52,
      systemType: 'binary-star',
      name: 'Alpha Centauri AB'
    },
    'sirius': {
      M1: 2.06,
      M2: 1.02,
      a: 19.8,
      e: 0.59,
      systemType: 'binary-star',
      name: 'Sirius AB'
    },
    'massive-oo': {
      M1: 50,
      M2: 40,
      a: 0.5,
      e: 0.3,
      systemType: 'binary-star',
      name: 'O+O Binary'
    }
  };

  /**
   * Apply a preset configuration
   *
   * @param {string} presetId - Key from PRESETS object
   */
  function applyPreset(presetId) {
    const preset = PRESETS[presetId];
    if (!preset) {
      console.warn(`Unknown preset: ${presetId}`);
      return;
    }

    state.M1 = preset.M1;
    state.M2 = preset.M2;
    state.a = preset.a;
    state.e = preset.e;
    state.theta = 0;
    state.t = 0;

    setDefaultUnits(preset.systemType);
  }

  // ============================================
  // Module Export
  // ============================================

  /**
   * Get a frozen copy of current state (prevents external mutation)
   * @returns {Object} Frozen state snapshot
   */
  function getState() {
    return Object.freeze({
      M1: state.M1,
      M2: state.M2,
      a: state.a,
      e: state.e,
      theta: state.theta,
      t: state.t,
      mode: state.mode,
      systemType: state.systemType,
      units: Object.freeze({ ...state.units }),
      overlays: Object.freeze({ ...state.overlays }),
      playing: state.playing,
      speed: state.speed
    });
  }

  // Expose as global for browser use
  window.BinaryOrbits = {
    // State access (getState() recommended for external use)
    state: state,  // Kept for backward compatibility
    getState: getState,

    // Core physics (delegated to Model)
    barycenterFraction: barycenterFraction,
    individualSemiMajor: individualSemiMajor,
    orbitalPeriod: orbitalPeriod,
    orbitalRadius: orbitalRadius,
    orbitalVelocity: orbitalVelocity,
    gravAcceleration: gravAcceleration,
    meanAnomalyToTrue: meanAnomalyToTrue,
    trueToMeanAnomaly: trueToMeanAnomaly,

    // Computation functions
    computePositions: computePositions,
    computeVelocities: computeVelocities,
    computeAccelerations: computeAccelerations,

    // Animation
    update: update,
    stepByAngle: stepByAngle,

    // Utilities
    setDefaultUnits: setDefaultUnits,
    getOrbitalSummary: getOrbitalSummary,
    applyPreset: applyPreset,

    // Presets
    PRESETS: PRESETS,

    // Constants
    G_SOLAR: G_SOLAR,

    // Model reference (for direct access to physics)
    Model: Model
  };

  // ============================================
  // DOM Element References
  // ============================================

  let elements = {};

  /**
   * Cache references to all UI elements from the HTML
   */
  function initElements() {
    elements = {
      // SVG elements
      orbitSvg: document.getElementById('orbit-svg'),
      barycenterGroup: document.getElementById('barycenter-group'),
      barycenter: document.getElementById('barycenter'),
      barycenterLabel: document.getElementById('barycenter-label'),
      orbit1: document.getElementById('orbit-1'),
      orbit2: document.getElementById('orbit-2'),
      body1Group: document.getElementById('body-1-group'),
      body1: document.getElementById('body-1'),
      body1Label: document.getElementById('body-1-label'),
      body2Group: document.getElementById('body-2-group'),
      body2: document.getElementById('body-2'),
      body2Label: document.getElementById('body-2-label'),
      separationLine: document.getElementById('separation-line'),
      separationText: document.getElementById('separation-text'),

      // Vector groups
      velocityVectors: document.getElementById('velocity-vectors'),
      v1Line: document.getElementById('v1-line'),
      v2Line: document.getElementById('v2-line'),
      accelVectors: document.getElementById('accel-vectors'),
      a1Line: document.getElementById('a1-line'),
      a2Line: document.getElementById('a2-line'),
      forceVectors: document.getElementById('force-vectors'),
      f1Line: document.getElementById('f1-line'),
      f2Line: document.getElementById('f2-line'),

      // Gradients for dynamic coloring
      body1Gradient: document.getElementById('body1Gradient'),
      body2Gradient: document.getElementById('body2Gradient'),

      // Controls
      systemType: document.getElementById('system-type'),
      m1Slider: document.getElementById('m1-slider'),
      m2Slider: document.getElementById('m2-slider'),
      aSlider: document.getElementById('a-slider'),
      eSlider: document.getElementById('e-slider'),

      // Displays
      m1Display: document.getElementById('m1-display'),
      m2Display: document.getElementById('m2-display'),
      aDisplay: document.getElementById('a-display'),
      eDisplay: document.getElementById('e-display'),

      // View controls
      zoomSlider: document.getElementById('zoom-slider'),
      zoomDisplay: document.getElementById('zoom-display'),
      markerSizeSlider: document.getElementById('marker-size-slider'),
      markerSizeDisplay: document.getElementById('marker-size-display'),

      // Unit selectors
      velocityUnit: document.getElementById('velocity-unit'),
      periodUnit: document.getElementById('period-unit'),

      // Readouts
      periodValue: document.getElementById('period-value'),
      periodUnitDisplay: document.getElementById('period-unit-display'),
      v1Value: document.getElementById('v1-value'),
      v1Unit: document.getElementById('v1-unit'),
      v2Value: document.getElementById('v2-value'),
      v2Unit: document.getElementById('v2-unit'),
      rValue: document.getElementById('r-value'),
      a1Value: document.getElementById('a1-value'),
      a2Value: document.getElementById('a2-value'),
      barycenterDistance: document.getElementById('barycenter-distance'),
      barycenterUnit: document.getElementById('barycenter-unit'),
      barycenterLocation: document.getElementById('barycenter-location'),
      t1Value: document.getElementById('t1-value'),
      type1Value: document.getElementById('type1-value'),
      type2Value: document.getElementById('type2-value'),

      // Conservation (details panel)
      kineticValue: document.getElementById('kinetic-value'),
      kineticUnit: document.getElementById('kinetic-unit'),
      potentialValue: document.getElementById('potential-value'),
      potentialUnit: document.getElementById('potential-unit'),
      energyValue: document.getElementById('energy-value'),
      energyUnit: document.getElementById('energy-unit'),
      angmomValue: document.getElementById('angmom-value'),
      angmomUnit: document.getElementById('angmom-unit'),
      arealValue: document.getElementById('areal-value'),
      arealUnit: document.getElementById('areal-unit'),

      // Animation controls
      btnPlay: document.getElementById('btn-play'),
      btnPause: document.getElementById('btn-pause'),
      btnReset: document.getElementById('btn-reset'),
      speedSelect: document.getElementById('speed-select'),

      // Overlay toggles
      toggleBarycenter: document.getElementById('toggle-barycenter'),
      toggleOrbits: document.getElementById('toggle-orbits'),
      toggleVelocity: document.getElementById('toggle-velocity'),
      toggleAcceleration: document.getElementById('toggle-acceleration'),
      toggleForce: document.getElementById('toggle-force'),

      // Preset buttons
      presetButtons: document.querySelectorAll('.preset-btn'),

      // Insight
      insightBox: document.getElementById('insight-box'),
      insightText: document.getElementById('insight-text'),

      // Accessibility
      statusAnnounce: document.getElementById('status-announce')
    };
  }

  // ============================================
  // SVG Rendering
  // ============================================

  const SVG_CENTER = { x: 300, y: 300 };
  const SVG_VIEWBOX_SIZE = 600;
  const BASE_SCALE = 200;  // pixels per AU at a=1

  function logSliderToZoom(sliderValue) {
    return Math.pow(10, parseFloat(sliderValue));
  }

  /**
   * Calculate scale factor to fit orbits in viewBox
   * Ensures the larger orbit fits comfortably with padding
   */
  function getScale() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);
    const maxOrbitSize = Math.max(a1, a2) * (1 + state.e);  // Aphelion distance
    const availableRadius = (SVG_VIEWBOX_SIZE / 2) * 0.85;  // 85% of half viewBox
    const fitScale = availableRadius / maxOrbitSize;
    const zoomScale = BASE_SCALE * state.view.zoom;
    return Math.min(zoomScale, fitScale);
  }

  /**
   * Convert AU position to SVG coordinates
   * Barycenter is at SVG_CENTER
   */
  function auToSvg(x_au, y_au) {
    const scale = getScale();
    return {
      x: SVG_CENTER.x + x_au * scale,
      y: SVG_CENTER.y - y_au * scale  // Flip y for SVG
    };
  }

  /**
   * Calculate semi-minor axis
   * b = a × sqrt(1 - e²)
   */
  function semiMinorAxis(a, e) {
    return a * Math.sqrt(1 - e * e);
  }

  /**
   * Update orbit ellipse paths centered on barycenter
   */
  function updateOrbitPaths() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);
    const scale = getScale();

    // Orbit 1 (body 1's path around barycenter)
    const rx1 = a1 * scale;
    const ry1 = semiMinorAxis(a1, state.e) * scale;
    const c1 = a1 * state.e * scale;  // Focus offset

    elements.orbit1.setAttribute('cx', SVG_CENTER.x - c1);
    elements.orbit1.setAttribute('cy', SVG_CENTER.y);
    elements.orbit1.setAttribute('rx', rx1);
    elements.orbit1.setAttribute('ry', ry1);

    // Orbit 2 (body 2's path, on opposite side)
    const rx2 = a2 * scale;
    const ry2 = semiMinorAxis(a2, state.e) * scale;
    const c2 = a2 * state.e * scale;

    elements.orbit2.setAttribute('cx', SVG_CENTER.x + c2);
    elements.orbit2.setAttribute('cy', SVG_CENTER.y);
    elements.orbit2.setAttribute('rx', rx2);
    elements.orbit2.setAttribute('ry', ry2);

    // Visibility
    const show = state.overlays.orbits;
    elements.orbit1.style.display = show ? 'block' : 'none';
    elements.orbit2.style.display = show ? 'block' : 'none';
  }

  /**
   * Update body positions and colors based on current theta
   */
  function updateBodies() {
    const positions = computePositions();
    const scale = getScale();

    // Update body sizes based on mass (log scale for visibility)
    const baseR1 = Math.max(
      BODY_SIZE.MIN,
      Math.min(
        BODY_SIZE.MAX,
        BODY_SIZE.BASE + BODY_SIZE.LOG_SCALE * Math.log10(Math.max(BODY_SIZE.MIN_MASS, state.M1))
      )
    );
    const baseR2 = Math.max(
      BODY_SIZE.MIN,
      Math.min(
        BODY_SIZE.MAX,
        BODY_SIZE.BASE + BODY_SIZE.LOG_SCALE * Math.log10(Math.max(BODY_SIZE.MIN_MASS, state.M2))
      )
    );

    const r1 = Math.max(3, Math.min(60, baseR1 * state.view.markerScale));
    const r2 = Math.max(3, Math.min(60, baseR2 * state.view.markerScale));

    // Body 1 position
    const pos1 = auToSvg(positions.body1.x, positions.body1.y);
    elements.body1.setAttribute('cx', pos1.x);
    elements.body1.setAttribute('cy', pos1.y);
    elements.body1Label.setAttribute('x', pos1.x);
    elements.body1Label.setAttribute('y', pos1.y + r1 + 15);

    // Body 2 position
    const pos2 = auToSvg(positions.body2.x, positions.body2.y);
    elements.body2.setAttribute('cx', pos2.x);
    elements.body2.setAttribute('cy', pos2.y);
    elements.body2Label.setAttribute('x', pos2.x);
    elements.body2Label.setAttribute('y', pos2.y + r2 + 15);

    // Update separation line
    elements.separationLine.setAttribute('x1', pos1.x);
    elements.separationLine.setAttribute('y1', pos1.y);
    elements.separationLine.setAttribute('x2', pos2.x);
    elements.separationLine.setAttribute('y2', pos2.y);

    // Separation text at midpoint
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2 - 15;
    elements.separationText.setAttribute('x', midX);
    elements.separationText.setAttribute('y', midY);
    elements.separationText.textContent = `r = ${positions.separation.toPrecision(3)} AU`;

    elements.body1.setAttribute('r', r1);
    elements.body2.setAttribute('r', r2);

    // Update body colors using StellarUtils
    updateBodyColors();
  }

  /**
   * Update body gradient colors based on stellar temperature
   */
  function updateBodyColors() {
    if (typeof StellarUtils === 'undefined') return;

    // Body 1 color
    const color1 = StellarUtils.massToColor(state.M1);
    const stops1 = elements.body1Gradient.querySelectorAll('stop');
    if (stops1.length >= 3) {
      const rgb1 = `rgb(${color1.r}, ${color1.g}, ${color1.b})`;
      const bright1 = `rgb(${Math.min(255, color1.r + 50)}, ${Math.min(255, color1.g + 50)}, ${Math.min(255, color1.b + 30)})`;
      const dark1 = `rgb(${Math.max(0, color1.r - 40)}, ${Math.max(0, color1.g - 40)}, ${Math.max(0, color1.b - 30)})`;
      stops1[0].setAttribute('stop-color', bright1);
      stops1[1].setAttribute('stop-color', rgb1);
      stops1[2].setAttribute('stop-color', dark1);
    }

    // Body 2 color (for planets, use a neutral blue; for stars, use temperature)
    if (state.M2 < 0.08) {
      // Substellar - use planet blue gradient
      const stops2 = elements.body2Gradient.querySelectorAll('stop');
      if (stops2.length >= 2) {
        stops2[0].setAttribute('stop-color', '#7ec8e3');
        stops2[1].setAttribute('stop-color', '#4a90d9');
      }
    } else {
      // Stellar mass - use temperature color
      const color2 = StellarUtils.massToColor(state.M2);
      const stops2 = elements.body2Gradient.querySelectorAll('stop');
      if (stops2.length >= 2) {
        const bright2 = `rgb(${Math.min(255, color2.r + 40)}, ${Math.min(255, color2.g + 40)}, ${Math.min(255, color2.b + 30)})`;
        const base2 = `rgb(${color2.r}, ${color2.g}, ${color2.b})`;
        stops2[0].setAttribute('stop-color', bright2);
        stops2[1].setAttribute('stop-color', base2);
      }
    }
  }

  /**
   * Update velocity, acceleration, and force vector overlays
   */
  function updateVectors() {
    const positions = computePositions();
    const velocities = computeVelocities();
    const accelerations = computeAccelerations();
    const scale = getScale();

    const pos1 = auToSvg(positions.body1.x, positions.body1.y);
    const pos2 = auToSvg(positions.body2.x, positions.body2.y);

    // Velocity vectors (scale for visibility)
    if (state.overlays.velocity) {
      elements.velocityVectors.style.display = 'block';
      // Adaptive scale: faster velocities get smaller scale to fit on screen
      // Target ~50-80 pixels for vectors
      const maxV = Math.max(velocities.v1.speed, velocities.v2.speed);
      const vScale = Math.min(15, Math.max(3, 60 / maxV));  // pixels per km/s

      const v1End = {
        x: pos1.x + velocities.v1.vx * vScale,
        y: pos1.y - velocities.v1.vy * vScale
      };
      elements.v1Line.setAttribute('x1', pos1.x);
      elements.v1Line.setAttribute('y1', pos1.y);
      elements.v1Line.setAttribute('x2', v1End.x);
      elements.v1Line.setAttribute('y2', v1End.y);

      const v2End = {
        x: pos2.x + velocities.v2.vx * vScale,
        y: pos2.y - velocities.v2.vy * vScale
      };
      elements.v2Line.setAttribute('x1', pos2.x);
      elements.v2Line.setAttribute('y1', pos2.y);
      elements.v2Line.setAttribute('x2', v2End.x);
      elements.v2Line.setAttribute('y2', v2End.y);
    } else {
      elements.velocityVectors.style.display = 'none';
    }

    // Acceleration vectors (toward other body)
    if (state.overlays.acceleration) {
      elements.accelVectors.style.display = 'block';
      const aScale = 40;  // Fixed visual scale

      // Body 1 accelerates toward body 2
      const a1Angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
      elements.a1Line.setAttribute('x1', pos1.x);
      elements.a1Line.setAttribute('y1', pos1.y);
      elements.a1Line.setAttribute('x2', pos1.x + aScale * Math.cos(a1Angle));
      elements.a1Line.setAttribute('y2', pos1.y + aScale * Math.sin(a1Angle));

      // Body 2 accelerates toward body 1
      const a2Angle = Math.atan2(pos1.y - pos2.y, pos1.x - pos2.x);
      elements.a2Line.setAttribute('x1', pos2.x);
      elements.a2Line.setAttribute('y1', pos2.y);
      elements.a2Line.setAttribute('x2', pos2.x + aScale * Math.cos(a2Angle));
      elements.a2Line.setAttribute('y2', pos2.y + aScale * Math.sin(a2Angle));
    } else {
      elements.accelVectors.style.display = 'none';
    }

    // Force vectors (same direction as acceleration, magnitude proportional to mass)
    if (state.overlays.force) {
      elements.forceVectors.style.display = 'block';
      const fBaseScale = 30;

      // Force on body 1 (toward body 2)
      const f1Angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
      const f1Len = fBaseScale * Math.min(2, Math.log10(state.M1 + 1) + 1);
      elements.f1Line.setAttribute('x1', pos1.x);
      elements.f1Line.setAttribute('y1', pos1.y);
      elements.f1Line.setAttribute('x2', pos1.x + f1Len * Math.cos(f1Angle));
      elements.f1Line.setAttribute('y2', pos1.y + f1Len * Math.sin(f1Angle));

      // Force on body 2 (toward body 1)
      const f2Angle = Math.atan2(pos1.y - pos2.y, pos1.x - pos2.x);
      const f2Len = fBaseScale * Math.min(2, Math.log10(state.M2 + 1) + 1);
      elements.f2Line.setAttribute('x1', pos2.x);
      elements.f2Line.setAttribute('y1', pos2.y);
      elements.f2Line.setAttribute('x2', pos2.x + f2Len * Math.cos(f2Angle));
      elements.f2Line.setAttribute('y2', pos2.y + f2Len * Math.sin(f2Angle));
    } else {
      elements.forceVectors.style.display = 'none';
    }
  }

  /**
   * Update barycenter marker visibility
   */
  function updateBarycenter() {
    elements.barycenterGroup.style.display = state.overlays.barycenter ? 'block' : 'none';
  }

  // ============================================
  // Readout Updates
  // ============================================

  /**
   * Format a number with appropriate precision
   */
  function formatValue(value) {
    if (Math.abs(value) >= 1000) {
      return value.toExponential(2);
    } else if (Math.abs(value) >= 1) {
      return value.toPrecision(3);
    } else if (Math.abs(value) >= 0.001) {
      return value.toPrecision(3);
    } else {
      return value.toExponential(2);
    }
  }

  /**
   * Update all readout displays
   */
  function updateReadouts() {
    const { a1, a2 } = individualSemiMajor(state.a, state.M1, state.M2);
    const P = orbitalPeriod(state.a, state.M1, state.M2);
    const positions = computePositions();
    const velocities = computeVelocities();

    // Period
    const periodUnit = state.units.period;
    let periodValue = P;
    if (periodUnit === 'days') {
      periodValue = P * 365.25;
    }
    elements.periodValue.textContent = formatValue(periodValue);
    elements.periodUnitDisplay.textContent = periodUnit === 'days' ? 'days' : 'yr';

    // Velocities
    const velUnit = state.units.velocity;
    let v1 = velocities.v1.speed;
    let v2 = velocities.v2.speed;

    // Convert from km/s to target unit
    if (typeof StellarUtils !== 'undefined') {
      v1 = StellarUtils.convertVelocity(v1, velUnit);
      v2 = StellarUtils.convertVelocity(v2, velUnit);
    } else {
      // Fallback conversion
      if (velUnit === 'AU/yr') {
        v1 = AstroUnits.kmPerSToAuPerYr(v1);
        v2 = AstroUnits.kmPerSToAuPerYr(v2);
      } else if (velUnit === 'm/s') {
        v1 *= 1000;
        v2 *= 1000;
      } else if (velUnit === 'cm/s') {
        v1 *= 100000;
        v2 *= 100000;
      }
    }

    elements.v1Value.textContent = formatValue(v1);
    elements.v1Unit.textContent = velUnit;
    elements.v2Value.textContent = formatValue(v2);
    elements.v2Unit.textContent = velUnit;

    // Separation
    elements.rValue.textContent = formatValue(positions.separation);

    // Individual orbit sizes
    elements.a1Value.textContent = formatValue(a1);
    elements.a2Value.textContent = formatValue(a2);

    // Barycenter distance from M1
    // a1 is in AU; convert to km (1 AU = 1.496e8 km)
    const SOLAR_RADIUS_KM = 6.96e5;
    const barycenterDistKm = a1 * AstroConstants.LENGTH.KM_PER_AU;

    // Get stellar radius if available
    let stellarRadiusKm = SOLAR_RADIUS_KM; // Default to solar radius
    if (typeof StellarUtils !== 'undefined') {
      const R1_solar = StellarUtils.massToRadius(state.M1);
      stellarRadiusKm = R1_solar * SOLAR_RADIUS_KM;
    }

    // Format distance display
    if (barycenterDistKm < 1e6) {
      // Show in km for small values
      elements.barycenterDistance.textContent = Math.round(barycenterDistKm).toLocaleString();
      elements.barycenterUnit.textContent = 'km from M₁';
    } else {
      // Show in AU for larger values
      elements.barycenterDistance.textContent = formatValue(a1);
      elements.barycenterUnit.textContent = 'AU from M₁';
    }

    // Inside/outside star indicator
    const isInsideStar = barycenterDistKm < stellarRadiusKm;
    if (isInsideStar) {
      elements.barycenterLocation.textContent = '(inside star)';
      elements.barycenterLocation.className = 'readout-note inside-star';
    } else {
      const distanceRatio = barycenterDistKm / stellarRadiusKm;
      if (distanceRatio < 10) {
        elements.barycenterLocation.textContent = `(${distanceRatio.toFixed(1)}× R★ from center)`;
      } else {
        elements.barycenterLocation.textContent = '(outside star)';
      }
      elements.barycenterLocation.className = 'readout-note outside-star';
    }

    // Stellar properties (temperature and spectral type)
    if (typeof StellarUtils !== 'undefined') {
      const T1 = StellarUtils.massToTemperature(state.M1);
      elements.t1Value.textContent = Math.round(T1).toLocaleString();
      elements.type1Value.textContent = StellarUtils.massToSpectralType(state.M1);

      if (state.M2 >= 0.08) {
        // Stellar mass
        elements.type2Value.textContent = StellarUtils.massToSpectralType(state.M2);
      } else if (state.M2 >= 0.001) {
        // Brown dwarf / giant planet
        elements.type2Value.textContent = 'BD';
      } else {
        // Planet
        elements.type2Value.textContent = 'Planet';
      }
    }

    // Conservation-law readouts (relative-orbit specific quantities).
    // "Specific" means per unit mass (here: per unit reduced mass), so:
    // - specific energy ε has units [length^2/time^2]
    // - specific angular momentum h has units [length^2/time]
    // The UI toggles between AU^2/yr^2 ("teaching units") and cm^2/s^2 (CGS).
    if (elements.energyValue && elements.angmomValue) {
      const muAu3Yr2 = TwoBody.muAu3Yr2FromMassSolar(state.M1 + state.M2);
      const rAu = positions.separation;
      const vRelAuYr = TwoBody.visVivaSpeedAuPerYr({ rAu, aAu: state.a, muAu3Yr2 });

      if (velUnit === 'cm/s') {
        const rCm = AstroUnits.auToCm(rAu);
        const aCm = AstroUnits.auToCm(state.a);
        const muCgs = TwoBody.muCgsFromMuAu3Yr2(muAu3Yr2);
        const vCms = AstroUnits.auPerYrToCmPerS(vRelAuYr);

        const k = 0.5 * vCms * vCms; // cm^2/s^2
        const u = -muCgs / rCm;      // cm^2/s^2
        const eps = k + u;           // cm^2/s^2
        const h = Math.sqrt(muCgs * aCm * (1 - state.e * state.e)); // cm^2/s
        const areal = 0.5 * h;       // cm^2/s

        elements.kineticValue.textContent = formatValue(k);
        elements.potentialValue.textContent = formatValue(u);
        elements.energyValue.textContent = formatValue(eps);
        elements.angmomValue.textContent = formatValue(h);
        elements.arealValue.textContent = formatValue(areal);

        elements.kineticUnit.textContent = 'cm²/s²';
        elements.potentialUnit.textContent = 'cm²/s²';
        elements.energyUnit.textContent = 'cm²/s²';
        elements.angmomUnit.textContent = 'cm²/s';
        elements.arealUnit.textContent = 'cm²/s';
      } else {
        const k = 0.5 * vRelAuYr * vRelAuYr; // AU^2/yr^2
        const u = -muAu3Yr2 / rAu;           // AU^2/yr^2
        const eps = k + u;                   // AU^2/yr^2
        const h = Math.sqrt(muAu3Yr2 * state.a * (1 - state.e * state.e)); // AU^2/yr
        const areal = 0.5 * h;               // AU^2/yr

        elements.kineticValue.textContent = formatValue(k);
        elements.potentialValue.textContent = formatValue(u);
        elements.energyValue.textContent = formatValue(eps);
        elements.angmomValue.textContent = formatValue(h);
        elements.arealValue.textContent = formatValue(areal);

        elements.kineticUnit.textContent = 'AU²/yr²';
        elements.potentialUnit.textContent = 'AU²/yr²';
        elements.energyUnit.textContent = 'AU²/yr²';
        elements.angmomUnit.textContent = 'AU²/yr';
        elements.arealUnit.textContent = 'AU²/yr';
      }
    }
  }

  /**
   * Update slider value displays
   */
  function updateSliderDisplays() {
    // Mass displays (log scale sliders)
    elements.m1Display.textContent = `${state.M1.toPrecision(2)} M\u2609`;
    elements.m2Display.textContent = `${state.M2.toPrecision(2)} M\u2609`;

    // Orbital parameters
    if (state.a >= 1) {
      elements.aDisplay.textContent = `${state.a.toFixed(2)} AU`;
    } else {
      elements.aDisplay.textContent = `${state.a.toPrecision(2)} AU`;
    }
    elements.eDisplay.textContent = state.e.toFixed(2);

    if (elements.zoomDisplay) {
      const zoom = state.view.zoom;
      elements.zoomDisplay.textContent = zoom >= 10 ? `${Math.round(zoom)}×` : `${zoom.toFixed(1)}×`;
    }

    if (elements.markerSizeDisplay) {
      elements.markerSizeDisplay.textContent = `${state.view.markerScale.toFixed(1)}×`;
    }
  }

  // ============================================
  // Control Event Handlers
  // ============================================

  /**
   * Convert log slider value to actual mass
   * Slider range: -1 to 2 → Mass: 0.1 to 100 M☉
   */
  function logSliderToMass(sliderValue) {
    return Math.pow(10, parseFloat(sliderValue));
  }

  /**
   * Convert mass to log slider value
   */
  function massToLogSlider(mass) {
    return Math.log10(mass);
  }

  /**
   * Convert log slider value to separation
   * Slider range: -2 to 2 → Separation: 0.01 to 100 AU
   */
  function logSliderToSeparation(sliderValue) {
    return Math.pow(10, parseFloat(sliderValue));
  }

  /**
   * Convert separation to log slider value
   */
  function separationToLogSlider(a) {
    return Math.log10(a);
  }

  /**
   * Setup mass and orbital parameter sliders
   */
  function setupSliders() {
    // M1 slider (log scale)
    elements.m1Slider.addEventListener('input', () => {
      state.M1 = logSliderToMass(elements.m1Slider.value);
      clearPresetHighlight();
      updateAll();
    });

    // M2 slider (log scale)
    elements.m2Slider.addEventListener('input', () => {
      state.M2 = logSliderToMass(elements.m2Slider.value);
      clearPresetHighlight();
      updateAll();
    });

    // Separation slider (log scale)
    elements.aSlider.addEventListener('input', () => {
      state.a = logSliderToSeparation(elements.aSlider.value);
      clearPresetHighlight();
      updateAll();
    });

    // Eccentricity slider (linear)
    elements.eSlider.addEventListener('input', () => {
      state.e = parseFloat(elements.eSlider.value);
      clearPresetHighlight();
      updateAll();
    });
  }

  function setupViewControls() {
    if (elements.zoomSlider) {
      elements.zoomSlider.addEventListener('input', () => {
        state.view.zoom = logSliderToZoom(elements.zoomSlider.value);
        updateAll();
      });
    }

    if (elements.markerSizeSlider) {
      elements.markerSizeSlider.addEventListener('input', () => {
        state.view.markerScale = parseFloat(elements.markerSizeSlider.value);
        updateAll();
      });
    }
  }

  /**
   * Setup system type selector (star-planet vs binary-star)
   */
  function setupSystemTypeSelector() {
    elements.systemType.addEventListener('change', () => {
      const type = elements.systemType.value;
      setDefaultUnits(type);

      // Update unit selectors to match
      if (type === 'star-planet') {
        elements.velocityUnit.value = 'AU/yr';
        elements.periodUnit.value = 'yr';
      } else {
        elements.velocityUnit.value = 'km/s';
        elements.periodUnit.value = 'days';
      }

      updateAll();
    });
  }

  /**
   * Setup unit selectors
   */
  function setupUnitSelectors() {
    elements.velocityUnit.addEventListener('change', () => {
      state.units.velocity = elements.velocityUnit.value;
      updateReadouts();
    });

    elements.periodUnit.addEventListener('change', () => {
      state.units.period = elements.periodUnit.value;
      updateReadouts();
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
        const M1 = parseFloat(btn.dataset.m1);
        const M2 = parseFloat(btn.dataset.m2);
        const a = parseFloat(btn.dataset.a);
        const e = parseFloat(btn.dataset.e);

        // Validate parsed values
        if (!Number.isFinite(M1) || M1 <= 0) {
          console.warn('Invalid M1 in preset:', btn.dataset.m1);
          return;
        }
        if (!Number.isFinite(M2) || M2 <= 0) {
          console.warn('Invalid M2 in preset:', btn.dataset.m2);
          return;
        }
        if (!Number.isFinite(a) || a <= 0) {
          console.warn('Invalid a in preset:', btn.dataset.a);
          return;
        }
        if (!Number.isFinite(e) || e < 0 || e >= 1) {
          console.warn('Invalid e in preset:', btn.dataset.e);
          return;
        }

        // Update state
        state.M1 = M1;
        state.M2 = M2;
        state.a = a;
        state.e = e;
        state.theta = 0;
        state.t = 0;

        // Update sliders to match
        elements.m1Slider.value = massToLogSlider(M1);
        elements.m2Slider.value = massToLogSlider(M2);
        elements.aSlider.value = separationToLogSlider(a);
        elements.eSlider.value = e;

        // Determine system type
        const isBinary = M2 >= 0.08;  // Stellar threshold
        const type = isBinary ? 'binary-star' : 'star-planet';
        elements.systemType.value = type;
        setDefaultUnits(type);

        // Update unit selectors
        if (type === 'star-planet') {
          elements.velocityUnit.value = 'AU/yr';
          elements.periodUnit.value = 'yr';
        } else {
          elements.velocityUnit.value = 'km/s';
          elements.periodUnit.value = 'days';
        }

        // Highlight active preset
        clearPresetHighlight();
        btn.classList.add('active');

        updateAll();
      });
    });
  }

  /**
   * Setup overlay toggle checkboxes
   */
  function setupOverlays() {
    elements.toggleBarycenter.addEventListener('change', () => {
      state.overlays.barycenter = elements.toggleBarycenter.checked;
      updateBarycenter();
    });

    elements.toggleOrbits.addEventListener('change', () => {
      state.overlays.orbits = elements.toggleOrbits.checked;
      updateOrbitPaths();
    });

    elements.toggleVelocity.addEventListener('change', () => {
      state.overlays.velocity = elements.toggleVelocity.checked;
      updateVectors();
    });

    elements.toggleAcceleration.addEventListener('change', () => {
      state.overlays.acceleration = elements.toggleAcceleration.checked;
      updateVectors();
    });

    elements.toggleForce.addEventListener('change', () => {
      state.overlays.force = elements.toggleForce.checked;
      updateVectors();
    });
  }

  // ============================================
  // Animation
  // ============================================

  let lastFrameTime = 0;

  /**
   * Setup animation control buttons
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
   * Start the orbital animation
   */
  function startAnimation() {
    if (state.playing) return;

    state.playing = true;
    elements.btnPlay.disabled = true;
    elements.btnPause.disabled = false;

    lastFrameTime = performance.now();
    state.animationId = requestAnimationFrame(animate);
  }

  /**
   * Stop the animation
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
   * Reset to initial position
   */
  function resetAnimation() {
    stopAnimation();
    state.theta = 0;
    state.t = 0;
    updateAll();
  }

  /**
   * Animation loop - update theta based on elapsed time and period
   */
  function animate(currentTime) {
    if (!state.playing) return;

    const dt = (currentTime - lastFrameTime) / 1000;  // seconds
    lastFrameTime = currentTime;

    // Get orbital period
    const P = orbitalPeriod(state.a, state.M1, state.M2);

    // Advance simulation time (speed is orbits per real second at 1x)
    // At 1x speed, one full orbit takes P seconds of real time
    const simDt = dt * state.speed;
    state.t += simDt;

    // Compute mean anomaly from time
    const meanAnomaly = (2 * Math.PI * state.t / P) % (2 * Math.PI);

    // Convert mean anomaly to true anomaly
    state.theta = meanAnomalyToTrue(meanAnomaly, state.e);

    // Update display
    updateBodies();
    updateVectors();
    updateReadouts();
    updateAriaPosition();

    // Continue animation
    state.animationId = requestAnimationFrame(animate);
  }

  // ============================================
  // ARIA Updates for Accessibility
  // ============================================

  /**
   * Update ARIA aria-valuenow attributes for body position sliders.
   * Body 1 position is theta in degrees (0-360).
   * Body 2 position is theta + 180 degrees (opposite side).
   */
  function updateAriaPosition() {
    const thetaDeg = ((state.theta * 180 / Math.PI) % 360 + 360) % 360;
    const theta2Deg = (thetaDeg + 180) % 360;

    elements.body1Group.setAttribute('aria-valuenow', Math.round(thetaDeg));
    elements.body2Group.setAttribute('aria-valuenow', Math.round(theta2Deg));
  }

  // ============================================
  // Body Dragging
  // ============================================

  /**
   * Setup drag interaction for bodies
   */
  function setupBodyDrag() {
    let isDragging = false;
    let dragBody = null;

    function getAngleFromEvent(event) {
      const svg = elements.orbitSvg;
      const pt = svg.createSVGPoint();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

      // Angle from barycenter to cursor
      return Math.atan2(SVG_CENTER.y - svgP.y, svgP.x - SVG_CENTER.x);
    }

    function startDrag(event, body) {
      isDragging = true;
      dragBody = body;
      stopAnimation();
      event.preventDefault();
    }

    // Body 1 drag
    elements.body1Group.addEventListener('mousedown', (e) => startDrag(e, 1));
    elements.body1Group.addEventListener('touchstart', (e) => startDrag(e, 1));

    // Body 2 drag
    elements.body2Group.addEventListener('mousedown', (e) => startDrag(e, 2));
    elements.body2Group.addEventListener('touchstart', (e) => startDrag(e, 2));

    function onMove(event) {
      if (!isDragging) return;

      let theta = getAngleFromEvent(event);

      // Body 2 is on opposite side
      if (dragBody === 2) {
        theta = theta + Math.PI;
      }

      state.theta = theta;

      // Update time to match position
      const P = orbitalPeriod(state.a, state.M1, state.M2);
      const M = trueToMeanAnomaly(state.theta, state.e);
      state.t = ((M + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI) * P;

      updateBodies();
      updateVectors();
      updateReadouts();
      updateAriaPosition();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);

    document.addEventListener('mouseup', () => { isDragging = false; dragBody = null; });
    document.addEventListener('touchend', () => { isDragging = false; dragBody = null; });
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    // Body 1 keyboard controls
    elements.body1Group.addEventListener('keydown', (event) => {
      handleBodyKeydown(event, 1);
    });

    // Body 2 keyboard controls
    elements.body2Group.addEventListener('keydown', (event) => {
      handleBodyKeydown(event, 2);
    });

    // Focus styling
    [elements.body1Group, elements.body2Group].forEach(group => {
      group.addEventListener('focus', () => {
        const circle = group.querySelector('circle');
        circle.setAttribute('stroke', 'var(--accent-gold)');
        circle.setAttribute('stroke-width', '3');
      });

      group.addEventListener('blur', () => {
        const circle = group.querySelector('circle');
        circle.removeAttribute('stroke');
        circle.removeAttribute('stroke-width');
      });
    });
  }

  function handleBodyKeydown(event, body) {
    const P = orbitalPeriod(state.a, state.M1, state.M2);
    let delta = 0;

    switch (event.key) {
      case 'ArrowLeft':
        delta = event.shiftKey ? -0.01 : -0.05;
        break;
      case 'ArrowRight':
        delta = event.shiftKey ? 0.01 : 0.05;
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

    // Step by mean anomaly for uniform time steps
    const M = trueToMeanAnomaly(state.theta, state.e);
    const newM = ((M + delta * 2 * Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    state.theta = meanAnomalyToTrue(newM, state.e);
    state.t = newM / (2 * Math.PI) * P;

    updateBodies();
    updateVectors();
    updateReadouts();
    updateAriaPosition();
  }

  // ============================================
  // Main Update Function
  // ============================================

  function updateAll() {
    updateOrbitPaths();
    updateBodies();
    updateVectors();
    updateBarycenter();
    updateReadouts();
    updateSliderDisplays();
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();

    // Initialize KaTeX for formulas if available
    if (window.AstroUtils && window.AstroUtils.renderAllMath) {
      AstroUtils.renderAllMath();
    }

    // Setup all event handlers
    setupSliders();
    setupViewControls();
    setupSystemTypeSelector();
    setupUnitSelectors();
    setupPresets();
    setupOverlays();
    setupAnimation();
    setupBodyDrag();
    setupKeyboard();

    // Initialize starfield if available
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
    }

    // Set initial slider positions from state
    elements.m1Slider.value = massToLogSlider(state.M1);
    elements.m2Slider.value = massToLogSlider(state.M2);
    elements.aSlider.value = separationToLogSlider(state.a);
    elements.eSlider.value = state.e;

    if (elements.zoomSlider) {
      elements.zoomSlider.value = Math.log10(state.view.zoom);
    }
    if (elements.markerSizeSlider) {
      elements.markerSizeSlider.value = state.view.markerScale;
    }

    // Initial overlay states
    elements.toggleBarycenter.checked = state.overlays.barycenter;
    elements.toggleOrbits.checked = state.overlays.orbits;
    elements.toggleVelocity.checked = state.overlays.velocity;
    elements.toggleAcceleration.checked = state.overlays.acceleration;
    elements.toggleForce.checked = state.overlays.force;

    // Initial render
    updateAll();
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // Extended Module Export
  // ============================================

  // Add UI functions to the global export
  Object.assign(window.BinaryOrbits, {
    // UI functions
    updateAll: updateAll,
    startAnimation: startAnimation,
    stopAnimation: stopAnimation,
    resetAnimation: resetAnimation
  });

})();
