
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}


function isComponentSpec(val) {
    return (typeof val === "function" || (typeof val === "string" && val[0] === ":"));
}

function classListsProxy(args) {
    if (!Array.isArray(args))
        return args;

    // flatten
    return  ReactHut.classLists.apply(null, args);
}

ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    for (var key in config) {
        if (key !== "transform") // the only config that we support right now..
            throw new Error("you passed: " + key + " in config, that's not supported..");
    }


    var transform = (config.transform || null);
    var factory = React.createElement;
    var isResolved = React.isValidElement;
    var classLists = ReactHut.classLists ? classListsProxy : null;


    var resolve = function (fragment) {
        var spec = [null, null];
        var i, componentSpec, inline, transformed;

        if (!Array.isArray(fragment))
            return fragment;

        // unroll nested arrays -> [[[[[[:div]]]]]] -> [:div]
        while (fragment.length === 1 && Array.isArray(fragment[0]))
            fragment = fragment[0];

        // empty ?
        if (fragment.length === 0 || fragment[0] === null)
            return null;

        // resolved ?
        if (fragment.length === 1 && isResolved(fragment[0]))
            return fragment[0];

        // an array of children ?
        if (!isComponentSpec(fragment[0])) {
            for(i = 0; i < fragment.length; i++)
                fragment[i] = resolve(fragment[i]);

            return fragment;
        }

        // we use a different array, and copy, because it's faster & simpler..
        spec[0] = fragment[0];

        // props or children?
        if (fragment.length > 1) {
            i = 0;

            if (isObject(fragment[1]) && !isResolved(fragment[1]) ) {
                spec[1] =  fragment[1];
                i = 1;
            }

            while(++i < fragment.length)
                spec.push(fragment[i]);
        }

        // component transform
        if (transform) {
            transformed = transform(spec);

            if (transformed === null)
                return null;

            if (transformed)
                spec = transformed;

            if (isResolved(spec))
                return spec;

            if (!Array.isArray(spec))
                throw new Error("component transform should return an array or nothing, got: " + typeof spec);
        }

        // builtin classLists transform
        if (classLists && spec[1] && spec[1].className && !typeof spec[1].className !== "string")
                spec[1].className = classLists(spec[1].className);


        // resolve children
        for (i = 2; i < spec.length; i++)
            spec[i] = resolve(spec[i]);


        // remove ":" from primitive components and inline class names
        if (typeof spec[0] === "string") {

            componentSpec = spec[0].split(".");
            spec[0] = componentSpec[0].slice(1);

            if (componentSpec.length > 1) {
                inline = componentSpec[1];

                for (i = 2; i < componentSpec.length; i++)
                    inline += " " + componentSpec[i];

                if (spec[1])
                    if (spec[1].className)
                        spec[1].className += " " + inline;
                    else
                        spec[1].className = inline;
                else
                    spec[1] = {className : inline};
            }
        }


        return factory.apply(React, spec);
    };

    return function () {
        return resolve(Array.prototype.slice.call(arguments));
    };
};


