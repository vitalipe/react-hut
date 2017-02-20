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


    var transformProps = config.propsTransform || {};
    var transformPropNames = Object.keys(transformProps);

    var componentTransform = (config.componentTransform || null);

    var factory = React.createElement;
    var isResolved = React.isValidElement;

    if (ReactHut.classLists && !transformProps.className) {
        transformProps.className = classListsProxy;
        transformPropNames.push("className");


    }


    var resolve = function (fragment) {
        var spec = [null, null];
        var i, propName;

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
        if (!isComponentSpec(fragment[0]))
            return fragment.map(resolve);


        // we use a different array, and copy, because it's faster & simpler..
        spec[0] = fragment[0];

        // props or children?
        if (fragment.length > 1) {
            i = 0;

            if (isObject(fragment[1])) {
                spec[1] =  fragment[1];
                i = 1;
            }

            while(++i < fragment.length)
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

        // resolve children
        for (i = 2; i < spec.length; i++)
            spec[i] = resolve(spec[i]);

        // remove ":" from primitive components
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



}));