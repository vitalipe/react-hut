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
    render() { return <div>
        <label className="value-wrapper">{this.props.value}</label>
        {this.props.children}
    </div>}
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

    describe("simple rendering", () => {

        it("should return null when called without input or with null as input", () => {
            assert.isNull(H());
            assert.isNull(H(null));

            assert.isNull(H([]));
            assert.isNull(H([null]));
        });

        it("should render a root primitive  without props", () => {
            verifyTree(H(["div", {}, []]), <div/>);
        });

        it("should render a custom root element without props", () => {
            verifyTree(H([CustomElement]), <CustomElement/>);
        });

        it("should render different primitive element", () => {
            verifyTree(H(["div", {}, []]), <div/>);
            verifyTree(H(["i", {}, []]), <i/>);
            verifyTree(H(["button", {}, []]), <button/>);
            verifyTree(H(["h1", {}, []]), <h1/>);
        });

        it("should render root element with props", () => {
            verifyTree(H([CustomElement, {value : "demo"}, []]), <CustomElement value="demo" />);
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


        it ("should render child elements", () => {
            verifyTree(H(
                [
                    CustomElement, {},
                    [
                        ["header", {className : "header"}, []],
                        ["div", {className : "content"}, []]
                    ]
                ]),
                <CustomElement>
                    <header className="header" />
                    <div className="content" />
                </CustomElement>);

        });

        it ("should render deeply nested child elements", () => {
            verifyTree(H(
                [
                    CustomElement, {},
                    [
                        ["header", {className : "header"},
                            [
                                ["h1", {}, "main-title"],
                                ["h2", {}, "sub-title"],
                                ["h3", {}, "sub-sub-title"]
                            ]
                        ],

                        ["div", {className : "content"},
                            [
                                ["label", {}, "content"]
                            ]
                        ]
                    ]
                ]),
                <CustomElement>
                    <header className="header">
                        <h1>main-title</h1>
                        <h2>sub-title</h2>
                        <h3>sub-sub-title</h3>
                    </header>
                    <div className="content">
                        <label>content</label>
                    </div>
                </CustomElement>);

        })


    });

    describe("invalid input", () => {

        it("should throw when root element is not inside an array and has > 3 args", () => {
            assert.throws(() => H("div", {}, [], "invalid"));
        });

        it("should throw when root element is inside an array and has > 1 args", () => {
            assert.throws(() => H(["div", {}, []], "invalid"));
        });


        it("should throw when multiple root elements are provided", () => {
            assert.throws(() => H(["h1"], ["h2"]));
        });

        it("should throw when a list of multiple nested children is provided", () => {
            assert.throws(() => H(["div", [ [["span"], ["div"]] ] ]));
            assert.throws(() => H(["div", [ "div", [["span"], ["div"]] ] ]));

        });

    });

    describe("nested array components", () => {

        it("should unpack nested root elements", () => {
            verifyTree(H([    ["div", {className: "demo"}, []]    ]), <div className="demo"></div>);
        });

        it("should unpack deeply nested root elements", () => {
            verifyTree(H([[[[[[[[["div", {className: "demo"}, []]]]]]]]]]), <div className="demo"></div>);
        });

        it("should unpack deeply nested single child elements", () => {
            verifyTree(H(["div", {className: "demo"}, [

                ["span", {className : "one"}, "one"],
                [[[[[["span", { className : "two"}, "two"]]]]]]


            ]]), <div className="demo">
                    <span className="one">one</span>
                    <span className="two">two</span>
                </div>);
        });
    });


    describe("shorthand notation", () => {

        it("should be possible to omit [] when a component does't have props or children ", () => {

            verifyTree(H(["div", {className: "demo"}, [CustomElement, "div", "ul"] ]),

                <div className="demo">
                    <CustomElement /><div /><ul />
                </div>);
        });

        it("should be possible to omit children  when a component does't have any ", () => {

            verifyTree(H(["div", {className: "demo"},
                    [[CustomElement, {value : "v"}] , ["div", {className : "foo"}], "ul"]
                ]),

                <div className="demo">
                    <CustomElement value="v" /><div className="foo" /><ul />
                </div>);
        });


        it("should be possible to omit props but still provide children", () => {

            verifyTree(H([
                    "div",
                    [
                        [CustomElement, {value : "v"}] ,
                        ["div",
                            [
                                ["span", "value"]
                            ]
                        ]
                    ]
                ]),

                <div>
                    <CustomElement value="v" />
                    <div>
                        <span>value</span>
                    </div>
                </div>);
        });

        it("should be possible to mix shorthand notation with normal notation", () => {

            verifyTree(H([
                    "div", {className: "demo"},
                    [
                        "div",
                        ["div", {className : "foo"}, []],
                        ["h1", "title"],
                        "span"
                    ]
                ]),

                <div className="demo">
                    <div /><div className="foo" /><h1>title</h1><span />
                </div>);
        });

    })

});