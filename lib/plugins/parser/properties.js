'use strict';

var _ = require('lodash');
var parser = require('properties-parser');

var name = 'Properties';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source) {
    return new Promise(function parse(resolve, reject) {
      try {
        var result = parser.parse(source);
        var object = correctObject(result);
        resolve(object);
      } catch (e) {
        reject(e);
      }
    });
  },
};

function correctObject(object) {
  var keys = Object.keys(object);
  var toReturn = {};
  for (var i = 0;i < keys.length;i++) {
    var key = keys[i];
    var value = object[key];
    if (value.indexOf(',') > -1) {
      value = parseArray(value);
    }
    toReturn = copyValue(value, toReturn, key.split('.'));
  }
  return toReturn;
}

function copyValue(sourceValue, target, keyElements) {
  if (1 === keyElements.length) {
    target[keyElements[0]] = sourceValue;
  } else {
    if (undefined === target[keyElements[0]]) {
      target[keyElements[0]] = {};
    }
    var subKeyElements = keyElements.splice(1, keyElements.length - 1);
    target[keyElements[0]] = copyValue(sourceValue, target[keyElements[0]], subKeyElements);
  }
  return target;
}

function parseArray(string) {
  var splitted = string.split(', ');
  return _.map(splitted, function trimElement(arrayElement) {
    return arrayElement.trim();
  });
}
