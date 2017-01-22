var Promise = global.Promise;

/**
 * @namespace promise
 */
var promise = {
  /**
   * Return current Promise constructor
   */
  constructor: function() {
    return Promise;
  },
  /**
   * Use the specified Promise constructor instead
   */
  use: function(constructor) {
    Promise = constructor;
  },
  /**
   * Use default Promise
   */
  restoreDefault: function() {
    Promise = global.Promise;
  }
};

module.exports = promise;
