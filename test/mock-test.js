var assert      = require('assert');
var TestHelper  = require('./test-helper');
var nisemono    = require('../');

describe('nisemono', function() {
  describe('.mock', function() {
    it('should replace methods of a object with fake functions', function() {
      var obj = {
        method1:  function() { return 1; },
        method2:  function() { return 2; },
        property: 'property'
      };
      obj.__proto__ = {
        method3:       function() { return 3; },
        protoProperty: 'protoProperty'
      };

      nisemono.mock(obj, { excepts: ['method2']});

      assert.equal(obj.property     , 'property');
      assert.equal(obj.protoProperty, 'protoProperty');

      assert.ok(TestHelper.isFunc(obj.method1));
      assert.ok(TestHelper.isFunc(obj.method2));
      assert.ok(TestHelper.isFunc(obj.method3));
      assert.ok(TestHelper.isFunc(obj.restore));

      assert.equal(obj.__nisemono_keys__.length, 2);

      assert.equal(obj.method1.expectations.length, 0);
      assert.equal(obj.method3.expectations.length, 0);
      assert.equal(obj.method2.expectations, undefined);
    });
  });
});

describe('FakeObject', function() {
  describe('.restore', function() {
    it('should restore original methods', function() {
      var obj = {
        method1:  function() { return 1; },
        method2:  function() { return 2; },
        property: 'property'
      };
      obj.__proto__ = {
        method3:       function() { return 3; },
        protoProperty: 'protoProperty'
      };

      nisemono.mock(obj);
      obj.restore();

      assert.equal(obj.property     , 'property');
      assert.equal(obj.protoProperty, 'protoProperty');

      assert.equal(obj.method1(), 1);
      assert.equal(obj.method2(), 2);
      assert.equal(obj.method3(), 3);
    });
  });
});
