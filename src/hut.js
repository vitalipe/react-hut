
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}


function stripMarkChar(element) {
    return (typeof element === "string") ? element.slice(1) : element;
}

function isComponentSpec(val) {
    return (typeof val === "function" || (typeof val === "string" && val[0] === ":"));
}


function resolveChildren(children, resolver) {
    if (!Array.isArray(children))
        return;

    for (var i = 0; i < children.length; i++)
        children[i] = resolver(children[i]);
}

function flattenChildren(fragment) {
    if (!Array.isArray(fragment[2]))
        return;

    fragment.push.apply(fragment, fragment.pop());
}

function resolveComponentTransform(fragment, transform) {

    if (!transform)
        return fragment;

    return transform(fragment) || fragment;
}


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    var transform = (config.transform || null);
    var factory = React.createElement;
    var isResolved = React.isValidElement;

    var resolve = function (fragment) {
        var spec = [null, null, null];

        if (!Array.isArray(fragment))
            return fragment;

        while (fragment.length === 1 && Array.isArray(fragment[0]))
            fragment = fragment[0];

        if (fragment.length < 1 || fragment[0] === null)
            return null;

        if (!isComponentSpec(fragment[0]))
            return fragment.map(resolve);

        if (fragment.length > 3)
            throw new Error("got: " + fragment.length + " args, as a child spec, that's not supported!");


        switch (fragment.length) {
            case 1:

                if (isResolved(fragment[0]) || fragment[0] === null)
                    return fragment[0];

                else if (Array.isArray(fragment[0]))
                    return resolve.apply(null, fragment[0]);

                spec[0] = fragment[0];

                break;

            case 2:
                if (isObject(fragment[1])) {
                    spec[0]  = fragment[0];
                    spec[1]    = fragment[1];
                } else {
                    spec[0]  = fragment[0];
                    spec[2] = fragment[1];
                }

                break;

            case 3:
                spec = fragment;
                break;
        }


        if (transform) { // resolve component transform
            spec = (transform(spec) || spec);

            if (isResolved(spec))
                return spec;

            if (!Array.isArray(spec))
                throw new Error("component transform should return an array or nothing, got: " + typeof spec);
        }


        resolveChildren(spec[2], resolve);


        spec[0] = stripMarkChar(spec[0]);
        flattenChildren(spec);

        return factory.apply(React, spec);
    };

    return function () {
        var args = Array.prototype.slice.call(arguments);

        while (args.length === 1 && Array.isArray(args[0]))
            args = args[0];

        if(!args.length)
            return null;

        if (!Array.isArray(args[0]))
            return resolve(args);

        for (var i = 0; i < args.length; i++)
            args[i] = resolve(args[i]);

        return args;
    };
};


