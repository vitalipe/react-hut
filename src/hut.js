
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}


function isComponentSpec(val) {
    return (typeof val === "function" || (typeof val === "string" && val[0] === ":"));
}


function resolveChildren(spec, resolver) {

}


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");


    var transformProps = config.propsTransform || {};
    var transformPropNames = Object.keys(transformProps);

    var componentTransform = (config.componentTransform || null);

    var factory = React.createElement;
    var isResolved = React.isValidElement;

    if (ReactHut.classLists && !transformProps.className) {
        transformProps.className = ReactHut.classLists;
        transformPropNames.push("className");
    }


    var resolve = function (fragment) {
        var spec = [];
        var i, propName;

        if (!Array.isArray(fragment))
            return fragment;

        // unroll nested arrays -> [[[[[[:div]]]]]] -> [:div]
        while (fragment.length === 1 && Array.isArray(fragment[0]))
            fragment = fragment[0];

        // empty
        if (fragment.length === 0 || fragment[0] === null)
            return null;

        // an array of children ?
        if (!isComponentSpec(fragment[0]))
            return fragment.map(resolve);


        if (fragment.length === 1) {
            if (isResolved(fragment[0]) || fragment[0] === null)
                return fragment[0];

            else if (Array.isArray(fragment[0]))
                return resolve.apply(null, fragment[0]);

            spec[0] = fragment[0];
            spec[1] = null;

        } else {

            spec[0] = fragment[0];
            spec[1] = isObject(fragment[1]) ? fragment[1] : null;

            for (i = isObject(fragment[1]) ? 2 : 1; i < fragment.length; i++)
                spec.push(fragment[i]);

        }

        // prop transform
        if (spec[1])
            for (i = 0; i < transformPropNames.length; i++) {
                propName = transformPropNames[i];

                if (spec[1].hasOwnProperty(propName))
                    spec[1][propName] = transformProps[propName](spec[1][propName]);
            }

        // component transform
        if (componentTransform) {
            spec = (componentTransform(spec) || spec);

            if (isResolved(spec))
                return spec;

            if (!Array.isArray(spec))
                throw new Error("component transform should return an array or nothing, got: " + typeof spec);
        }


        for (i = 2; i < spec.length; i++)
            spec[i] = resolve(spec[i]);

        if (typeof spec[0] === "string")
            spec[0] = spec[0].slice(1);

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


