/**
 * Binary Orbits Demo - Two-Body Physics Core
 * Interactive demonstration of proper center-of-mass orbital mechanics
 *
 * Both bodies orbit the barycenter with correct physics - even planets
 * cause measurable stellar wobble.
 */

(function() {
  'use strict';

  // ============================================
  // Physical Constants
  // ============================================

  // G in solar units: G = 4π² AU³/yr²/M☉ (Kepler's normalization)
  // This makes P² = a³/M_tot with P in years, a in AU, M in M☉
  const G_SOLAR = 4 * Math.PI * Math.PI;

  // Unit conversions
  const AU_KM = 1.496e8;           // km per AU
  const YEAR_SECONDS = 3.156e7;    // seconds per year

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

    // Animation state
    playing: false,
    speed: 1.0,
    animationId: null
  };

  // ============================================
  // Two-Body Physics Functions
  // ============================================

  /**
   * Calculate barycenter fraction (center of mass position)
   * x_cm = M2 / (M1 + M2) × separation from M1
   *
   * @param {number} M1 - Mass of body 1 (M☉)
   * @param {number} M2 - Mass of body 2 (M☉)
   * @returns {number} Fraction of separation from M1 to barycenter
   */
  function barycenterFraction(M1, M2) {
    const M_tot = M1 + M2;
    if (M_tot === 0) return 0.5;
    return M2 / M_tot;
  }

  /**
   * Calculate individual semi-major axes for each body's orbit around barycenter
   *
   * The key insight: a1 + a2 = a_rel (relative separation)
   * And: a1/a2 = M2/M1 (inverse mass ratio)
   *
   * @param {number} a_rel - Relative separation semi-major axis (AU)
   * @param {number} M1 - Mass of body 1 (M☉)
   * @param {number} M2 - Mass of body 2 (M☉)
   * @returns {{a1: number, a2: number}} Individual orbit semi-major axes (AU)
   */
  function individualSemiMajor(a_rel, M1, M2) {
    const M_tot = M1 + M2;
    if (M_tot === 0) {
      return { a1: a_rel / 2, a2: a_rel / 2 };
    }
    return {
      a1: a_rel * M2 / M_tot,  // Body 1's orbit size (larger mass = smaller orbit)
      a2: a_rel * M1 / M_tot   // Body 2's orbit size
    };
  }

  /**
   * Calculate orbital period using Kepler's 3rd Law
   * P² = a³ / (M1 + M2)  [with P in years, a in AU, M in M☉]
   *
   * @param {number} a_rel - Relative separation semi-major axis (AU)
   * @param {number} M1 - Mass of body 1 (M☉)
   * @param {number} M2 - Mass of body 2 (M☉)
   * @returns {number} Orbital period (years)
   */
  function orbitalPeriod(a_rel, M1, M2) {
    const M_tot = M1 + M2;
    if (M_tot === 0) return Infinity;
    return Math.sqrt(Math.pow(a_rel, 3) / M_tot);
  }

  /**
   * Calculate orbital radius from true anomaly using polar equation
   * r = a(1 - e²) / (1 + e × cos(θ))
   *
   * @param {number} a - Semi-major axis (AU)
   * @param {number} e - Eccentricity (0 ≤ e < 1)
   * @param {number} theta - True anomaly (radians)
   * @returns {number} Orbital radius (AU)
   */
  function orbitalRadius(a, e, theta) {
    if (e >= 1) e = 0.999;  // Safety clamp for bound orbits
    const numerator = a * (1 - e * e);
    const denominator = 1 + e * Math.cos(theta);
    return numerator / denominator;
  }

  /**
   * Calculate orbital velocity using vis-viva equation
   * v = √(G × M_tot × (2/r - 1/a))
   *
   * Returns velocity in AU/yr, then converts to km/s
   *
   * @param {number} r - Current orbital radius (AU)
   * @param {number} a - Semi-major axis (AU)
   * @param {number} M1 - Mass of body 1 (M☉)
   * @param {number} M2 - Mass of body 2 (M☉)
   * @returns {number} Orbital velocity (km/s)
   */
  function orbitalVelocity(r, a, M1, M2) {
    const M_tot = M1 + M2;
    if (M_tot === 0 || r === 0 || a === 0) return 0;

    // v² = G × M_tot × (2/r - 1/a)  [AU³/yr²/M☉ × M☉ × 1/AU = AU²/yr²]
    const v_squared = G_SOLAR * M_tot * (2 / r - 1 / a);
    if (v_squared < 0) return 0;  // Safety for numerical edge cases

    const v_AU_yr = Math.sqrt(v_squared);  // AU/yr

    // Convert to km/s: 1 AU/yr = AU_KM / YEAR_SECONDS km/s
    const v_kms = v_AU_yr * AU_KM / YEAR_SECONDS;
    return v_kms;
  }

  /**
   * Calculate gravitational acceleration toward other body
   * a = G × M_other / r²
   *
   * @param {number} r - Distance from other body (AU)
   * @param {number} M_other - Mass of the other body (M☉)
   * @returns {number} Gravitational acceleration (m/s²)
   */
  function gravAcceleration(r, M_other) {
    if (r === 0) return Infinity;

    // a = G × M / r²  [AU³/yr²/M☉ × M☉ / AU² = AU/yr²]
    const a_AU_yr2 = G_SOLAR * M_other / (r * r);

    // Convert to m/s²: 1 AU/yr² = (AU_KM × 1000) / (YEAR_SECONDS²) m/s²
    const AU_M = AU_KM * 1000;
    const a_ms2 = a_AU_yr2 * AU_M / (YEAR_SECONDS * YEAR_SECONDS);
    return a_ms2;
  }

  /**
   * Convert mean anomaly to true anomaly by solving Kepler's equation
   * M = E - e × sin(E)  (Kepler's equation)
   * θ = 2 × atan2(√(1+e) × sin(E/2), √(1-e) × cos(E/2))
   *
   * Uses Newton-Raphson iteration for eccentric anomaly E
   *
   * @param {number} M_anom - Mean anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} True anomaly (radians)
   */
  function meanAnomalyToTrue(M_anom, e) {
    // Normalize mean anomaly to [0, 2π)
    M_anom = ((M_anom % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    // For circular orbit, true anomaly = mean anomaly
    if (e < 1e-10) return M_anom;

    // Newton-Raphson iteration to solve Kepler's equation
    // M = E - e × sin(E)
    // f(E) = E - e × sin(E) - M = 0
    // f'(E) = 1 - e × cos(E)

    let E = M_anom;  // Initial guess
    const maxIter = 30;
    const tolerance = 1e-10;

    for (let i = 0; i < maxIter; i++) {
      const f = E - e * Math.sin(E) - M_anom;
      const fPrime = 1 - e * Math.cos(E);

      if (Math.abs(fPrime) < 1e-15) break;  // Avoid division by zero

      const dE = f / fPrime;
      E -= dE;

      if (Math.abs(dE) < tolerance) break;
    }

    // Convert eccentric anomaly E to true anomaly θ
    // tan(θ/2) = √((1+e)/(1-e)) × tan(E/2)
    const sinHalfTheta = Math.sqrt(1 + e) * Math.sin(E / 2);
    const cosHalfTheta = Math.sqrt(1 - e) * Math.cos(E / 2);
    const theta = 2 * Math.atan2(sinHalfTheta, cosHalfTheta);

    return theta;
  }

  /**
   * Convert true anomaly to mean anomaly (for time calculations)
   *
   * @param {number} theta - True anomaly (radians)
   * @param {number} e - Eccentricity
   * @returns {number} Mean anomaly (radians)
   */
  function trueToMeanAnomaly(theta, e) {
    // For circular orbit
    if (e < 1e-10) return theta;

    // True anomaly → Eccentric anomaly
    // tan(E/2) = √((1-e)/(1+e)) × tan(θ/2)
    const sinHalfE = Math.sqrt(1 - e) * Math.sin(theta / 2);
    const cosHalfE = Math.sqrt(1 + e) * Math.cos(theta / 2);
    const E = 2 * Math.atan2(sinHalfE, cosHalfE);

    // Eccentric anomaly → Mean anomaly (Kepler's equation)
    const M = E - e * Math.sin(E);

    return M;
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

    // Body 2's position (angle = θ + π, opposite side of barycenter)
    const theta2 = state.theta + Math.PI;
    const r2 = orbitalRadius(a2, state.e, theta2);
    const x2 = r2 * Math.cos(theta2);
    const y2 = r2 * Math.sin(theta2);

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

    // Velocity direction: perpendicular to radius, in direction of motion
    // For prograde orbit: v is 90° ahead of r
    const vAngle1 = state.theta + Math.PI / 2;
    const vAngle2 = state.theta + Math.PI + Math.PI / 2;

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

  // Expose as global for browser use
  window.BinaryOrbits = {
    // State (read-only access recommended)
    state: state,

    // Core physics functions
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
    G_SOLAR: G_SOLAR
  };

  console.log('Binary Orbits physics core loaded');

})();
