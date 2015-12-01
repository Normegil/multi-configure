'use strict';

let _ = require('lodash');
let pathExplorer = require('path-explorer');
let h = require('./helper');

module.exports = function merge(sources, allResults, log) {
  return new Promise(function merge(resolve, reject) {
    log.debug({sources: sources, results: allResults}, 'Sort configs by sources priority');
    sortResults(allResults, sources)
      .then(function reduce(sortedResults) {
        log.debug({sources: sources, results: sortedResults}, 'Configs sorted');
        let configs = sortedResults.map(function getConfig(result) {
          return result.config;
        });

        log.debug({sources: sources, results: configs}, 'Fuse configs into one');
        return configs.reduce(function reduce(memo, config) {
          return memo.then(function onFused(base) {
            return fuseConfig(base, config, log);
          });
        }, Promise.resolve({}));
      }).then(function onMerged(mergeConfig) {
        resolve(mergeConfig);
      }).catch(reject);
  });
};

function fuseConfig(base, config, log) {
  return new Promise(function fuse(resolve, reject) {
    log.trace({base: base, config: config}, 'Fuse config');
    h.visit(config, '', {
      onLeaf: function onLeaf(value, path) {
        return new Promise(function onLeaf(resolve, reject) {
          setValue(base, path, value)
            .then(function onSetted(result) {
              base = result;
              resolve();
            })
            .catch(reject);
        });
      },
    }).then(function onVisited() {
      resolve(base);
    }).catch(reject);
  });
}

function sortResults(results, sources) {
  return new Promise(function sortResults(resolve) {
    let sourcesWithPriority = sources.filter(function filterWithPriority(source) {
      return h.exist(source.priority);
    });

    let sourcesWithoutPriority = sources.filter(function filterWithPriority(source) {
      return !h.exist(source.priority);
    });

    let sortedSourcesWithPriority = _.sortBy(sourcesWithPriority, function sortSources(source) {
      return -source.priority;
    });

    let sourceWithInternalPriority =
      _.union(sortedSourcesWithPriority, sourcesWithoutPriority)
      .map(function addInternalPriority(source, index) {
        source.internalPriority = index;
        return source;
      });

    let resultsWithMetaData = _.sortBy(results, function sortBy(result) {
      let source = sourceWithInternalPriority.find(function find(source) {
        return source.id === result.sourceID;
      });
      return source.internalPriority;
    });

    resolve(resultsWithMetaData);
  });
}

function setValue(target, path, value) {
  return new Promise(function onLeaf(resolve, reject) {
    let finalValue = pathExplorer.get(target, path);
    if (undefined !== finalValue) { // Value has been set before
      return resolve(target);
    }
    pathExplorer.set({
      target: target,
      path: path,
      value: value,
    }).then(resolve).catch(reject);
  });
}
