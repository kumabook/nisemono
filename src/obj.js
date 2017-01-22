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
