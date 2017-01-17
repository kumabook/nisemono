var func        = require('./src/func');
var mock        = require('./src/mock');
var Expectation = require('./src/expectation');
var expects     = require('./src/expects');
var promise     = require('./src/promise');

module.exports = {
  func:        func,
  mock:        mock,
  expects:     expects,
  Expectation: Expectation,
  promise:     promise
};
