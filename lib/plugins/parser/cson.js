'use strict';

var cson = require('cson');
var name = 'CSON';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    cson.parse(source, {}, callback);
  },
};
