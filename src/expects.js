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
