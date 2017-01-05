
function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function isComponentSpec(val) {
    return (typeof val === "function" || typeof val === "string");
}

function clearFakeSpreadTokens(children) {
    var child;
    var stack = [];

    if (!Array.isArray(children) || children.length === 0)
        return;

    if (children[children.length-1] === SPREAD_TOKEN)
        children.pop();

    stack = stack.concat(children);

    while (stack.length) {
        child = stack.pop();

        if (!Array.isArray(child) || child.length === 0)
            continue;

        if (child[child.length-1] === SPREAD_TOKEN)
            child.pop();

        if (child.length) // recur...
            stack.push.apply(stack, child);
    }
}


var SPREAD_TOKEN = {};


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    var factory = React.createElement;
    var isResolved = React.isValidElement;

    var _isRunningSpread = false;

    var context = function () {
        var child, i, trackedStackSize, fragment, top;
        var args = (Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments));
        var stack = [args];

        if (arguments.length > 3 || (Array.isArray(arguments[0]) && arguments.length > 1))
            throw new Error("was expecting element, props & children or [element, props, children], got extra arguments!");

        // the special case where we want to return null form render...
        if (!args[0])
            return null;

        while (stack.length) {
            trackedStackSize = stack.length;
            fragment = stack[stack.length-1]; // peek

            // unwrap nested arrays like: [[[[Element]]]]
            // fail on arrays like [[Element], "one", "two"]
            while (Array.isArray(fragment[0])){

                if (fragment.length === 1) {
                    fragment = fragment[0];
                    continue;
                }

                // stop unwrapping
                if (fragment[fragment.length-1] === SPREAD_TOKEN)
                    break;

                // invalid..
                if (fragment === args && !_isRunningSpread)
                    throw new Error("multiple root elements are not supported!");
                else
                    throw new Error("received a list of deeply nested elements! this" +
                        " is not supported in this version, use the spread operator(...) or .spread()");
            }

            if (fragment[fragment.length-1] === SPREAD_TOKEN) {
                top = stack.pop();

                if (fragment !== top) {
                    top[0] = fragment[0];
                    top[1] = fragment[1];
                }

                continue;
            }

            // normalize element,props and children
            var element  = fragment[0];
            var props    = null;
            var children = null;

            // 2nd arg can be props or children...
            if (fragment.length === 2) {
                if (isObject(fragment[1]))
                    props = fragment[1];
                else
                    children = fragment[1];
            }

            else if (fragment.length === 3) {
                props = fragment[1];
                children = fragment[2];
            }

            // resolve children
            if (Array.isArray(children))
                for (i = 0; i < children.length; i++) {
                    child = children[i];

                    if (isResolved(child))
                        continue;

                    // we ignore arrays with SPREAD_TOKEN because we might run this loop
                    // twice per component, and we don't want to lose info..
                    if (Array.isArray(child) && child.length > 0 && child[child.length-1] !== SPREAD_TOKEN) {
                        if (isResolved(child[0])) // was resolved?
                            children[i] = child[0];
                        else
                            stack.push(child);
                    }

                    else if (isComponentSpec(child)) {
                        children[i] = factory(child);
                    }

                    // otherwise we don't care..
                }


            if (trackedStackSize !== stack.length)
                continue; // an element can't be resolved before it's children


            fragment = stack.pop();

            // fragment might be a nested array that was unrolled..
            // so let's make sure have the relevant data there...
            fragment[0] = element;
            fragment[1] = props;

            // remove children.. because we want to inline them
            if (fragment.length > 2)
                fragment.pop();

            if (Array.isArray(children)) {
                fragment.push.apply(fragment, children);
                clearFakeSpreadTokens(children);
            }
            else {
                fragment.push(children);
            }



            fragment[0] = factory.apply(null, fragment);
        }


        return args[0];
    };

    context.spread = function (arr, func) {
        var i, root;

        if (!Array.isArray(arr))
            return arr;

        _isRunningSpread = true;

        if (func)
            arr = arr.map(func);

        for (i = 0; i < arr.length; i++) {
            root = arr[i];
            arr[i] = context(root);
        }


        _isRunningSpread = false;

        // mark the result so that we know that it's not a component
        return [arr, SPREAD_TOKEN];
    };

    return context;

};
