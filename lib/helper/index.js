'use strict';

var u = require('underscore');
var visitor = require('./visitor');
var valueHelper = require('./value');

module.exports.exist = function exist(value) {
  return undefined !== value && null !== value;
};

module.exports.isObject = function isObject(toTest) {
  return u.isObject(toTest) &&
    !u.isFunction(toTest) &&
    !Array.isArray(toTest) &&
    null !== toTest &&
    undefined !== toTest;
};

module.exports.visit = visitor.visit;
module.exports.getValue = valueHelper.getValue;
module.exports.setValue = valueHelper.setValue;
