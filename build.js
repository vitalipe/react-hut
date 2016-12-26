var compressor = require("node-minify");

function print(msg) {process.stdout.write(msg)}
function done() {print("[done] \n")}

function concat() {
    print("joining files...");

    return compressor.minify({
        compressor: "no-compress",
        input: ["src/umd/_head", "src/hut.js", "src/umd/_tail"],
        output: "dist/hut.js"
    }).then(done);

}

function compile() {
    print("compiling...");

    return compressor.minify({
        compressor: "gcc",
        input: "dist/hut.js",
        output: "dist/hut.min.js",
        options: {
            compilation_level: "ADVANCED_OPTIMIZATIONS",
            language: "ECMASCRIPT5_STRICT"
        }
    }).then(done);
}



var targets  = {

    help: function() {
        console.log("here be help");
    },

    dev : function() {concat()},
    production : function () {concat().then(compile)}


};


// run selected target
(targets[process.argv[2]] || targets["help"]).call();