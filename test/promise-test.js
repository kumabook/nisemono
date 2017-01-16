var assert  = require('assert');
var promise = require('../src/promise');

describe('promise', function() {
  beforeEach(function() {
    promise.restoreDefault();
  });
  describe('.constructor', function() {
    it('should return native Promise constructor as default', function() {
      assert.equal(promise.constructor(), Promise);
    });
  });
  describe('.use', function() {
    it('should set custom Promise constructor', function() {
      var FakePromise = function() {};
      promise.use(FakePromise);
      assert.equal(promise.constructor(), FakePromise);
    });
  });
  describe('.restoreDefault', function() {
    var FakePromise = function() {};
    promise.use(FakePromise);
    promise.restoreDefault();
    assert.equal(promise.constructor(), Promise);
  });
});
