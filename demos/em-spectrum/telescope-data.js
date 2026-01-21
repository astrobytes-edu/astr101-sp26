/**
 * Telescope Data for EM Spectrum Explorer
 *
 * Real telescopes with their wavelength ranges (in cm)
 * Data sourced from official telescope specifications
 */

window.TELESCOPES = [
  // Gamma-ray
  {
    name: 'Fermi',
    band: 'Gamma-ray',
    lambda_min: 1e-14,        // ~100 MeV photons
    lambda_max: 1e-10,        // ~10 keV
    location: 'Space (LEO)',
    science: 'Gamma-ray bursts, pulsars, active galactic nuclei, dark matter searches',
    icon: '\uD83D\uDEF0\uFE0F'  // Satellite
  },
  {
    name: 'VERITAS',
    band: 'Gamma-ray',
    lambda_min: 1e-15,        // ~1 TeV photons
    lambda_max: 1e-12,        // ~1 GeV
    location: 'Arizona, USA (ground)',
    science: 'Very high energy gamma rays from blazars, supernova remnants',
    icon: '\uD83D\uDD2D'       // Telescope
  },

  // X-ray
  {
    name: 'Chandra',
    band: 'X-ray',
    lambda_min: 1e-9,         // 0.01 nm (hard X-ray)
    lambda_max: 1e-6,         // 10 nm (soft X-ray)
    location: 'Space (HEO)',
    science: 'Black holes, neutron stars, supernova remnants, galaxy clusters',
    icon: '\uD83D\uDEF0\uFE0F'
  },
  {
    name: 'XMM-Newton',
    band: 'X-ray',
    lambda_min: 6e-9,         // 0.06 nm
    lambda_max: 1.2e-6,       // 12 nm
    location: 'Space (HEO)',
    science: 'X-ray spectroscopy of hot gas in clusters, stellar coronae',
    icon: '\uD83D\uDEF0\uFE0F'
  },

  // Ultraviolet
  {
    name: 'GALEX',
    band: 'Ultraviolet',
    lambda_min: 1.35e-5,      // 135 nm (FUV)
    lambda_max: 2.8e-5,       // 280 nm (NUV)
    location: 'Space (archived)',
    science: 'Star formation history, UV bright stars, hot white dwarfs',
    icon: '\uD83D\uDEF0\uFE0F'
  },

  // Optical/UV
  {
    name: 'Hubble',
    band: 'UV/Optical/Near-IR',
    lambda_min: 1.15e-5,      // 115 nm (UV)
    lambda_max: 2.5e-4,       // 2.5 um (IR)
    location: 'Space (LEO)',
    science: 'Deep field imaging, exoplanet atmospheres, stellar populations',
    icon: '\uD83D\uDEF0\uFE0F'
  },

  // Optical (ground)
  {
    name: 'Keck',
    band: 'Optical/Near-IR',
    lambda_min: 3e-5,         // 300 nm
    lambda_max: 5e-4,         // 5 um
    location: 'Mauna Kea, Hawaii',
    science: 'Exoplanet detection, galaxy spectroscopy, adaptive optics imaging',
    icon: '\uD83D\uDD2D'
  },
  {
    name: 'VLT',
    band: 'Optical/Near-IR',
    lambda_min: 3e-5,         // 300 nm
    lambda_max: 2.5e-3,       // 25 um (with VISIR)
    location: 'Paranal, Chile',
    science: 'First image of exoplanet, black hole at galactic center',
    icon: '\uD83D\uDD2D'
  },

  // Infrared (space)
  {
    name: 'JWST',
    band: 'Near/Mid-IR',
    lambda_min: 6e-5,         // 0.6 um
    lambda_max: 2.8e-3,       // 28 um
    location: 'Space (L2)',
    science: 'First galaxies, exoplanet atmospheres, star formation in dust',
    icon: '\uD83D\uDEF0\uFE0F'
  },
  {
    name: 'Spitzer',
    band: 'Infrared',
    lambda_min: 3.6e-4,       // 3.6 um
    lambda_max: 1.6e-2,       // 160 um
    location: 'Space (archived)',
    science: 'Infrared galaxies, brown dwarfs, protoplanetary disks',
    icon: '\uD83D\uDEF0\uFE0F'
  },
  {
    name: 'Herschel',
    band: 'Far-IR/Sub-mm',
    lambda_min: 5.5e-3,       // 55 um
    lambda_max: 6.72e-2,      // 672 um
    location: 'Space (archived)',
    science: 'Cold dust in star-forming regions, debris disks, distant galaxies',
    icon: '\uD83D\uDEF0\uFE0F'
  },

  // Submillimeter/Millimeter
  {
    name: 'ALMA',
    band: 'Millimeter/Sub-mm',
    lambda_min: 3.2e-2,       // 0.32 mm
    lambda_max: 3.6e0,        // 3.6 mm
    location: 'Atacama, Chile',
    science: 'Protoplanetary disks, molecular gas, high-z galaxies',
    icon: '\uD83D\uDD2D'
  },

  // Radio
  {
    name: 'VLA',
    band: 'Radio',
    lambda_min: 7e-1,         // 7 mm
    lambda_max: 4e2,          // 4 m
    location: 'New Mexico, USA',
    science: 'Radio galaxies, jets, synchrotron emission, HI 21 cm',
    icon: '\uD83D\uDD2D'
  },
  {
    name: 'FAST',
    band: 'Radio',
    lambda_min: 2.1e1,        // 21 cm
    lambda_max: 4.3e2,        // 4.3 m
    location: 'Guizhou, China',
    science: 'Pulsars, fast radio bursts, neutral hydrogen mapping',
    icon: '\uD83D\uDD2D'
  },
  {
    name: 'Arecibo',
    band: 'Radio',
    lambda_min: 3e0,          // 3 cm
    lambda_max: 6e2,          // 6 m
    location: 'Puerto Rico (collapsed 2020)',
    science: 'Pulsars, radar astronomy, SETI (historical)',
    icon: '\uD83D\uDD2D'
  },
  {
    name: 'Event Horizon Telescope',
    band: 'Millimeter',
    lambda_min: 8.7e-2,       // 0.87 mm
    lambda_max: 1.3e-1,       // 1.3 mm
    location: 'Global network',
    science: 'Black hole shadow imaging (M87*, Sgr A*)',
    icon: '\u26AB'            // Black circle
  }
];
