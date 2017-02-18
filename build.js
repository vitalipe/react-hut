var compressor = require("node-minify");
var fs = require("fs");

function print(msg) {process.stdout.write(msg)}
function done() {print("[done] \n")}

function concat() {
    print("joining files...");

    return compressor.minify({
        compressor: "no-compress",
        input: ["src/umd/_head", "src/class-lists.js", "src/hut.js", "src/umd/_tail"],
        output: "bin/react-hut.js"
    }).then(done);

}

function compile() {
    print("compiling...");

    return compressor.minify({
        compressor: "gcc",
        input: "bin/react-hut.js",
        output: "bin/react-hut.js",
        options: {
            compilation_level: "ADVANCED_OPTIMIZATIONS",
            language: "ECMASCRIPT5_STRICT"
        }
    }).then(done);
}

function copy(from, to) {
    print("copying...");
    fs.writeFileSync(to, fs.readFileSync(from));
    done();
}


var targets  = {

    help: function() {
        console.log("here be help");
    },

    dev  : function() {concat()},
    prod : function () {concat().then(compile)},
    dist : function () {
        concat()
            .then(() => copy("./bin/react-hut.js", "./dist/react-hut.js"))
            .then(compile)
            .then(() => copy("./bin/react-hut.js", "./dist/react-hut.min.js"))
    }

};


// run selected target
(targets[process.argv[2]] || targets["help"]).call();