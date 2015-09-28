'use strict';

var h = require('./index');

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

/* jshint maxstatements: 23 */
/* jshint maxcomplexity: 9 */
module.exports.setValue = function setValue(options, callback) {
  var separator = '.';
  var target = options.target;
  var path = options.path;
  var value = options.value;
  if (!h.exist(path)) {
    return callback(new Error('Path doesn\'t exist'));
  }
  if (!h.exist(target)) {
    target = {};
  }
  if ('' === path || '.' === path) {
    target = value;
    return callback(null, target);
  } else if (path.indexOf(separator) < 0) {
    if (!h.exist(target)) {
      target = {};
    }
    target[path] = value;
    return callback(null, target);
  } else {
    var pathElements = path.split('.');
    var newTarget = target[pathElements[0]];
    if (!h.isObject(newTarget) && undefined !== newTarget) {
      return callback(new Error(newTarget + ' is not undefined'));
    }
    if (!h.exist(target)) {
      target = {};
    }
    var reducedPath = pathElements
      .splice(1, pathElements.length - 1)
      .join(',');
    setValue(
      {
        target: newTarget,
        path: reducedPath,
        value: value,
      },
      function onValueSetted(err, result) {
        target[pathElements[0]] = result;
        return callback(err, target);
      });
  }
};

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
