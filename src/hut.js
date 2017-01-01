
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


    return function () {
        var args = (Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments));
        var stack = [args];

        if (arguments.length > 3 || (Array.isArray(arguments[0]) && arguments.length > 1))
            throw new Error("was expecting element, props & children or [element, props, children], got extra arguments!");

        // the special case where we want to return null form render...
        if (!args[0])
            return null;

        while (stack.length) {
            var trackedStackSize = stack.length;
            var fragment = stack[stack.length-1]; // peek

            // unwrap nested arrays like: [[[[Element]]]]
            while (Array.isArray(fragment[0]))
                fragment = fragment[0];

            // normalize element,props and children
            var element  = fragment[0];
            var props    = null;
            var children = null;

            // 2nd arg can be props of children...
            if (fragment.length === 2) {
                if (isObject(fragment[1]))
                    props = fragment[1];
                else
                    children = fragment[1];
            }

            if (fragment.length === 3) {
                props = fragment[1];
                children = fragment[2];
            }

            // resolve children
            if (Array.isArray(children))
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];

                    if (isResolved(child))
                        continue;

                    if (Array.isArray(child) && child.length > 0)
                        if (isResolved(child[0])) // was resolved?
                            children[i] = child[0];
                        else
                            stack.push(child);

                    else if (isComponentSpec(child))
                        children[i] = factory(child);

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

            if (Array.isArray(children))
                fragment.push.apply(fragment, children);
            else
                fragment.push(children);


            fragment[0] = factory.apply(null, fragment);
        }


        return args[0];
    };

};


