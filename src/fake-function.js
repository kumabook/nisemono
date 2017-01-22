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
