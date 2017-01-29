(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nisemono = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var func        = require('./src/func');
var obj         = require('./src/obj');
var Expectation = require('./src/expectation');
var expects     = require('./src/expects');
var promise     = require('./src/promise');

module.exports = {
  func:        func,
  obj:         obj,
  expects:     expects,
  Expectation: Expectation,
  promise:     promise
};

},{"./src/expectation":3,"./src/expects":4,"./src/func":6,"./src/obj":7,"./src/promise":8}],2:[function(require,module,exports){
/**
 * @class
 */
var Call = function(params) {
  this.args     = params.args;
  this.calledAt = params.calledAt;
};

module.exports = Call;

},{}],3:[function(require,module,exports){
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

},{"./promise":8}],4:[function(require,module,exports){
var Expectation = require('./expectation');

/**
 * Create a new expectation of the function or method
 * @function expects
 * @return {Expectation}
 */
module.exports = function(func) {
  var expectation = new Expectation();
  func.expectations.push(expectation);
  return expectation;
};

},{"./expectation":3}],5:[function(require,module,exports){
var Call = require('./call');
/**
 * @class fake function
 */
var FakeFunction = {
  invoke: function() {
    var args = Array.prototype.slice.call(arguments);
    var call = new Call({
      args:     args,
      calledAt: new Date()
    });
    this.calls.push(call);
    this.isCalled = true;
    try {
      this.handler(call);
    } catch (e) {
      // continue regardless of error
    }
    var i, expectation;
    var l = this.expectations.length;
    for (i = 0; i < l; i++) {
      expectation = this.expectations[i];
      if (expectation.isMeet(args)) {
        return expectation.invoke();
      }
    }
    return undefined;
  },
  /**
   * Call the function in specified index of latest called arguments
   * @function
   * @instance
   * @param {number} index   index of the function in arguments that will be called
   * @param {Object} thisArg the value of this provided for the call to function
   */
  callArgFuncAt: function(index, thisArg) {
    var args = Array.prototype.slice.call(arguments, 1);
    var last = this.calls.length - 1;
    return this.calls[last].args[index].apply(thisArg, args);
  }
};

module.exports = FakeFunction;

},{"./call":2}],6:[function(require,module,exports){
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

},{"./fake-function":5}],7:[function(require,module,exports){
var func     = require('./func');
var util     = require('./util');
var isFunc   = util.isFunc;
var contains = util.contains;
var keys     = util.keys;

/**
 * Create a fake object.
 * The fake object has cloned properties and cloned methods or fake methods:
 * - The methods in `except` options are copied to the fake object from original object.
 * - The methods in `only` options are fake functions.
 * - As default, All methods are fake functions.
 * @param  {Object}       object a fake object
 * @param  {string[]?}     opts.except method name list. the methods of a object are not fake function, use original method.
 * @param  {string[]?}     opts.only method name list. The methods of a object are fake function instead of original method.
 * @return {Object} a fake object
 */
var obj = function(object, opts) {
  var key;
  var fake    = {};
  var options = opts || {};
  var except  = options.except || [];
  var only    = options.only || keys(object);
  for (key in object) {
    if (isFunc(object[key]) && !contains(key, except) && contains(key, only)) {
      fake[key] = func();
    } else {
      fake[key] = object[key];
    }
  }
  return fake;
};

module.exports = obj;

},{"./func":6,"./util":9}],8:[function(require,module,exports){
(function (global){
var Promise = global.Promise;

/**
 * @namespace promise
 */
var promise = {
  /**
   * Return current Promise constructor
   */
  constructor: function() {
    return Promise;
  },
  /**
   * Use the specified Promise constructor instead
   */
  use: function(constructor) {
    Promise = constructor;
  },
  /**
   * Use default Promise
   */
  restoreDefault: function() {
    Promise = global.Promise;
  }
};

module.exports = promise;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
function isFunc(f) {
  return typeof f === 'function';
}

function contains(v, values) {
  var i, l;
  for (i = 0, l = values.length; i < l; i++) {
    if (v === values[i]) {
      return true;
    }
  }
  return false;
}

function keys(object) {
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  return keys;
}

module.exports = {
  isFunc:   isFunc,
  contains: contains,
  keys:     keys
};

},{}]},{},[1])(1)
});