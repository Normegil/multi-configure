
'use strict';

var h = require('../../helper');

var name = 'EnvironmentVariables';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    if (!h.exist(options.structure)) {
      return callback(new Error('Config structure doesn\'t exist'));
    }

    var result;
    var prefix = '';
    h.visit({
      toVisit: options.structure,
      path: '',
    }, {
      enterObject: function enterObject(object, path, callback) {
        if (h.exist(object.envVar)) {
          treatEnvVar({
            envVar: prefix + object.envVar,
            target: result,
            path: path,
          }, function onVariableTreated(err, response) {
            if (err) {
              return callback(err);
            }
            result = response;
            callback();
          });
        } else if (h.exist(object.envVarPrefix)) {
          prefix += object.envVarPrefix;
          callback();
        } else {
          callback();
        }
      },
      quitObject: function quitObject(object, path, callback) {
        if (h.exist(object.envVarPrefix)) {
          prefix = prefix.replace(object.envVarPrefix, '');
        }
        callback();
      },
    }, function onVisited(err) {
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

function treatEnvVar(options, callback) {
  var value = process.env[options.envVar];
  if (undefined !== value) {
    h.setValue(
      {
        target: options.target,
        value: value,
        path: options.path,
      },
      function onSetted(err, response) {
        if (err) {
          return callback(err);
        }
        return callback(null, response);
      });
  } else {
    callback(null, options.target);
  }
}
