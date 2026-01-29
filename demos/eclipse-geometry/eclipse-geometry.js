/**
 * Eclipse Geometry Demo
 * Interactive demonstration of why eclipses don't happen every month
 */

(function() {
  'use strict';

  const Model = typeof window !== 'undefined' ? window.EclipseGeometryModel : null;
  if (!Model) {
    console.error('Eclipse Geometry: missing window.EclipseGeometryModel (did you load demos/_assets/eclipse-geometry-model.js?)');
    return;
  }

  // ============================================
  // Constants
  // ============================================

  const CENTER = { x: 200, y: 200 };
  const ORBIT_RADIUS = 100;
  const DAYS_PER_TROPICAL_YEAR = 365.2422; // days
  const SIDEREAL_MONTH_DAYS = 27.321661; // days
  const SYNODIC_MONTH_DAYS = 29.530588; // days (New to New)
  const NODE_REGRESSION_YEARS = 18.6; // years (nodal precession period; VERIFY)

  const SUN_RATE_DEG_PER_DAY = 360 / DAYS_PER_TROPICAL_YEAR;
  const MOON_RATE_DEG_PER_DAY = 360 / SIDEREAL_MONTH_DAYS;
  const NODE_RATE_DEG_PER_DAY = -360 / (NODE_REGRESSION_YEARS * DAYS_PER_TROPICAL_YEAR);

  // Eclipse checks should require being close to true syzygy (New/Full), not merely inside
  // a coarse "phase label" bucket.
  const SYZYGY_TOLERANCE_DEG = 5; // pedagogical; hours-level realism not required
  const STATUS_PLANE_EPS_DEG = 0.05; // treat as "in plane" for copy/readouts

  // Eclipse classification uses a physically-motivated shadow model (similar triangles)
  // with user-selectable Earth–Moon distance. This yields realistic “eclipse season” windows without
  // hard-coding node-angle thresholds.
  const MOON_DISTANCE_PRESETS_KM = {
    perigee: 363300,
    mean: 384400,
    apogee: 405500,
  };

  const STORAGE_KEYS = {
    simSpeed: 'eclipse-geometry.simSpeed',
    simYearsSlider: 'eclipse-geometry.simYearsSlider',
  };

  // ============================================
  // State
  // ============================================

  const state = {
    // Inertial longitudes (degrees). The SVG visualization is Sun-fixed by displaying
    // angles relative to the Sun direction (i.e., subtracting sunLonDeg internally).
    sunLonDeg: 0,
    moonLonDeg: 180,        // start at Full Moon (opposite Sun)
    orbitalTilt: 5.145,     // Degrees of orbital tilt
    nodeLonDeg: 210,        // chosen so the displayed ascending node starts at ~30°
    earthMoonDistanceKm: MOON_DISTANCE_PRESETS_KM.mean,
    animationId: null,
    isAnimating: false,

    // Simulation stats (track total and partial separately)
    totalSolarEclipses: 0,
    annularSolarEclipses: 0,
    partialSolarEclipses: 0,
    totalLunarEclipses: 0,
    partialLunarEclipses: 0,
    penumbralLunarEclipses: 0,
    yearsSimulated: 0,

    // Eclipse log for table display
    eclipseLog: [],
    showLog: false
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // SVG elements
      moonTopCircle: document.getElementById('moon-top-circle'),
      moonSide: document.getElementById('moon-side'),
      moonOrbit: document.getElementById('moon-orbit'),
      moonPathSide: document.getElementById('moon-path-side'),
      heightLine: document.getElementById('height-line'),
      heightLabel: document.getElementById('height-label'),
      ascendingNode: document.getElementById('ascending-node'),
      descendingNode: document.getElementById('descending-node'),
      ascendingNodeLabel: document.getElementById('ascending-node-label'),
      descendingNodeLabel: document.getElementById('descending-node-label'),
      nodeSide1: document.getElementById('node-side-1'),
      nodeSide2: document.getElementById('node-side-2'),

      // Status
      eclipseStatus: document.getElementById('eclipse-status'),
      statusDetail: document.getElementById('status-detail'),
      nodeDistanceDetail: document.getElementById('node-distance-detail'),
      distanceDetail: document.getElementById('distance-detail'),
      statusNote: document.getElementById('status-note'),

      // Controls
      tiltSlider: document.getElementById('tilt-slider'),
      tiltDisplay: document.getElementById('tilt-display'),
      phaseDisplay: document.getElementById('phase-display'),
      moonAngleSlider: document.getElementById('moon-angle-slider'),
      moonAngleDisplay: document.getElementById('moon-angle-display'),
      moonDistanceSelect: document.getElementById('moon-distance-select'),
      moonDistanceDisplay: document.getElementById('moon-distance-display'),

      // Buttons
      btnNewMoon: document.getElementById('btn-new-moon'),
      btnFullMoon: document.getElementById('btn-full-moon'),
      btnAnimateMonth: document.getElementById('btn-animate-month'),
      btnAnimateYear: document.getElementById('btn-animate-year'),
      btnRunSim: document.getElementById('btn-run-sim'),
      btnStop: document.getElementById('btn-stop'),
      btnToggleLog: document.getElementById('btn-toggle-log'),
      btnClearLog: document.getElementById('btn-clear-log'),
      btnReset: document.getElementById('btn-reset'),

      // Simulation slider
      simYearsSlider: document.getElementById('sim-years-slider'),
      simYearsDisplay: document.getElementById('sim-years-display'),
      simSpeedSelect: document.getElementById('sim-speed-select'),
      simSpeedDisplay: document.getElementById('sim-speed-display'),

      // Stats
      statsPanel: document.getElementById('stats-panel'),
      statSolar: document.getElementById('stat-solar'),
      statLunar: document.getElementById('stat-lunar'),
      statYears: document.getElementById('stat-years'),

      // Eclipse log
      logPanel: document.getElementById('eclipse-log-panel'),
      logTable: document.getElementById('eclipse-log-table'),

      // Eclipse window arcs (node distance windows)
      arcSolarAnyAsc: document.getElementById('arc-solar-any-asc'),
      arcSolarAnyDesc: document.getElementById('arc-solar-any-desc'),
      arcSolarCentralAsc: document.getElementById('arc-solar-central-asc'),
      arcSolarCentralDesc: document.getElementById('arc-solar-central-desc'),
      arcLunarAnyAsc: document.getElementById('arc-lunar-any-asc'),
      arcLunarAnyDesc: document.getElementById('arc-lunar-any-desc'),
      arcLunarCentralAsc: document.getElementById('arc-lunar-central-asc'),
      arcLunarCentralDesc: document.getElementById('arc-lunar-central-desc')
    };
  }

  // ============================================
  // Calculations
  // ============================================

  function normalizeAngleDeg(angleDeg) {
    return Model.normalizeAngleDeg(angleDeg);
  }

  function angularSeparationDeg(aDeg, bDeg) {
    return Model.angularSeparationDeg(aDeg, bDeg);
  }

  function isNearAngle(angleDeg, targetDeg, toleranceDeg) {
    return angularSeparationDeg(angleDeg, targetDeg) <= toleranceDeg;
  }

  function getPhaseAngleDeg() {
    return Model.phaseAngleDeg({ moonLonDeg: state.moonLonDeg, sunLonDeg: state.sunLonDeg });
  }

  function getMoonEclipticLatitudeDeg(moonLonDeg = state.moonLonDeg, nodeLonDeg = state.nodeLonDeg) {
    return Model.eclipticLatitudeDeg({
      tiltDeg: state.orbitalTilt,
      moonLonDeg,
      nodeLonDeg,
    });
  }

  function getEclipseThresholds(earthMoonDistanceKm = state.earthMoonDistanceKm) {
    return Model.eclipseThresholdsDeg({ earthMoonDistanceKm });
  }

  function polarToXY(center, r, deg) {
    const a = (deg * Math.PI) / 180;
    return { x: center.x + r * Math.cos(a), y: center.y - r * Math.sin(a) };
  }

  function arcPath(center, r, startDeg, endDeg) {
    const start = polarToXY(center, r, startDeg);
    const end = polarToXY(center, r, endDeg);
    const sweep = normalizeAngleDeg(endDeg - startDeg);
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }

  function fullCirclePath(center, r, startDeg) {
    const midDeg = normalizeAngleDeg(startDeg + 180);
    const start = polarToXY(center, r, startDeg);
    const mid = polarToXY(center, r, midDeg);
    const end = start;
    const a1 = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 0 0 ${mid.x.toFixed(2)} ${mid.y.toFixed(2)}`;
    const a2 = `A ${r} ${r} 0 0 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
    return `${a1} ${a2}`;
  }

  function setWindowArc(pathEl, centerDeg, halfWidthDeg) {
    if (!pathEl) return;
    if (!Number.isFinite(halfWidthDeg) || halfWidthDeg <= 0) {
      pathEl.setAttribute('d', '');
      return;
    }

    // If the window covers essentially the full orbit, draw a full circle.
    if (halfWidthDeg >= 179.999) {
      pathEl.setAttribute('d', fullCirclePath(CENTER, ORBIT_RADIUS, centerDeg));
      return;
    }

    const startDeg = normalizeAngleDeg(centerDeg - halfWidthDeg);
    const endDeg = normalizeAngleDeg(centerDeg + halfWidthDeg);
    pathEl.setAttribute('d', arcPath(CENTER, ORBIT_RADIUS, startDeg, endDeg));
  }

  function updateEclipseWindowArcs() {
    // Convert the latitude thresholds into "within Δλ of a node" windows for the current tilt.
    const thresholds = getEclipseThresholds();
    const dSolarAny = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: thresholds.solarPartialDeg });
    const dSolarCentral = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: thresholds.solarCentralDeg });
    const dLunarAny = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: thresholds.lunarPenumbralDeg });
    const dLunarCentral = Model.deltaLambdaFromBetaDeg({ tiltDeg: state.orbitalTilt, betaDeg: thresholds.lunarTotalDeg });

    const nodeAsc = getDisplayNodeAngleDeg();
    const nodeDesc = normalizeAngleDeg(nodeAsc + 180);

    setWindowArc(elements.arcSolarAnyAsc, nodeAsc, dSolarAny);
    setWindowArc(elements.arcSolarAnyDesc, nodeDesc, dSolarAny);
    setWindowArc(elements.arcSolarCentralAsc, nodeAsc, dSolarCentral);
    setWindowArc(elements.arcSolarCentralDesc, nodeDesc, dSolarCentral);
    setWindowArc(elements.arcLunarAnyAsc, nodeAsc, dLunarAny);
    setWindowArc(elements.arcLunarAnyDesc, nodeDesc, dLunarAny);
    setWindowArc(elements.arcLunarCentralAsc, nodeAsc, dLunarCentral);
    setWindowArc(elements.arcLunarCentralDesc, nodeDesc, dLunarCentral);
  }

  // Phase labels based on phase angle Δ = λ_moon - λ_sun:
  //   0° = New, 180° = Full.
  function getPhaseLabel(phaseAngleDeg) {
    const normalized = normalizeAngleDeg(phaseAngleDeg);

    if (normalized < 22.5 || normalized >= 337.5) return 'New Moon';
    if (normalized < 67.5) return 'Waxing Crescent';
    if (normalized < 112.5) return 'First Quarter';
    if (normalized < 157.5) return 'Waxing Gibbous';
    if (normalized < 202.5) return 'Full Moon';
    if (normalized < 247.5) return 'Waning Gibbous';
    if (normalized < 292.5) return 'Third Quarter';
    return 'Waning Crescent';
  }

  function getDisplayMoonAngleDeg() {
    // Display convention: 180° is toward the Sun (left), 0° is opposite the Sun (right).
    return normalizeAngleDeg(180 + (state.moonLonDeg - state.sunLonDeg));
  }

  function getDisplayNodeAngleDeg() {
    return normalizeAngleDeg(180 + (state.nodeLonDeg - state.sunLonDeg));
  }

  function setMoonFromDisplayAngleDeg(displayAngleDeg) {
    state.moonLonDeg = state.sunLonDeg + (normalizeAngleDeg(displayAngleDeg) - 180);
  }

  function setNodeFromDisplayAngleDeg(displayAngleDeg) {
    state.nodeLonDeg = state.sunLonDeg + (normalizeAngleDeg(displayAngleDeg) - 180);
  }

  /**
   * Check if eclipse is possible
   * @returns {object} { type: 'none'|'solar'|'lunar', detail: string }
   */
  function checkEclipse() {
    const height = getMoonEclipticLatitudeDeg();
    const absHeight = Math.abs(height);
    const phaseAngle = getPhaseAngleDeg();
    const phaseLabel = getPhaseLabel(phaseAngle);
    const nearNew = isNearAngle(phaseAngle, 0, SYZYGY_TOLERANCE_DEG);
    const nearFull = isNearAngle(phaseAngle, 180, SYZYGY_TOLERANCE_DEG);

    // Check for solar eclipse (New Moon)
    if (nearNew) {
      const solar = Model.solarEclipseTypeFromBetaDeg({
        betaDeg: absHeight,
        earthMoonDistanceKm: state.earthMoonDistanceKm,
      });
      if (solar.type === 'total-solar') {
        return { type: 'total-solar', detail: `TOTAL solar eclipse — |β| = ${absHeight.toFixed(2)}°` };
      }
      if (solar.type === 'annular-solar') {
        return { type: 'annular-solar', detail: `ANNULAR solar eclipse — |β| = ${absHeight.toFixed(2)}°` };
      }
      if (solar.type === 'partial-solar') {
        return { type: 'partial-solar', detail: `Partial solar eclipse — |β| = ${absHeight.toFixed(2)}°` };
      }
    }

    // Check for lunar eclipse (Full Moon)
    if (nearFull) {
      const lunar = Model.lunarEclipseTypeFromBetaDeg({
        betaDeg: absHeight,
        earthMoonDistanceKm: state.earthMoonDistanceKm,
      });
      if (lunar.type === 'total-lunar') {
        return { type: 'total-lunar', detail: `TOTAL lunar eclipse — |β| = ${absHeight.toFixed(2)}°` };
      }
      if (lunar.type === 'partial-lunar') {
        return { type: 'partial-lunar', detail: `Umbral lunar eclipse (partial) — |β| = ${absHeight.toFixed(2)}°` };
      }
      if (lunar.type === 'penumbral-lunar') {
        return { type: 'penumbral-lunar', detail: `Penumbral lunar eclipse — |β| = ${absHeight.toFixed(2)}°` };
      }
    }

    const direction = height > 0 ? 'above' : 'below';
    if (phaseLabel === 'New Moon' || phaseLabel === 'Full Moon') {
      return {
        type: 'none',
        detail: `Moon is ${absHeight.toFixed(1)}° ${direction} the ecliptic — no eclipse`
      };
    }

    return {
      type: 'none',
      detail: `${phaseLabel} — eclipses only occur at new/full moon`
    };
  }

  function formatEclipseTypeLabel(type) {
    switch (type) {
      case 'total-solar':
        return 'Total solar';
      case 'annular-solar':
        return 'Annular solar';
      case 'partial-solar':
        return 'Partial solar';
      case 'total-lunar':
        return 'Total lunar';
      case 'partial-lunar':
        return 'Umbral lunar';
      case 'penumbral-lunar':
        return 'Penumbral lunar';
      default:
        return type;
    }
  }

  // ============================================
  // Visualization Updates
  // ============================================

  function updateVisualization() {
    const moonAngle = getDisplayMoonAngleDeg();
    const nodeAngle = getDisplayNodeAngleDeg();

    const angleRad = moonAngle * Math.PI / 180;
    const nodeRad = nodeAngle * Math.PI / 180;

    // Top view: Moon position on tilted orbit
    // The orbit appears as an ellipse when tilted (but we keep it circular for simplicity)
    const moonX = CENTER.x + ORBIT_RADIUS * Math.cos(angleRad);
    const moonY = CENTER.y - ORBIT_RADIUS * Math.sin(angleRad);

    elements.moonTopCircle.setAttribute('cx', moonX);
    elements.moonTopCircle.setAttribute('cy', moonY);

    // Node positions (on the line of nodes)
    const ascX = CENTER.x + ORBIT_RADIUS * Math.cos(nodeRad);
    const ascY = CENTER.y - ORBIT_RADIUS * Math.sin(nodeRad);
    const descX = CENTER.x + ORBIT_RADIUS * Math.cos(nodeRad + Math.PI);
    const descY = CENTER.y - ORBIT_RADIUS * Math.sin(nodeRad + Math.PI);

    elements.ascendingNode.setAttribute('cx', ascX);
    elements.ascendingNode.setAttribute('cy', ascY);
    elements.descendingNode.setAttribute('cx', descX);
    elements.descendingNode.setAttribute('cy', descY);

    if (elements.ascendingNodeLabel) {
      elements.ascendingNodeLabel.setAttribute('x', ascX + 10);
      elements.ascendingNodeLabel.setAttribute('y', ascY + 4);
      elements.ascendingNodeLabel.setAttribute('text-anchor', 'start');
    }
    if (elements.descendingNodeLabel) {
      elements.descendingNodeLabel.setAttribute('x', descX - 10);
      elements.descendingNodeLabel.setAttribute('y', descY + 4);
      elements.descendingNodeLabel.setAttribute('text-anchor', 'end');
    }

    // Side view: Moon's vertical position
    const height = getMoonEclipticLatitudeDeg();

    // Map angle to horizontal position in side view
    // Project along the Sun–Earth line so phase geometry is truthful:
    // Full Moon (0°) is to the right of Earth, New Moon (180°) is to the left.
    const sideX = 200 + ORBIT_RADIUS * Math.cos(angleRad);
    const sideY = 100 - height * 8; // Scale height for visibility

    elements.moonSide.setAttribute('cx', sideX);
    elements.moonSide.setAttribute('cy', sideY);

    // Height indicator
    elements.heightLine.setAttribute('x1', sideX);
    elements.heightLine.setAttribute('x2', sideX);
    elements.heightLine.setAttribute('y1', 100);
    elements.heightLine.setAttribute('y2', sideY);

    elements.heightLabel.setAttribute('x', sideX + 10);
    elements.heightLabel.setAttribute('y', (100 + sideY) / 2);
    elements.heightLabel.textContent = `${height >= 0 ? '+' : ''}${height.toFixed(1)}°`;

    // Update sinusoidal path for side view
    updateMoonPath();

    // Update eclipse windows (arcs around nodes)
    updateEclipseWindowArcs();

    // Update nodes on side view
    // Nodes are where the orbit crosses the ecliptic (y=100)
    elements.nodeSide1.setAttribute('cx', ascX);
    elements.nodeSide2.setAttribute('cx', descX);
  }

  function updateMoonPath() {
    // Draw the Moon's tilted path in side view.
    let pathD = '';
    for (let i = 0; i <= 360; i += 5) {
      const angleRad = i * Math.PI / 180;
      const x = 200 + ORBIT_RADIUS * Math.cos(angleRad);
      // Convert display-angle i back to inertial moon longitude, keeping the display Sun-fixed.
      const moonLonDeg = state.sunLonDeg + (i - 180);
      const h = getMoonEclipticLatitudeDeg(moonLonDeg, state.nodeLonDeg);
      const y = 100 - h * 8;

      if (i === 0) {
        pathD = `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    }
    elements.moonPathSide.setAttribute('d', pathD);
  }

  function updateStatus() {
    const eclipse = checkEclipse();
    const phaseAngle = getPhaseAngleDeg();
    const phase = getPhaseLabel(phaseAngle);
    const height = getMoonEclipticLatitudeDeg();
    const absHeight = Math.abs(height);
    const direction = height >= 0 ? 'above' : 'below';
    const nodeDistance = Model.nearestNodeDistanceDeg({ moonLonDeg: state.moonLonDeg, nodeLonDeg: state.nodeLonDeg });

    // Persistent lecture-contract readout (exact phrasing)
    elements.statusDetail.textContent =
      absHeight < STATUS_PLANE_EPS_DEG
        ? `Moon is in the ecliptic plane (${absHeight.toFixed(1)}°)`
        : `Moon is ${absHeight.toFixed(1)}° ${direction} ecliptic plane`;

    if (elements.nodeDistanceDetail) {
      elements.nodeDistanceDetail.textContent = `Nearest node: ${nodeDistance.toFixed(1)}°`;
    }

    if (elements.distanceDetail) {
      elements.distanceDetail.textContent = `Earth–Moon distance: ${Math.round(state.earthMoonDistanceKm).toLocaleString()} km`;
    }
    if (elements.moonDistanceDisplay) {
      elements.moonDistanceDisplay.textContent = `${Math.round(state.earthMoonDistanceKm).toLocaleString()} km`;
    }

    // Status indicator
    let statusText = 'NO ECLIPSE';
    let cssClass = 'miss';
    switch (eclipse.type) {
      case 'total-solar':
        statusText = 'TOTAL SOLAR ECLIPSE';
        cssClass = 'solar';
        break;
      case 'annular-solar':
        statusText = 'ANNULAR SOLAR ECLIPSE';
        cssClass = 'solar';
        break;
      case 'partial-solar':
        statusText = 'PARTIAL SOLAR ECLIPSE';
        cssClass = 'solar';
        break;
      case 'total-lunar':
        statusText = 'TOTAL LUNAR ECLIPSE';
        cssClass = 'lunar';
        break;
      case 'partial-lunar':
        statusText = 'UMBRAL LUNAR ECLIPSE';
        cssClass = 'lunar';
        break;
      case 'penumbral-lunar':
        statusText = 'PENUMBRAL LUNAR ECLIPSE';
        cssClass = 'lunar';
        break;
      default:
        break;
    }

    elements.eclipseStatus.textContent = statusText;
    elements.eclipseStatus.className = 'eclipse-status ' + cssClass;

    if (elements.statusNote) {
      if (eclipse.type === 'none') {
        const nearSyzygy =
          isNearAngle(phaseAngle, 0, SYZYGY_TOLERANCE_DEG) ||
          isNearAngle(phaseAngle, 180, SYZYGY_TOLERANCE_DEG);
        elements.statusNote.textContent =
          nearSyzygy
            ? 'Too far from node for an eclipse'
            : 'Eclipses require New/Full Moon near a node';
      } else if (eclipse.type === 'annular-solar') {
        elements.statusNote.textContent = 'Annular eclipse conditions';
      } else if (eclipse.type === 'penumbral-lunar') {
        elements.statusNote.textContent = 'Penumbral eclipse conditions';
      } else if (eclipse.type.includes('total')) {
        elements.statusNote.textContent = 'Total eclipse conditions';
      } else if (eclipse.type.includes('partial')) {
        elements.statusNote.textContent = 'Partial eclipse conditions';
      } else {
        elements.statusNote.textContent = '';
      }
    }

    elements.phaseDisplay.textContent = phase;

    if (elements.moonAngleSlider && elements.moonAngleDisplay) {
      const displayAngle = getDisplayMoonAngleDeg();
      elements.moonAngleSlider.value = Math.round(displayAngle).toString();
      elements.moonAngleDisplay.textContent = `${Math.round(displayAngle)}°`;
    }
  }

		  function updateStats() {
		    // Show total eclipses prominently, partial in parentheses
		    const totalSolar = state.totalSolarEclipses;
		    const allSolar = state.totalSolarEclipses + state.annularSolarEclipses + state.partialSolarEclipses;
		    const totalLunar = state.totalLunarEclipses;
		    const allLunar = state.totalLunarEclipses + state.partialLunarEclipses + state.penumbralLunarEclipses;

		    elements.statSolar.innerHTML = `${totalSolar} <small style="opacity:0.6">(${allSolar} incl. annular + partial)</small>`;
		    elements.statLunar.innerHTML = `${totalLunar} <small style="opacity:0.6">(${allLunar} incl. umbral + penumbral)</small>`;
		    elements.statYears.textContent = state.yearsSimulated.toFixed(1);
		  }

  function update() {
    updateVisualization();
    updateStatus();
  }

  // ============================================
  // Drag Handling
  // ============================================

  function setupDrag() {
    const moonTop = document.getElementById('moon-top');
    const svg = document.getElementById('top-view-svg');
    let isDragging = false;

    function getAngle(event) {
      const rect = svg.getBoundingClientRect();
      const svgX = (event.clientX - rect.left) / rect.width * 400;
      const svgY = (event.clientY - rect.top) / rect.height * 400;

      const dx = svgX - CENTER.x;
      const dy = CENTER.y - svgY;

      return Math.atan2(dy, dx) * 180 / Math.PI;
    }

    moonTop.addEventListener('mousedown', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    });

    moonTop.addEventListener('touchstart', (e) => {
      isDragging = true;
      stopAnimation();
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setMoonFromDisplayAngleDeg(normalizeAngleDeg(getAngle(e)));
      update();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches.length) return;
      const touch = e.touches[0];
      setMoonFromDisplayAngleDeg(normalizeAngleDeg(getAngle(touch)));
      update();
    }, { passive: false });

    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('touchend', () => { isDragging = false; });
  }

  // ============================================
  // Controls
  // ============================================

	  function setupControls() {
	    // Tilt slider
	    elements.tiltSlider.addEventListener('input', () => {
	      state.orbitalTilt = parseFloat(elements.tiltSlider.value) / 10;
	      elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';
	      update();
	    });

	    if (elements.moonDistanceSelect) {
	      elements.moonDistanceSelect.addEventListener('change', () => {
	        stopAnimation();
	        const key = elements.moonDistanceSelect.value;
	        const next = MOON_DISTANCE_PRESETS_KM[key] ?? MOON_DISTANCE_PRESETS_KM.mean;
	        state.earthMoonDistanceKm = next;
	        update();
	      });
	    }

    // Phase buttons
    elements.btnNewMoon.addEventListener('click', () => {
      stopAnimation();
      animateToDisplayAngle(180);
    });

    elements.btnFullMoon.addEventListener('click', () => {
      stopAnimation();
      animateToDisplayAngle(0);
    });

    // Moon position slider (keyboard accessible)
    if (elements.moonAngleSlider) {
      elements.moonAngleSlider.addEventListener('input', () => {
        stopAnimation();
        setMoonFromDisplayAngleDeg(parseFloat(elements.moonAngleSlider.value));
        update();
      });
    }

    // Animation buttons
    elements.btnAnimateMonth.addEventListener('click', () => {
      animateMonth();
    });

    elements.btnAnimateYear.addEventListener('click', () => {
      animateYear();
    });

	    // Simulation years slider (logarithmic: 0-100 maps to 1-1000 years)
	    elements.simYearsSlider.addEventListener('input', () => {
	      const years = sliderToYears(parseFloat(elements.simYearsSlider.value));
	      elements.simYearsDisplay.textContent = formatYears(years);
	      safeLocalStorageSet(STORAGE_KEYS.simYearsSlider, elements.simYearsSlider.value);
	    });

	    if (elements.simSpeedSelect) {
	      elements.simSpeedSelect.addEventListener('change', () => {
	        updateSimSpeedDisplay();
	        safeLocalStorageSet(STORAGE_KEYS.simSpeed, elements.simSpeedSelect.value);
	      });
	    }

    elements.btnRunSim.addEventListener('click', () => {
      const years = sliderToYears(parseFloat(elements.simYearsSlider.value));
      simulateYears(years);
    });

    elements.btnStop.addEventListener('click', () => {
      stopAnimation();
    });

    elements.btnToggleLog.addEventListener('click', () => {
      toggleLog();
    });

    if (elements.btnClearLog) {
      elements.btnClearLog.addEventListener('click', () => {
        stopAnimation();
        state.eclipseLog = [];
        updateLogTable();
      });
    }

    // Reset button
    if (elements.btnReset) {
      elements.btnReset.addEventListener('click', () => {
        stopAnimation();

        // Reset state to defaults
	        state.sunLonDeg = 0;
	        state.moonLonDeg = 180;
	        state.nodeLonDeg = 210;
	        state.orbitalTilt = 5.145;
	        state.earthMoonDistanceKm = MOON_DISTANCE_PRESETS_KM.mean;

	        // Reset UI
	        elements.tiltSlider.value = state.orbitalTilt * 10;
	        elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';
	        if (elements.moonDistanceSelect) elements.moonDistanceSelect.value = 'mean';

	        // Reset stats
	        state.totalSolarEclipses = 0;
	        state.annularSolarEclipses = 0;
	        state.partialSolarEclipses = 0;
	        state.totalLunarEclipses = 0;
	        state.partialLunarEclipses = 0;
	        state.penumbralLunarEclipses = 0;
        state.yearsSimulated = 0;
        state.eclipseLog = [];
        updateLogTable();

        // Hide stats panel and log panel
        elements.statsPanel.style.display = 'none';
        elements.logPanel.style.display = 'none';
        state.showLog = false;
        elements.btnToggleLog.textContent = 'Show Log';

        update();
      });
    }
  }

  // Logarithmic slider conversion (slider 0-100 → years 1-1000)
  function sliderToYears(sliderVal) {
    // 0 → 1, 50 → ~32, 100 → 1000
    return Math.pow(10, sliderVal / 100 * 3);
  }

  function yearsToSlider(years) {
    // Inverse: 1 → 0, 32 → 50, 1000 → 100
    return Math.log10(years) / 3 * 100;
  }

  function formatYears(years) {
    if (years >= 1000) return (years / 1000).toFixed(1) + 'k';
    return Math.round(years).toString();
  }

  function safeLocalStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore (private browsing / disabled storage)
    }
  }

  function updateSimSpeedDisplay() {
    if (!elements.simSpeedSelect || !elements.simSpeedDisplay) return;
    const selected = elements.simSpeedSelect.selectedOptions?.[0];
    elements.simSpeedDisplay.textContent = selected ? selected.textContent : elements.simSpeedSelect.value;
  }

  function loadPersistedSimSettings() {
    if (elements.simSpeedSelect) {
      const storedSpeed = safeLocalStorageGet(STORAGE_KEYS.simSpeed);
      const allowed = new Set(Array.from(elements.simSpeedSelect.options).map((opt) => opt.value));
      if (storedSpeed && allowed.has(storedSpeed)) {
        elements.simSpeedSelect.value = storedSpeed;
      }
    }

    if (elements.simYearsSlider && elements.simYearsDisplay) {
      const storedSlider = safeLocalStorageGet(STORAGE_KEYS.simYearsSlider);
      const n = storedSlider === null ? NaN : parseFloat(storedSlider);
      if (Number.isFinite(n)) {
        elements.simYearsSlider.value = String(n);
        const years = sliderToYears(n);
        elements.simYearsDisplay.textContent = formatYears(years);
      }
    }

    updateSimSpeedDisplay();
  }

  function getSpeedConfig() {
    const mode = elements.simSpeedSelect ? elements.simSpeedSelect.value : 'normal';
    switch (mode) {
      case 'slow':
        return { monthMs: 5000, yearMs: 15000, simMonthsPerTick: 1, simTickMs: 60 };
      case 'fast':
        return { monthMs: 1500, yearMs: 5000, simMonthsPerTick: 4, simTickMs: 16 };
      case 'instant':
        return { monthMs: 600, yearMs: 2000, simMonthsPerTick: 50, simTickMs: 0 };
      case 'normal':
      default:
        return { monthMs: 3000, yearMs: 10000, simMonthsPerTick: 1, simTickMs: 30 };
    }
  }

  function animateToDisplayAngle(targetDisplayAngleDeg) {
    const startAngle = getDisplayMoonAngleDeg();
    let diff = targetDisplayAngleDeg - startAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    AstroUtils.animateValue(startAngle, startAngle + diff, 500, (val) => {
      setMoonFromDisplayAngleDeg(normalizeAngleDeg(val));
      update();
    });
  }

  // ============================================
  // Animations
  // ============================================

  function stopAnimation() {
    state.isAnimating = false;
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      clearTimeout(state.animationId);
      state.animationId = null;
    }
  }

  function animateMonth() {
    stopAnimation();
    state.isAnimating = true;

    const duration = getSpeedConfig().monthMs;
    const startSun = state.sunLonDeg;
    const startMoon = state.moonLonDeg;
    const startNode = state.nodeLonDeg;
    const startTime = performance.now();

    function frame(currentTime) {
      if (!state.isAnimating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const timeDays = progress * SYNODIC_MONTH_DAYS;

      state.sunLonDeg = normalizeAngleDeg(startSun + SUN_RATE_DEG_PER_DAY * timeDays);
      state.moonLonDeg = normalizeAngleDeg(startMoon + MOON_RATE_DEG_PER_DAY * timeDays);
      state.nodeLonDeg = normalizeAngleDeg(startNode + NODE_RATE_DEG_PER_DAY * timeDays);

      update();

      if (progress < 1) {
        state.animationId = requestAnimationFrame(frame);
      } else {
        state.isAnimating = false;
      }
    }

    state.animationId = requestAnimationFrame(frame);
  }

  function animateYear() {
    stopAnimation();
    state.isAnimating = true;

    const duration = getSpeedConfig().yearMs;
    const startSun = state.sunLonDeg;
    const startMoon = state.moonLonDeg;
    const startNode = state.nodeLonDeg;
    const startTime = performance.now();

    function frame(currentTime) {
      if (!state.isAnimating) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const timeDays = progress * DAYS_PER_TROPICAL_YEAR;

      state.sunLonDeg = normalizeAngleDeg(startSun + SUN_RATE_DEG_PER_DAY * timeDays);
      state.moonLonDeg = normalizeAngleDeg(startMoon + MOON_RATE_DEG_PER_DAY * timeDays);
      state.nodeLonDeg = normalizeAngleDeg(startNode + NODE_RATE_DEG_PER_DAY * timeDays);

      update();

      if (progress < 1) {
        state.animationId = requestAnimationFrame(frame);
      } else {
        state.isAnimating = false;
      }
    }

    state.animationId = requestAnimationFrame(frame);
  }

  function toggleLog() {
    state.showLog = !state.showLog;
    elements.logPanel.style.display = state.showLog ? 'block' : 'none';
    elements.btnToggleLog.textContent = state.showLog ? 'Hide Log' : 'Show Log';
    if (state.showLog) updateLogTable();
  }

  function updateLogTable() {
    if (!elements.logTable) return;

    // Build table HTML
    let html = '<tr><th>Year</th><th>Type</th><th>Details</th></tr>';

    // Show most recent first, limit to last 100 for performance
    const recentLog = state.eclipseLog.slice(-100).reverse();
    for (const entry of recentLog) {
      const typeClass = entry.type.includes('solar') ? 'solar' : 'lunar';
      const typeLabel = formatEclipseTypeLabel(entry.type);
      html += `<tr class="${typeClass}">
        <td>${entry.year.toFixed(2)}</td>
        <td>${typeLabel}</td>
        <td>${entry.height.toFixed(2)}° from ecliptic</td>
      </tr>`;
    }

    if (state.eclipseLog.length > 100) {
      html += `<tr><td colspan="3" style="opacity:0.6">... and ${state.eclipseLog.length - 100} more</td></tr>`;
    }

    elements.logTable.innerHTML = html;
  }

	  function simulateYears(yearsToSimulate) {
	    stopAnimation();
	    state.isAnimating = true;

	    // Reset stats
	    state.totalSolarEclipses = 0;
	    state.annularSolarEclipses = 0;
	    state.partialSolarEclipses = 0;
	    state.totalLunarEclipses = 0;
	    state.partialLunarEclipses = 0;
	    state.penumbralLunarEclipses = 0;
	    state.yearsSimulated = 0;
	    state.eclipseLog = [];

    elements.statsPanel.style.display = 'grid';
    // Immediately clear the visible log table, so "Reset" / reruns don't leave stale rows.
    updateLogTable();

	    const startSun = state.sunLonDeg;
	    const startMoon = state.moonLonDeg;
	    const startNode = state.nodeLonDeg;
	    const earthMoonDistanceKm = state.earthMoonDistanceKm;

    const totalMonths = Math.ceil((yearsToSimulate * DAYS_PER_TROPICAL_YEAR) / SYNODIC_MONTH_DAYS);

    let currentMonth = 0;

    function simulateBatch() {
      if (!state.isAnimating) return;
      if (currentMonth >= totalMonths) {
        state.isAnimating = false;
        state.yearsSimulated = yearsToSimulate;
        updateStats();
        updateLogTable();
        return;
      }

      const { simMonthsPerTick, simTickMs } = getSpeedConfig();
      for (let i = 0; i < simMonthsPerTick && currentMonth < totalMonths; i++, currentMonth++) {
        // Time since simulation start.
        const tNewDays = currentMonth * SYNODIC_MONTH_DAYS;
        const tFullDays = tNewDays + 0.5 * SYNODIC_MONTH_DAYS;

        // New Moon event (phase angle ~0): solar eclipses possible.
	        {
	          const sunLonDeg = normalizeAngleDeg(startSun + SUN_RATE_DEG_PER_DAY * tNewDays);
	          const nodeLonDeg = normalizeAngleDeg(startNode + NODE_RATE_DEG_PER_DAY * tNewDays);
	          const moonLonDeg = sunLonDeg; // conjunction

	          const betaAbs = Math.abs(Model.eclipticLatitudeDeg({ tiltDeg: state.orbitalTilt, moonLonDeg, nodeLonDeg }));
	          const year = tNewDays / DAYS_PER_TROPICAL_YEAR;

	          const solar = Model.solarEclipseTypeFromBetaDeg({
	            betaDeg: betaAbs,
	            earthMoonDistanceKm,
	          });

	          if (solar.type === 'total-solar') {
	            state.totalSolarEclipses++;
	            state.eclipseLog.push({ year, type: 'total-solar', height: betaAbs });
	          } else if (solar.type === 'annular-solar') {
	            state.annularSolarEclipses++;
	            state.eclipseLog.push({ year, type: 'annular-solar', height: betaAbs });
	          } else if (solar.type === 'partial-solar') {
	            state.partialSolarEclipses++;
	            state.eclipseLog.push({ year, type: 'partial-solar', height: betaAbs });
	          }
	        }

        // Full Moon event (phase angle ~180): lunar eclipses possible.
        {
          const sunLonDeg = normalizeAngleDeg(startSun + SUN_RATE_DEG_PER_DAY * tFullDays);
          const nodeLonDeg = normalizeAngleDeg(startNode + NODE_RATE_DEG_PER_DAY * tFullDays);
          const moonLonDeg = normalizeAngleDeg(sunLonDeg + 180); // opposition

          const betaAbs = Math.abs(Model.eclipticLatitudeDeg({ tiltDeg: state.orbitalTilt, moonLonDeg, nodeLonDeg }));
          const year = tFullDays / DAYS_PER_TROPICAL_YEAR;

	          const lunar = Model.lunarEclipseTypeFromBetaDeg({
	            betaDeg: betaAbs,
	            earthMoonDistanceKm,
	          });

          if (lunar.type === 'total-lunar') {
            state.totalLunarEclipses++;
            state.eclipseLog.push({ year, type: 'total-lunar', height: betaAbs });
          } else if (lunar.type === 'partial-lunar') {
            state.partialLunarEclipses++;
            state.eclipseLog.push({ year, type: 'partial-lunar', height: betaAbs });
          } else if (lunar.type === 'penumbral-lunar') {
            state.penumbralLunarEclipses++;
            state.eclipseLog.push({ year, type: 'penumbral-lunar', height: betaAbs });
          }
        }

        // Advance visible state (for the live animation during simulation).
        const tDays = tNewDays;
        state.sunLonDeg = normalizeAngleDeg(startSun + SUN_RATE_DEG_PER_DAY * tDays);
        state.moonLonDeg = normalizeAngleDeg(startMoon + MOON_RATE_DEG_PER_DAY * tDays);
        state.nodeLonDeg = normalizeAngleDeg(startNode + NODE_RATE_DEG_PER_DAY * tDays);
        state.yearsSimulated = tDays / DAYS_PER_TROPICAL_YEAR;
      }

      updateStats();
      update();

      if (state.showLog) updateLogTable();

      state.animationId = setTimeout(simulateBatch, simTickMs);
    }

    state.animationId = setTimeout(simulateBatch, getSpeedConfig().simTickMs);
  }

  // ============================================
  // Challenge Mode
  // ============================================

  /**
   * Eclipse Challenges - 5 pedagogically appropriate challenges
   * Teaching: solar/lunar eclipse setup, orbital inclination, umbra/penumbra, totality
   */
  const ECLIPSE_CHALLENGES = [
    {
      id: 'solar-eclipse-setup',
      prompt: 'Position the Moon to create a solar eclipse. Drag the Moon to the correct phase and make sure it is near a node.',
      hint: 'Solar eclipses happen at NEW MOON when the Moon passes between Earth and Sun. The Moon must also be near a node (where its tilted orbit crosses the ecliptic plane).',
      initialState: { moonAngle: 90, nodeAngle: 0 },
      check: (demoState) => {
        const rawHeight = Model.eclipticLatitudeDeg({
          tiltDeg: demoState.orbitalTilt,
          moonLonDeg: demoState.moonAngle,
          nodeLonDeg: demoState.nodeAngle,
        });
        const height = Math.abs(rawHeight);
        const isNewMoon = isNearAngle(demoState.moonAngle, 180, SYZYGY_TOLERANCE_DEG);
        const thresholds = getEclipseThresholds(state.earthMoonDistanceKm);
        const nearNode = height < thresholds.solarPartialDeg;
        const solar = Model.solarEclipseTypeFromBetaDeg({
          betaDeg: height,
          earthMoonDistanceKm: state.earthMoonDistanceKm,
        });
        const phase = getPhaseLabel(normalizeAngleDeg(demoState.moonAngle - 180));

        if (isNewMoon && nearNode) {
          const eclipseType =
            solar.type === 'total-solar'
              ? 'total'
              : solar.type === 'annular-solar'
                ? 'annular'
                : 'partial';
          return {
            correct: true,
            message: `Solar eclipse achieved! The Moon is at new moon AND only ${height.toFixed(2)}° from the ecliptic — that's a ${eclipseType} solar eclipse!`
          };
        } else if (isNewMoon) {
          return {
            correct: false,
            close: true,
            message: `You have new moon (correct phase!), but the Moon is ${height.toFixed(1)}° from the ecliptic — too far for an eclipse. Move closer to a node.`
          };
        } else if (nearNode) {
          return {
            correct: false,
            close: true,
            message: `The Moon is near a node (good!), but it's at ${phase}. Solar eclipses only happen at new moon.`
          };
        }
        return {
          correct: false,
          close: false,
          message: `You need BOTH new moon (Moon between Earth and Sun) AND proximity to a node. Currently at ${phase}.`
        };
      }
    },
    {
      id: 'lunar-eclipse-setup',
      prompt: 'Position the Moon to create a lunar eclipse. Remember: lunar eclipses happen when Earth blocks sunlight from reaching the Moon.',
      hint: 'Lunar eclipses happen at FULL MOON when the Moon passes through Earth\'s shadow. The Moon must be near a node so it doesn\'t pass above or below the shadow.',
      initialState: { moonAngle: 270, nodeAngle: 0 },
      check: (demoState) => {
        const rawHeight = Model.eclipticLatitudeDeg({
          tiltDeg: demoState.orbitalTilt,
          moonLonDeg: demoState.moonAngle,
          nodeLonDeg: demoState.nodeAngle,
        });
        const height = Math.abs(rawHeight);
        const isFullMoon = isNearAngle(demoState.moonAngle, 0, SYZYGY_TOLERANCE_DEG);
        const lunar = Model.lunarEclipseTypeFromBetaDeg({ betaDeg: height, earthMoonDistanceKm: state.earthMoonDistanceKm });
        const nearNode = lunar.type !== 'none';
        const phase = getPhaseLabel(normalizeAngleDeg(demoState.moonAngle - 180));

        if (isFullMoon && nearNode) {
          const eclipseType =
            lunar.type === 'total-lunar'
              ? 'total'
              : lunar.type === 'partial-lunar'
                ? 'umbral (partial)'
                : 'penumbral';
          return {
            correct: true,
            message: `Lunar eclipse achieved! The Moon is at full moon AND passing through Earth's shadow — that's a ${eclipseType} lunar eclipse!`
          };
        } else if (isFullMoon) {
          return {
            correct: false,
            close: true,
            message: `You have full moon (correct phase!), but the Moon is ${height.toFixed(1)}° from the ecliptic — it misses Earth's shadow.`
          };
        } else if (nearNode) {
          return {
            correct: false,
            close: true,
            message: `The Moon is near a node, but it's at ${phase}. Lunar eclipses only happen at full moon.`
          };
        }
        return {
          correct: false,
          close: false,
          message: `You need BOTH full moon (Moon opposite the Sun) AND proximity to a node. Currently at ${phase}.`
        };
      }
    },
    {
      id: 'why-not-every-month',
      prompt: 'Demonstrate why eclipses don\'t happen every month: Find a full moon position that does NOT cause a lunar eclipse.',
      hint: 'Most full moons don\'t cause eclipses because the Moon\'s orbit is tilted ~5°. Try positioning the Moon at full moon but FAR from the nodes — it will pass above or below Earth\'s shadow.',
      initialState: { moonAngle: 0, nodeAngle: 90 },
      check: (demoState) => {
        const rawHeight = Model.eclipticLatitudeDeg({
          tiltDeg: demoState.orbitalTilt,
          moonLonDeg: demoState.moonAngle,
          nodeLonDeg: demoState.nodeAngle,
        });
        const height = Math.abs(rawHeight);
        const isFullMoon = isNearAngle(demoState.moonAngle, 0, SYZYGY_TOLERANCE_DEG);
        const noEclipse =
          Model.lunarEclipseTypeFromBetaDeg({ betaDeg: height, earthMoonDistanceKm: state.earthMoonDistanceKm }).type === 'none';
        const phase = getPhaseLabel(normalizeAngleDeg(demoState.moonAngle - 180));

        if (isFullMoon && noEclipse) {
          return {
            correct: true,
            message: `The Moon is ${height.toFixed(1)}° from the ecliptic — it passes ${rawHeight > 0 ? 'above' : 'below'} Earth's shadow! This is why eclipses don't happen every month: the 5° orbital tilt means the Moon usually misses the shadow.`
          };
        } else if (isFullMoon) {
          return {
            correct: false,
            close: true,
            message: `That's a full moon with an eclipse! The Moon is only ${height.toFixed(1)}° from the ecliptic. Try adjusting the node angle or tilt so the full moon is farther from the ecliptic plane.`
          };
        }
        return {
          correct: false,
          close: false,
          message: `First position the Moon at full moon, then make sure it's far from the nodes.`
        };
      }
    },
    {
      id: 'tilt-experiment',
      prompt: 'Experiment: Set the orbital tilt to 0° and observe what would happen. With no tilt, would eclipses be rare or common?',
      hint: 'Use the "Orbital Tilt" slider to set tilt to 0°. Then check: at new moon and full moon positions, how far is the Moon from the ecliptic?',
      initialState: { moonAngle: 180, orbitalTilt: 5.145, nodeAngle: 0 },
      check: (demoState) => {
        const tiltIsZero = demoState.orbitalTilt < 0.5;
        const phase = getPhaseLabel(normalizeAngleDeg(demoState.moonAngle - 180));

        if (tiltIsZero) {
          return {
            correct: true,
            message: `With zero tilt, the Moon always stays in the ecliptic plane! Every new moon would be a solar eclipse and every full moon would be a lunar eclipse. The real ~5° tilt is what makes eclipses rare special events.`
          };
        } else if (demoState.orbitalTilt < 2) {
          return {
            correct: false,
            close: true,
            message: `Getting closer! Tilt is ${demoState.orbitalTilt.toFixed(1)}°. Set it all the way to 0° to see what would happen without any orbital tilt.`
          };
        }
        return {
          correct: false,
          close: false,
          message: `Current tilt is ${demoState.orbitalTilt.toFixed(1)}°. Use the Orbital Tilt slider to reduce it to 0°.`
        };
      }
    },
    {
      id: 'eclipse-statistics',
      prompt: 'Run a 10-year simulation and count the eclipses. Are total eclipses more common than partial eclipses?',
      hint: 'Click "Run Simulation" with at least 10 years selected. Watch the statistics panel — it shows total vs partial eclipses for both solar and lunar types.',
      initialState: { moonAngle: 0, nodeAngle: 0, orbitalTilt: 5.145 },
      check: (demoState) => {
        const hasRunSim = demoState.yearsSimulated >= 9;
        const totalSolar = demoState.totalSolarEclipses;
        const annularSolar = demoState.annularSolarEclipses || 0;
        const partialSolar = demoState.partialSolarEclipses;
        const totalLunar = demoState.totalLunarEclipses;
        const partialLunar = demoState.partialLunarEclipses;
        const penumbralLunar = demoState.penumbralLunarEclipses || 0;
        const allEclipses = totalSolar + annularSolar + partialSolar + totalLunar + partialLunar + penumbralLunar;

        if (hasRunSim && allEclipses > 0) {
          const totalCount = totalSolar + totalLunar;
          const nonTotalCount = annularSolar + partialSolar + partialLunar + penumbralLunar;
          const allSolar = totalSolar + annularSolar + partialSolar;
          const allLunar = totalLunar + partialLunar + penumbralLunar;
          const eclipsesPerYear = (allEclipses / demoState.yearsSimulated).toFixed(1);

          return {
            correct: true,
            message: `In ${demoState.yearsSimulated.toFixed(0)} years: ${allSolar} solar eclipses (${totalSolar} total, ${annularSolar} annular), ${allLunar} lunar eclipses (${totalLunar} total). That's about ${eclipsesPerYear} eclipses per year — rare compared to 12+ new/full moons per year! Non-total eclipses (${nonTotalCount}) are more common than total eclipses (${totalCount}) because they require less precise alignment.`
          };
        } else if (demoState.yearsSimulated > 0) {
          return {
            correct: false,
            close: true,
            message: `You've simulated ${demoState.yearsSimulated.toFixed(1)} years. Run at least 10 years to get meaningful statistics.`
          };
        }
        return {
          correct: false,
          close: false,
          message: `Use the simulation controls to run a 10+ year simulation. Set years with the slider, then click "Run Simulation".`
        };
      }
    }
  ];

  let challengeEngine = null;

  /**
   * Set up challenge mode integration
   */
  function setupChallengeMode() {
    const container = document.getElementById('challenge-container');
    const btn = document.getElementById('btn-challenges');

    if (!container || !btn || typeof ChallengeEngine === 'undefined') {
      console.warn('Challenge mode not available: missing container, button, or ChallengeEngine');
      return;
    }

    challengeEngine = ChallengeEngine.create({
      challenges: ECLIPSE_CHALLENGES,
      getState: () => ({
        moonAngle: getDisplayMoonAngleDeg(),
        nodeAngle: getDisplayNodeAngleDeg(),
        orbitalTilt: state.orbitalTilt,
        earthMoonDistanceKm: state.earthMoonDistanceKm,
        yearsSimulated: state.yearsSimulated,
        totalSolarEclipses: state.totalSolarEclipses,
        annularSolarEclipses: state.annularSolarEclipses,
        partialSolarEclipses: state.partialSolarEclipses,
        totalLunarEclipses: state.totalLunarEclipses,
        partialLunarEclipses: state.partialLunarEclipses,
        penumbralLunarEclipses: state.penumbralLunarEclipses
      }),
      setState: (newState) => {
        if (newState.moonAngle !== undefined) {
          setMoonFromDisplayAngleDeg(newState.moonAngle);
        }
        if (newState.nodeAngle !== undefined) {
          setNodeFromDisplayAngleDeg(newState.nodeAngle);
        }
        if (newState.orbitalTilt !== undefined) {
          state.orbitalTilt = newState.orbitalTilt;
          elements.tiltSlider.value = newState.orbitalTilt * 10;
          elements.tiltDisplay.textContent = newState.orbitalTilt.toFixed(1) + '°';
        }
        if (newState.earthMoonDistanceKm !== undefined && Number.isFinite(newState.earthMoonDistanceKm)) {
          state.earthMoonDistanceKm = newState.earthMoonDistanceKm;
        }
        update();
      },
      container: container,
      onStop: () => {
        btn.textContent = 'Challenge Mode';
      }
    });

    // Toggle challenge mode on button click
    btn.addEventListener('click', () => {
      if (challengeEngine.isActive()) {
        challengeEngine.stop();
      } else {
        challengeEngine.start();
        btn.textContent = 'Exit Challenges';
      }
    });
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupDrag();
    setupControls();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      const starfield = Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
      starfield.start();
    }

	    // Set initial tilt slider value
	    elements.tiltSlider.value = state.orbitalTilt * 10;
	    elements.tiltDisplay.textContent = state.orbitalTilt.toFixed(1) + '°';

	    if (elements.moonDistanceSelect) {
	      elements.moonDistanceSelect.value = 'mean';
	    }

	    // Set initial simulation years slider (default 10 years)
	    const defaultYears = 10;
	    elements.simYearsSlider.value = yearsToSlider(defaultYears);
	    elements.simYearsDisplay.textContent = formatYears(defaultYears);
	    loadPersistedSimSettings();

	    // Set initial Moon angle slider value (display angle)
	    if (elements.moonAngleSlider && elements.moonAngleDisplay) {
	      const displayAngle = getDisplayMoonAngleDeg();
      elements.moonAngleSlider.value = Math.round(displayAngle).toString();
      elements.moonAngleDisplay.textContent = `${Math.round(displayAngle)}°`;
    }

    // Set up challenge mode
    setupChallengeMode();

    // Initial update
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
