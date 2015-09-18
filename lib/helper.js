'use strict';

var u = require('underscore');

module.exports.visit = function visit(config, getValue) {
  var result = {};
  return visitConfig(result, {config: config, path: ''}, getValue);
};
/* jshint maxcomplexity: 6 */
module.exports.getValue = function getValue(object, path) {
  var separator = '.';
  var pathElements = path.split(separator);
  if (undefined === object) {
    return undefined;
  } else if (0 === pathElements.length || '' === pathElements[0]) {
    return object;
  } else if (1 === pathElements.length && '' !== pathElements[0]) {
    if ('' === pathElements[0]) {
      return object;
    } else {
      return getObjectValue(object, pathElements[0]);
    }
  } else {
    var indexToStartKeeping = 1;
    var numberOfElementsToKeep = pathElements.length - 1;
    var subPathElements = pathElements.splice(indexToStartKeeping, numberOfElementsToKeep);
    var objectToSearch = getObjectValue(object, pathElements[0]);
    return getValue(objectToSearch, subPathElements.join(separator));
  }
};

function visitConfig(result, options, getValue) {
  var config = options.config;
  var path = options.path;
  var keys = Object.keys(config);
  u.each(keys, function forEachKey(key) {
    var toVisit = config[key];
    var pathToElement = getPath(path, key);
    if (undefined !== getValue && null !== getValue && isValue(toVisit)) {
      result[key] = getValue(toVisit, pathToElement);
    } else if (isObject(toVisit)) {
      result[key] = {};
      result[key] = visitConfig(result[key], {config: toVisit, path: pathToElement}, getValue);
    }
  });
  return result;
}

function isObject(toTest) {
  return u.isObject(toTest) && !Array.isArray(toTest) && null !== toTest && undefined !== toTest;
}

function isValue(toTest) {
  if (isObject(toTest)) {
    var keys = Object.keys(toTest);
    return u.contains(keys, 'defaultValue');
  }
  return false;
}

function getPath(path, key) {
  var toReturn = path;
  if ('' !== toReturn) {
    toReturn += '.';
  }
  toReturn += key;
  return toReturn;
}

function getObjectValue(object, key) {
  var arrayPathMatchRegex = /^[a-zA-Z0-9]+(\[-?[0-9]+\])+$/i;
  if (key.match(arrayPathMatchRegex)) {
    var realKey = extractKeyPart(key);
    var indexes = extractIndexes(key);
    var toReturn = object[realKey];
    for (var i = 0;i < indexes.length;i++) {
      var index = indexes[i];
      toReturn = toReturn[index];
    }
    return toReturn;
  } else {
    return object[key];
  }
}

function extractIndexes(path) {
  var regex = /\[(-?[0-9]+)\]/g;
  var matches = [];
  var match;
  while (null !== (match = regex.exec(path))) {
    matches.push(+match[1]);
  }
  return matches;
}

function extractKeyPart(path) {
  var regex = /^[a-z]+/i;
  return regex.exec(path);
}
