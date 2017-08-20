var css = require('./css');

var CSS_TRANSFORM = css.CSS_TRANSFORM,
    CSS_TRANS_ORG = css.CSS_TRANS_ORG,
    TRANSLATE_OPTS = css.TRANSLATE_OPTS,
    num = require('./utils').num;

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