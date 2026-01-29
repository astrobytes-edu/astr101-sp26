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

  return {
    CONSTANTS,
  };
});
