'use strict';

var h = require('../../helper');

var name = 'DefaultValues';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(plugins, options, callback) {
    if (!h.exist(options.config)) {
      return callback(new Error('Config structure doesn\'t exist'));
    }
    var result;
    h.visit(
      {
        toVisit: options.config,
        path: '',
      }, {
        onObject: function onObject(object, path, onObjectCallback) {
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
