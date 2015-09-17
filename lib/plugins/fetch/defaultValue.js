'use strict';

var helper = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(sources, configOptions, callback) {
    var config = helper.visit(configOptions, function getValue(object) {
      return object.defaultValue;
    });
    callback(null, {
      plugin: name,
      config: config,
    });
  },
};
