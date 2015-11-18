'use strict';

var h = require('../../helper');

var name = 'package.json';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options) {
    return new Promise(function load(resolve, reject) {
      h.readFile(options.source.path)
        .then(function parseFile(content) {
          try {
            var packageJson = JSON.parse(content);
            resolve({
              plugin: name,
              config: packageJson.config,
            });
          } catch (err) {
            reject(err);
          }
        })
        .catch(function onError(err) {
          if (h.exist(err) && h.exist(err.code) && 'ENOENT' === err.code) {
            resolve({
              plugin: name,
              config: {},
            });
          } else {
            reject(err);
          }
        });
    });
  },
};
