/* Blackbody Radiation model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.BlackbodyModel)
 * and in Node tests (via require()).
 *
 * PHYSICS (CGS units):
 * - Wien's Law: λ_peak = b / T, where b = 0.2898 cm·K
 * - Planck Function: B_λ(T) = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
 * - Stefan-Boltzmann: F = σT⁴
 *
 * MODEL LIMITATIONS:
 * - Temperature-to-color is a perceptual approximation, not CIE colorimetry
 * - Planck function overflow protection kicks in at exp(700)
 * - All wavelengths in cm internally; conversion helpers provided
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.BlackbodyModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    c: 2.998e10,           // Speed of light (cm/s)
    h: 6.626e-27,          // Planck constant (erg·s)
    k: 1.381e-16,          // Boltzmann constant (erg/K)
    sigma: 5.670e-5,       // Stefan-Boltzmann (erg/cm²/s/K⁴)
    wien_b: 0.2898,        // Wien displacement constant (cm·K)

    // Unit conversions
    cm_to_nm: 1e7,         // cm to nm
    nm_to_cm: 1e-7,        // nm to cm

    // Solar reference values
    T_sun: 5772,           // K (IAU 2015 nominal)
    R_sun: 6.957e10,       // cm (IAU 2015 nominal)
    L_sun: 3.828e33        // erg/s (IAU 2015 nominal)
  };

  // ============================================
  // Wien's Displacement Law
  // ============================================

  /**
   * Wien's peak wavelength in cm
   * λ_peak = b / T
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (cm)
   */
  function wienPeakCm(T) {
    if (!Number.isFinite(T) || T <= 0) return NaN;
    return CONSTANTS.wien_b / T;
  }

  /**
   * Wien's peak wavelength in nm (for display)
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (nm)
   */
  function wienPeakNm(T) {
    const cm = wienPeakCm(T);
    return Number.isNaN(cm) ? NaN : cm * CONSTANTS.cm_to_nm;
  }

  // ============================================
  // Planck Function
  // ============================================

  /**
   * Planck function B_λ(T) - spectral radiance
   * B_λ = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
   *
   * @param {number} lambda - Wavelength (cm)
   * @param {number} T - Temperature (K)
   * @returns {number} Spectral radiance (erg/s/cm²/sr/cm)
   */
  function planckFunction(lambda, T) {
    if (!Number.isFinite(lambda) || lambda <= 0) return 0;
    if (!Number.isFinite(T) || T <= 0) return 0;

    const c = CONSTANTS.c;
    const h = CONSTANTS.h;
    const k = CONSTANTS.k;

    const factor1 = (2 * h * c * c) / Math.pow(lambda, 5);
    const exponent = (h * c) / (lambda * k * T);

    // Prevent overflow for very small wavelengths or low temperatures
    if (exponent > 700) return 0;

    return factor1 / (Math.exp(exponent) - 1);
  }

  // ============================================
  // Stefan-Boltzmann Law
  // ============================================

  /**
   * Stefan-Boltzmann flux: F = σT⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Flux (erg/s/cm²)
   */
  function stefanBoltzmannFlux(T) {
    if (!Number.isFinite(T) || T <= 0) return 0;
    return CONSTANTS.sigma * Math.pow(T, 4);
  }

  /**
   * Luminosity relative to Sun (assuming same radius)
   * L/L☉ = (T/T☉)⁴
   * @param {number} T - Temperature (K)
   * @returns {number} Luminosity ratio
   */
  function luminosityRatio(T) {
    if (!Number.isFinite(T) || T <= 0) return 0;
    return Math.pow(T / CONSTANTS.T_sun, 4);
  }

  // ============================================
  // Temperature to Color (Perceptual Approximation)
  // ============================================

  /**
   * Convert temperature to approximate blackbody RGB color.
   * This is a perceptual approximation, not CIE colorimetry.
   *
   * @param {number} T - Temperature (K)
   * @returns {object} {r, g, b} values 0-255
   */
  function temperatureToColor(T) {
    if (!Number.isFinite(T) || T <= 0) {
      return { r: 0, g: 0, b: 0 };
    }

    let r, g, b;

    if (T < 1000) {
      // Very cold - dark red to invisible
      r = Math.min(255, T / 4);
      g = 0;
      b = 0;
    } else if (T < 4000) {
      // Red to orange
      r = 255;
      g = Math.min(255, (T - 1000) / 12);
      b = 0;
    } else if (T < 6500) {
      // Orange to white
      r = 255;
      g = Math.min(255, 180 + (T - 4000) / 35);
      b = Math.min(255, (T - 4000) / 8);  // Faster blue increase for white-ish Sun
    } else if (T < 10000) {
      // White to blue-white
      r = Math.max(200, 255 - (T - 6500) / 30);
      g = Math.max(200, 255 - (T - 6500) / 50);
      b = 255;
    } else {
      // Blue-white to blue
      r = Math.max(150, 200 - (T - 10000) / 200);
      g = Math.max(180, 200 - (T - 10000) / 300);
      b = 255;
    }

    return {
      r: Math.round(Math.max(0, Math.min(255, r))),
      g: Math.round(Math.max(0, Math.min(255, g))),
      b: Math.round(Math.max(0, Math.min(255, b)))
    };
  }

  /**
   * Get descriptive color name from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Color name
   */
  function colorName(T) {
    if (!Number.isFinite(T) || T <= 0) return 'Unknown';
    if (T < 2000) return 'Infrared (invisible)';
    if (T < 3500) return 'Deep Red';
    if (T < 4500) return 'Orange-Red';
    if (T < 5500) return 'Yellow-Orange';
    if (T < 6500) return 'Yellow-White';
    if (T < 8000) return 'White';
    if (T < 12000) return 'Blue-White';
    return 'Blue';
  }

  /**
   * Get spectral class from temperature
   * @param {number} T - Temperature (K)
   * @returns {string} Spectral class (O, B, A, F, G, K, M, L+)
   */
  function spectralClass(T) {
    if (!Number.isFinite(T) || T <= 0) return 'Unknown';
    if (T >= 30000) return 'O';
    if (T >= 10000) return 'B';
    if (T >= 7500) return 'A';
    if (T >= 6000) return 'F';
    if (T >= 5200) return 'G';
    if (T >= 3700) return 'K';
    if (T >= 2400) return 'M';
    return 'L+';
  }

  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
    planckFunction,
    stefanBoltzmannFlux,
    luminosityRatio,
    temperatureToColor,
    colorName,
    spectralClass,
  };
});
