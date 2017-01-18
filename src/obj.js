var func     = require('./func');
var util     = require('./util');
var isFunc   = util.isFunc;
var contains = util.contains;
var keys     = util.keys;

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
