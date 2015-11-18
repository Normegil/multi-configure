'use strict';

var set = require('path-explorer').set;
var h = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options) {
    return new Promise(function load(resolve, reject) {
      let structure = options.structure;
      if (!h.exist(structure)) {
        return reject(new Error('Config structure doesn\'t exist'));
      }
      var target = {};
      h.visit(structure, '', {
        enterObject: function enterObject(object, path) {
          return new Promise(function enterObject(resolve, reject) {
            var value = object.defaultValue;
            if (undefined === value) {
              return resolve();
            } else {
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
