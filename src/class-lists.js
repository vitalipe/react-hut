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