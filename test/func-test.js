var assert      = require('assert');
var TestHelper  = require('./test-helper');
var nisemono    = require('../');
var Call        = require('../src/call');

describe('nisemono', function() {
  describe('.func', function() {
    it('should return a fake function', function() {
      var fakeFunc = nisemono.func();
      assert.ok(TestHelper.isFunc(fakeFunc));
      assert.notEqual(undefined, fakeFunc.expectations);
      assert.notEqual(undefined, fakeFunc.calls);
      assert.equal(fakeFunc.expectations.length, 0);
      assert.equal(fakeFunc.calls.length       , 0);
      assert.ok(TestHelper.isFunc(fakeFunc.invoke));
    });
  });
});

describe('FakeFunction', function() {
  describe('.invoke', function() {
    context('no expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        fakeFunc(1, 2, 3);
      });
      it('should set isCalled to true', function() {
        assert.ok(fakeFunc.isCalled);
      });
      it('should add a call object', function() {
        assert.equal(fakeFunc.calls.length, 1);
        assert.ok(fakeFunc.calls[0] instanceof Call);
      });
      it('should capture arguments', function() {
        var call = fakeFunc.calls[0];
        assert.equal(call.args[0], 1);
        assert.equal(call.args[1], 2);
        assert.equal(call.args[2], 3);
      });
    });
    context('with normal expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        nisemono.expects(fakeFunc)
                .withArgs(1, 2, 3)
                .returns(6);
      });
      it('should return value of expectation', function() {
        assert.equal(fakeFunc(1, 2, 3), 6);
      });
      it('should return undefined with unexpected args', function() {
        assert.equal(fakeFunc('1', '2', '3'), undefined);
        assert.equal(fakeFunc(1, 2)         , undefined);
      });
    });
    context('with error expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        nisemono.expects(fakeFunc)
                .withArgs('1', '2', '3')
          .throws(new Error('parameters must be numbers'));
      });
      it('should throw error of expectation', function() {
        assert.throws(function() {
          fakeFunc('1', '2', '3');
        }, 'parameters must be numbers');
      });
    });
    context('without args expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        nisemono.expects(fakeFunc)
                .returns(6);
      });
      it('should always return value of expectation', function() {
        assert.equal(fakeFunc() , 6);
        assert.equal(fakeFunc(1), 6);
        assert.equal(fakeFunc('1'), 6);
      });
    });
    context('with resolve expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        nisemono.expects(fakeFunc)
                .resolves(1);
      });
      it('should always return a promise that resolves with the specified value', function(done) {
        fakeFunc().then(function(value) {
          assert.equal(value, 1);
          done();
        }, function() {
          assert.fail();
        });
      });
    });
    context('with reject expectation', function() {
      var fakeFunc;
      beforeEach(function() {
        fakeFunc = nisemono.func();
        nisemono.expects(fakeFunc)
                .rejects('reason');
      });
      it('should always return a promise that rejects with the specified value', function(done) {
        fakeFunc().then(function() {
          assert.fail();
        }, function(reason) {
          assert.equal(reason, 'reason');
          done();
        });
      });
    });
  });

  describe('callArgFuncAt', function() {
    it('should calls argument function at index with specified args', function(done) {
      var fetch = nisemono.func();

      nisemono.expects(fetch).calls(function() {
        fetch.callArgFuncAt(2, ['entry1', 'entry2', 'entry3']);
      });

      fetch('GET', 'http://www.example.com/entries', function(entries) {
        assert.equal(entries.length, 3);
        assert.equal(entries[0], 'entry1');
        done();
      }, function() {
        assert.fail();
      });
    });
  });
});
