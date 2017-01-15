var Expectation = function() {
  this.hasArgs     = false;
  this.args        = [];
  this.returnValue = null;
  this.thrownError = null;
  this.isFulfilled = false;
};

Expectation.prototype.withArgs = function() {
  this.hasArgs = true;
  this.args    = Array.prototype.slice.call(arguments);
  return this;
};

Expectation.prototype.returns = function(value) {
  this.returnValue = value;
  return this;
};

Expectation.prototype.throws = function(error) {
  this.thrownError = error;
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

module.exports = Expectation;
