'use strict';

var helper = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(plugins, options, callback) {
    var result = helper.visit(options.config, function getValue(object) {
      return object.defaultValue;
    });
    callback(null, {
      plugin: name,
      config: result,
    });
  },
};
