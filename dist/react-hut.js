(function (root, factory) {
    /* istanbul ignore next */
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

/* istanbul ignore next */
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

    var proxy = function () {
        return resolve(Array.prototype.slice.call(arguments));
    };

    proxy.__IS_HUT = true;
    proxy.__React = React;


    return proxy;
};




function funcValue(val) {
    if (typeof  val !== "function")
        return function () { return val};

    return val;
}

var throwPropCollisionError = function (a, b) {
    throw new Error(
        "It seems like you defined both "
        + a + " & " + b  + "go get some sleep! ;) ");
};

var wrap = function(func, H, displayName) {
    var proxy = function () {return H(func.apply(this, arguments))};

    if (displayName)
        proxy.displayName = displayName;

    return proxy;
};

ReactHut.createHutView = function (ReactOrHut) {

    var H, React;

    if (typeof ReactOrHut !== "function" && !isObject(ReactOrHut))
        throw new Error("first arg must be React or H()!");

    if (ReactOrHut.__IS_HUT) {
        React = ReactOrHut.__React;
        H = ReactOrHut;
    } else {
        H = ReactHut.createHut(ReactOrHut);
        React = ReactOrHut;
    }

    var lifecycleMethods = [
        ["willMount", "componentWillMount"],
        ["didMount", "componentDidMount"],
        ["willUpdate", "componentWillUpdate"],
        ["didUpdate", "componentDidUpdate"],
        ["willReceiveProps", "componentWillReceiveProps"],
        ["willUnmount", "componentWillUnmount"]];


    return function (displayName, spec) {
        if (typeof displayName !== "string") {
            spec = displayName;
            displayName = null;
        }

        // function component?
        if (typeof spec === "function")
            return wrap(spec, H, displayName);

        var render = spec["render"];
        var lifecycle = spec["lifecycle"];
        var props = spec["props"];
        var state = spec["state"];
        var shouldUpdateFunc = spec["shouldUpdate"];

        delete  spec["lifecycle"];
        delete  spec["props"];
        delete  spec["state"];
        delete  spec["shouldUpdate"];

        if (displayName)
            spec["displayName"] = displayName;

        // shouldComponentUpdate shorthand
        if (shouldUpdateFunc)
            if (!spec["shouldComponentUpdate"])
                spec["shouldComponentUpdate"] = shouldUpdateFunc;
            else
                throwPropCollisionError("shouldUpdate", "shouldComponentUpdate");

        // props shorthand
        if (props)
            if (!spec["getDefaultProps"])
                spec["getDefaultProps"] = funcValue(props);
            else
                throwPropCollisionError("props", "getDefaultProps()");

        // state shorthand
        if (state)
            if (!spec["getInitialState"])
                spec["getInitialState"] = funcValue(state);
            else
                throwPropCollisionError("state", "getInitialState()");

        // lifecycle shorthand
        if (lifecycle)
            lifecycleMethods.forEach(function (pair) {
                var short = pair[0];
                var long  = pair[1];

                if (!lifecycle[short])
                    return;

                if (spec[long])
                    throwPropCollisionError(short, long);

                spec[long] = lifecycle[short];
            });

        // render hook
        if (spec["render"])
            spec["render"] = function () {return H(render.call(this, this.props, this.state))};


        return React.createClass(spec);
    }

};



}));