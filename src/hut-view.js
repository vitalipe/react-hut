
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


