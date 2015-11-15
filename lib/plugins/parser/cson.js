'use strict';

var cson = require('cson');
var name = 'CSON';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source) {
    return new Promise(function parse(resolve, reject) {
      cson.parse(source, {}, function onParsed(err, content) {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  },
};
