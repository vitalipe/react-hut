// setup global dom
require("./dom");

var chai = require("chai");
var reactHut = require("../../../bin/react-hut");
var {render, mount} = require("enzyme");
var React = require("react");
var sinon = require("sinon");

sinon.assert.expose(chai.assert, { prefix: "" });
var assert = chai.assert;


// utils
var utils = {
    verifyTree(result, expected) {
        assert.equal(
            render(<div className="test-wrapper-ignore-it">{result}</div>).html(),
            render(<div className="test-wrapper-ignore-it">{expected}</div>).html());
    },

    willVerifyEqual(expected) {
        return (arg) =>  assert.deepEqual(arg, expected);
    }
};



module.exports = {
    assert,
    React,
    render,
    mount,
    sinon,

    reactHut,
    utils
};