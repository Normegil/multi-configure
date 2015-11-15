'use strict';

var pathExplorer = require('path-explorer');
var minimist = require('minimist');
var _ = require('lodash');
var h = require('../../helper');

var name = 'Command Line';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options) {
    return new Promise(function load(resolve, reject) {
      let structure = options.structure;
      if (!h.exist(structure)) {
        return reject(new Error('Config structure doesn\'t exist'));
      }

      var config = {};
      var args = minimist(process.argv.slice(2));
      h.visit(structure, '', {
        enterObject: function enter(object, path) {
          return new Promise(function enter(resolve, reject) {
            return enterObject({
              object: object,
              path: path,
              target: config,
              args: args,
            }).then(function onSuccess(result) {
              if (h.exist(result)) {
                config = result;
              }
              resolve();
            }).catch(reject);
          });
        },
      }).then(function onSuccess() {
        resolve({plugin: name, config: config});
      }).catch(reject);
    });
  },
};

function enterObject(options) {
  return new Promise(function enterObject(resolve, reject) {
    let cmdOpts = getCommandLineOptions(options.object);

    if (!h.exist(cmdOpts) || 0 === cmdOpts.length) {
      return resolve();
    }

    let values = getCommandLineValues(options.args, cmdOpts);
    if (!shouldPutValue(values)) {
      return resolve();
    }

    getValue(options.object, values)
      .then(function saveValue(value) {
        return pathExplorer.set({
          target: options.target,
          path: options.path,
          value: value,
        });
      })
      .then(resolve)
      .catch(reject);
  });
}

function getValue(properties, values) {
  return new Promise(function getValue(resolve, reject) {
    if (isNotArrayButShouldBeArray(values, properties)) {
      resolve([values]);
    } else if (isArrayButShouldBeSingleValue(values, properties)) {
      if (1 === values.length) {
        resolve(values[0]);
      } else {
        reject(new Error(
          'Conflicting value & parameter: Should not be an array but multiple inputs found ' +
            '[cmdOpts: ' + properties.cmdOpts + ';Values: ' + values + ']'
        ));
      }
    } else {
      return resolve(values);
    }
  });
}

function getCommandLineOptions(object) {
  var options = object.cmdOpts;
  if (!Array.isArray(object.cmdOpts)) {
    options = [object.cmdOpts];
  }
  return options;
}

function getCommandLineValues(args, options) {
  var valuesWithUndefined = options.map(function getOptionValue(option) {
    return args[option];
  });
  var flattenValues = _.flatten(valuesWithUndefined, true);
  return flattenValues.filter(function getOptionValue(value) {
    return undefined !== value;
  });
}

function shouldPutValue(value) {
  return h.exist(value) && (
    !Array.isArray(value) ||
    Array.isArray(value) && value.length > 0
  );
}

function isArrayButShouldBeSingleValue(values, properties) {
  return Array.isArray(values) && (
    !h.exist(properties.isArray) || !properties.isArray);
}

function isNotArrayButShouldBeArray(values, properties) {
  return !Array.isArray(values) &&
    h.exist(properties.isArray) && properties.isArray;
}
