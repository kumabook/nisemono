var func = require('./func');

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

var obj = function(o, opts) {
  var key;
  var keys = [];
  var options = opts || {};
  var excepts = options.excepts || [];
  for (key in o) {
    if (isFunc(o[key]) && !contains(key, excepts)) {
      o['__nisemono__' + key] = o[key];
      o[key]                  = func();
      keys.push(key);
    }
  }
  o['__nisemono_keys__'] = keys;
  for (key in FakeObject) {
    o[key] = FakeObject[key];
  }
  return o;
};

var FakeObject = {
  restore: function() {
    var keys = this['__nisemono_keys__'];
    var l    = keys.length;
    for (var i = 0; i < l; i++) {
      var key = keys[i];
      this[key] = this['__nisemono__' + key];
      this['__nisemono__' + key] = null;
    }
    this['__nisemono_keys__']  = null;
    this.restore               = null;
  }
};

module.exports = obj;
