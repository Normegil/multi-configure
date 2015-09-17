'use strict';

var name = 'RAW';
var format = 'raw';

module.exports = {
  format: format,
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    callback(null, source);
  },
};
