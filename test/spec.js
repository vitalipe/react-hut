var assert = require("chai").assert;
var reactHut = require("../bin/react-hut");
var render = require("enzyme").render;
var React = require("react");

function verifyTree(result, expected) {
        assert.equal(
            render(<div className="test-wrapper-ignore-it">{result}</div>).html(),
            render(<div className="test-wrapper-ignore-it">{expected}</div>).html());
}

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

    describe("single element rendering", () => {
        let H = reactHut.createHut(React, {});
        let CustomElement = React.createClass({
            render() { return <div className="custom">{this.props.value}</div>}
        });

        it("should return null when called without input or with null as input", () => {

            assert.isNull(H());
            assert.isNull(H(null));

            assert.isNull(H([]));
            assert.isNull(H([null]));

        });

        it("should render a single primitive element without props", () => {
            verifyTree(H("div"), <div/>);
            verifyTree(H("div", {}), <div/>);
            verifyTree(H("div", {}, []), <div/>);

            verifyTree(H(CustomElement), <CustomElement/>);
            verifyTree(H(CustomElement, {}), <CustomElement/>);
            verifyTree(H(CustomElement, {}, []), <CustomElement/>);

        });

        it("should render any primitive element", () => {
            verifyTree(H("div"), <div/>);
            verifyTree(H("i"), <i/>);
            verifyTree(H("button"), <button/>);
            verifyTree(H("h1"), <h1/>);
        });

        it("should render a single element with props", () => {
            verifyTree(H(CustomElement, {value : "demo"}, []), <CustomElement value="demo" />);
            verifyTree(H("div", {className : "demo"}, []), <div className="demo" />);
            verifyTree(H("div", {className : "demo"}), <div className="demo"/>);
        });


        it("should accept a single element in an array", () => {
            verifyTree(H(["div", {className : "demo"}]), <div className="demo"></div>);
            verifyTree(H(["div"]), <div/>);
        });

        it("should teat functions or strings in the same array as sibling elements", () => {
            verifyTree(H(["div", "i", "h1", CustomElement]), [<div/>, <i/>, <h1 />, <CustomElement/>]);
        });


        it("should return a single element when there is only one top component ", () => {
            assert.isNotArray(H(["div"]));
            assert.isNotArray(H(["div", {}]));
            assert.isNotArray(H(["div", {}, [] ]));

            assert.isNotArray(H("div"));
            assert.isNotArray(H("div", {}));
            assert.isNotArray(H("div", {}, [] ));
        });

    });

    /**
    describe("element with children rendering", () => {

        it("should render element with props & a single child", () => {
            verifyTree(H(["div", {}, ["div"]]), <div className="demo"><div></div></div>);
        });

    }); **/
});