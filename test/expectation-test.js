var assert      = require('assert');
var Expectation = require('../src/expectation');

var ResultType  = Expectation.ResultType;

describe('expectation', function() {
  var expectation;
  beforeEach(function() {
    expectation = new Expectation();
  });
  describe('#withArgs', function() {
    it('should capture expected arguments', function() {
      expectation.withArgs(1, 2, 3);
      assert.equal(expectation.args[0], 1);
      assert.equal(expectation.args[1], 2);
      assert.equal(expectation.args[2], 3);
    });
  });
  describe('#returns', function() {
    it('should set expected return value', function() {
      expectation.returns(6);
      assert.equal(expectation.returnValue, 6);
      assert.equal(expectation.resultType , ResultType.RETURN);
    });
  });
  describe('#throws', function() {
    it('should capture thrown error', function() {
      var error = new Error('unexpected error');
      expectation.throws(error);
      assert.equal(expectation.thrownError, error);
      assert.equal(expectation.resultType , ResultType.THROW);
    });
  });
  describe('#resolves', function() {
    it('should set resolved value', function() {
      expectation.resolves(1);
      assert.equal(expectation.resolvedValue, 1);
      assert.equal(expectation.resultType , ResultType.RESOLVE);
    });
  });
  describe('#rejects', function() {
    it('should set rejected reason', function() {
      expectation.rejects('parse error');
      assert.equal(expectation.rejectedReason, 'parse error');
      assert.equal(expectation.resultType , ResultType.REJECT);
    });
  });
  describe('#calls', function() {
    it('should add callback function', function() {
      var thisArg  = {};
      var func = function() {};
      expectation.calls(func, thisArg, 1, 2, 3);
      assert.equal(expectation.callbacks.length, 1);
      assert.equal(expectation.callbacks[0].func, func);
      assert.equal(expectation.callbacks[0].thisArg, thisArg);
      assert.deepEqual(expectation.callbacks[0].args, [1, 2, 3]);
    });
  });
  describe('#isMeet', function() {
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
  describe('#invoke', function() {
    it('should throw error if result type is unknown', function() {
      expectation.resultType = null;
      assert.throws(function() {
        expectation.invoke();
      });
    });
  });
});
