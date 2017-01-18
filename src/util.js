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

function keys(object) {
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  return keys;
}

module.exports = {
  isFunc:   isFunc,
  contains: contains,
  keys:     keys
};
