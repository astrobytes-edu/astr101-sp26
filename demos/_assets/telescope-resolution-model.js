/**
 * demos/_assets/telescope-resolution-model.js
 *
 * Telescope resolution physics model (diffraction, Rayleigh criterion, Airy disk).
 *
 * Physics (CGS units):
 * - Diffraction limit: theta = 1.22 * lambda / D (radians)
 * - theta (arcsec) = 251643 * lambda(cm) / D(cm)
 * - Rayleigh criterion: resolved if separation > theta_diffraction
 * - Airy disk intensity: I(x) = (2*J1(x)/x)^2 where x = pi*D*sin(theta)/lambda
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.TelescopeResolutionModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CONSTANTS = {
    // Conversion factors
    RAD_TO_ARCSEC: 206265,     // radians to arcseconds (exact: 648000/π)
    ARCSEC_TO_RAD: 4.848e-6,   // arcseconds to radians
    M_TO_CM: 100,              // meters to cm
    NM_TO_CM: 1e-7,            // nanometers to cm

    // Diffraction coefficient (in convenient units)
    // theta(arcsec) = 1.22 * 206264.806 * lambda(cm) / D(cm)
    // Exact: 1.22 * 206264.806 = 251643.1
    DIFF_COEFF: 251643.1,

    // Typical Strehl ratio for good adaptive optics
    AO_STREHL: 0.6
  };

  /**
   * Calculate diffraction limit in arcseconds
   * theta = 1.22 * lambda / D (radians)
   * theta(arcsec) = DIFF_COEFF * lambda(cm) / D(cm)
   *
   * @param {number} lambda_cm - Wavelength in cm
   * @param {number} D_cm - Aperture diameter in cm
   * @returns {number} Angular resolution in arcseconds, or NaN for invalid inputs
   */
  function diffractionLimitArcsec(lambda_cm, D_cm) {
    if (!Number.isFinite(lambda_cm) || lambda_cm <= 0) return NaN;
    if (!Number.isFinite(D_cm) || D_cm <= 0) return NaN;
    return CONSTANTS.DIFF_COEFF * lambda_cm / D_cm;
  }

  /**
   * Calculate effective resolution including atmospheric seeing
   *
   * For space telescopes (seeing = 0): resolution = diffraction limit
   * For ground without AO: resolution = max(diffraction_limit, seeing)
   * For ground with AO: resolution combines both quadratically with Strehl improvement
   *
   * @param {number} theta_diff - Diffraction limit in arcsec
   * @param {number} seeing - Atmospheric seeing in arcsec (0 for space)
   * @param {boolean} aoEnabled - Whether adaptive optics is enabled
   * @returns {number} Effective resolution in arcseconds
   */
  function effectiveResolution(theta_diff, seeing, aoEnabled) {
    if (seeing === 0) {
      // Space telescope - diffraction limited
      return theta_diff;
    }

    if (!aoEnabled) {
      // Ground without AO - seeing limited unless telescope is small
      return Math.max(theta_diff, seeing);
    }

    // Ground with AO - partial correction
    // AO reduces the seeing contribution by (1 - Strehl)
    const correctedSeeing = seeing * (1 - CONSTANTS.AO_STREHL);
    // Combine in quadrature
    return Math.sqrt(theta_diff * theta_diff + correctedSeeing * correctedSeeing);
  }

  /**
   * Determine if a binary pair is resolved according to Rayleigh criterion
   * @param {number} separation - Binary separation in arcsec
   * @param {number} resolution - Effective resolution in arcsec
   * @returns {string} 'resolved', 'marginal', or 'unresolved'
   */
  function resolutionStatus(separation, resolution) {
    const ratio = separation / resolution;
    if (ratio > 1.5) return 'resolved';
    if (ratio > 0.8) return 'marginal';
    return 'unresolved';
  }

  return {
    CONSTANTS,
    diffractionLimitArcsec,
    effectiveResolution,
    resolutionStatus,
  };
});
