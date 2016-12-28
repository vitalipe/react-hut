var assert = require("chai").assert;
var reactHut = require("../bin/react-hut");
var render = require("enzyme").render;
var React = require("react");

console.log(render(<div />).html());

describe("react-hut", () => {

    describe(".createHut()", () => {

        it("should return a function", () => {
            assert.isFunction(reactHut.createHut(React));
        });

        it("should throw error if react is not passed", () => {
            assert.throws(() => reactHut.createHut({}));
            assert.throws(() => reactHut.createHut());
        });
    });

    describe("simple rendering", () => {
        let H = reactHut.createHut(React, {});

        it("should return null when called without input or with null as input", () => {

            assert.isNull(H());
            assert.isNull(H(null));

            assert.isNull(H([]));
            assert.isNull(H([null]));

        });

        it("should render a single div", () => {

            verifyHtml(H("div"), "<div></div>");

            assert.isNull(H("div"));
            assert.isNull(H(["div"]));

        });

    });
});