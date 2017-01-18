var assert      = require('assert');
var TestHelper  = require('./test-helper');
var nisemono    = require('../');

describe('nisemono', function() {
  describe('.obj', function() {
    var obj;
    beforeEach(function() {
      obj = {
        method1:  function() { return 1; },
        method2:  function() { return 2; },
        property: 'property'
      };
      obj.__proto__ = {
        method3:       function() { return 3; },
        protoProperty: 'protoProperty'
      };
    });
    it('should return a fake object that has fake methods', function() {
      var fake = nisemono.obj(obj);

      assert.equal(fake.property     , 'property');
      assert.equal(fake.protoProperty, 'protoProperty');

      assert.ok(TestHelper.isFunc(obj.method1));
      assert.ok(TestHelper.isFunc(obj.method2));
      assert.ok(TestHelper.isFunc(obj.method3));

      assert.ok(TestHelper.isFakeFunc(fake.method1));
      assert.ok(TestHelper.isFakeFunc(fake.method2));
      assert.ok(TestHelper.isFakeFunc(fake.method3));
    });
    context('excepts', function() {
      it('should return a fake object that has fake methods excepts specified methods', function() {
        var fake = nisemono.obj(obj, { excepts: ['method1'] });

        assert.ok(TestHelper.isFunc(obj.method1));
        assert.ok(TestHelper.isFunc(obj.method2));
        assert.ok(TestHelper.isFunc(obj.method3));

        assert.ok(!TestHelper.isFakeFunc(fake.method1));
        assert.ok(TestHelper.isFakeFunc(fake.method2));
        assert.ok(TestHelper.isFakeFunc(fake.method3));
      });
    });
    context('only', function() {
      it('should return a fake object that has only specified fake methods', function() {
        var fake = nisemono.obj(obj, { only: ['method1'] });

        assert.ok(TestHelper.isFunc(obj.method1));
        assert.ok(TestHelper.isFunc(obj.method2));
        assert.ok(TestHelper.isFunc(obj.method3));

        assert.ok(TestHelper.isFakeFunc(fake.method1));
        assert.ok(!TestHelper.isFakeFunc(fake.method2));
        assert.ok(!TestHelper.isFakeFunc(fake.method3));
      });
    });
    context('excepts&only', function() {
      it('should return a fake object that has specified fake methods', function() {
        var fake = nisemono.obj(obj, { only: ['method1', 'method2'], excepts: ['method1'] });

        assert.ok(TestHelper.isFunc(obj.method1));
        assert.ok(TestHelper.isFunc(obj.method2));
        assert.ok(TestHelper.isFunc(obj.method3));

        assert.ok(!TestHelper.isFakeFunc(fake.method1));
        assert.ok(TestHelper.isFakeFunc(fake.method2));
        assert.ok(!TestHelper.isFakeFunc(fake.method3));
      });
    });
  });
});
