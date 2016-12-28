


ReactHut.createHut = function (React, config) {
    config = (config || {});

    if (!React || !React.createElement || !React.isValidElement)
        throw new Error("first arg must be React!");

    var factory = React.createElement;

    return function () {
        var args = (Array.isArray(arguments[0]) ? arguments[0] : arguments);

        if (!args[0])
            return null;

        return factory(args[0]);
    };

};


