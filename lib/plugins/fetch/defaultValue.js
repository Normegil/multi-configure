'use strict';

var set = require('path-explorer').set;
var h = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, log) {
    return new Promise(function load(resolve, reject) {
      let structure = options.source.structure;
      if (!h.exist(structure)) {
        return reject(new Error('Config structure doesn\'t exist'));
      }
      log.debug({structure: structure}, 'Default Values: Search for values');
      var target = {};
      h.visit(structure, '', {
        enterObject: function enterObject(object, path) {
          return new Promise(function enterObject(resolve, reject) {
            var value = object.defaultValue;
            if (undefined === value) {
              return resolve();
            } else {
              log.debug({structure: structure, target: target, path: path, value: value},
                'Default Values: value found - save it');
              set({
                target: target,
                value: value,
                path: path,
              }).then(function onSuccess(result) {
                target = result;
                resolve();
              }).catch(reject);
            }
          });
        },
      }).then(function onLoaded() {
        resolve({
          plugin: name,
          config: target,
        });
      }).catch(reject);
    });
  },
};
