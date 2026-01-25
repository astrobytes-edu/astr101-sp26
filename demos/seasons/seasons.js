/**
 * Seasons Demo
 * Interactive demonstration that axial tilt causes seasons, NOT distance from the Sun
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  const ORBITAL_CENTER = { x: 200, y: 200 };
  const ORBITAL_RADIUS_X = 150;
  const ORBITAL_RADIUS_Y = 145; // Slightly elliptical
  const GLOBE_CENTER = { x: 200, y: 200 };
  const GLOBE_RADIUS = 150;

  // Month names for date formatting
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in each month (non-leap year)
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Planet presets with colors and orbital data
  let PLANET_DATA = {
    earth: {
      tilt: 23.5, color: 'var(--earth-blue)', name: 'Earth',
      orbitalRadius: 1.0, orbitalPeriod: 1.0, perihelion: 0.983, aphelion: 1.017
    },
    mars: {
      tilt: 25.2, color: 'var(--mars-red)', name: 'Mars',
      orbitalRadius: 1.52, orbitalPeriod: 1.88, perihelion: 1.38, aphelion: 1.67
    },
    uranus: {
      tilt: 97.8, color: 'var(--ice-blue)', name: 'Uranus',
      orbitalRadius: 19.2, orbitalPeriod: 84.0, perihelion: 18.3, aphelion: 20.1
    },
    venus: {
      tilt: 177.4, color: 'var(--stellar-amber)', name: 'Venus',
      orbitalRadius: 0.72, orbitalPeriod: 0.615, perihelion: 0.718, aphelion: 0.728
    },
    jupiter: {
      tilt: 3.1, color: 'var(--jupiter-tan)', name: 'Jupiter',
      orbitalRadius: 5.2, orbitalPeriod: 11.86, perihelion: 4.95, aphelion: 5.46
    },
    saturn: {
      tilt: 26.7, color: 'var(--sun-core)', name: 'Saturn',
      orbitalRadius: 9.5, orbitalPeriod: 29.4, perihelion: 9.02, aphelion: 10.05
    },
    neptune: {
      tilt: 28.3, color: 'var(--accent-blue)', name: 'Neptune',
      orbitalRadius: 30.0, orbitalPeriod: 164.8, perihelion: 29.8, aphelion: 30.3
    }
  };

  function loadPlanetsJson() {
    return fetch('planets.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`planets.json fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !Array.isArray(data.planets)) return;
        const next = {};
        for (const planet of data.planets) {
          if (!planet || typeof planet !== 'object') continue;
          if (typeof planet.key !== 'string' || planet.key.trim() === '') continue;
          next[planet.key] = planet;
        }
        if (Object.keys(next).length > 0) {
          PLANET_DATA = next;
        }
      })
      .catch(() => {
        // Offline/file:// runs may block fetch; keep the embedded fallback.
      });
  }

  // ============================================
  // State
  // ============================================

  const state = {
    dayOfYear: 80,           // Default: March equinox (day 80)
    axialTilt: 23.5,         // Degrees
    latitude: 40,            // Observer latitude (degrees)
    currentPlanet: 'earth',  // Current planet preset
    animating: false,        // Animation in progress
    animationId: null,       // Animation frame ID

    // Overlay visibility
    overlays: {
      celestialEquator: false,
      ecliptic: false,
      latitudeBands: true,
      terminator: true,
      hourGrid: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // SVG views
      orbitalView: document.getElementById('orbital-view'),
      globeView: document.getElementById('globe-view'),

      // Orbital view elements
      orbitPath: document.getElementById('orbit-path'),
      earthOrbital: document.getElementById('earth-orbital'),
      earthOrbitalCircle: document.getElementById('earth-orbital-circle'),
      axisLine: document.getElementById('axis-line'),
      axisArrow: document.getElementById('axis-arrow'),
      polarisLabel: document.getElementById('polaris-label'),
      earthLabel: document.getElementById('earth-label'),
      distanceLine: document.getElementById('distance-line'),
      distanceText: document.getElementById('distance-text'),
      axisIndicator: document.getElementById('axis-indicator'),

      // Globe view elements
      globeBg: document.getElementById('globe-bg'),
      terminator: document.getElementById('terminator'),
      latitudeBands: document.getElementById('latitude-bands'),
      arcticCircle: document.getElementById('arctic-circle'),
      tropicCancer: document.getElementById('tropic-cancer'),
      equatorLine: document.getElementById('equator-line'),
      tropicCapricorn: document.getElementById('tropic-capricorn'),
      antarcticCircle: document.getElementById('antarctic-circle'),
      celestialEquator: document.getElementById('celestial-equator'),
      eclipticOverlay: document.getElementById('ecliptic-overlay'),
      hourGrid: document.getElementById('hour-grid'),
      globeAxis: document.getElementById('globe-axis'),
      globeAxisLine: document.getElementById('globe-axis-line'),
      latMarkerDot: document.getElementById('lat-marker-dot'),
      latMarkerLabel: document.getElementById('lat-marker-label'),

      // Band labels
      labelArctic: document.getElementById('label-arctic'),
      labelCancer: document.getElementById('label-cancer'),
      labelEquator: document.getElementById('label-equator'),
      labelCapricorn: document.getElementById('label-capricorn'),
      labelAntarctic: document.getElementById('label-antarctic'),

      // Readouts
      dateDisplay: document.getElementById('date-display'),
      seasonNorthDisplay: document.getElementById('season-north-display'),
      seasonSouthDisplay: document.getElementById('season-south-display'),
      dayLengthDisplay: document.getElementById('day-length-display'),
      sunAltitudeDisplay: document.getElementById('sun-altitude-display'),
      distanceDisplay: document.getElementById('distance-display'),

      // Planet indicator
      planetIndicator: document.getElementById('planet-indicator'),
      planetName: document.getElementById('planet-name'),
      planetTiltDisplay: document.getElementById('planet-tilt-display'),

      // Sliders
      dateSlider: document.getElementById('date-slider'),
      dateSliderDisplay: document.getElementById('date-slider-display'),
      tiltSlider: document.getElementById('tilt-slider'),
      tiltDisplay: document.getElementById('tilt-display'),
      latitudeSlider: document.getElementById('latitude-slider'),
      latitudeDisplay: document.getElementById('latitude-display'),

      // Buttons
      btnAnimateYear: document.getElementById('btn-animate-year'),
      btnStop: document.getElementById('btn-stop'),
      btnResetDefaults: document.getElementById('btn-reset-defaults'),

      // Season presets
      presetMarEquinox: document.getElementById('preset-mar-equinox'),
      presetJunSolstice: document.getElementById('preset-jun-solstice'),
      presetSepEquinox: document.getElementById('preset-sep-equinox'),
      presetDecSolstice: document.getElementById('preset-dec-solstice'),

      // Planet presets
      presetEarth: document.getElementById('preset-earth'),
      presetMars: document.getElementById('preset-mars'),
      presetUranus: document.getElementById('preset-uranus'),
      presetVenus: document.getElementById('preset-venus'),
      presetJupiter: document.getElementById('preset-jupiter'),
      presetSaturn: document.getElementById('preset-saturn'),
      presetNeptune: document.getElementById('preset-neptune'),

      // Overlay toggles
      toggleCelestialEquator: document.getElementById('toggle-celestial-equator'),
      toggleEcliptic: document.getElementById('toggle-ecliptic'),
      toggleLatitudeBands: document.getElementById('toggle-latitude-bands'),
      toggleTerminator: document.getElementById('toggle-terminator'),
      toggleHourGrid: document.getElementById('toggle-hour-grid')
    };
  }

  // ============================================
  // Core Calculations
  // ============================================

  /**
   * Sun's declination for a given day of year
   * @param {number} dayOfYear - Day of year (0-365)
   * @returns {number} Declination in degrees (-23.5 to +23.5 for Earth)
   */
  function effectiveObliquityDegrees(obliquityDeg) {
    const t = Math.abs(obliquityDeg % 360);
    const folded = t > 180 ? 360 - t : t; // 0..180
    return folded > 90 ? 180 - folded : folded; // 0..90
  }

  function getSunDeclination(dayOfYear) {
    const daysFromEquinox = dayOfYear - 80; // March 21 ~ day 80
    const eps = effectiveObliquityDegrees(state.axialTilt);
    return eps * Math.sin(2 * Math.PI * daysFromEquinox / 365);
  }

  /**
   * Day length at a given latitude
   * @param {number} latitude - Observer latitude in degrees
   * @param {number} sunDeclination - Sun's declination in degrees
   * @returns {number} Hours of daylight
   */
  function getDayLength(latitude, sunDeclination) {
    const phi = latitude * Math.PI / 180;
    const delta = sunDeclination * Math.PI / 180;
    const cosH = -Math.tan(phi) * Math.tan(delta);

    if (cosH < -1) return 24;  // Midnight sun
    if (cosH > 1) return 0;    // Polar night

    const H = Math.acos(cosH) * 180 / Math.PI;
    return 2 * H / 15;  // Hours of daylight
  }

  /**
   * Sun's maximum altitude at noon
   * @param {number} latitude - Observer latitude in degrees
   * @param {number} sunDeclination - Sun's declination in degrees
   * @returns {number} Maximum sun altitude in degrees
   */
  function getSunAltitude(latitude, sunDeclination) {
    return 90 - Math.abs(latitude - sunDeclination);
  }

  /**
   * Earth-Sun distance for day of year
   * @param {number} dayOfYear - Day of year (0-365)
   * @returns {number} Distance in AU
   */
  function getEarthSunDistance(dayOfYear) {
    // Perihelion around Jan 3 (day 3), eccentricity ~ 0.017
    const daysFromPerihelion = dayOfYear - 3;
    const angle = 2 * Math.PI * daysFromPerihelion / 365;
    return 1 - 0.017 * Math.cos(angle);
  }

  /**
   * Convert day of year to date string
   * @param {number} dayOfYear - Day of year (0-365)
   * @returns {string} Formatted date like "March 21"
   */
  function dayOfYearToDate(dayOfYear) {
    let day = Math.floor(dayOfYear);
    if (day < 0) day = 0;
    if (day > 365) day = 365;

    let monthIndex = 0;
    let dayInMonth = day;

    for (let i = 0; i < 12; i++) {
      if (dayInMonth < DAYS_IN_MONTH[i]) {
        monthIndex = i;
        break;
      }
      dayInMonth -= DAYS_IN_MONTH[i];
    }

    return `${MONTHS[monthIndex]} ${dayInMonth + 1}`;
  }

  /**
   * Get season name for Northern hemisphere
   * @param {number} dayOfYear - Day of year (0-365)
   * @returns {string} Season name
   */
  function getSeasonNorth(dayOfYear) {
    if (dayOfYear >= 80 && dayOfYear < 172) return 'Spring';
    if (dayOfYear >= 172 && dayOfYear < 266) return 'Summer';
    if (dayOfYear >= 266 && dayOfYear < 356) return 'Fall';
    return 'Winter';
  }

  /**
   * Get season name for Southern hemisphere (opposite of North)
   * @param {number} dayOfYear - Day of year (0-365)
   * @returns {string} Season name
   */
  function getSeasonSouth(dayOfYear) {
    const north = getSeasonNorth(dayOfYear);
    const opposites = {
      'Spring': 'Fall',
      'Summer': 'Winter',
      'Fall': 'Spring',
      'Winter': 'Summer'
    };
    return opposites[north];
  }

  /**
   * Get CSS class for season styling
   * @param {string} season - Season name
   * @returns {string} CSS class name
   */
  function getSeasonClass(season) {
    return 'season-' + season.toLowerCase();
  }

  /**
   * Format day length as hours and minutes
   * @param {number} hours - Hours of daylight
   * @returns {string} Formatted like "14h 32m"
   */
  function formatDayLength(hours) {
    if (hours >= 24) return '24h 0m';
    if (hours <= 0) return '0h 0m';

    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  }

  function formatLatitude(lat) {
    const abs = Math.abs(lat);
    const absStr = Number.isInteger(abs) ? String(abs) : abs.toFixed(1);
    return lat >= 0 ? `${absStr}°N` : `${absStr}°S`;
  }

  // ============================================
  // Orbital View Updates
  // ============================================

  function getOrbitAngleFromDay(dayOfYear) {
    // Anchor perihelion (day ~3) on the +x axis for visual truthfulness.
    const daysFromPerihelion = dayOfYear - 3;
    return (daysFromPerihelion / 365) * 2 * Math.PI;
  }

  function getExaggeratedOrbitRadiusPx(distanceAU) {
    const base = 150;
    const exaggeration = 8; // 1 AU ±1.7% becomes visually noticeable
    return base * (1 + exaggeration * (distanceAU - 1));
  }

  function updateOrbitalView() {
    const distanceAU = getEarthSunDistance(state.dayOfYear);
    const earthAngle = getOrbitAngleFromDay(state.dayOfYear);
    const orbitRadiusPx = getExaggeratedOrbitRadiusPx(distanceAU);

    // Keep the orbit path as a stable "average orbit" reference ring.
    if (elements.orbitPath) {
      elements.orbitPath.setAttribute('rx', '150');
      elements.orbitPath.setAttribute('ry', '150');
    }

    const earthX = ORBITAL_CENTER.x + orbitRadiusPx * Math.cos(earthAngle);
    const earthY = ORBITAL_CENTER.y + orbitRadiusPx * Math.sin(earthAngle);

    // Update Earth position
    elements.earthOrbitalCircle.setAttribute('cx', earthX);
    elements.earthOrbitalCircle.setAttribute('cy', earthY);

    // Update axis indicator
    // The axis ALWAYS points toward Polaris (fixed direction in space)
    // We'll say Polaris is "up and to the right" in the orbital view
    // At June solstice (day 172), N pole tilts toward Sun
    // At December solstice (day 356), N pole tilts away from Sun

    // The tilt direction in the orbital plane view:
    // The axis points in a fixed direction (toward Polaris)
    // Let's define Polaris direction as pointing "up" in the diagram
    // The apparent tilt toward/away from Sun depends on Earth's orbital position

    const axisLength = 30;
    const tiltRad = state.axialTilt * Math.PI / 180;

    // The axis always points in the same direction in space
    // In our view, that's roughly upward with a slight tilt
    // The key is the axis direction relative to the Sun-Earth line

    // For visualization, we'll show the axis tilting toward "top" of the view
    // This represents the axis pointing toward Polaris (approximately up in diagram)
    const axisEndX = earthX;
    const axisEndY = earthY - axisLength;
    const arrowTipY = axisEndY - 5;

    elements.axisLine.setAttribute('x1', earthX);
    elements.axisLine.setAttribute('y1', earthY);
    elements.axisLine.setAttribute('x2', axisEndX);
    elements.axisLine.setAttribute('y2', axisEndY);

    elements.axisArrow.setAttribute('points',
      `${axisEndX},${arrowTipY} ${axisEndX - 4},${axisEndY + 3} ${axisEndX + 4},${axisEndY + 3}`);

    elements.polarisLabel.setAttribute('x', axisEndX);
    elements.polarisLabel.setAttribute('y', arrowTipY - 5);

    elements.earthLabel.setAttribute('x', earthX);
    elements.earthLabel.setAttribute('y', earthY + 25);

    // Update distance line
    elements.distanceLine.setAttribute('x1', ORBITAL_CENTER.x);
    elements.distanceLine.setAttribute('y1', ORBITAL_CENTER.y);
    elements.distanceLine.setAttribute('x2', earthX);
    elements.distanceLine.setAttribute('y2', earthY);

    const midX = (ORBITAL_CENTER.x + earthX) / 2;
    const midY = (ORBITAL_CENTER.y + earthY) / 2;
    elements.distanceText.setAttribute('x', midX + 10);
    elements.distanceText.setAttribute('y', midY);
    elements.distanceText.textContent = `${distanceAU.toFixed(3)} AU`;

    // Update planet color
    const planetData = PLANET_DATA[state.currentPlanet];
    if (planetData) {
      elements.earthOrbitalCircle.setAttribute('fill', planetData.color);
    }
  }

  // ============================================
  // Globe View Updates
  // ============================================

  function updateGlobeView() {
    const declination = getSunDeclination(state.dayOfYear);

    // Update terminator position
    // The terminator is a great circle perpendicular to the Sun-Earth line
    // In our 2D view, it appears as an ellipse
    // When declination > 0, N pole is tilted toward Sun (N hemisphere summer)
    // When declination < 0, S pole is tilted toward Sun (S hemisphere summer)

    if (state.overlays.terminator) {
      elements.terminator.style.display = '';
      // The terminator shifts based on declination
      // At equinox (dec=0), terminator is centered
      // At summer solstice (dec=23.5), terminator shifts to reveal more of N hemisphere
      const shiftX = (declination / 90) * GLOBE_RADIUS * 0.8;
      const terminatorCenterX = GLOBE_CENTER.x + GLOBE_RADIUS * 0.3 + shiftX;

      elements.terminator.setAttribute('cx', terminatorCenterX);
      elements.terminator.setAttribute('cy', GLOBE_CENTER.y);
      elements.terminator.setAttribute('rx', GLOBE_RADIUS * 0.4);
      elements.terminator.setAttribute('ry', GLOBE_RADIUS);
    } else {
      elements.terminator.style.display = 'none';
    }

    // Update latitude bands based on current tilt
    updateLatitudeBands();

    // Update latitude marker position
    updateLatitudeMarker();

    // Update globe color for planet
    const planetData = PLANET_DATA[state.currentPlanet];
    if (planetData) {
      // Create a gradient based on planet color
      const baseColor = planetData.color;
      elements.globeBg.setAttribute('fill', `url(#globeGradient)`);
      // We'd need to dynamically update the gradient, but for now use the planet color
      // The gradient is defined in HTML, so we'll leave it as is for Earth
    }

    // Update globe axis tilt visualization
    updateGlobeAxis();

    // Update overlays
    updateOverlays();
  }

  function updateLatitudeBands() {
    const tilt = effectiveObliquityDegrees(state.axialTilt);

    // Latitude bands are positioned based on the current axial tilt
    // Arctic Circle: 90 - tilt degrees
    // Tropic of Cancer: tilt degrees N
    // Equator: 0 degrees
    // Tropic of Capricorn: tilt degrees S
    // Antarctic Circle: -(90 - tilt) degrees

    // Convert latitude to Y position on globe
    // Latitude 90 (N pole) = top, Latitude -90 (S pole) = bottom
    function latToY(lat) {
      // lat goes from -90 to 90
      // Y goes from 350 (bottom) to 50 (top)
      return GLOBE_CENTER.y - (lat / 90) * GLOBE_RADIUS;
    }

    // Calculate the apparent width of latitude circle at given latitude
    function getEllipseRy(lat) {
      // At equator (lat=0), ry = 0 (appears as a line)
      // At poles (lat=90), ry = full radius
      // Actually, we're viewing the globe from the side, so:
      // A latitude line appears as an ellipse with:
      // rx = GLOBE_RADIUS * cos(lat)
      // The "ry" in our 2D projection represents how much we see "into" the globe
      return Math.abs(GLOBE_RADIUS * Math.cos(lat * Math.PI / 180) * 0.15);
    }

    // Arctic Circle at 90 - tilt degrees
    const arcticLat = 90 - tilt;
    elements.arcticCircle.setAttribute('cy', latToY(arcticLat));
    elements.arcticCircle.setAttribute('ry', getEllipseRy(arcticLat));
    elements.arcticCircle.setAttribute('rx', GLOBE_RADIUS * Math.cos(arcticLat * Math.PI / 180));

    // Tropic of Cancer at +tilt degrees
    elements.tropicCancer.setAttribute('cy', latToY(tilt));
    elements.tropicCancer.setAttribute('ry', getEllipseRy(tilt));
    elements.tropicCancer.setAttribute('rx', GLOBE_RADIUS * Math.cos(tilt * Math.PI / 180));

    // Equator at 0 degrees
    elements.equatorLine.setAttribute('cy', GLOBE_CENTER.y);
    elements.equatorLine.setAttribute('ry', getEllipseRy(0));
    elements.equatorLine.setAttribute('rx', GLOBE_RADIUS);

    // Tropic of Capricorn at -tilt degrees
    elements.tropicCapricorn.setAttribute('cy', latToY(-tilt));
    elements.tropicCapricorn.setAttribute('ry', getEllipseRy(-tilt));
    elements.tropicCapricorn.setAttribute('rx', GLOBE_RADIUS * Math.cos(tilt * Math.PI / 180));

    // Antarctic Circle at -(90 - tilt) degrees
    const antarcticLat = -(90 - tilt);
    elements.antarcticCircle.setAttribute('cy', latToY(antarcticLat));
    elements.antarcticCircle.setAttribute('ry', getEllipseRy(antarcticLat));
    elements.antarcticCircle.setAttribute('rx', GLOBE_RADIUS * Math.cos(antarcticLat * Math.PI / 180));

    // Update labels
    elements.labelArctic.setAttribute('y', latToY(arcticLat) + 4);
    elements.labelCancer.setAttribute('y', latToY(tilt) + 4);
    elements.labelEquator.setAttribute('y', GLOBE_CENTER.y + 4);
    elements.labelCapricorn.setAttribute('y', latToY(-tilt) + 4);
    elements.labelAntarctic.setAttribute('y', latToY(antarcticLat) + 4);

    // Show/hide latitude bands
    elements.latitudeBands.style.display = state.overlays.latitudeBands ? '' : 'none';
  }

  function updateLatitudeMarker() {
    const lat = state.latitude;

    // Position marker on globe
    const y = GLOBE_CENTER.y - (lat / 90) * GLOBE_RADIUS;

    // X position - show on the left (sunlit) side of the globe
    const rx = GLOBE_RADIUS * Math.cos(lat * Math.PI / 180);
    const x = GLOBE_CENTER.x - rx * 0.7; // Slightly left of center on sunlit side

    elements.latMarkerDot.setAttribute('cx', x);
    elements.latMarkerDot.setAttribute('cy', y);

    // Update label
    const latStr = formatLatitude(lat);
    elements.latMarkerLabel.setAttribute('x', x + 15);
    elements.latMarkerLabel.setAttribute('y', y + 4);
    elements.latMarkerLabel.textContent = latStr;
  }

  function updateGlobeAxis() {
    // The globe axis tilts based on axial tilt
    // For the globe view (side view), we show the axis tilted
    // The tilt direction depends on the current season

    const declination = getSunDeclination(state.dayOfYear);
    const eps = effectiveObliquityDegrees(state.axialTilt);
    const tiltRad = eps * Math.PI / 180;

    // Calculate axis endpoints
    // The axis should tilt toward/away from the viewer (left/right in side view)
    // based on declination
    const tiltDirection = eps === 0 ? 0 : declination / eps; // -1 to +1
    const horizontalOffset = 20 * Math.sin(tiltRad) * tiltDirection;

    const topX = GLOBE_CENTER.x + horizontalOffset;
    const topY = GLOBE_CENTER.y - GLOBE_RADIUS - 20;
    const bottomX = GLOBE_CENTER.x - horizontalOffset;
    const bottomY = GLOBE_CENTER.y + GLOBE_RADIUS + 20;

    elements.globeAxisLine.setAttribute('x1', topX);
    elements.globeAxisLine.setAttribute('y1', topY);
    elements.globeAxisLine.setAttribute('x2', bottomX);
    elements.globeAxisLine.setAttribute('y2', bottomY);
  }

  function updateOverlays() {
    // Celestial equator
    if (elements.celestialEquator) {
      elements.celestialEquator.style.display = state.overlays.celestialEquator ? '' : 'none';
    }

    // Ecliptic
    if (elements.eclipticOverlay) {
      elements.eclipticOverlay.style.display = state.overlays.ecliptic ? '' : 'none';
      // The ecliptic is tilted relative to the equator by the axial tilt
      if (state.overlays.ecliptic) {
        // Rotate the ecliptic ellipse to show the tilt
        const tiltDeg = effectiveObliquityDegrees(state.axialTilt);
        elements.eclipticOverlay.setAttribute('transform',
          `rotate(${tiltDeg} ${GLOBE_CENTER.x} ${GLOBE_CENTER.y})`);
      }
    }

    // Hour grid
    if (elements.hourGrid) {
      elements.hourGrid.style.display = state.overlays.hourGrid ? '' : 'none';
    }
  }

  // ============================================
  // Readout Updates
  // ============================================

  function updateReadouts() {
    const declination = getSunDeclination(state.dayOfYear);
    const dayLength = getDayLength(state.latitude, declination);
    const sunAltitude = getSunAltitude(state.latitude, declination);
    const distance = getEarthSunDistance(state.dayOfYear);

    // Date display
    elements.dateDisplay.textContent = dayOfYearToDate(state.dayOfYear);

    // Season displays
    const seasonNorth = getSeasonNorth(state.dayOfYear);
    const seasonSouth = getSeasonSouth(state.dayOfYear);

    elements.seasonNorthDisplay.textContent = seasonNorth;
    elements.seasonNorthDisplay.className = 'readout-value ' + getSeasonClass(seasonNorth);

    elements.seasonSouthDisplay.textContent = seasonSouth;
    elements.seasonSouthDisplay.className = 'readout-value ' + getSeasonClass(seasonSouth);

    // Day length
    elements.dayLengthDisplay.textContent = formatDayLength(dayLength);

    // Sun altitude
    elements.sunAltitudeDisplay.textContent = `${sunAltitude.toFixed(1)}°`;

    // Distance
    elements.distanceDisplay.textContent = `${distance.toFixed(3)} AU`;

    // Slider displays
    elements.dateSliderDisplay.textContent = Math.round(state.dayOfYear);
    const eps = effectiveObliquityDegrees(state.axialTilt);
    if (state.axialTilt > 90) {
      elements.tiltDisplay.textContent = `${state.axialTilt.toFixed(1)}° (effective ${eps.toFixed(1)}°)`;
    } else {
      elements.tiltDisplay.textContent = `${state.axialTilt.toFixed(1)}°`;
    }

    elements.latitudeDisplay.textContent = formatLatitude(state.latitude);

    // Update ARIA for Earth position
    const earthOrbital = document.getElementById('earth-orbital');
    if (earthOrbital) {
      const seasonN = getSeasonNorth(state.dayOfYear);
      earthOrbital.setAttribute('aria-label',
        `Earth at ${dayOfYearToDate(state.dayOfYear)}, ${seasonN} in Northern Hemisphere`);
    }

    // Announce significant changes
    const announce = document.getElementById('status-announce');
    if (announce && !state.animating) {
      announce.textContent = `${dayOfYearToDate(state.dayOfYear)}, Northern ${getSeasonNorth(state.dayOfYear)}`;
    }
  }

  // ============================================
  // Main Update Function
  // ============================================

  function update() {
    updateOrbitalView();
    updateGlobeView();
    updateReadouts();
  }

  // ============================================
  // Controls
  // ============================================

  function setupControls() {
    // Date slider
    elements.dateSlider.addEventListener('input', () => {
      stopAnimation();
      state.dayOfYear = parseFloat(elements.dateSlider.value);
      updateSeasonPresetHighlight();
      update();
    });

    // Tilt slider
    elements.tiltSlider.addEventListener('input', () => {
      state.axialTilt = parseFloat(elements.tiltSlider.value);
      updatePlanetPresetHighlight();
      update();
    });

    // Latitude slider
    elements.latitudeSlider.addEventListener('input', () => {
      state.latitude = parseFloat(elements.latitudeSlider.value);
      update();
    });

    // Season presets
    const seasonPresets = [
      { el: elements.presetMarEquinox, day: 80 },
      { el: elements.presetJunSolstice, day: 172 },
      { el: elements.presetSepEquinox, day: 266 },
      { el: elements.presetDecSolstice, day: 356 }
    ];

    seasonPresets.forEach(preset => {
      preset.el.addEventListener('click', () => {
        stopAnimation();
        animateToDay(preset.day);
        updateSeasonPresetHighlight(preset.el);
      });
    });

    // Planet presets
    const planetPresets = [
      { el: elements.presetEarth, planet: 'earth' },
      { el: elements.presetMars, planet: 'mars' },
      { el: elements.presetUranus, planet: 'uranus' },
      { el: elements.presetVenus, planet: 'venus' },
      { el: elements.presetJupiter, planet: 'jupiter' },
      { el: elements.presetSaturn, planet: 'saturn' },
      { el: elements.presetNeptune, planet: 'neptune' }
    ];

    planetPresets.forEach(preset => {
      preset.el.addEventListener('click', () => {
        const planetData = PLANET_DATA[preset.planet];
        const tilt = planetData ? parseFloat(planetData.tilt) : parseFloat(preset.el.getAttribute('data-tilt'));
        state.currentPlanet = preset.planet;

        // Store actual tilt value (0-180° range now supported)
        state.axialTilt = tilt;
        elements.tiltSlider.value = tilt;

        updatePlanetPresetHighlight(preset.el);
        update();
      });
    });

    // Animation buttons
    elements.btnAnimateYear.addEventListener('click', () => {
      animateYear();
    });

    elements.btnStop.addEventListener('click', () => {
      stopAnimation();
    });

    if (elements.btnResetDefaults) {
      elements.btnResetDefaults.addEventListener('click', () => {
        stopAnimation();

        state.currentPlanet = 'earth';
        state.dayOfYear = 80;
        state.axialTilt = 23.5;
        state.latitude = 40;

        elements.dateSlider.value = state.dayOfYear;
        elements.tiltSlider.value = state.axialTilt;
        elements.latitudeSlider.value = state.latitude;

        updateSeasonPresetHighlight(elements.presetMarEquinox);
        updatePlanetPresetHighlight(elements.presetEarth);
        update();
      });
    }

    // Overlay toggles
    elements.toggleCelestialEquator.addEventListener('change', () => {
      state.overlays.celestialEquator = elements.toggleCelestialEquator.checked;
      update();
    });

    elements.toggleEcliptic.addEventListener('change', () => {
      state.overlays.ecliptic = elements.toggleEcliptic.checked;
      update();
    });

    elements.toggleLatitudeBands.addEventListener('change', () => {
      state.overlays.latitudeBands = elements.toggleLatitudeBands.checked;
      update();
    });

    elements.toggleTerminator.addEventListener('change', () => {
      state.overlays.terminator = elements.toggleTerminator.checked;
      update();
    });

    elements.toggleHourGrid.addEventListener('change', () => {
      state.overlays.hourGrid = elements.toggleHourGrid.checked;
      update();
    });
  }

  function updateSeasonPresetHighlight(activeEl) {
    const presets = [
      elements.presetMarEquinox,
      elements.presetJunSolstice,
      elements.presetSepEquinox,
      elements.presetDecSolstice
    ];

    presets.forEach(el => el.classList.remove('active'));

    if (activeEl) {
      activeEl.classList.add('active');
    } else {
      // Auto-detect based on current day
      const day = state.dayOfYear;
      if (Math.abs(day - 80) < 10) elements.presetMarEquinox.classList.add('active');
      else if (Math.abs(day - 172) < 10) elements.presetJunSolstice.classList.add('active');
      else if (Math.abs(day - 266) < 10) elements.presetSepEquinox.classList.add('active');
      else if (day > 346 || day < 10) elements.presetDecSolstice.classList.add('active');
    }
  }

  function updatePlanetPresetHighlight(activeEl) {
    const presets = [
      elements.presetEarth,
      elements.presetMars,
      elements.presetUranus,
      elements.presetVenus,
      elements.presetJupiter,
      elements.presetSaturn,
      elements.presetNeptune
    ];

    presets.forEach(el => el.classList.remove('active'));

    if (activeEl) {
      activeEl.classList.add('active');
    }

    // Update planet indicator display
    updatePlanetIndicator();
  }

  function updatePlanetIndicator() {
    const planetData = PLANET_DATA[state.currentPlanet];
    if (planetData && elements.planetName && elements.planetTiltDisplay) {
      elements.planetName.textContent = planetData.name;
      const eps = effectiveObliquityDegrees(planetData.tilt);
      if (planetData.tilt > 90) {
        elements.planetTiltDisplay.textContent = `(${planetData.tilt}° tilt, effective ${eps.toFixed(1)}°)`;
      } else {
        elements.planetTiltDisplay.textContent = `(${planetData.tilt}° tilt)`;
      }

      // Update indicator color to match planet
      if (elements.planetIndicator) {
        const rgb = resolveRgbTriplet(planetData.color) || '74, 144, 217';
        elements.planetIndicator.style.background = `rgba(${rgb}, 0.15)`;
        elements.planetIndicator.style.borderColor = `rgba(${rgb}, 0.4)`;
      }
      if (elements.planetName) {
        elements.planetName.style.color = planetData.color;
      }
    }
  }

  const resolvedRgbCache = new Map();

  function resolveRgbTriplet(color) {
    if (!color || typeof color !== 'string') return null;
    const key = color.trim();
    if (key === '') return null;

    const cached = resolvedRgbCache.get(key);
    if (cached) return cached;

    const fromHex = rgbTripletFromHex(key);
    if (fromHex) {
      resolvedRgbCache.set(key, fromHex);
      return fromHex;
    }

    const varMatch = /^var\(\s*(--[\w-]+)\s*\)$/.exec(key);
    if (varMatch) {
      const cssValue = getComputedStyle(document.documentElement).getPropertyValue(varMatch[1]).trim();
      if (cssValue) {
        const resolved = resolveRgbTriplet(cssValue);
        if (resolved) {
          resolvedRgbCache.set(key, resolved);
          return resolved;
        }
      }
    }

    const probe = document.createElement('span');
    probe.style.color = key;
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();

    const rgbMatch = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(computed);
    if (!rgbMatch) return null;

    const triplet = `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
    resolvedRgbCache.set(key, triplet);
    return triplet;
  }

  function rgbTripletFromHex(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return null;
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }

  // ============================================
  // Animation
  // ============================================

  function stopAnimation() {
    state.animating = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
    elements.btnStop.disabled = true;
    elements.btnAnimateYear.disabled = false;
  }

  function animateToDay(targetDay) {
    const startDay = state.dayOfYear;
    let diff = targetDay - startDay;

    // Take shortest path around the year
    if (diff > 182.5) diff -= 365;
    if (diff < -182.5) diff += 365;

    AstroUtils.animateValue(startDay, startDay + diff, 500, (val) => {
      state.dayOfYear = ((val % 365) + 365) % 365;
      elements.dateSlider.value = state.dayOfYear;
      update();
    });
  }

  function animateYear() {
    stopAnimation();
    state.animating = true;
    elements.btnStop.disabled = false;
    elements.btnAnimateYear.disabled = true;

    const duration = 10000; // 10 seconds for full year
    const startDay = state.dayOfYear;
    const startTime = performance.now();

    function frame(currentTime) {
      if (!state.animating) return;

      const elapsed = currentTime - startTime;
      const progress = (elapsed / duration) % 1; // Loop continuously

      state.dayOfYear = (startDay + progress * 365) % 365;
      elements.dateSlider.value = state.dayOfYear;
      updateSeasonPresetHighlight();
      update();

      state.animationId = requestAnimationFrame(frame);
    }

    state.animationId = requestAnimationFrame(frame);
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      // Only handle if not focused on an input
      if (event.target.tagName === 'INPUT') return;

      let dayDelta = 0;
      let jumpDay = null;

      switch (event.key) {
        case 'ArrowLeft':
          dayDelta = event.shiftKey ? -30 : -1;
          break;
        case 'ArrowRight':
          dayDelta = event.shiftKey ? 30 : 1;
          break;
        case 'e':
        case 'E':
          // Jump to nearest equinox
          const distToMar = Math.abs(state.dayOfYear - 80);
          const distToSep = Math.abs(state.dayOfYear - 266);
          jumpDay = distToMar < distToSep ? 80 : 266;
          break;
        case 's':
        case 'S':
          // Jump to nearest solstice
          const distToJun = Math.abs(state.dayOfYear - 172);
          const distToDec = Math.min(Math.abs(state.dayOfYear - 356), Math.abs(state.dayOfYear + 9));
          jumpDay = distToJun < distToDec ? 172 : 356;
          break;
        case ' ':
          event.preventDefault();
          if (state.animating) {
            stopAnimation();
          } else {
            animateYear();
          }
          return;
        default:
          return;
      }

      event.preventDefault();
      stopAnimation();

      if (jumpDay !== null) {
        animateToDay(jumpDay);
      } else if (dayDelta !== 0) {
        state.dayOfYear = ((state.dayOfYear + dayDelta) % 365 + 365) % 365;
        elements.dateSlider.value = state.dayOfYear;
        updateSeasonPresetHighlight();
        update();
      }
    });
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupControls();
    setupKeyboard();

    // Initialize starfield if available
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      const starfield = Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
      starfield.start();
    }

    // Set initial slider values
    elements.dateSlider.value = state.dayOfYear;
    elements.tiltSlider.value = state.axialTilt;
    elements.latitudeSlider.value = state.latitude;

    // Set initial overlay checkbox states
    elements.toggleCelestialEquator.checked = state.overlays.celestialEquator;
    elements.toggleEcliptic.checked = state.overlays.ecliptic;
    elements.toggleLatitudeBands.checked = state.overlays.latitudeBands;
    elements.toggleTerminator.checked = state.overlays.terminator;
    elements.toggleHourGrid.checked = state.overlays.hourGrid;

    loadPlanetsJson().then(() => {
      updatePlanetIndicator();
      update();
    });

    // Initial update
    update();
    updateSeasonPresetHighlight();
    updatePlanetIndicator();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
