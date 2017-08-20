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