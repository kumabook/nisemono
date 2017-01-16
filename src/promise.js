var Promise = global.Promise;

module.exports = {
  constructor: function() {
    return Promise;
  },
  use: function(constructor) {
    Promise = constructor;
  },
  restoreDefault: function() {
    Promise = global.Promise;
  }
};
