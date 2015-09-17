'use strict';

var u = require('underscore');

module.exports = function merge(sources, allResults) {
  var plugins = u.sortBy(sources.plugins, function getSortValue(source) {
    return -source.priority;
  });
  var finalConfig = {};
  u.each(plugins, function forEachPlugin(plugin) {
    var result = getPluginResult(plugin.type, allResults);
    finalConfig = getConfigObject(finalConfig, result);
  });
  return finalConfig;
};

function getPluginResult(pluginName, allResults) {
  var uniqueResultArray = u.filter(allResults, function filter(result) {
    return pluginName === result.plugin;
  });
  var pluginResult = uniqueResultArray[0];
  return pluginResult.config;
}

function getConfigObject(previousResult, result) {
  var keys = Object.keys(result);
  u.each(keys, function forEachKey(key) {
    var value = result[key];
    if (undefined !== value) {
      if (undefined === previousResult[key] || isObject(previousResult[key])) {
        previousResult[key] = getConfigValue(previousResult[key], value);
      }
    }
  });
  return previousResult;
}

function isObject(toTest) {
  return u.isObject(toTest) && !Array.isArray(toTest) && null !== toTest;
}

function getConfigValue(object, value) {
  if (null === value || !isObject(value)) {
    return value;
  } else {
    if (undefined === object) {
      object = {};
    }
    return getConfigObject(object, value);
  }
}
