'use strict';

var parser = require('js-yaml');

var name = 'YAML';
var format = 'yaml';

module.exports = {
  format: format,
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    var result = parser.safeLoad(source);
    callback(null, result);
  },
};
