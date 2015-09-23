'use strict';

var name = 'RAW';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    callback(null, source);
  },
};
