'use strict';

var helper = require('../../helper');

var name = 'EnvironmentVariables';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(plugins, options, callback) {
    var result = helper.visit(options.config, function getValue(object) {
      return process.env[object.environmentVariable];
    });
    callback(null, {
      plugin: name,
      config: result,
    });
  },
};
