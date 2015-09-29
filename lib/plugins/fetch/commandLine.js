'use strict';

var minimist = require('minimist');
var _ = require('underscore');
var h = require('../../helper');

var name = 'Command Line';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    if (!h.exist(options.structure)) {
      return callback(new Error('Config structure doesn\'t exist'));
    }

    var args = minimist(process.argv.slice(2));

    var result = {};
    h.visit({
      toVisit: options.structure,
      path: '',
    }, {
      enterObject: function enterObject(object, path, enterObjectCallback) {
        if (h.exist(object.cmdOpts)) {
          var options = object.cmdOpts;
          if (!Array.isArray(object.cmdOpts)) {
            options = [object.cmdOpts];
          }

          var valuesWithUndefined = _.map(options, function getOptionValue(option) {
            return args[option];
          });
          var flattenValues = _.flatten(valuesWithUndefined, true);

          var values = _.filter(flattenValues, function getOptionValue(value) {
            return undefined !== value;
          });

          if (shouldPutValue(values)) {
            getValue(object, values, function forValue(err, value) {
              if (err) {
                return enterObjectCallback(err);
              }
              h.setValue({
                target: result,
                path: path,
                value: value,
              }, function onValueSetted(err, response) {
                if (err) {
                  return enterObjectCallback(err);
                }
                result = response;
                enterObjectCallback();
              });
            });
          } else {
            enterObjectCallback();
          }
        } else {
          enterObjectCallback();
        }
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

function shouldPutValue(value) {
  return h.exist(value) &&
    (
      !Array.isArray(value) ||
      Array.isArray(value) && value.length > 0
    );
}

function getValue(object, values, callback) {
  var isNotArrayButShouldBeArray =
    h.exist(object.isArray) &&
    object.isArray &&
    !Array.isArray(values);
  var isArrayButShouldBeSingleValue =
    (
      !h.exist(object.isArray) ||
      !object.isArray
    ) &&
    Array.isArray(values);
  if (isNotArrayButShouldBeArray) {
    callback(null, [values]);
  } else if (isArrayButShouldBeSingleValue) {
    if (1 === values.length) {
      callback(null, values[0]);
    } else {
      return callback(new Error(
        'Conflicting value & parameter: Should not be an array but multiple inputs found ' +
          '[cmdOpts: ' + object.cmdOpts + ';Values: ' + values + ']'
      ));
    }
  } else {
    return callback(null, values);
  }
}
