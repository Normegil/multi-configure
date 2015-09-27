'use strict';

var u = require('underscore');
var async = require('async');
var h = require('./helper');

module.exports = function merge(sources, allResults, callback) {
  var resultsWithMetaData = u.sortBy(allResults, function sortBy(result) {
    var source = u.filter(sources, function filterSources(source) {
      return source.id === result.sourceID;
    });
    return -source[0].priority;
  });
  var results = u.map(resultsWithMetaData, function getConfig(result) {
    return result.config;
  });
  async.reduce(
    results,
    {},
    reduceConfig,
    function endOfReduce(err, result) {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
};

function reduceConfig(memo, result, callback) {
  h.visit(
    {
      toVisit: result,
      path: '',
    },
    {
      onLeaf: function onLeaf(value, path, onValueCallback) {
        var finalValue = h.getValue(memo, path);
        if (undefined !== finalValue) {
          return onValueCallback(null, memo);
        }
        h.setValue(
          {
            target: memo,
            path: path,
            value: value,
          },
          function onValueSetted(err, result) {
            if (err) {
              return onValueCallback(err);
            }
            memo = result;
            return onValueCallback(null, memo);
          });
      },
    },
    function onVisited(err) {
      return callback(err, memo);
    });
}
