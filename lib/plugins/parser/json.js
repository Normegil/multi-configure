'use strict';

var name = 'JSON';

module.exports = {
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
