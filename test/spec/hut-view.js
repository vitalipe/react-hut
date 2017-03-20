const {assert, render, sinon, React, reactHut, mount} = require("./env");
const {verifyTree} = require("./env").utils;



describe("HutView", () => {


    describe(".createHutView()", () => {
        let H = reactHut.createHut(React);

        it("should return a function", () => {
            assert.isFunction(reactHut.createHutView(React));
            assert.isFunction(reactHut.createHutView(H));
        });

        it("should return  a component factory", () => {
            let HutView = reactHut.createHutView(React);
            let Component = HutView({render() {return null}});

            assert.doesNotThrow(() => React.createElement(Component));
        });


        it("should throw error if react or a valid H() is not passed", () => {
            assert.throws(() => reactHut.createHutView({}));
            assert.throws(() => reactHut.createHutView());
            assert.throws(() => reactHut.createHutView({k : 42}));
            assert.throws(() => reactHut.createHutView(42));
        });

        it("should use custom H() when one is passed", () => {
            let H = sinon.spy(reactHut.createHut(React));
            let HutView = reactHut.createHutView(H);
            let My = HutView({
                render() {
                    return [":ul",
                        [":li"],
                        [":li"]]
                }
            });

            H.reset();
            mount(React.createElement(My));
            assert.called(H);
        });

    });


    describe("React.createClass() compatibility", () => {
        let HutView = reactHut.createHutView(React);

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
        let HutView = reactHut.createHutView(React);


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
        let HutView = reactHut.createHutView(React);

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
        let HutView = reactHut.createHutView(React);

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
            let spy = sinon.spy();
            let Widget = HutView({
                lifecycle : { willMount : function () {}},
                render() {

                    assert.notProperty(this, "lifecycle");

                    spy();
                    return null;
                }
            });

            mount(<Widget/>);

            assert.called(spy);
        });
    });


});
