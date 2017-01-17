var Expectation = require('./expectation');

module.exports = function(func) {
  var expectation = new Expectation();
  func.expectations.push(expectation);
  return expectation;
};
