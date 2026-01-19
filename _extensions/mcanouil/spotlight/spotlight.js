// Source: https://github.com/denniskniep/reveal.js-plugin-spotlight
// Author: Dennis Kniep
// License: Apache License 2.0

var RevealSpotlight = window.RevealSpotlight || (function () {

  //configs
  var spotlightSize;
  var toggleOnMouseDown;
  var spotlightOnKeyPressAndHold;
  var presentingCursor;
  var spotlightCursor;
  var initialPresentationMode;
  var disablingUserSelect;
  var fadeInAndOut;
  var style;
  var lockPointerInsideCanvas;
  var getMousePos;

  var drawBoard;
  var isSpotlightOn = true;
  var isCursorOn = true;
  var isChalkboardOn = false;

  var lastMouseMoveEvent;

  function onRevealJsReady(event) {
    configure();
    drawBoard = setupCanvas();

    addChalkboardInterlock();

    addWindowResizeListener();

    addMouseMoveListener();

    if (toggleOnMouseDown) {
      addMouseToggleSpotlightListener();
    }

    if (spotlightOnKeyPressAndHold) {
      addKeyPressAndHoldSpotlightListener(spotlightOnKeyPressAndHold);
    }

    setSpotlight(false);
    setCursor(!initialPresentationMode);
  }

  function isChalkboardVisible() {
    var chalkboardEl = document.getElementById('chalkboard');
    if (!chalkboardEl) return false;

    // reveal-chalkboard toggles via inline style (visibility/opacity).
    var computed = window.getComputedStyle ? window.getComputedStyle(chalkboardEl) : null;
    var visibility = (computed && computed.visibility) || chalkboardEl.style.visibility;
    var display = (computed && computed.display) || chalkboardEl.style.display;
    var opacity = (computed && computed.opacity) || chalkboardEl.style.opacity;

    if (display === 'none') return false;
    if (visibility === 'hidden') return false;
    if (opacity === '0') return false;

    return true;
  }

  function updateChalkboardState() {
    isChalkboardOn = isChalkboardVisible();
    if (isChalkboardOn) {
      setSpotlight(false);
    }
  }

  function addChalkboardInterlock() {
    function tryAttach() {
      var chalkboardEl = document.getElementById('chalkboard');
      if (!chalkboardEl) return false;

      updateChalkboardState();

      if (window.MutationObserver) {
        var observer = new MutationObserver(function () {
          updateChalkboardState();
        });
        observer.observe(chalkboardEl, { attributes: true, attributeFilter: ['style', 'class'] });
      }

      // Also listen for reveal-chalkboard's broadcast events (belt + suspenders).
      document.addEventListener('broadcast', function (e) {
        var content = e && (e.content || e.detail);
        var type = content && content.type;
        if (type === 'showChalkboard' || type === 'closeChalkboard') {
          updateChalkboardState();
        }
      }, false);

      return true;
    }

    if (tryAttach()) return;

    var attempts = 0;
    var maxAttempts = 50;
    var intervalMs = 100;
    var timer = window.setInterval(function () {
      attempts += 1;
      if (tryAttach() || attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, intervalMs);
  }

  function configure() {
    var config = Reveal.getConfig().spotlight || {};
    spotlightSize = config.size || 60;
    presentingCursor = config.presentingCursor || "none";
    spotlightCursor = config.spotlightCursor || "none";
    var useAsPointer = config.useAsPointer || false;
    var pointerColor = config.pointerColor || 'red';
    lockPointerInsideCanvas = config.lockPointerInsideCanvas || false;

    if(lockPointerInsideCanvas){
      getMousePos = getMousePosByMovement;
    } else {
      getMousePos = getMousePosByBoundingClientRect;
    }

    // If using as pointer draw a transparent background and
    // the mouse pointer in the specified color or default
    var pointerStyle = {
      backgroundFillStyle : "rgba(0, 0, 0, 0)",
      mouseFillStyle : pointerColor
    };

    var spotlightStyle = {
      backgroundFillStyle : "#000000A8",
      mouseFillStyle : "#FFFFFFFF"
    };

    style = useAsPointer ? pointerStyle : spotlightStyle;

    if (config.hasOwnProperty("toggleSpotlightOnMouseDown")) {
      toggleOnMouseDown = config.toggleSpotlightOnMouseDown;
    } else {
      toggleOnMouseDown = true;
    }

    if (config.hasOwnProperty("initialPresentationMode")) {
      initialPresentationMode = config.initialPresentationMode;
    } else {
      initialPresentationMode = toggleOnMouseDown;
    }

    if (config.hasOwnProperty("spotlightOnKeyPressAndHold")) {
      spotlightOnKeyPressAndHold = config.spotlightOnKeyPressAndHold;
    } else {
      spotlightOnKeyPressAndHold = false;
    }

    if (config.hasOwnProperty("disablingUserSelect")) {
      disablingUserSelect = config.disablingUserSelect;
    } else {
      disablingUserSelect = true;
    }

    if (config.hasOwnProperty("fadeInAndOut")) {
      fadeInAndOut = config.fadeInAndOut;
    } else {
      fadeInAndOut = false;
    }
  }

  function setupCanvas() {
    var container = document.createElement('div');
    container.id = "spotlight";
    container.style.cssText = "position:absolute;top:0;left:0;bottom:0;right:0;z-index:99;";
    if (fadeInAndOut) {
      container.style.cssText += "transition: " + fadeInAndOut + "ms opacity;";
    }

    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    container.appendChild(canvas);
    document.body.appendChild(container);
    container.style.opacity = 0;
    container.style['pointer-events'] = 'none';
    return {
      container,
      canvas,
      context
    }
  }

  function addWindowResizeListener() {
    window.addEventListener('resize', function (e) {
      var canvas = drawBoard.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, false);
  }

  function addMouseMoveListener() {
    window.addEventListener('mousemove', function (e) {
      if(isSpotlightOn && !isChalkboardOn) {
        showSpotlight(e);
      }
      lastMouseMoveEvent = e;
    }, false);
  }

  function addMouseToggleSpotlightListener() {

    window.addEventListener("mousedown", function (e) {
      if (!isCursorOn) {
        if (isChalkboardOn) return;
        setSpotlight(true, e);
      }
    }, false);

    window.addEventListener("mouseup", function (e) {
      if (!isCursorOn) {
        if (isChalkboardOn) return;
        setSpotlight(false, e);
      }
    }, false);
  }

  function addKeyPressAndHoldSpotlightListener(keyCode) {

    window.addEventListener("keydown", function (e) {
      if (!isCursorOn && e.keyCode === keyCode) {
        if (isChalkboardOn) return;
        setSpotlight(true, lastMouseMoveEvent);
      }
    }, false);

    window.addEventListener("keyup", function (e) {
      if (!isCursorOn && e.keyCode === keyCode) {
        if (isChalkboardOn) return;
        setSpotlight(false);
      }
    }, false);
  }

  function toggleSpotlight() {
    setSpotlight(!isSpotlightOn, lastMouseMoveEvent);
  }

  function setSpotlight(isOn, mouseEvt) {
    if (isOn && isChalkboardOn) {
      isOn = false;
    }
    isSpotlightOn = isOn;
    var container = drawBoard.container;
    if (isOn) {
      document.body.classList.add("spotlight-on");
      if (lockPointerInsideCanvas && document.pointerLockElement != drawBoard.canvas) {
        drawBoard.canvas.requestPointerLock();
      }
      container.style.opacity = 1;
      // Never intercept clicks (menus/chalkboard/outline must remain clickable).
      // Spotlight rendering is driven by global mouse events, so pointer events
      // on the overlay are unnecessary and harmful.
      container.style['pointer-events'] = 'none';
      document.body.style.cursor = spotlightCursor;
      if (mouseEvt) {
        showSpotlight(mouseEvt);
      }
    } else {
      document.body.classList.remove("spotlight-on");
      container.style.opacity = 0;
      container.style['pointer-events'] = 'none';
      document.body.style.cursor = presentingCursor;
    }
  }

  function togglePresentationMode() {
    setCursor(!isCursorOn);
  }

  function setCursor(isOn) {
    isCursorOn = isOn;
    if (isOn) {
      setSpotlight(false);
      if (disablingUserSelect) {
        document.body.style.userSelect = null;
        document.body.style.MozUserSelect = null;
      }
      document.body.style.cursor = null;
      if(lockPointerInsideCanvas && document.pointerLockElement === drawBoard.canvas){
        document.exitPointerLock();
      }
    } else {
      if (disablingUserSelect) {
        document.body.style.userSelect = "none";
        document.body.style.MozUserSelect = "none";
      }
      if (lockPointerInsideCanvas && document.pointerLockElement != drawBoard.canvas) {
        drawBoard.canvas.requestPointerLock();
      }
      document.body.style.cursor = presentingCursor;
    }
  }

  function showSpotlight(mouseEvt) {
    var canvas = drawBoard.canvas;
    var context = drawBoard.context;
    var mousePos = getMousePos(canvas, mouseEvt);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Create a canvas mask
    var maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    var maskCtx = maskCanvas.getContext('2d');

    maskCtx.fillStyle = style.backgroundFillStyle;
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation = 'xor';

    maskCtx.fillStyle = style.mouseFillStyle;
    maskCtx.arc(mousePos.x, mousePos.y, spotlightSize, 0, 2 * Math.PI);
    maskCtx.fill();

    context.drawImage(maskCanvas, 0, 0);
  }

  var mX = 0;
  var mY = 0;

  function getMousePosByMovement(canvas, evt) {
    var movementX = evt.movementX || 0;
    var movementY = evt.movementY || 0;
    mX += movementX;
    mY += movementY;

    if (mX > canvas.clientWidth) {
      mX = canvas.clientWidth;
    }
    if (mY > canvas.clientHeight) {
      mY = canvas.clientHeight;
    }
    if (mX < 0) {
      mX = 0;
    }
    if (mY < 0) {
      mY = 0;
    }

    return {
      x: mX,
      y: mY
    };
  }

  function getMousePosByBoundingClientRect(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  Reveal.addEventListener('ready', onRevealJsReady);

  this.toggleSpotlight = toggleSpotlight;
  this.togglePresentationMode = togglePresentationMode;
  return this;
})();
