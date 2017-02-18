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
                    [
                        CustomElement, {value: "demo"},
                        [
                            [":div", {}, []],
                            [":div", {}, []]
                        ]

                    ]), <CustomElement value="demo">
                    <div />
                    <div />
                </CustomElement>);
            });

            it("should render child elements", () => {
                verifyTree(H(
                    [
                        CustomElement, {},
                        [
                            [":header", {className: "header"}, []],
                            [":div", {className: "content"}, []]
                        ]
                    ]),
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
                            "I'm a simple string ",
                            "answer is: ",
                            42
                        ]

                    ]), <CustomElement>{["I'm a simple string ", "answer is: ", 42]}</CustomElement>);
            });

            it("should be possible to mix literals with child components", () => {
                verifyTree(H(
                    [
                        CustomElement, {},
                        [
                            [":span", {className : "s1"}],
                            "I'm a simple string ",
                            "answer is: ",
                            42,
                            [":span", {className : "s2"}]
                        ]

                    ]), <CustomElement>
                        <span className="s1" />{["I'm a simple string ", "answer is: ", 42]}<span className="s2" />
                    </CustomElement>);
            });

            it("should render deeply nested child elements", () => {
                verifyTree(H(
                    [
                        CustomElement, {},
                        [
                            [":header", {className: "header"},
                                [
                                    [":h1", {}, "main-title"],
                                    [":h2", {}, "sub-title"],
                                    [":h3", {}, "sub-sub-title"]
                                ]
                            ],

                            [":div", {className: "content"},
                                [
                                    [":label", {}, "content"]
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
                        [
                            [":span", {className: "one"}, "one"],
                            [[[[[[":span", {className: "two"}, "two"]]]]]]
                        ]
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

                            [":span", {className: "one"}, "one"],
                            [[[[[
                                [":span", {className: "two"}, "two"]
                            ]]]]],

                            [
                                [
                                    [":div"], [":span"]
                                ],
                                [[[[
                                    [":span", {className: "three"}, "3"]
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

                    [":span", {className: "one"}, "one"],
                    [["raw", " ", "data", " ", "string"]]

                ]]), <div className="demo">
                    <span className="one">one</span>
                    raw data string
                </div>);
            });

            it("should still parse mixed nested data that looks like a component", () => {
                verifyTree(H(
                    [":div", {className: "demo"},
                        [
                            [":span", {className: "one"}, "one"],
                            [
                                ["raw", " ", "data", " ", "string"],
                                [":ul", {className : "with-child"}, [[":li"]]]
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

        describe("shorthand notation", () => {

            it("should be possible to omit children & props ", () => {

                verifyTree(H(
                    [":div", {className: "demo"},
                        [
                            [CustomElement], [":ul"]
                        ]
                    ]),

                    <div className="demo">
                        <CustomElement />
                        <ul />
                    </div>);
            });


            it("should be possible to omit children", () => {

                verifyTree(H(
                    [":div", {className: "demo"},
                        [
                            [CustomElement, {value: "v"}],
                            [":div", {className: "foo"}],
                            [":ul"]
                        ]

                    ]),

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

                verifyTree(H([
                        ":div",
                        [
                            [CustomElement, {value: "v"}],
                            [":div",
                                [
                                    [":span", "value"]
                                ]
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

                verifyTree(H([
                        ":div", {className: "demo"},
                        [
                            [":div"],
                            [":div", {className: "foo"}, []],
                            [":h1", "title"],
                            [":span"]
                        ]
                    ]),

                    <div className="demo">
                        <div />
                        <div className="foo"/>
                        <h1>title</h1><span />
                    </div>);
            });

        })
    });

    describe("#prop transform", () => {

        it("should be called in each matching prop", () => {
            let transform1 = sinon.spy(v => v);
            let transform2 = sinon.spy(v => v);

            let H = reactHut.createHut(React, {
                propsTransform : {
                    className : transform1,
                    key : transform2
                }
            });

            H([":div", {className : "foo"},
                [
                    [":ul", {key : 99, className : "bar"}, [
                        [":li", {key : 0}],
                        [":li", {key : 1}]
                    ]]
                ]
            ]);

            assert.calledTwice(transform1);
            assert.calledThrice(transform2);
        });

        it("should pass current prop value to transform", () => {
            let transform = sinon.spy(v => v);
            let H = reactHut.createHut(React, { propsTransform : { className : transform}});

            H(":div", {className : "foo"});

            assert.calledWith(transform, "foo");

        });


        it("should be possible to change prop value by returning a value", () => {
            let classTransform = classList => classList.join(" ");
            let H = reactHut.createHut(React, { propsTransform : { className : classTransform}});

            verifyTree(
                H(":div", {className : ["foo", "bar"]},
                    [
                        [":ul", {key : 99, className : ["moo", "42", "crap"]}]
                    ]

                ), <div className="foo bar">
                    <ul key={99} className="moo 42 crap" />
                </div>
            );
        });

        it("should be called before component transform", () => {
            let propTransform = sinon.stub().returns(42);
            let componentTransform = sinon.spy(([c, props]) => assert.equal(props.key, 42));
            let H = reactHut.createHut(React, {
                propsTransform : { key : propTransform},
                componentTransform : componentTransform
            });

            H(":div", {key : 0});

            assert(propTransform.calledBefore(componentTransform));
        });



        describe("# default className transform", () => {
            beforeEach(() => {
                sinon.spy(reactHut , "classLists");

            });

            afterEach(() => {
                reactHut.classLists.restore();
            });

            it("should use class-lists lib for class name props by default", () => {
                let H = reactHut.createHut(React);

                H(":div", {className : ["one", "two"]}, [[":div", {className : "other"}]]);

                assert.calledTwice(reactHut.classLists);
                assert.calledWith(reactHut.classLists, ["one", "two"]);
                assert.calledWith(reactHut.classLists, "other");
            });

            it("should be possible to add other prop transforms without effecting  default class-lists transform", () => {
                let H = reactHut.createHut(React, { propsTransform : { key : k => k}});

                H(":div", {className : ["one", "two"]}, [[":div", {className : "other"}]]);

                assert.calledTwice(reactHut.classLists);
                assert.calledWith(reactHut.classLists, ["one", "two"]);
                assert.calledWith(reactHut.classLists, "other");
            });

            it("should be possible to override default class-lists transform", () => {
                let custom = sinon.stub();
                let H = reactHut.createHut(React, { propsTransform : { className : custom}});

                H(":div", {className : ["one", "two"]}, [[":div", {className : "other"}]]);

                assert.notCalled(reactHut.classLists);

                assert.calledTwice(custom);
                assert.calledWith(custom, ["one", "two"]);
                assert.calledWith(custom, "other");
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
        });
    });

    describe("#component transform", () => {

        it("should be called for each component", () => {
            let transform = sinon.stub();
            let H = reactHut.createHut(React, { componentTransform : transform});

            H([":div",
                [
                    [":ul", [
                        [":li"],
                        [":li"],
                        [":li"]
                    ]]
                ]
            ]);

            assert.callCount(transform, 5);
        });

        it("should be possible apply transformation by returning a new array", () => {
            let transform = () => [":div", {className : "moo"}, "mooo!"];
            let H = reactHut.createHut(React, {componentTransform: transform});

            verifyTree(H(":span", {style : {}}, []), <div className="moo">mooo!</div>);
        });

        it("should be possible apply transformation by altering the param", () => {
            let transform = (fragment) => {
                fragment[0] = ":div";
                fragment[1] = {className : "moo"};
                fragment[2] = "mooo!";
            };

            let H = reactHut.createHut(React, {componentTransform: transform});

            verifyTree(H(":span", {style : {}}, []), <div className="moo">mooo!</div>);
        });

        it("should be possible to return resolved components from transform", () => {
            let transform = () => <div className="resolved" />;
            let H = reactHut.createHut(React, {componentTransform: transform});

            verifyTree(H(":crap", {style : {}}, []), <div className="resolved" />);
        });

        it("should be possible to modify children before they are resolved", () => {
            let transform = ([e, p, children]) => (children || []).forEach(c => { if (c[0] === ":fake") c[0] = ":li" });
            let H = reactHut.createHut(React, {componentTransform: transform});


            verifyTree(H(
                ":ul", [
                    [":fake"],
                    [":fake"],
                    [":fake"]
                ]), <ul>
                <li />
                <li />
                <li />
            </ul>);

        });


        it("should throw an error when a transformation returns a thruthy non array value", () => {
            let transform = sinon.stub();
            let H = reactHut.createHut(React, {componentTransform: transform});

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
                let H = reactHut.createHut(React, {componentTransform: transform});

                H(":div", {k: "v"}, "hello", "man");
            });

            it("missing props should be passed as null", () => {
                let transform = willVerifyEqual([":div", null, ["raw..."]]);
                let H = reactHut.createHut(React, {componentTransform: transform});

                H(":div", ["raw..."]);
            });

            it("missing children should be passed are undefined", () => {
                let transform = willVerifyEqual([":div", {works: true}]);
                let H = reactHut.createHut(React, {componentTransform: transform});

                H(":div", {works: true});
            });

            it("missing props should be passed as null when children are passed", () => {
                let transform = willVerifyEqual([":header", null, "hello", "world"]);
                let H = reactHut.createHut(React, {componentTransform: transform});

                H(":header", "hello", "world");
            });

            it("missing props should be passed as null when children & props are missing", () => {
                let transform = willVerifyEqual([":header", null]);
                let H = reactHut.createHut(React, {componentTransform: transform});

                H(":header");
            });

        });
    })
});