var FakeFunction = require('./fake-function');
/**
 * Create a fake function
 * @return {FakeFunction}
 */
var func = function() {
  var f = function() {
    return f.invoke.apply(f, arguments);
  };
  /**
   * an array of expectation objects
   * @name expectations
   * @type {Expectation[]}
   * @instance
   * @memberof FakeFunction
   */
  f.expectations = [];
  /**
   * an array of call objects
   * @name calls
   * @type {Call[]}
   * @memberof FakeFunction
   * @instance
   */
  f.calls        = [];
  /**
   * bool value if the function is called or not
   * @name isCalled
   * @type {bool}
   * @memberof FakeFunction
   * @instance
   */
  f.isCalled     = false;
  f.handler      = function() {};
  f.__proto__    = FakeFunction;
  return f;
};


module.exports = func;
