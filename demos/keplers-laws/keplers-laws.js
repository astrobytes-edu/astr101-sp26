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
      // TODO: populate in Task 2
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

  // TODO: implement in Task 3

  // ============================================
  // Controls
  // ============================================

  // TODO: implement in Task 4

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    console.log('Kepler\'s Laws Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
