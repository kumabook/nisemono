var isFunc = require('../src/util').isFunc;

module.exports = {
  isFunc:     isFunc,
  isFakeFunc: function(func) {
    if (func.expectations === undefined) {
      return false;
    }
    if (func.calls === undefined) {
      return false;
    }
    if (func.expectations.length !== 0) {
      return false;
    }
    return isFunc(func.invoke);
  }
};
