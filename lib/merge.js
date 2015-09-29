'use strict';

var _ = require('underscore');
var async = require('async');
var h = require('./helper');

module.exports = function merge(sources, allResults, callback) {
  sortResults(allResults, sources, function onSorted(err, sortedResults) {
    if (err) {
      return callback(err);
    }
    var results = _.map(sortedResults, function getConfig(result) {
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

function sortResults(results, sources, callback) {
  var sourcesWithPriority = _.filter(sources, function filterWithPriority(source) {
    return h.exist(source.priority);
  });

  var sourcesWithoutPriority = _.filter(sources, function filterWithPriority(source) {
    return !h.exist(source.priority);
  });

  var sortedSourcesWithPriority = _.sortBy(sourcesWithPriority, function sortSources(source) {
    return -source.priority;
  });

  var prioritizedSources = _.union(sortedSourcesWithPriority, sourcesWithoutPriority);

  var sourceWithInternalPriority =
    _.map(prioritizedSources, function addInternalPriority(source, index) {
      source.internalPriority = index;
      return source;
    });

  var resultsWithMetaData = _.sortBy(results, function sortBy(result) {
    var source = _.filter(sourceWithInternalPriority, function filterSources(source) {
      return source.id === result.sourceID;
    });
    return source[0].internalPriority;
  });

  callback(null, resultsWithMetaData);
}
