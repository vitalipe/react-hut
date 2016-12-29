
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function isComponentSpec(val) {
    return (typeof val === "function" || typeof val === "string");
}


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    var factory = React.createElement;
    var isResolved = React.isValidElement;
    var isElementOrResolved = function (val) { return isResolved(val) || isComponentSpec(val)};


    return function () {
        var args = (Array.isArray(arguments[0]) ? arguments[0] : arguments);
        var fragment = args;
        var resolved = [];

        if (!args[0])
            return null;

        var i = 0;
        while (i < fragment.length) {
            var currentIndex = i;
            var current = fragment[i];
            var next = (i + 1 < fragment.length) ? fragment[i+1] : null;
            var nextNext = (i + 2 < fragment.length) ? fragment[i+2] : null;

            var props = null;
            var children = null;


            if (!isElementOrResolved(next)) {

                if (isObject(next) || next === null)
                    props = next;
                else
                    children = next;

                i++;
            }

            if (!children && !isElementOrResolved(nextNext)) {

                if (Array.isArray(nextNext) || fragment.length === 3) {
                    children = nextNext;
                    i++;
                }
            }

            if (!isResolved(current))
                current = fragment[currentIndex] = (factory(current, props, children));

            resolved.push(current);
            i++;
        }

        return resolved.length === 1 ? resolved[0] : resolved;
    };

};


