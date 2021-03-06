var promise = require('./promise');

var ResultType = {
  RETURN:  0,
  THROW:   1,
  RESOLVE: 2,
  REJECT:  3
};
/**
 * @class
 */
var Expectation = function() {
  this.hasArgs        = false;
  this.args           = [];
  this.returnValue    = null;
  this.thrownError    = null;
  this.resolvedValue  = null;
  this.rejectedReason = null;
  this.callbacks      = [];
  this.resultType     = ResultType.RETURN;
  /**
   * bool value if the expectation is fulfilled or not
   * @instance
   * @type {bool}
   */
  this.isFulfilled    = false;
};

/**
 * Add condition about arguments
 * @return {Expectation}
 */
Expectation.prototype.withArgs = function() {
  this.hasArgs = true;
  this.args    = Array.prototype.slice.call(arguments);
  return this;
};

/**
 * Expects the function returns specified value
 * @return {Expectation}
 */
Expectation.prototype.returns = function(value) {
  this.returnValue = value;
  this.resultType  = ResultType.RETURN;
  return this;
};

/**
 * Expects the function throws specified error
 * @return {Expectation}
 */
Expectation.prototype.throws = function(error) {
  this.thrownError = error;
  this.resultType  = ResultType.THROW;
  return this;
};

/**
 * Expects the function returns a promise object that resolves specified value
 * @return {Expectation}
 */
Expectation.prototype.resolves = function(value) {
  this.resolvedValue = value;
  this.resultType    = ResultType.RESOLVE;
  return this;
};

/**
 * Expects the function returns a promise object that rejects specified value
 * @return {Expectation}
 */
Expectation.prototype.rejects = function(reason) {
  this.rejectedReason = reason;
  this.resultType     = ResultType.REJECT;
  return this;
};

/**
 * Expects the function calls specified function
 * @return {Expectation}
 */
Expectation.prototype.calls = function(func, thisArg) {
  var args = Array.prototype.slice.call(arguments, 2);
  this.callbacks.push({
    func:    func,
    thisArg: thisArg,
    args:    args
  });
  return this;
};

Expectation.prototype.isMeet = function(actualArgs) {
  if (!this.hasArgs) {
    return true;
  }
  var l = actualArgs.length;
  if (l !== this.args.length) {
    return false;
  }
  for (var i = 0; i < l; i++) {
    if (actualArgs[i] !== this.args[i]) {
      return false;
    }
  }
  return true;
};

Expectation.prototype.invoke = function() {
  this.isFulfilled = true;
  var l = this.callbacks.length;
  var callback;

  for (var i = 0; i < l; i++) {
    callback = this.callbacks[i];
    try {
      callback.func.apply(callback.thisArg, callback.args);
    } catch(e) {
      // do nothing
    }
  }

  switch (this.resultType) {
  case ResultType.RETURN:
    return this.returnValue;
  case ResultType.THROW:
    throw this.thrownError;
  case ResultType.RESOLVE:
    return promise.constructor().resolve(this.resolvedValue);
  case ResultType.REJECT:
    return promise.constructor().reject(this.rejectedReason);
  default:
    throw new Error('Unknown result type');
  }
};

Expectation.ResultType = ResultType;
module.exports         = Expectation;
