'use strict';

var name = 'JSON';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source) {
    return new Promise(function parse(resolve, reject) {
      try {
        var parsed = JSON.parse(source);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    });
  },
};
