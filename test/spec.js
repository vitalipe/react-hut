var chai = require("chai");
var reactHut = require("../bin/react-hut");
var render = require("enzyme").render;
var React = require("react");
var sinon = require("sinon");

sinon.assert.expose(chai.assert, { prefix: "" });
var assert = chai.assert;

function verifyTree(result, expected) {
        assert.equal(
            render(<div className="test-wrapper-ignore-it">{result}</div>).html(),
            render(<div className="test-wrapper-ignore-it">{expected}</div>).html());
}

function willVerifyEqual(expected) {
    return (arg) =>  assert.deepEqual(arg, expected);
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

        it("should throw error if invalid config keys are passed", () => {
            assert.throws(() => reactHut.createHut(React, {crap : function () {}}));
            assert.throws(() => reactHut.createHut(React, {transforrmmmm : function () {}}));
            assert.throws(() => reactHut.createHut(React, {fake : true}));
        });
    });

    describe("#default hut context", () => {
        let H = reactHut.createHut(React, {});
        let CustomElement = React.createClass({
            render() { return <div>
                <label className="value-wrapper">{this.props.value}</label>
                {this.props.children}
            </div>}
        });

        describe("#simple rendering", () => {


            it("should return null when called without input or with null as input", () => {
                assert.isNull(H());
                assert.isNull(H(null));

                assert.isNull(H([]));
                assert.isNull(H([null]));
            });

            it("should render a root primitive", () => {
                verifyTree(H([":div", {}, []]), <div/>);
            });

            it("should render a custom root element", () => {
                verifyTree(H([CustomElement]), <CustomElement/>);
            });

            it("should render different primitive element", () => {
                verifyTree(H([":div", {}, []]), <div/>);
                verifyTree(H([":i", {}, []]), <i/>);
                verifyTree(H([":button", {}, []]), <button/>);
                verifyTree(H([":h1", {}, []]), <h1/>);
            });

            it("should render root element with props", () => {
                verifyTree(H([CustomElement, {value: "demo"}, []]), <CustomElement value="demo"/>);
            });

            it("should render root element with props and children", () => {
                verifyTree(H(
                    [CustomElement, {value: "demo"},
                        [":div", {}, []],
                        [":div", {}, []]
                    ]),

                    <CustomElement value="demo">
                    <div />
                    <div />
                </CustomElement>);
            });

            it("should render child elements", () => {
                verifyTree(H(

                    [CustomElement, {},
                        [":header", {className: "header"}, []],
                        [":div", {className: "content"}, []]]


                    ),
                    <CustomElement>
                        <header className="header"/>
                        <div className="content"/>
                    </CustomElement>);

            });

            it("should not fuck with children that are not arrays", () => {
                verifyTree(H(
                    [
                        CustomElement, {},
                        [
                            "the answer is: ",
                            42,
                            "and it's",
                            true,
                            "or",
                            false,
                            "but not",
                            0
                        ]

                    ]), <CustomElement>{
                    [
                        "the answer is: ",
                        42,
                        "and it's",
                        true,
                        "or",
                        false,
                        "but not",
                        0
                    ]
                }</CustomElement>);
            });

            it("should be possible to mix literals with child components", () => {
                verifyTree(H(
                    [CustomElement, {},
                        [":span", {className : "s1"}],
                        "I'm a simple string ", "answer is: ", 42,
                        [":span", {className : "s2"}]]

                ), <CustomElement>
                        <span className="s1" />{["I'm a simple string ", "answer is: ", 42]}<span className="s2" />
                    </CustomElement>);
            });

            it("should render deeply nested child elements", () => {
                verifyTree(H(
                    [CustomElement, {},
                        [":header", {className: "header"},
                            [
                                [":h1", {key : 1}, "main-title"],
                                [":h2", {key : 2}, "sub-title"]
                            ],
                            [":h3", {}, "sub-sub-title"]],

                        [":div", {className: "content"},
                            [":label", {}, "content"]]]),

                    <CustomElement>
                        <header className="header">
                            <h1 key={1}>main-title</h1>
                            <h2 key={2}>sub-title</h2>
                            <h3>sub-sub-title</h3>
                        </header>
                        <div className="content">
                            <label>content</label>
                        </div>
                    </CustomElement>);

            });

            it("should render a list of elements and return an array", () => {
                var list = H(

                        [":div", {className : "d1"}, []],
                        [":div", {className : "d2"}, [[":span"]]]

                );

                assert.isArray(list);
                assert.lengthOf(list, 2);

                verifyTree(list[0], <div className="d1" />);
                verifyTree(list[1], <div className="d2"><span /></div>);
            });

            it("should be possible to pass a React component", () => {
                verifyTree(H(<div/>), <div/>);
            });

            it("should be possible to mix calls to H with JSX", () => {
                verifyTree(H(
                    ":div.parent",
                    42,
                    <div/>,
                    [":span"]),

                    <div className="parent">
                        42
                        <div />
                        <span />
                    </div>);

                verifyTree(H(
                    ":div.parent",
                        <div/>,
                        [":span"],
                        <div/>, [[":span", {key : "0"}], <ul key="1"/>]),

                    <div className="parent">
                        <div/>
                        <span />
                        <div />
                        {[<span key="0" />, <ul key="1"/>]}
                    </div>);
            });

        });


        describe("# builtin className transform with classLists", () => {
            beforeEach(() => {
                sinon.spy(reactHut , "classLists");

            });

            afterEach(() => {
                reactHut.classLists.restore();
            });

            it("should use class-lists lib for class name props by default", () => {
                let H = reactHut.createHut(React);

                H(":div", {className : ["one", "two"]},
                    [":div", {className : ["moo", "crap", "other"]}]);

                assert.calledTwice(reactHut.classLists);
                assert.calledWith(reactHut.classLists, "one", "two");
                assert.calledWith(reactHut.classLists, "moo", "crap", "other");
            });

            it("should spread args to class-lists", () => {
                let H = reactHut.createHut(React);

                H(":div", {className : ["one", "two", [true, "hidden"]] });

                assert.calledWith(reactHut.classLists, "one", "two", [true, "hidden"]);
            });


            it("should not crash when class-lists is missing", () => {
                let classLists = reactHut.classLists;
                delete reactHut.classLists;

                assert.doesNotThrow(() => {
                    let H = reactHut.createHut(React);
                    H(":div", {className : ["one", "two"]}, [[":div", {className : "other"}]]);
                });

                reactHut.classLists = classLists;
            });


            it("should be called after transform()", () => {
                let transform = sinon.spy(([c, {className}]) => assert.deepEqual(className, ["one", "two"]));
                let H = reactHut.createHut(React, {transform});

                H(":div", {className : ["one", "two"]});

                assert(transform.calledBefore(reactHut.classLists));
            });

            it("should not call classNames on simple string className values", () => {
                H(":div.panel", {className : "my string class-name-here"});
                assert(reactHut.classLists.notCalled);
            });

            it("should correctly render class-names ", () => {
                assert(reactHut.classLists.notCalled);

                verifyTree(
                    H(":div.panel", {className : "my string class-name-here"}),
                    <div className="my string class-name-here panel" />);

                verifyTree(
                    H(":div", {className : ["panel", [true, "open", "closed"]]}),
                    <div className="panel open" />);
            });

        });

        describe("#flat children", () => {

            it("should be possible to omit array when there is only one child fragment", () => {
                verifyTree(H(
                    [":div",
                        [":span"]]
                    ),

                    <div>
                        <span />
                    </div>
                )
            });

            it("should be possible to omit array with multiple child fragments", () => {
                verifyTree(H(
                    [":ul",
                        [":li"], [":li"], [":li"]]
                    ),

                    <ul>
                        <li />
                        <li />
                        <li />
                    </ul>
                )
            });

            it("should be possible to omit array with primitive children", () => {
                verifyTree(H(
                    [":div",
                        42, "hello"]
                    ),

                    <div>
                        {42}
                        {"hello"}
                    </div>
                )
            });

            it("should be possible to omit array with mixed child fragments", () => {
                verifyTree(H(
                    [":ul",
                        "hello", [":li"], [":li"], "world", [":li"]]
                    ),

                    <ul>
                        hello
                        <li />
                        <li />
                        world
                        <li />
                    </ul>
                );

                verifyTree(H(
                    [":ul",
                        [":li"], "hello", [":li"], "world", [":li"]]
                    ),

                    <ul>
                        <li />
                        hello
                        <li />
                        world
                        <li />
                    </ul>
                );
            });

            it("should be possible to omit array with nested children", () => {
                verifyTree(H(
                    [":ul",
                        [":li",
                            [":span", {className : "inner"}, "hey"]],
                        [":li"],
                        [":li"]
                    ]
                    ),

                    <ul>
                        <li><span className="inner">hey</span></li>
                        <li/>
                        <li/>
                    </ul>
                )
            });
        });

        describe("#nested array components", () => {

            it("should unpack nested root elements", () => {
                verifyTree(H([[":div", {className: "demo"}, []]]), <div className="demo"></div>);
            });

            it("should unpack deeply nested root elements", () => {
                verifyTree(H([[[[[[[[[":div", {className: "demo"}, []]]]]]]]]]), <div className="demo"></div>);
            });

            it("should unpack deeply nested single child elements", () => {
                verifyTree(H(
                    [":div", {className: "demo"},
                        [":span", {className: "one"}, "one"],
                        [[[[[[":span", {className: "two"}, "two"]]]]]]
                    ]
                ), <div className="demo">
                    <span className="one">one</span>
                    <span className="two">two</span>
                </div>);
            });

            it("should unpack deeply nested multi child elements", () => {
                verifyTree(H(
                    [":div", {className: "demo"},
                        [

                            [":span", {key : 0, className: "one"}, "one"],
                            [[[[[
                                [":span", {key : 1, className: "two"}, "two"]
                            ]]]]],

                            [
                                [
                                    [":div", {key : 2}], [":span", {key : 3}]
                                ],
                                [[[[
                                    [":span", {className: "three", key : 4}, "3"]
                                ]]]]
                            ]

                        ]
                    ]
                ), <div className="demo">
                    <span className="one">one</span>
                    <span className="two">two</span>
                    <div />
                    <span />
                    <span className="three">3</span>
                </div>);
            });


            it("should not try to parse nested data that doesn't look like a component", () => {
                verifyTree(H([":div", {className: "demo"}, [

                    [":span", {key : "moo", className: "one"}, "one"],
                    [["raw", " ", "data", " ", "string"]]

                ]]), <div className="demo">
                    <span className="one">one</span>
                    raw data string
                </div>);
            });

            it("should still parse mixed nested data that looks like a component", () => {
                verifyTree(H(
                    [":div", {key : 0, className: "demo"},
                        [
                            [":span", {key : 1, className: "one"}, "one"],
                            [
                                ["raw", " ", "data", " ", "string"],
                                [":ul", {key : 2, className : "with-child"}, [[":li"]]]
                            ]
                        ]
                    ]

                ), <div className="demo">
                    <span className="one">one</span>
                    raw data string
                    <ul className="with-child">
                        <li />
                    </ul>
                </div>);
            });

        });

        describe("#shorthand notation", () => {

            it("should be possible to omit children & props ", () => {

                verifyTree(H(
                    [":div", {className: "demo"},
                            [CustomElement], [":ul"]
                    ]),

                    <div className="demo">
                        <CustomElement />
                        <ul />
                    </div>);
            });

            it("should be possible to omit children", () => {

                verifyTree(H(
                    [":div", {className: "demo"},
                        [CustomElement, {value: "v"}],
                        [":div", {className: "foo"}],
                        [":ul"]]
                    ),

                    <div className="demo">
                        <CustomElement value="v"/>
                        <div className="foo"/>
                        <ul />
                    </div>);
            });

            it("should also work on root element", () => {
                verifyTree(H(":div"), <div/>);
                verifyTree(H(":div", ["string literal"]), <div>string literal</div>);
                verifyTree(H(":div", {className : "foo"}), <div className="foo"/>);
                verifyTree(H(":div", {className : "foo"}, ["string literal"]), <div className="foo">string literal</div>)
            });

            it("should be possible to omit props but still provide children", () => {

                verifyTree(H([":div",

                            [CustomElement, {value: "v"}],
                            [":div",
                                [
                                    [":span", "value"]
                                ]
                            ]

                    ]),

                    <div>
                        <CustomElement value="v"/>
                        <div>
                            <span>value</span>
                        </div>
                    </div>);
            });

            it("should be possible to mix shorthand notation with normal notation", () => {

                verifyTree(H(
                    [":div", {className: "demo"},
                        [":div"],
                        [":div", {className: "foo"}, []],
                        [":h1", "title"],
                        [":span"]

                    ]),

                    <div className="demo">
                        <div />
                        <div className="foo"/>
                        <h1>title</h1><span />
                    </div>);
            });

        });

        describe("#inline class-names", () => {

            it("should be possible to inline class name with .", () => {
                verifyTree(H([":div.my-class-name"]), <div className="my-class-name" />);
                verifyTree(H([":div.my-class-name", {}]), <div className="my-class-name" />);
            });

            it("should be possible to inline multiple class names", () => {
                verifyTree(H([":div.class-first.class-mid.class-last"]), <div className="class-first class-mid class-last" />);
            });

            it("should append inline class names to className prop", () => {
                verifyTree(H([":div.panel", {className : "my"}]), <div className="my panel" />);
            });
        });


    });

    describe("#component transform", () => {

        it("should be called for each component", () => {
            let transform = sinon.stub();
            let H = reactHut.createHut(React, {transform});

            H(
                [":div",
                    [":ul",
                        [":li"],
                        [":li"],
                        [":li"]]]
            );

            assert.callCount(transform, 5);
        });

        it("should be possible apply transformation by returning a new array", () => {
            let transform = () => [":div", {className : "moo"}, "mooo!"];
            let H = reactHut.createHut(React, {transform});

            verifyTree(H(":span", {style : {}}, []), <div className="moo">mooo!</div>);
        });

        it("should be possible apply transformation by altering the param", () => {
            let transform = (fragment) => {
                fragment[0] = ":div";
                fragment[1] = {className : "moo"};
                fragment[2] = "mooo!";
            };

            let H = reactHut.createHut(React, {transform});

            verifyTree(H(":span", {style : {}}, []), <div className="moo">mooo!</div>);
        });


        it("should be called before class-names are inline", () => {
            let transform = ([element]) => assert.equal(element, ":div.panel");
            let H = reactHut.createHut(React, {transform});

            H([":div.panel"]);
        });


        it("should be possible to return resolved components from transform", () => {
            let transform = () => <div className="resolved" />;
            let H = reactHut.createHut(React, {transform});

            verifyTree(H(":crap", {style : {}}, []), <div className="resolved" />);
        });

        it("should be possible to modify children before they are resolved", () => {
            let transform = ([e, p, ...children]) => (children || []).forEach(c => { if (c[0] === ":fake") c[0] = ":li" });
            let H = reactHut.createHut(React, {transform});


            verifyTree(H(
                ":ul",
                    [":fake"],
                    [":fake"],
                    [":fake"]
                ), <ul>
                <li />
                <li />
                <li />
            </ul>);

        });


        it("should throw an error when a transformation returns a thruthy non array value", () => {
            let transform = sinon.stub();
            let H = reactHut.createHut(React, {transform});

            transform.returns(true);
            assert.throws(() => H(":span", {style : {}}, []), Error);

            transform.returns(42);
            assert.throws(() => H(":span", {style : {}}, []), Error);

            transform.returns({});
            assert.throws(() => H(":span", {style : {}}, []), Error);

            transform.returns("component");
            assert.throws(() => H(":span", {style : {}}, []), Error);
        });


        describe("#transform function args", () => {

            it("should be called with the component, props & children in a single array argument", () => {
                let transform = willVerifyEqual([":div", {k: "v"}, "hello", "man"]);
                let H = reactHut.createHut(React, {transform});

                H(":div", {k: "v"}, "hello", "man");
            });

            it("missing props should be passed as null", () => {
                let transform = willVerifyEqual([":div", null, ["raw..."]]);
                let H = reactHut.createHut(React, {transform});

                H(":div", ["raw..."]);
            });

            it("missing children should be passed are undefined", () => {
                let transform = willVerifyEqual([":div", {works: true}]);
                let H = reactHut.createHut(React, {transform});

                H(":div", {works: true});
            });

            it("missing props should be passed as null when children are passed", () => {
                let transform = willVerifyEqual([":header", null, "hello", "world"]);
                let H = reactHut.createHut(React, {transform});

                H(":header", "hello", "world");
            });

            it("missing props should be passed as null when children & props are missing", () => {
                let transform = willVerifyEqual([":header", null]);
                let H = reactHut.createHut(React, {transform});

                H(":header");
            });

        });
    })

});