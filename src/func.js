var Call = require('./call');

var func = function() {
  var f = function() {
    return f.invoke.apply(f, arguments);
  };
  f.expectations = [];
  f.calls        = [];
  f.isCalled     = false;
  f.handler      = function() {};
  for (var key in FakeFunction) {
    f[key] = FakeFunction[key];
  }
  return f;
};

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
  callArgFuncAt: function(index, thisArg) {
    var args = Array.prototype.slice.call(arguments, 1);
    var last = this.calls.length - 1;
    return this.calls[last].args[index].apply(thisArg, args);
  }
};

module.exports = func;
