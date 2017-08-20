var Utils = require('./utils');
var cssmod = require('./css');

var css = Utils.css,
    addClass = Utils.addClass,
    CSS_USERSELECT = cssmod.CSS_USERSELECT;

function _initializeResize (width, height, resizeHorizontal, resizeVertical, resize) {
    var wrap = document.createElement('div');
    var isDragging = false;
    var direction;
    var originalX;
    var originalY;
    var vr;
    var hr;

    addClass(wrap, 'cr-resizer');
    css(wrap, {
        width: width + 'px',
        height: height + 'px'
    });

    if (resizeVertical) {
        vr = document.createElement('div');
        addClass(vr, 'cr-resizer-vertical');
        wrap.appendChild(vr);
    }

    if (resizeHorizontal) {
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

        isDragging = true;
        originalX = ev.pageX;
        originalY = ev.pageY;
        direction = ev.currentTarget.className.indexOf('vertical') !== -1 ? 'v' : 'h';

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
        var newSize;

        newSize = (direction === 'v') ? resize(0, deltaY) : resize(deltaX, 0);

        originalY = pageY;
        originalX = pageX;

        css(wrap, {
            width: newSize.width + 'px',
            height: newSize.height + 'px'
        });
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

    return wrap;
}

module.exports = _initializeResize;