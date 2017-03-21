const {assert, render, sinon, React, reactHut, mount} = require("./env");
const {verifyTree} = require("./env").utils;


const HutView = reactHut.createHutView(React);

function verifyNoPropAfterCreation(spec, prop) {
    let spy = sinon.spy();
    spec.render = function () {

        assert.notProperty(this, prop);
        spy(); // record call;

        return null;
    };

    spy.reset();
    let FakeWidget = HutView(spec);
    mount(<FakeWidget/>);

    assert.called(spy);
}

describe("HutView", () => {


    describe(".createHutView()", () => {

        it("is a function", () => {
            let H = reactHut.createHut(React);
            assert.isFunction(reactHut.createHutView(React));
            assert.isFunction(reactHut.createHutView(H));
        });


        it("should throw error if react or a valid H() is not passed", () => {
            assert.throws(() => reactHut.createHutView({}));
            assert.throws(() => reactHut.createHutView());
            assert.throws(() => reactHut.createHutView({k : 42}));
            assert.throws(() => reactHut.createHutView(42));
        });

    });


    describe("basic usage", () => {

        it("should create components from object specs", () => {
            let Component = HutView({render() {return null}});
            assert.doesNotThrow(() => { React.createElement(Component)});
        });

        it("should create components from function specs", () => {
            let Component = HutView(() =>  null);
            assert.doesNotThrow(() => {
                React.createElement(Component);
            });
        });

        it("if first arg is a string then it's the display name", () => {
            let FunctionComponent = HutView("MyComponent", () => null);
            let Component = HutView("MyClassComponent", {render() {return null}});

            assert(mount(React.createElement(FunctionComponent)).is("MyComponent"));
            assert(mount(React.createElement(Component)).is("MyClassComponent"));
        });

        it("should use custom H() when one is passed", () => {
            let H = sinon.spy(reactHut.createHut(React));
            let HutView = reactHut.createHutView(H);

            let MyClassComponent = HutView({
                render() {
                    return [":ul",
                        [":li"],
                        [":li"]]
                }
            });

            let MyFunctionComponent = HutView({
                render() {
                    return [":ul",
                        [":li"],
                        [":li"]]
                }
            });


            mount(React.createElement(MyFunctionComponent));
            mount(React.createElement(MyClassComponent));
            assert.calledTwice(H);
        });
    });


    describe("React.createClass() compatibility", () => {

        it("should throw an Error when render() is not defined", () => {
            assert.throws(() => HutView({}));
        });

        it("should be possible to pass props & state like in .createClass() API", () => {
            let My = HutView({

                getDefaultProps() {return {data : null}},
                getInitialState() { return {data : 42}},

                render() {return <div>{this.state.data} {this.props.data}</div>}
            });


            verifyTree(<My data={100} />, <div>42 100</div>);
        });

        it("should be possible to pass lifecycle methods like with plain .createClass() API", () => {
            let [willMount, didMount, willUnmount] = [sinon.spy(), sinon.spy(), sinon.spy()];
            let [willUpdate, didUpdate, willReceiveProps] = [sinon.spy(), sinon.spy(), sinon.spy()];
            let My = HutView({

                componentWillMount : willMount,
                componentDidMount : didMount,
                componentWillUnmount : willUnmount,

                componentWillReceiveProps : willReceiveProps,
                componentWillUpdate : willUpdate,
                componentDidUpdate : didUpdate,

                render() {return null}
            });

            let wrapper = mount(<My />);

            wrapper.render();
            wrapper.setProps({x : "crap"});
            wrapper.unmount();

            assert.calledOnce(willMount);
            assert.calledOnce(didMount);
            assert.calledOnce(willUnmount);

            assert.calledOnce(willUpdate);
            assert.calledOnce(didUpdate);
            assert.calledOnce(willReceiveProps);
        });
    });


    describe("render", () => {

        it("should be possible to return react elements (JSX)", () => {
            let My = HutView({ render() {return <div className="moo" />}});

            verifyTree(<My/>, <div className="moo"></div>);
        });

        it("should be possible to return hiccup", () => {
            let My = HutView({ render() {return [":div.moo"]}});

            verifyTree(<My/>, <div className="moo"></div>);
        });

        it("should be called with props & state as params", () => {
            let My = HutView({
                getInitialState() {
                    return {
                        x : "demo"
                    }
                },

                render(props, state) {

                    assert.deepEqual(props, this.props);
                    assert.deepEqual(state, this.state);

                    return <div>yes, we called render</div>;
                }
            });

            verifyTree(<My p="crap"/>, <div>yes, we called render</div>);
        });
    });


    describe("shorter props & state", () => {

        it("should be possible to set default props as 'props : {}' ", () => {
            let My = HutView({
                props : {name : "moo"},
                render() { return <div>{this.props.name}</div> }
            });

            verifyTree(<My/>, <div>moo</div>);
        });

        it("should be possible to set default props as 'props : function(){...}' ", () => {
            let My = HutView({
                props : function () { return {name : "moo"}},
                render() { return <div>{this.props.name}</div> }
            });

            verifyTree(<My/>, <div>moo</div>);
        });


        it("should throw an Error when both props & getDefaultProps() are defined", () => {
            assert.throws(() => HutView({
                props : {name : "moo"},
                getDefaultProps : function () { return {name : "moo"}},
                render() { return <div>{this.props.name}</div> }
            }))
        });

        it("should be possible to set default state as 'state : {}' ", () => {
            let My = HutView({
                state : {name : "moo"},
                render() { return <div>{this.state.name}</div> }
            });

            verifyTree(<My/>, <div>moo</div>);
        });

        it("should be possible to set default state as 'state : function(){...}' ", () => {
            let My = HutView({
                state : function () { return {name : "moo"}},
                render() { return <div>{this.state.name}</div> }
            });

            verifyTree(<My/>, <div>moo</div>);
        });


        it("should throw an Error when both state & getInitialState() are defined", () => {
            assert.throws(() => HutView({
                state : {name : "moo"},
                getInitialState : function () { return {name : "moo"}},
                render() { return <div>{this.state.name}</div> }
            }))
        });

    });


    describe("lifecycle shortcuts", () => {

        it("should be possible to pass a `lifecycle` object with methods", () => {

            let [willMount, didMount, willUnmount] = [sinon.spy(), sinon.spy(), sinon.spy()];
            let [willUpdate, didUpdate, willReceiveProps] = [sinon.spy(), sinon.spy(), sinon.spy()];
            let My = HutView({

                lifecycle : {
                    willMount : willMount,
                    didMount : didMount,
                    willUnmount : willUnmount,

                    willReceiveProps : willReceiveProps,
                    willUpdate : willUpdate,
                    didUpdate : didUpdate,
                },

                render() {return null}
            });

            let wrapper = mount(<My />);

            wrapper.render();
            wrapper.setProps({x : "crap"});
            wrapper.unmount();

            assert.calledOnce(willMount);
            assert.calledOnce(didMount);
            assert.calledOnce(willUnmount);

            assert.calledOnce(willUpdate);
            assert.calledOnce(didUpdate);
            assert.calledOnce(willReceiveProps);
        });

        it("should throw an Error when both short and normal lifecycle methods are defined", () => {
            let generateComponentCollision = ([short, long]) => () =>
                HutView({
                    [long] : function () {},
                    lifecycle : { [short] : function () {}},

                    render() { return <div>{this.props.name}</div> }
                });

            assert.throws(generateComponentCollision(["willMount", "componentWillMount"]));
            assert.throws(generateComponentCollision(["didMount", "componentDidMount"]));
            assert.throws(generateComponentCollision(["willUpdate", "componentWillUpdate"]));
            assert.throws(generateComponentCollision(["didUpdate", "componentDidUpdate"]));
            assert.throws(generateComponentCollision(["willReceiveProps", "componentWillReceiveProps"]));
            assert.throws(generateComponentCollision(["willUnmount", "componentWillUnmount"]));
        });

        it("should be possible to pass an empty `lifecycle` object", () => {
            let Widget = HutView({
                lifecycle : {},
                render() { return <div>crap</div> }
            });

            verifyTree(<Widget/>, <div>crap</div>)
        });

        it("should not pass `lifecycle` object to the actual component", () => {
            let spec = {lifecycle : { willMount : function () {}}};

            verifyNoPropAfterCreation(spec, "lifecycle");
        });
    });


    describe("shouldComponentUpdate() shortcut", () => {

        it("should be possible to alias as 'shouldUpdate()' ", () => {
            let stub = sinon.stub().returns(true);
            let My = HutView({
                shouldUpdate : stub,
                render() {return null}
            });

            stub.reset();
            mount(<My />).setProps({x : "crap"});
            assert.calledOnce(stub);
        });

        it("should not pass `shouldUpdate` method to the actual component", () => {
            let spec = {shouldUpdate : sinon.stub().returns(true) };

            verifyNoPropAfterCreation(spec, "shouldUpdate");
        });

        it("should throw an Error when shouldUpdate() & shouldComponentUpdate() are both defined", () => {
            assert.throws(() => HutView({
                render : sinon.stub().returns(null),
                shouldUpdate : sinon.stub().returns(true),
                shouldComponentUpdate : sinon.stub().returns(true)
            }));
        });


    });

});
