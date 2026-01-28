/* Angular Size model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.AngularSizeModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.AngularSizeModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function angularDiameterDeg({ diameterKm, distanceKm }) {
    if (!Number.isFinite(diameterKm) || diameterKm <= 0) return 0;
    if (!Number.isFinite(distanceKm) || distanceKm <= 0) return 180;
    const radians = 2 * Math.atan(diameterKm / (2 * distanceKm));
    return Math.min(180, radians * (180 / Math.PI));
  }

  function distanceForAngularDiameterDeg({ diameterKm, angularDiameterDeg }) {
    if (!Number.isFinite(diameterKm) || diameterKm <= 0) return NaN;
    if (!Number.isFinite(angularDiameterDeg) || angularDiameterDeg <= 0) return Infinity;
    if (angularDiameterDeg >= 180) return 0;
    const theta = (angularDiameterDeg * Math.PI) / 180;
    return diameterKm / (2 * Math.tan(theta / 2));
  }

  function moonDistanceKmFromRecession({ distanceTodayKm, recessionCmPerYr, timeMyr }) {
    if (!Number.isFinite(distanceTodayKm)) return NaN;
    if (!Number.isFinite(recessionCmPerYr)) return NaN;
    if (!Number.isFinite(timeMyr)) return NaN;

    // Linear toy model: ΔD = v * t.
    // 1 cm/yr = 1e-5 km/yr; 1 Myr = 1e6 yr → 10 km/Myr.
    const kmPerMyr = recessionCmPerYr * 10;
    return distanceTodayKm + kmPerMyr * timeMyr;
  }

  // Presets used by the Angular Size demo.
  // Distances and diameters are in km.
  const presets = {
    // Astronomical objects
    sun: {
      name: 'Sun',
      diameter: 1.392e6,  // km
      distance: 1.496e8,  // km (1 AU)
      category: 'astronomical',
      color: 'sun',
      description: 'Our star'
    },
    moon: {
      name: 'Moon (Today)',
      diameter: 3474,     // km
      distance: 384400,   // km
      category: 'astronomical',
      color: 'moon',
      description: 'Earth\'s satellite',
      timeEvolution: true  // Enable time controls
    },
    jupiter: {
      name: 'Jupiter',
      diameter: 139820,   // km
      distance: 6.287e8,  // km (opposition)
      category: 'astronomical',
      color: 'planet',
      description: 'At opposition'
    },
    venus: {
      name: 'Venus',
      diameter: 12104,    // km
      distance: 4.14e7,   // km (closest approach)
      category: 'astronomical',
      color: 'planet',
      description: 'At closest approach'
    },
    mars: {
      name: 'Mars',
      diameter: 6779,     // km
      distance: 5.46e7,   // km (opposition)
      category: 'astronomical',
      color: 'mars',
      description: 'At opposition'
    },
    andromeda: {
      name: 'Andromeda',
      diameter: 1.26e18,  // km (~130,000 ly; bright disk)
      distance: 2.4e19,   // km (~2.5 million ly)
      category: 'astronomical',
      color: 'galaxy',
      description: 'Nearest large galaxy (bright disk)'
    },

    // Everyday objects
    basketball: {
      name: 'Basketball @ 10m',
      diameter: 0.000239, // 23.9 cm in km
      distance: 0.01,     // 10m in km
      category: 'everyday',
      color: 'object',
      description: 'Standard basketball'
    },
    soccerball: {
      name: 'Soccer ball @ 20m',
      diameter: 0.00022,  // 22 cm in km
      distance: 0.02,     // 20m in km
      category: 'everyday',
      color: 'object',
      description: 'Regulation soccer ball'
    },
    quarter: {
      name: 'Quarter @ arm\'s length',
      diameter: 0.0000243, // 24.3 mm in km
      distance: 0.0007,    // 70cm arm's length
      category: 'everyday',
      color: 'object',
      description: 'US quarter coin'
    },
    thumb: {
      name: 'Your thumb',
      diameter: 0.00002,   // ~2cm thumb width
      distance: 0.0007,    // ~70cm arm's length
      category: 'everyday',
      color: 'object',
      description: 'Thumb at arm\'s length ≈ 2°'
    },
    airplane: {
      name: 'Jet @ 10km',
      diameter: 0.06,      // ~60m wingspan
      distance: 10,        // 10 km altitude
      category: 'everyday',
      color: 'object',
      description: 'Commercial jet overhead'
    },
    iss: {
      name: 'ISS overhead',
      diameter: 0.109,     // 109 m in km
      distance: 420,       // 420 km altitude
      category: 'everyday',
      color: 'object',
      description: 'International Space Station'
    }
  };

  return {
    angularDiameterDeg,
    distanceForAngularDiameterDeg,
    moonDistanceKmFromRecession,
    presets,
  };
});
