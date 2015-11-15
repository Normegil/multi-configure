'use strict';

let _ = require('lodash');
let visitor = require('./visitor');
let fileHelper = require('./file');

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
module.exports.getFileFromHierarchy = fileHelper.getFileFromHierarchy;
module.exports.readFile = fileHelper.readFile;
