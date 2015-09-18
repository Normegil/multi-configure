'use strict';

var h = require('./helper');
var u = require('underscore');

module.exports = function merge(options, allResults) {
  var resultsWithMetaData = u.sortBy(allResults, function sortBy(result) {
    var sources = u.filter(options.sources, function filterSources(source) {
      return source.id === result.sourceID;
    });
    console.log(result);
    return -sources[0].priority;
  });
  var results = u.map(resultsWithMetaData, function getConfig(result) {
    return result.config;
  });
  return h.visit(options.config, function assignValue(optionLeaf, path) {
    for (var i = 0;i < results.length;i++) {
      var result = results[i];
      var value = h.getValue(result, path);
      if (undefined !== value) {
        return value;
      }
    }
    return undefined;
  });
};
