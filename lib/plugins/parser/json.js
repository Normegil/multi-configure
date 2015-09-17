'use strict';

var name = 'JSON';
var format = 'json';

module.exports = {
  format: format,
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    try {
      var parsed = JSON.parse(source);
      callback(null, parsed);
    } catch (e) {
      callback(e);
    }
  },
};
