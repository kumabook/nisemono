var assert      = require('assert');
var nisemono    = require('../');
var Expectation = require('../src/expectation');

describe('expects', function() {
  it('should return new empty expectation', function() {
    var fakeFunc    = nisemono.func();
    var expectation = nisemono.expects(fakeFunc);
    assert.ok(expectation instanceof Expectation);
    assert.equal(fakeFunc.expectations.length, 1);
  });
});
