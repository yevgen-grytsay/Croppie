
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