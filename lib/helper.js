'use strict';

var u = require('underscore');
var async = require('async');

var exist = module.exports.exist = function exist(value) {
  return undefined !== value && null !== value;
};

var visit = module.exports.visit = function visit(options, actions, callback) {
  var toVisit = options.toVisit;
  var path = options.path;

  if (!isObject(toVisit)) {
    if (u.isFunction(actions.onLeaf)) {
      actions.onLeaf(toVisit, path, function onLeafTreated(err) {
        return callback(err);
      });
    } else {
      return callback();
    }
  } else {
    if (u.isFunction(actions.onObject)) {
      actions.onObject(toVisit, path, function onVisited(err) {
        if (err) {
          return callback(err);
        }
        visitObjectStructure(options, actions, function onStructureVisited(err) {
          callback(err);
        });
      });
    } else {
      visitObjectStructure(options, actions, function onStructureVisited(err) {
        callback(err);
      });
    }
  }
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

/* jshint maxstatements: 21 */
/* jshint maxcomplexity: 8 */
module.exports.setValue = function setValue(options, callback) {
  var separator = '.';
  var target = options.target;
  var path = options.path;
  var value = options.value;
  if (!exist(path)) {
    return callback(new Error('Path doesn\'t exist'));
  }
  if ('' === path || '.' === path) {
    target = value;
    return callback(null, target);
  } else if (path.indexOf(separator) < 0) {
    if (!exist(target)) {
      target = {};
    }
    target[path] = value;
    return callback(null, target);
  } else {
    var pathElements = path.split('.');
    var newTarget = target[pathElements[0]];
    if (!isObject(newTarget) && undefined !== newTarget) {
      return callback(new Error(newTarget + ' is not undefined'));
    }
    if (!exist(target)) {
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

function isObject(toTest) {
  return u.isObject(toTest) && !Array.isArray(toTest) && null !== toTest && undefined !== toTest;
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

function visitObjectStructure(options, actions, callback) {
  var toVisit = options.toVisit;
  var path = options.path;
  var keys = Object.keys(toVisit);
  async.each(
    keys,
    function treatKey(key, asyncCallback) {
      var nextPath = path;
      if ('' !== path) {
        nextPath += '.';
      }
      nextPath += key;
      visit(
        {
          toVisit: toVisit[key],
          path: nextPath,
        },
        actions,
        asyncCallback);
    },
    function keysTreated(err) {
      callback(err);
    }
  );
}
