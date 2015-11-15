'use strict';

var parser = require('js-yaml');

var name = 'YAML';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source) {
    return new Promise(function parse(resolve, reject) {
      try {
        var result = parser.safeLoad(source);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  },
};
