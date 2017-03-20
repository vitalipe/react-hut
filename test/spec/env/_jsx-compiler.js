/**
 *
 *  jsx compiler for tests...
 *  taken from khan academy: https://github.com/Khan/react-components/
 *
 *  to use it pass node the --compilers flag. e,g:
 *  mocha --compilers .:test/_jsx-compiler.js test/spec.js
 *
 */

var fs = require("fs");
var ReactTools = require("react-tools");

var originalCompile = require.extensions[".js"];

require.extensions[".js"] = function(module, filename) {
    // we only care for files inside "test/

    if (filename.indexOf("node_modules") !== -1 || filename.indexOf("test/") === -1)
        return originalCompile(module, filename);

    var content = fs.readFileSync(filename, 'utf8');
    var compiled = ReactTools.transform(content, {harmony: true});
    return module._compile(compiled, filename);
};