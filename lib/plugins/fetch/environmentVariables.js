
'use strict';

var set = require('path-explorer').set;
var h = require('../../helper');

var name = 'EnvironmentVariables';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options) {
    return new Promise(function load(resolve, reject) {
      let structure = options.source.structure;
      if (!h.exist(structure)) {
        return reject(new Error('Config structure doesn\'t exist'));
      }

      var config = {};
      var prefix = '';
      h.visit(structure, '', {
        enterObject: function enterObject(object, path) {
          return new Promise(function enterObject(resolve, reject) {
            if (h.exist(object.envVar)) {
              var value = process.env[prefix + object.envVar];
              if (undefined === value) {
                resolve();
              } else {
                set({
                  target: config,
                  value: parseValue(value),
                  path: path,
                }).then(function onSuccess(result) {
                    config = result;
                    resolve();
                  })
                  .catch(reject);
              }
            } else if (h.exist(object.envVarPrefix)) {
              prefix += object.envVarPrefix;
              resolve();
            } else {
              resolve();
            }
          });
        },
        quitObject: function quitObject(object) {
          return new Promise(function quitObject(resolve) {
            if (h.exist(object.envVarPrefix)) {
              prefix = prefix.replace(object.envVarPrefix, '');
            }
            resolve();
          });
        },
      }).then(function onLoaded() {
        resolve({
          plugin: name,
          config: config,
        });
      }).catch(reject);
    });
  },
};

function parseValue(value) {
  if (!isNaN(value)) {
    return Number(value);
  } else {
    return value;
  }
}
