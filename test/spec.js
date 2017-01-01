var assert = require("chai").assert;
var reactHut = require("../bin/react-hut");
var render = require("enzyme").render;
var React = require("react");

function verifyTree(result, expected) {
        assert.equal(
            render(<div className="test-wrapper-ignore-it">{result}</div>).html(),
            render(<div className="test-wrapper-ignore-it">{expected}</div>).html());
}

let H = reactHut.createHut(React, {});
let CustomElement = React.createClass({
    render() { return <div className="custom">{this.props.value}</div>}
});


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

    describe("root element", () => {

        it("should return null when called without input or with null as input", () => {
            assert.isNull(H());
            assert.isNull(H(null));

            assert.isNull(H([]));
            assert.isNull(H([null]));
        });

        it("should render a root primitive  without props", () => {
            verifyTree(H("div"), <div/>);
            verifyTree(H(["div"]), <div/>);
        });

        it("should render a custom root element without props", () => {
            verifyTree(H(CustomElement), <CustomElement/>);
            verifyTree(H([CustomElement]), <CustomElement/>);
        });

        it("should render different primitive element", () => {
            verifyTree(H("div"), <div/>);
            verifyTree(H("i"), <i/>);
            verifyTree(H("button"), <button/>);
            verifyTree(H("h1"), <h1/>);
        });

        it("should render root element with props", () => {
            verifyTree(H([CustomElement, {value : "demo"}]), <CustomElement value="demo" />);
        });

        it("should render root element with props and children", () => {
            verifyTree(H(
                [
                    CustomElement, {value : "demo"},
                    [
                        ["div", {}, []],
                        ["div", {}, []]
                    ]

                ]), <CustomElement value="demo"><div /><div /></CustomElement>);
        });

        it("should render root element with children", () => {
            verifyTree(H(
                [
                    CustomElement,
                    [
                        ["div", {}, []],
                        ["div", {}, []]
                    ]

                ]), <CustomElement><div /><div /></CustomElement>);
        });


        it("should accept a root element with props, without an array", () => {
            verifyTree(H("div", {className : "demo"}), <div className="demo"></div>);
        });

        it("should throw when root element is not inside an array and has > 3 args", () => {
            assert.throws(() => H("div", {}, [], "invalid"));
        });

        it("should throw when root element is inside an array and has > 1 args", () => {
            assert.throws(() => H(["div", {}, []], "invalid"));
        });

    });

});