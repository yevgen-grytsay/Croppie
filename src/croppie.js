/*************************
 * Croppie
 * Copyright 2017
 * Foliotek
 * Version: 2.5.0
 *************************/

require('./polyfills');
var Promise = require('promise-polyfill');
var Utils = require('./utils');
var Transformations = require('./transform');
var initResize = require('./resize');

var Transform = Transformations.Transform,
    TransformOrigin = Transformations.TransformOrigin,
    deepExtend = Utils.deepExtend,
    debounce = Utils.debounce,
    cssmod = require('./css'),
    drawCanvas = require('./canvas').drawCanvas,
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
        var minSize = 50;
        var resize = function (deltaX, deltaY) {
            var newHeight = self.options.viewport.height + deltaY;
            var newWidth = self.options.viewport.width + deltaX;
            var overlayRect = self.elements.overlay.getBoundingClientRect();

            var maxWidth = overlayRect.width;
            var maxHeight = overlayRect.height;

            var result = {w: self.options.viewport.width, h: self.options.viewport.height};

            if (newHeight >= minSize && newHeight <= maxHeight) {
                self.options.boundary.height += deltaY;
                css(self.elements.boundary, {
                    height: self.options.boundary.height + 'px'
                });

                self.options.viewport.height += deltaY;
                css(self.elements.viewport, {
                    height: self.options.viewport.height + 'px'
                });
                result.height = newHeight;
            }

            if (newWidth >= minSize && newWidth <= maxWidth) {
                self.options.boundary.width += deltaX;
                css(self.elements.boundary, {
                    width: self.options.boundary.width + 'px'
                });

                self.options.viewport.width += deltaX;
                css(self.elements.viewport, {
                    width: self.options.viewport.width + 'px'
                });
                result.width = newWidth;
            }

            _updateOverlay.call(self);
            _updateZoomLimits.call(self);
            _updateCenterPoint.call(self);
            _triggerUpdate.call(self);

            return result;
        };
       var resizeEl = initResize(self.options.viewport.width, self.options.viewport.height,
            this.options.resizeControls.width, this.options.resizeControls.height, resize);
        this.elements.boundary.appendChild(resizeEl);
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