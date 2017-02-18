(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an with the same name as the npm module.
        define('react-hut', ['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.ReactHut = {}));
    }
}(this, function (ReactHut) {
"use strict";
// class-lists 1.0.0 by Juan Maiz Lulkin (aka @joaomilho) MIT
// https://github.com/joaomilho/class-lists.git
ReactHut.classLists =  function() {
    var classes = []
    var module = arguments[0].constructor === Object
        ? arguments[0]
        : null

    var i = 0
    while (i < arguments.length) {
        var arg = arguments[i++]
        if (!arg) continue

        if (typeof arg === 'string') {
            classes.push(module && module[arg] || arg)
        } else if (Array.isArray(arg) && arg.length <= 3) {
            arg[0]
                ? typeof arg[1] === 'string' &&
            classes.push(module && module[arg[1]] || arg[1])
                : typeof arg[2] === 'string' &&
            classes.push(module && module[arg[2]] || arg[2])
        }
    }

    return classes.join(' ')
};

function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
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
        var spec = [null, null, null];
        var i, propName;

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


        resolveChildren(spec[2], resolve);


        if (typeof spec[0] === "string")
            spec[0] = spec[0].slice(1);

        if (Array.isArray(spec[2]))
            spec.push.apply(spec, spec.pop());


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



}));