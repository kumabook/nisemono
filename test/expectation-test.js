var assert      = require('assert');
var Expectation = require('../src/expectation');

describe('expectation', function() {
  var expectation;
  beforeEach(function() {
    expectation = new Expectation();
  });
  describe('.withArgs', function() {
    it('should capture expected arguments', function() {
      expectation.withArgs(1, 2, 3);
      assert.equal(expectation.args[0], 1);
      assert.equal(expectation.args[1], 2);
      assert.equal(expectation.args[2], 3);
    });
  });
  describe('.returns', function() {
    it('should set expected return value', function() {
      expectation.returns(6);
      assert.equal(expectation.returnValue, 6);
    });
  });
  describe('.throws', function() {
    it('should capture thrown error', function() {
      var error = new Error('unexpected error');
      expectation.throws(error);
      assert.equal(expectation.thrownError, error);
    });
  });
  describe('.isMeet', function() {
    it('should return true with the expected args', function() {
      expectation.withArgs(0, 1, 2);
      assert.ok(expectation.isMeet([0, 1, 2]));
    });
    it('should return false with the unexpected args', function() {
      expectation.withArgs(0, 1, 2);
      assert.ok(!expectation.isMeet([0]));
      assert.ok(!expectation.isMeet([0, 1, 2, 3]));
      assert.ok(!expectation.isMeet(['0', '1', '2']));
      assert.ok(!expectation.isMeet([]));
    });
  });
});
