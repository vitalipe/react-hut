
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function resolveChildren(children, resolver) {
    if (!Array.isArray(children))
        return;

    for (var i = 0; i < children.length; i++)
        children[i] = resolver(children[i]);
}

function resolveComponentTransform(fragment, transform) {
    var transformed;

    if (!transform)
        return fragment;

    transformed = transform(fragment);

    if (!transformed)
        return fragment;

    if (!Array.isArray(transformed))
        throw new Error("component transform should return an array or nothing, got: " + typeof transformed);

    return transformed;
}


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    var transform = (config.transform || null);
    var factory = React.createElement;
    var isResolved = React.isValidElement;
    var delimiter  = ":";


    var isComponentSpec = function(val) {
        return (typeof val === "function" || (typeof val === "string" && val[0] === delimiter));
    };

    var resolve = function (fragment) {
        var i, element;
        var props = null;
        var children = null;
        var spec = [null, null, null];
        var args = [];

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

                element = fragment[0];
                break;

            case 2:
                if (isObject(fragment[1])) {
                    element  = fragment[0];
                    props    = fragment[1];
                } else {
                    element  = fragment[0];
                    children = fragment[1];
                }

                break;

            case 3:
                element  = fragment[0];
                props    = fragment[1];
                children = fragment[2];
                break;
        }

        spec[0] = element;
        spec[1] = props;
        spec[2] = children;


        spec = resolveComponentTransform(spec, transform);
        resolveChildren(spec[2], resolve);

        args[0] = (spec[0][0] === delimiter ? spec[0].slice(1) : spec[0]);
        args[1] = spec[1];

        // flatten children so that we don't get warnings all the time...
        if (Array.isArray(spec[2]))
            args.push.apply(args, spec[2]);
        else
            args.push(spec[2]);

        return factory.apply(React, args);
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


