'use strict';

var _ = require('underscore');
var visitor = require('./visitor');
var valueHelper = require('./value');
var fileHelper = require('./file');

module.exports.exist = function exist(value) {
  return undefined !== value && null !== value;
};

module.exports.isObject = function isObject(toTest) {
  return _.isObject(toTest) &&
    !_.isFunction(toTest) &&
    !Array.isArray(toTest) &&
    null !== toTest &&
    undefined !== toTest;
};

module.exports.visit = visitor.visit;
module.exports.getValue = valueHelper.getValue;
module.exports.setValue = valueHelper.setValue;
module.exports.getFileFromHierarchy = fileHelper.getFileFromHierarchy;
