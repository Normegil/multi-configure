'use strict';

var h = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    if (!h.exist(options.structure)) {
      return callback(new Error('Config structure doesn\'t exist'));
    }
    var result;
    h.visit(
      {
        toVisit: options.structure,
        path: '',
      }, {
        enterObject: function enterObject(object, path, onObjectCallback) {
          var value = object.defaultValue;
          if (undefined !== value) {
            h.setValue(
              {
                target: result,
                value: value,
                path: path,
              },
              function onSetted(err, response) {
                if (err) {
                  return onObjectCallback(err);
                }
                result = response;
                return onObjectCallback();
              });
          } else {
            return onObjectCallback();
          }
        },
      },
      function onVisited(err) {
        if (err) {
          return callback(err);
        }
        return callback(null, {
          plugin: name,
          config: result,
        });
      });
  },
};
