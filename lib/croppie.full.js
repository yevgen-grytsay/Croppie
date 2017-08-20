(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Croppie"] = factory();
	else
		root["Croppie"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function loadImage(src, imageEl, doExif) {
    var img = imageEl || new Image();
    img.style.opacity = 0;

    return new Promise(function (resolve) {
        function _resolve() {
            setTimeout(function(){
                resolve(img);
            }, 1);
        }

        if (img.src === src) {// If image source hasn't changed resolve immediately
            _resolve();
            return;
        }

        img.exifdata = null;
        img.removeAttribute('crossOrigin');
        if (src.match(/^https?:\/\/|^\/\//)) {
            img.setAttribute('crossOrigin', 'anonymous');
        }
        img.onload = function () {
            if (doExif) {
                EXIF.getData(img, function () {
                    _resolve();
                });
            }
            else {
                _resolve();
            }
        };
        img.src = src;
    });
}

function naturalImageDimensions(img) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    if (img.exifdata && img.exifdata.Orientation >= 5) {
        var x= w;
        w = h;
        h = x;
    }
    return { width: w, height: h };
}

// Credits to : Andrew Dupont - http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
function deepExtend(destination, source) {
    destination = destination || {};
    for (var property in source) {
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function dispatchChange(element) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
    }
    else {
        element.fireEvent("onchange");
    }
}

//http://jsperf.com/vanilla-css
function css(el, styles, val) {
    if (typeof (styles) === 'string') {
        var tmp = styles;
        styles = {};
        styles[tmp] = val;
    }

    for (var prop in styles) {
        el.style[prop] = styles[prop];
    }
}

function addClass(el, c) {
    if (el.classList) {
        el.classList.add(c);
    }
    else {
        el.className += ' ' + c;
    }
}

function removeClass(el, c) {
    if (el.classList) {
        el.classList.remove(c);
    }
    else {
        el.className = el.className.replace(c, '');
    }
}

function num(v) {
    return parseInt(v, 10);
}

function getExifOrientation (img) {
    return img.exifdata.Orientation;
}


module.exports = {
    loadImage: loadImage,
    naturalImageDimensions: naturalImageDimensions,
    deepExtend: deepExtend,
    debounce: debounce,
    dispatchChange: dispatchChange,
    css: css,
    addClass: addClass,
    removeClass: removeClass,
    num: num,
    getExifOrientation: getExifOrientation
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {


var emptyStyles = document.createElement('div').style,
    cssPrefixes = ['Webkit', 'Moz', 'ms'];


function vendorPrefix(prop) {
    if (prop in emptyStyles) {
        return prop;
    }

    var capProp = prop[0].toUpperCase() + prop.slice(1),
        i = cssPrefixes.length;

    while (i--) {
        prop = cssPrefixes[i] + capProp;
        if (prop in emptyStyles) {
            return prop;
        }
    }
}

var CSS_TRANSFORM = vendorPrefix('transform');
var CSS_TRANS_ORG = vendorPrefix('transformOrigin');
var CSS_USERSELECT = vendorPrefix('userSelect');

var TRANSLATE_OPTS = {
    'translate3d': {
        suffix: ', 0px'
    },
    'translate': {
        suffix: ''
    }
};

module.exports = {
    CSS_TRANSFORM: CSS_TRANSFORM,
    CSS_TRANS_ORG: CSS_TRANS_ORG,
    CSS_USERSELECT: CSS_USERSELECT,
    TRANSLATE_OPTS: TRANSLATE_OPTS
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*************************
 * Croppie
 * Copyright 2017
 * Foliotek
 * Version: 2.5.0
 *************************/

__webpack_require__(3);
var Promise = __webpack_require__(4);
var Utils = __webpack_require__(0);
var Transformations = __webpack_require__(9);

var Transform = Transformations.Transform,
    TransformOrigin = Transformations.TransformOrigin,
    deepExtend = Utils.deepExtend,
    debounce = Utils.debounce,
    cssmod = __webpack_require__(1),
    drawCanvas = __webpack_require__(10).drawCanvas,
    CSS_TRANS_ORG = cssmod.CSS_TRANS_ORG,
    CSS_TRANSFORM = cssmod.CSS_TRANSFORM,
    CSS_USERSELECT = cssmod.CSS_USERSELECT,
    css = Utils.css,
    addClass = Utils.addClass,
    removeClass = Utils.removeClass,
    num = Utils.num,
    getExifOrientation = Utils.getExifOrientation,
    dispatchChange = Utils.dispatchChange;


/* Private Methods */
function _create() {
    var self = this,
        contClass = 'croppie-container',
        customViewportClass = self.options.viewport.type ? 'cr-vp-' + self.options.viewport.type : null,
        boundary, viewport, overlay, bw, bh;

    self.options.useCanvas = self.options.enableOrientation || _hasExif.call(self);
    // Properties on class
    self.data = {};
    self.elements = {};

    boundary = self.elements.boundary = document.createElement('div');
    viewport = self.elements.viewport = document.createElement('div');
    self.elements.img = document.createElement('img');
    overlay = self.elements.overlay = document.createElement('div');

    if (self.options.useCanvas) {
        self.elements.canvas = document.createElement('canvas');
        self.elements.preview = self.elements.canvas;
    }
    else {
        self.elements.preview = self.elements.img;
    }

    addClass(boundary, 'cr-boundary');
    bw = self.options.boundary.width;
    bh = self.options.boundary.height;
    css(boundary, {
        width: (bw + (isNaN(bw) ? '' : 'px')),
        height: (bh + (isNaN(bh) ? '' : 'px'))
    });

    addClass(viewport, 'cr-viewport');
    if (customViewportClass) {
        addClass(viewport, customViewportClass);
    }
    css(viewport, {
        width: self.options.viewport.width + 'px',
        height: self.options.viewport.height + 'px'
    });
    viewport.setAttribute('tabindex', 0);

    addClass(self.elements.preview, 'cr-image');
    addClass(overlay, 'cr-overlay');

    self.element.appendChild(boundary);
    boundary.appendChild(self.elements.preview);
    boundary.appendChild(viewport);
    boundary.appendChild(overlay);

    addClass(self.element, contClass);
    if (self.options.customClass) {
        addClass(self.element, self.options.customClass);
    }

    _initDraggable.call(this);

    if (self.options.enableZoom) {
        _initializeZoom.call(self);
    }

    // if (self.options.enableOrientation) {
    //     _initRotationControls.call(self);
    // }

    if (self.options.enableResize) {
        _initializeResize.call(self);
    }
}

// function _initRotationControls () {
//     var self = this,
//         wrap, btnLeft, btnRight, iLeft, iRight;

//     wrap = document.createElement('div');
//     self.elements.orientationBtnLeft = btnLeft = document.createElement('button');
//     self.elements.orientationBtnRight = btnRight = document.createElement('button');

//     wrap.appendChild(btnLeft);
//     wrap.appendChild(btnRight);

//     iLeft = document.createElement('i');
//     iRight = document.createElement('i');
//     btnLeft.appendChild(iLeft);
//     btnRight.appendChild(iRight);

//     addClass(wrap, 'cr-rotate-controls');
//     addClass(btnLeft, 'cr-rotate-l');
//     addClass(btnRight, 'cr-rotate-r');

//     self.elements.boundary.appendChild(wrap);

//     btnLeft.addEventListener('click', function () {
//         self.rotate(-90);
//     });
//     btnRight.addEventListener('click', function () {
//         self.rotate(90);
//     });
// }

function _hasExif() {
    return this.options.enableExif && window.EXIF;
}

function _initializeResize () {
    var self = this;
    var wrap = document.createElement('div');
    var isDragging = false;
    var direction;
    var originalX;
    var originalY;
    var minSize = 50;
    var maxWidth;
    var maxHeight;
    var vr;
    var hr;

    addClass(wrap, 'cr-resizer');
    css(wrap, {
        width: this.options.viewport.width + 'px',
        height: this.options.viewport.height + 'px'
    });

    if (this.options.resizeControls.height) {
        vr = document.createElement('div');
        addClass(vr, 'cr-resizer-vertical');
        wrap.appendChild(vr);
    }

    if (this.options.resizeControls.width) {
        hr = document.createElement('div');
        addClass(hr, 'cr-resizer-horisontal');
        wrap.appendChild(hr);
    }

    function mouseDown(ev) {
        if (ev.button !== undefined && ev.button !== 0) return;

        ev.preventDefault();
        if (isDragging) {
            return;
        }

        var overlayRect = self.elements.overlay.getBoundingClientRect();

        isDragging = true;
        originalX = ev.pageX;
        originalY = ev.pageY;
        direction = ev.currentTarget.className.indexOf('vertical') !== -1 ? 'v' : 'h';
        maxWidth = overlayRect.width;
        maxHeight = overlayRect.height;

        if (ev.touches) {
            var touches = ev.touches[0];
            originalX = touches.pageX;
            originalY = touches.pageY;
        }

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('touchend', mouseUp);
        document.body.style[CSS_USERSELECT] = 'none';
    }

    function mouseMove(ev) {
        var pageX = ev.pageX;
        var pageY = ev.pageY;

        ev.preventDefault();

        if (ev.touches) {
            var touches = ev.touches[0];
            pageX = touches.pageX;
            pageY = touches.pageY;
        }

        var deltaX = pageX - originalX;
        var deltaY = pageY - originalY;
        var newHeight = self.options.viewport.height + deltaY;
        var newWidth = self.options.viewport.width + deltaX;

        if (direction === 'v' && newHeight >= minSize && newHeight <= maxHeight) {
            css(wrap, {
                height: newHeight + 'px'
            });

            self.options.boundary.height += deltaY;
            css(self.elements.boundary, {
                height: self.options.boundary.height + 'px'
            });

            self.options.viewport.height += deltaY;
            css(self.elements.viewport, {
                height: self.options.viewport.height + 'px'
            });
        }
        else if (direction === 'h' && newWidth >= minSize && newWidth <= maxWidth) {
            css(wrap, {
                width: newWidth + 'px'
            });

            self.options.boundary.width += deltaX;
            css(self.elements.boundary, {
                width: self.options.boundary.width + 'px'
            });

            self.options.viewport.width += deltaX;
            css(self.elements.viewport, {
                width: self.options.viewport.width + 'px'
            });
        }

        _updateOverlay.call(self);
        _updateZoomLimits.call(self);
        _updateCenterPoint.call(self);
        _triggerUpdate.call(self);
        originalY = pageY;
        originalX = pageX;
    }

    function mouseUp() {
        isDragging = false;
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('touchend', mouseUp);
        document.body.style[CSS_USERSELECT] = '';
    }

    if (vr) {
        vr.addEventListener('mousedown', mouseDown);
    }

    if (hr) {
        hr.addEventListener('mousedown', mouseDown);
    }

    this.elements.boundary.appendChild(wrap);
}

function _setZoomerVal(v) {
    if (this.options.enableZoom) {
        var z = this.elements.zoomer,
            val = fix(v, 4);

        z.value = Math.max(z.min, Math.min(z.max, val));
    }
}

function _initializeZoom() {
    var self = this,
        wrap = self.elements.zoomerWrap = document.createElement('div'),
        zoomer = self.elements.zoomer = document.createElement('input');

    addClass(wrap, 'cr-slider-wrap');
    addClass(zoomer, 'cr-slider');
    zoomer.type = 'range';
    zoomer.step = '0.0001';
    zoomer.value = 1;
    zoomer.style.display = self.options.showZoomer ? '' : 'none';

    self.element.appendChild(wrap);
    wrap.appendChild(zoomer);

    self._currentZoom = 1;

    function change() {
        _onZoom.call(self, {
            value: parseFloat(zoomer.value),
            origin: new TransformOrigin(self.elements.preview),
            viewportRect: self.elements.viewport.getBoundingClientRect(),
            transform: Transformations.parse(self.elements.preview)
        });
    }

    function scroll(ev) {
        var delta, targetZoom;

        if (ev.wheelDelta) {
            delta = ev.wheelDelta / 1200; //wheelDelta min: -120 max: 120 // max x 10 x 2
        } else if (ev.deltaY) {
            delta = ev.deltaY / 1060; //deltaY min: -53 max: 53 // max x 10 x 2
        } else if (ev.detail) {
            delta = ev.detail / -60; //delta min: -3 max: 3 // max x 10 x 2
        } else {
            delta = 0;
        }

        targetZoom = self._currentZoom + (delta * self._currentZoom);

        ev.preventDefault();
        _setZoomerVal.call(self, targetZoom);
        change.call(self);
    }

    self.elements.zoomer.addEventListener('input', change);// this is being fired twice on keypress
    self.elements.zoomer.addEventListener('change', change);

    if (self.options.mouseWheelZoom) {
        self.elements.boundary.addEventListener('mousewheel', scroll);
        self.elements.boundary.addEventListener('DOMMouseScroll', scroll);
    }
}

function _onZoom(ui) {
    var self = this,
        transform = ui ? ui.transform : Transformations.parse(self.elements.preview),
        vpRect = ui ? ui.viewportRect : self.elements.viewport.getBoundingClientRect(),
        origin = ui ? ui.origin : new TransformOrigin(self.elements.preview);

    function applyCss() {
        var transCss = {};
        transCss[CSS_TRANSFORM] = transform.toString();
        transCss[CSS_TRANS_ORG] = origin.toString();
        css(self.elements.preview, transCss);
    }

    self._currentZoom = ui ? ui.value : self._currentZoom;
    transform.scale = self._currentZoom;
    applyCss();

    if (self.options.enforceBoundary) {
        var boundaries = _getVirtualBoundaries.call(self, vpRect),
            transBoundaries = boundaries.translate,
            oBoundaries = boundaries.origin;

        if (transform.x >= transBoundaries.maxX) {
            origin.x = oBoundaries.minX;
            transform.x = transBoundaries.maxX;
        }

        if (transform.x <= transBoundaries.minX) {
            origin.x = oBoundaries.maxX;
            transform.x = transBoundaries.minX;
        }

        if (transform.y >= transBoundaries.maxY) {
            origin.y = oBoundaries.minY;
            transform.y = transBoundaries.maxY;
        }

        if (transform.y <= transBoundaries.minY) {
            origin.y = oBoundaries.maxY;
            transform.y = transBoundaries.minY;
        }
    }
    applyCss();
    _debouncedOverlay.call(self);
    _triggerUpdate.call(self);
}

function _getVirtualBoundaries(viewport) {
    var self = this,
        scale = self._currentZoom,
        vpWidth = viewport.width,
        vpHeight = viewport.height,
        centerFromBoundaryX = self.elements.boundary.clientWidth / 2,
        centerFromBoundaryY = self.elements.boundary.clientHeight / 2,
        imgRect = self.elements.preview.getBoundingClientRect(),
        curImgWidth = imgRect.width,
        curImgHeight = imgRect.height,
        halfWidth = vpWidth / 2,
        halfHeight = vpHeight / 2;

    var maxX = ((halfWidth / scale) - centerFromBoundaryX) * -1;
    var minX = maxX - ((curImgWidth * (1 / scale)) - (vpWidth * (1 / scale)));

    var maxY = ((halfHeight / scale) - centerFromBoundaryY) * -1;
    var minY = maxY - ((curImgHeight * (1 / scale)) - (vpHeight * (1 / scale)));

    var originMinX = (1 / scale) * halfWidth;
    var originMaxX = (curImgWidth * (1 / scale)) - originMinX;

    var originMinY = (1 / scale) * halfHeight;
    var originMaxY = (curImgHeight * (1 / scale)) - originMinY;

    return {
        translate: {
            maxX: maxX,
            minX: minX,
            maxY: maxY,
            minY: minY
        },
        origin: {
            maxX: originMaxX,
            minX: originMinX,
            maxY: originMaxY,
            minY: originMinY
        }
    };
}

function _updateCenterPoint() {
    var self = this,
        scale = self._currentZoom,
        data = self.elements.preview.getBoundingClientRect(),
        vpData = self.elements.viewport.getBoundingClientRect(),
        transform = Transformations.parse(self.elements.preview.style[CSS_TRANSFORM]),
        pc = new TransformOrigin(self.elements.preview),
        top = (vpData.top - data.top) + (vpData.height / 2),
        left = (vpData.left - data.left) + (vpData.width / 2),
        center = {},
        adj = {};

    center.y = top / scale;
    center.x = left / scale;

    adj.y = (center.y - pc.y) * (1 - scale);
    adj.x = (center.x - pc.x) * (1 - scale);

    transform.x -= adj.x;
    transform.y -= adj.y;

    var newCss = {};
    newCss[CSS_TRANS_ORG] = center.x + 'px ' + center.y + 'px';
    newCss[CSS_TRANSFORM] = transform.toString();
    css(self.elements.preview, newCss);
}

function _initDraggable() {
    var self = this,
        isDragging = false,
        originalX,
        originalY,
        originalDistance,
        vpRect,
        transform;

    function assignTransformCoordinates(deltaX, deltaY) {
        var imgRect = self.elements.preview.getBoundingClientRect(),
            top = transform.y + deltaY,
            left = transform.x + deltaX;

        if (self.options.enforceBoundary) {
            if (vpRect.top > imgRect.top + deltaY && vpRect.bottom < imgRect.bottom + deltaY) {
                transform.y = top;
            }

            if (vpRect.left > imgRect.left + deltaX && vpRect.right < imgRect.right + deltaX) {
                transform.x = left;
            }
        }
        else {
            transform.y = top;
            transform.x = left;
        }
    }

    function keyDown(ev) {
        var LEFT_ARROW  = 37,
            UP_ARROW    = 38,
            RIGHT_ARROW = 39,
            DOWN_ARROW  = 40;

        if (ev.shiftKey && (ev.keyCode === UP_ARROW || ev.keyCode === DOWN_ARROW)) {
            var zoom = 0.0;
            if (ev.keyCode === UP_ARROW) {
                zoom = parseFloat(self.elements.zoomer.value, 10) + parseFloat(self.elements.zoomer.step, 10)
            }
            else {
                zoom = parseFloat(self.elements.zoomer.value, 10) - parseFloat(self.elements.zoomer.step, 10)
            }
            self.setZoom(zoom);
        }
        else if (self.options.enableKeyMovement && (ev.keyCode >= 37 && ev.keyCode <= 40)) {
            ev.preventDefault();
            var movement = parseKeyDown(ev.keyCode);

            transform = Transformations.parse(self.elements.preview);
            document.body.style[CSS_USERSELECT] = 'none';
            vpRect = self.elements.viewport.getBoundingClientRect();
            keyMove(movement);
        }

        function parseKeyDown(key) {
            switch (key) {
                case LEFT_ARROW:
                    return [1, 0];
                case UP_ARROW:
                    return [0, 1];
                case RIGHT_ARROW:
                    return [-1, 0];
                case DOWN_ARROW:
                    return [0, -1];
            }
        }
    }

    function keyMove(movement) {
        var deltaX = movement[0],
            deltaY = movement[1],
            newCss = {};

        assignTransformCoordinates(deltaX, deltaY);

        newCss[CSS_TRANSFORM] = transform.toString();
        css(self.elements.preview, newCss);
        _updateOverlay.call(self);
        document.body.style[CSS_USERSELECT] = '';
        _updateCenterPoint.call(self);
        _triggerUpdate.call(self);
        originalDistance = 0;
    }

    function mouseDown(ev) {
        if (ev.button !== undefined && ev.button !== 0) return;

        ev.preventDefault();
        if (isDragging) return;
        isDragging = true;
        originalX = ev.pageX;
        originalY = ev.pageY;

        if (ev.touches) {
            var touches = ev.touches[0];
            originalX = touches.pageX;
            originalY = touches.pageY;
        }

        transform = Transformations.parse(self.elements.preview);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('touchend', mouseUp);
        document.body.style[CSS_USERSELECT] = 'none';
        vpRect = self.elements.viewport.getBoundingClientRect();
    }

    function mouseMove(ev) {
        ev.preventDefault();
        var pageX = ev.pageX,
            pageY = ev.pageY;

        if (ev.touches) {
            var touches = ev.touches[0];
            pageX = touches.pageX;
            pageY = touches.pageY;
        }

        var deltaX = pageX - originalX,
            deltaY = pageY - originalY,
            newCss = {};

        if (ev.type === 'touchmove') {
            if (ev.touches.length > 1) {
                var touch1 = ev.touches[0];
                var touch2 = ev.touches[1];
                var dist = Math.sqrt((touch1.pageX - touch2.pageX) * (touch1.pageX - touch2.pageX) + (touch1.pageY - touch2.pageY) * (touch1.pageY - touch2.pageY));

                if (!originalDistance) {
                    originalDistance = dist / self._currentZoom;
                }

                var scale = dist / originalDistance;

                _setZoomerVal.call(self, scale);
                dispatchChange(self.elements.zoomer);
                return;
            }
        }

        assignTransformCoordinates(deltaX, deltaY);

        newCss[CSS_TRANSFORM] = transform.toString();
        css(self.elements.preview, newCss);
        _updateOverlay.call(self);
        originalY = pageY;
        originalX = pageX;
    }

    function mouseUp() {
        isDragging = false;
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('touchend', mouseUp);
        document.body.style[CSS_USERSELECT] = '';
        _updateCenterPoint.call(self);
        _triggerUpdate.call(self);
        originalDistance = 0;
    }

    self.elements.overlay.addEventListener('mousedown', mouseDown);
    self.elements.viewport.addEventListener('keydown', keyDown);
    self.elements.overlay.addEventListener('touchstart', mouseDown);
}

function _updateOverlay() {
    var self = this,
        boundRect = self.elements.boundary.getBoundingClientRect(),
        imgData = self.elements.preview.getBoundingClientRect();

    css(self.elements.overlay, {
        width: imgData.width + 'px',
        height: imgData.height + 'px',
        top: (imgData.top - boundRect.top) + 'px',
        left: (imgData.left - boundRect.left) + 'px'
    });
}
var _debouncedOverlay = debounce(_updateOverlay, 500);

function _triggerUpdate() {
    var self = this,
        data = self.get(),
        ev;

    if (!_isVisible.call(self)) {
        return;
    }

    self.options.update.call(self, data);
    if (self.$ && typeof Prototype === 'undefined') {
        self.$(self.element).trigger('update', data);
    }
    else {
        if (window.CustomEvent) {
            ev = new CustomEvent('update', { detail: data });
        } else {
            ev = document.createEvent('CustomEvent');
            ev.initCustomEvent('update', true, true, data);
        }

        self.element.dispatchEvent(ev);
    }
}

function _isVisible() {
    return this.elements.preview.offsetHeight > 0 && this.elements.preview.offsetWidth > 0;
}

function _updatePropertiesFromImage() {
    var self = this,
        initialZoom = 1,
        cssReset = {},
        img = self.elements.preview,
        imgData = self.elements.preview.getBoundingClientRect(),
        transformReset = new Transform(0, 0, initialZoom),
        originReset = new TransformOrigin(),
        isVisible = _isVisible.call(self);

    if (!isVisible || self.data.bound) {
        // if the croppie isn't visible or it doesn't need binding
        return;
    }

    self.data.bound = true;
    cssReset[CSS_TRANSFORM] = transformReset.toString();
    cssReset[CSS_TRANS_ORG] = originReset.toString();
    cssReset['opacity'] = 1;
    css(img, cssReset);

    self._originalImageWidth = imgData.width;
    self._originalImageHeight = imgData.height;

    if (self.options.enableZoom) {
        _updateZoomLimits.call(self, true);
    }
    else {
        self._currentZoom = initialZoom;
    }

    transformReset.scale = self._currentZoom;
    cssReset[CSS_TRANSFORM] = transformReset.toString();
    css(img, cssReset);

    if (self.data.points.length) {
        _bindPoints.call(self, self.data.points);
    }
    else {
        _centerImage.call(self);
    }

    _updateCenterPoint.call(self);
    _updateOverlay.call(self);
}

function _updateZoomLimits (initial) {
    var self = this,
        minZoom = 0,
        maxZoom = 1.5,
        initialZoom,
        defaultInitialZoom,
        zoomer = self.elements.zoomer,
        scale = parseFloat(zoomer.value),
        boundaryData = self.elements.boundary.getBoundingClientRect(),
        imgData = self.elements.preview.getBoundingClientRect(),
        vpData = self.elements.viewport.getBoundingClientRect(),
        minW,
        minH;

    if (self.options.enforceBoundary) {
        minW = vpData.width / (initial ? imgData.width : imgData.width / scale);
        minH = vpData.height / (initial ? imgData.height : imgData.height / scale);
        minZoom = Math.max(minW, minH);
    }

    if (minZoom >= maxZoom) {
        maxZoom = minZoom + 1;
    }

    zoomer.min = fix(minZoom, 4);
    zoomer.max = fix(maxZoom, 4);

    if (initial) {
        defaultInitialZoom = Math.max((boundaryData.width / imgData.width), (boundaryData.height / imgData.height));
        initialZoom = self.data.boundZoom !== null ? self.data.boundZoom : defaultInitialZoom;
        _setZoomerVal.call(self, initialZoom);
    }

    dispatchChange(zoomer);
}

function _bindPoints(points) {
    if (points.length !== 4) {
        throw "Croppie - Invalid number of points supplied: " + points;
    }
    var self = this,
        pointsWidth = points[2] - points[0],
        // pointsHeight = points[3] - points[1],
        vpData = self.elements.viewport.getBoundingClientRect(),
        boundRect = self.elements.boundary.getBoundingClientRect(),
        vpOffset = {
            left: vpData.left - boundRect.left,
            top: vpData.top - boundRect.top
        },
        scale = vpData.width / pointsWidth,
        originTop = points[1],
        originLeft = points[0],
        transformTop = (-1 * points[1]) + vpOffset.top,
        transformLeft = (-1 * points[0]) + vpOffset.left,
        newCss = {};

    newCss[CSS_TRANS_ORG] = originLeft + 'px ' + originTop + 'px';
    newCss[CSS_TRANSFORM] = new Transform(transformLeft, transformTop, scale).toString();
    css(self.elements.preview, newCss);

    _setZoomerVal.call(self, scale);
    self._currentZoom = scale;
}

function _centerImage() {
    var self = this,
        imgDim = self.elements.preview.getBoundingClientRect(),
        vpDim = self.elements.viewport.getBoundingClientRect(),
        boundDim = self.elements.boundary.getBoundingClientRect(),
        vpLeft = vpDim.left - boundDim.left,
        vpTop = vpDim.top - boundDim.top,
        w = vpLeft - ((imgDim.width - vpDim.width) / 2),
        h = vpTop - ((imgDim.height - vpDim.height) / 2),
        transform = new Transform(w, h, self._currentZoom);

    css(self.elements.preview, CSS_TRANSFORM, transform.toString());
}

function _transferImageToCanvas(customOrientation) {
    var self = this,
        canvas = self.elements.canvas,
        img = self.elements.img,
        ctx = canvas.getContext('2d'),
        exif = _hasExif.call(self),
        customOrientation = self.options.enableOrientation && customOrientation;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = img.width;
    canvas.height = img.height;

    if (exif && !customOrientation) {
        var orientation = getExifOrientation(img);
        drawCanvas(canvas, img, num(orientation || 0, 10));
    }
    else if (customOrientation) {
        drawCanvas(canvas, img, customOrientation);
    }
}

function _getCanvas(data) {
    var self = this,
        points = data.points,
        left = num(points[0]),
        top = num(points[1]),
        right = num(points[2]),
        bottom = num(points[3]),
        width = right-left,
        height = bottom-top,
        circle = data.circle,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        outWidth = width,
        outHeight = height,
        startX = 0,
        startY = 0,
        canvasWidth = outWidth,
        canvasHeight = outHeight,
        customDimensions = (data.outputWidth && data.outputHeight),
        outputRatio = 1;

    if (customDimensions) {
        canvasWidth = data.outputWidth;
        canvasHeight = data.outputHeight;
        outputRatio = canvasWidth / outWidth;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (data.backgroundColor) {
        ctx.fillStyle = data.backgroundColor;
        ctx.fillRect(0, 0, outWidth, outHeight);
    }

    // start fixing data to send to draw image for enforceBoundary: false
    if (!self.options.enforceBoundary) {
        if (left < 0) {
            startX = Math.abs(left);
            left = 0;
        }
        if (top < 0) {
            startY = Math.abs(top);
            top = 0;
        }
        if (right > self._originalImageWidth) {
            width = self._originalImageWidth - left;
            outWidth = width;
        }
        if (bottom > self._originalImageHeight) {
            height = self._originalImageHeight - top;
            outHeight = height;
        }
    }

    if (outputRatio !== 1) {
        startX *= outputRatio;
        startY *= outputRatio;
        outWidth *= outputRatio;
        outHeight *= outputRatio;
    }

    ctx.drawImage(this.elements.preview, left, top, Math.min(width, self._originalImageWidth), Math.min(height, self._originalImageHeight), startX, startY, outWidth, outHeight);
    if (circle) {
        ctx.fillStyle = '#fff';
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(outWidth / 2, outHeight / 2, outWidth / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    return canvas;
}

function _getHtmlResult(data) {
    var points = data.points,
        div = document.createElement('div'),
        img = document.createElement('img'),
        width = points[2] - points[0],
        height = points[3] - points[1];

    addClass(div, 'croppie-result');
    div.appendChild(img);
    css(img, {
        left: (-1 * points[0]) + 'px',
        top: (-1 * points[1]) + 'px'
    });
    img.src = data.url;
    css(div, {
        width: width + 'px',
        height: height + 'px'
    });

    return div;
}

function _getBase64Result(data) {
    return _getCanvas.call(this, data).toDataURL(data.format, data.quality);
}

function _getBlobResult(data) {
    var self = this;
    return new Promise(function (resolve, reject) {
        _getCanvas.call(self, data).toBlob(function (blob) {
            resolve(blob);
        }, data.format, data.quality);
    });
}

function _bind(options, cb) {
    var self = this,
        url,
        points = [],
        zoom = null,
        hasExif = _hasExif.call(self);

    if (typeof (options) === 'string') {
        url = options;
        options = {};
    }
    else if (Array.isArray(options)) {
        points = options.slice();
    }
    else if (typeof (options) === 'undefined' && self.data.url) { //refreshing
        _updatePropertiesFromImage.call(self);
        _triggerUpdate.call(self);
        return null;
    }
    else {
        url = options.url;
        points = options.points || [];
        zoom = typeof(options.zoom) === 'undefined' ? null : options.zoom;
    }

    self.data.bound = false;
    self.data.url = url || self.data.url;
    self.data.boundZoom = zoom;

    return Utils.loadImage(url, self.elements.img, hasExif).then(function (img) {
        if (!points.length) {
            var natDim = Utils.naturalImageDimensions(img);
            var rect = self.elements.viewport.getBoundingClientRect();
            var aspectRatio = rect.width / rect.height;
            var imgAspectRatio = natDim.width / natDim.height;
            var width, height;

            if (imgAspectRatio > aspectRatio) {
                height = natDim.height;
                width = height * aspectRatio;
            }
            else {
                width = natDim.width;
                height = width / aspectRatio;
            }

            var x0 = (natDim.width - width) / 2;
            var y0 = (natDim.height - height) / 2;
            var x1 = x0 + width;
            var y1 = y0 + height;

            self.data.points = [x0, y0, x1, y1];
        }
        else if (self.options.relative) {
            points = [
                points[0] * img.naturalWidth / 100,
                points[1] * img.naturalHeight / 100,
                points[2] * img.naturalWidth / 100,
                points[3] * img.naturalHeight / 100
            ];
        }

        self.data.points = points.map(function (p) {
            return parseFloat(p);
        });
        if (self.options.useCanvas) {
            _transferImageToCanvas.call(self, options.orientation || 1);
        }
        _updatePropertiesFromImage.call(self);
        _triggerUpdate.call(self);
        cb && cb();
    });
}

function fix(v, decimalPoints) {
    return parseFloat(v).toFixed(decimalPoints || 0);
}

function _get() {
    var self = this,
        imgData = self.elements.preview.getBoundingClientRect(),
        vpData = self.elements.viewport.getBoundingClientRect(),
        x1 = vpData.left - imgData.left,
        y1 = vpData.top - imgData.top,
        widthDiff = (vpData.width - self.elements.viewport.offsetWidth) / 2, //border
        heightDiff = (vpData.height - self.elements.viewport.offsetHeight) / 2,
        x2 = x1 + self.elements.viewport.offsetWidth + widthDiff,
        y2 = y1 + self.elements.viewport.offsetHeight + heightDiff,
        scale = self._currentZoom;

    if (scale === Infinity || isNaN(scale)) {
        scale = 1;
    }

    var max = self.options.enforceBoundary ? 0 : Number.NEGATIVE_INFINITY;
    x1 = Math.max(max, x1 / scale);
    y1 = Math.max(max, y1 / scale);
    x2 = Math.max(max, x2 / scale);
    y2 = Math.max(max, y2 / scale);

    return {
        points: [fix(x1), fix(y1), fix(x2), fix(y2)],
        zoom: scale
    };
}

var RESULT_DEFAULTS = {
        type: 'canvas',
        format: 'png',
        quality: 1
    },
    RESULT_FORMATS = ['jpeg', 'webp', 'png'];

function _result(options) {
    var self = this,
        data = _get.call(self),
        opts = deepExtend(RESULT_DEFAULTS, deepExtend({}, options)),
        resultType = (typeof (options) === 'string' ? options : (opts.type || 'base64')),
        size = opts.size || 'viewport',
        format = opts.format,
        quality = opts.quality,
        backgroundColor = opts.backgroundColor,
        circle = typeof opts.circle === 'boolean' ? opts.circle : (self.options.viewport.type === 'circle'),
        vpRect = self.elements.viewport.getBoundingClientRect(),
        ratio = vpRect.width / vpRect.height,
        prom;

    if (size === 'viewport') {
        data.outputWidth = vpRect.width;
        data.outputHeight = vpRect.height;
    } else if (typeof size === 'object') {
        if (size.width && size.height) {
            data.outputWidth = size.width;
            data.outputHeight = size.height;
        } else if (size.width) {
            data.outputWidth = size.width;
            data.outputHeight = size.width / ratio;
        } else if (size.height) {
            data.outputWidth = size.height * ratio;
            data.outputHeight = size.height;
        }
    }

    if (RESULT_FORMATS.indexOf(format) > -1) {
        data.format = 'image/' + format;
        data.quality = quality;
    }

    data.circle = circle;
    data.url = self.data.url;
    data.backgroundColor = backgroundColor;

    prom = new Promise(function (resolve, reject) {
        switch(resultType.toLowerCase())
        {
            case 'rawcanvas':
                resolve(_getCanvas.call(self, data));
                break;
            case 'canvas':
            case 'base64':
                resolve(_getBase64Result.call(self, data));
                break;
            case 'blob':
                _getBlobResult.call(self, data).then(resolve);
                break;
            default:
                resolve(_getHtmlResult.call(self, data));
                break;
        }
    });
    return prom;
}

function _refresh() {
    _updatePropertiesFromImage.call(this);
}

function _rotate(deg) {
    if (!this.options.useCanvas) {
        throw 'Croppie: Cannot rotate without enableOrientation';
    }

    var self = this,
        canvas = self.elements.canvas,
        copy = document.createElement('canvas'),
        ornt = 1;

    copy.width = canvas.width;
    copy.height = canvas.height;
    var ctx = copy.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    if (deg === 90 || deg === -270) ornt = 6;
    if (deg === -90 || deg === 270) ornt = 8;
    if (deg === 180 || deg === -180) ornt = 3;

    drawCanvas(canvas, copy, ornt);
    _onZoom.call(self);
    copy = null;
}

function _destroy() {
    var self = this;
    self.element.removeChild(self.elements.boundary);
    removeClass(self.element, 'croppie-container');
    if (self.options.enableZoom) {
        self.element.removeChild(self.elements.zoomerWrap);
    }
    delete self.elements;
}

if (window.jQuery) {
    var $ = window.jQuery;
    $.fn.croppie = function (opts) {
        var ot = typeof opts;

        if (ot === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            var singleInst = $(this).data('croppie');

            if (opts === 'get') {
                return singleInst.get();
            }
            else if (opts === 'result') {
                return singleInst.result.apply(singleInst, args);
            }
            else if (opts === 'bind') {
                return singleInst.bind.apply(singleInst, args);
            }

            return this.each(function () {
                var i = $(this).data('croppie');
                if (!i) return;

                var method = i[opts];
                if ($.isFunction(method)) {
                    method.apply(i, args);
                    if (opts === 'destroy') {
                        $(this).removeData('croppie');
                    }
                }
                else {
                    throw 'Croppie ' + opts + ' method not found';
                }
            });
        }
        else {
            return this.each(function () {
                var i = new Croppie(this, opts);
                i.$ = $;
                $(this).data('croppie', i);
            });
        }
    };
}

function Croppie(element, opts) {
    this.element = element;
    this.options = deepExtend(deepExtend({}, Croppie.defaults), opts);

    if (this.element.tagName.toLowerCase() === 'img') {
        var origImage = this.element;
        addClass(origImage, 'cr-original-image');
        var replacementDiv = document.createElement('div');
        this.element.parentNode.appendChild(replacementDiv);
        replacementDiv.appendChild(origImage);
        this.element = replacementDiv;
        this.options.url = this.options.url || origImage.src;
    }

    _create.call(this);
    if (this.options.url) {
        var bindOpts = {
            url: this.options.url,
            points: this.options.points
        };
        delete this.options['url'];
        delete this.options['points'];
        _bind.call(this, bindOpts);
    }
}

Croppie.defaults = {
    viewport: {
        width: 100,
        height: 100,
        type: 'square'
    },
    boundary: { },
    orientationControls: {
        enabled: true,
        leftClass: '',
        rightClass: ''
    },
    resizeControls: {
        width: true,
        height: true
    },
    customClass: '',
    showZoomer: true,
    enableZoom: true,
    enableResize: false,
    mouseWheelZoom: true,
    enableExif: false,
    enforceBoundary: true,
    enableOrientation: false,
    enableKeyMovement: true,
    update: function () { }
};

Croppie.globals = {
    translate: 'translate3d'
};

deepExtend(Croppie.prototype, {
    bind: function (options, cb) {
        return _bind.call(this, options, cb);
    },
    get: function () {
        var data = _get.call(this);
        var points = data.points;
        if (this.options.relative) {
            points[0] /= this.elements.img.naturalWidth / 100;
            points[1] /= this.elements.img.naturalHeight / 100;
            points[2] /= this.elements.img.naturalWidth / 100;
            points[3] /= this.elements.img.naturalHeight / 100;
        }
        return data;
    },
    result: function (type) {
        return _result.call(this, type);
    },
    refresh: function () {
        return _refresh.call(this);
    },
    setZoom: function (v) {
        _setZoomerVal.call(this, v);
        dispatchChange(this.elements.zoomer);
    },
    rotate: function (deg) {
        _rotate.call(this, deg);
    },
    destroy: function () {
        return _destroy.call(this);
    }
});

/*** EXPORTS FROM exports-loader ***/
module.exports = Croppie;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

if ( typeof window.CustomEvent !== "function" ) {
    (function(){
        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    }());
}

if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i=0; i<len; i++ ) {
                arr[i] = binStr.charCodeAt(i);
            }

            callback( new Blob( [arr], {type: type || 'image/png'} ) );
        }
    });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5).setImmediate))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(6);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var css = __webpack_require__(1);

var CSS_TRANSFORM = css.CSS_TRANSFORM,
    CSS_TRANS_ORG = css.CSS_TRANS_ORG,
    TRANSLATE_OPTS = css.TRANSLATE_OPTS,
    num = __webpack_require__(0).num;

var Transform = function (x, y, scale) {
    this.x = parseFloat(x);
    this.y = parseFloat(y);
    this.scale = parseFloat(scale);
};

var parse = function (v) {
    if (v.style) {
        return parse(v.style[CSS_TRANSFORM]);
    }
    else if (v.indexOf('matrix') > -1 || v.indexOf('none') > -1) {
        return fromMatrix(v);
    }
    else {
        return fromString(v);
    }
};

var fromMatrix = function (v) {
    var vals = v.substring(7).split(',');
    if (!vals.length || v === 'none') {
        vals = [1, 0, 0, 1, 0, 0];
    }

    return new Transform(num(vals[4]), num(vals[5]), parseFloat(vals[0]));
};

var fromString = function (v) {
    var values = v.split(') '),
        translate = values[0].substring(Croppie.globals.translate.length + 1).split(','),
        scale = values.length > 1 ? values[1].substring(6) : 1,
        x = translate.length > 1 ? translate[0] : 0,
        y = translate.length > 1 ? translate[1] : 0;

    return new Transform(x, y, scale);
};

Transform.prototype.toString = function () {
    var suffix = TRANSLATE_OPTS[Croppie.globals.translate].suffix || '';
    return Croppie.globals.translate + '(' + this.x + 'px, ' + this.y + 'px' + suffix + ') scale(' + this.scale + ')';
};

var TransformOrigin = function (el) {
    if (!el || !el.style[CSS_TRANS_ORG]) {
        this.x = 0;
        this.y = 0;
        return;
    }
    var css = el.style[CSS_TRANS_ORG].split(' ');
    this.x = parseFloat(css[0]);
    this.y = parseFloat(css[1]);
};

TransformOrigin.prototype.toString = function () {
    return this.x + 'px ' + this.y + 'px';
};

module.exports = {
    Transform: Transform,
    TransformOrigin: TransformOrigin,
    parse: parse
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

function drawCanvas(canvas, img, orientation) {
    var width = img.width,
        height = img.height,
        ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.save();
    switch (orientation) {
        case 2:
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;

        case 3:
            ctx.translate(width, height);
            ctx.rotate(180*Math.PI/180);
            break;

        case 4:
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;

        case 5:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(90*Math.PI/180);
            ctx.scale(1, -1);
            break;

        case 6:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(90*Math.PI/180);
            ctx.translate(0, -height);
            break;

        case 7:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(-90*Math.PI/180);
            ctx.translate(-width, height);
            ctx.scale(1, -1);
            break;

        case 8:
            canvas.width = height;
            canvas.height = width;
            ctx.translate(0, width);
            ctx.rotate(-90*Math.PI/180);
            break;
    }
    ctx.drawImage(img, 0,0, width, height);
    ctx.restore();
}

module.exports = {
    drawCanvas: drawCanvas
};

/***/ })
/******/ ]);
});