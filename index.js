'use strict';

let uuid = require('node-uuid');
let h = require('./lib/helper');
let merge = require('./lib/merge');
let loadPlugins = require('plugin-system');

module.exports = function config(options) {
  return new Promise(function config(resolve, reject) {
    loadPlugins({
      paths: [__dirname + '/lib/plugins/'],
      custom: options.plugins,
    })
      .then(function config(plugins) {
        return getConfiguration({
            plugins: plugins,
            sources: options.sources,
          });
      }).then(resolve).catch(reject);
  });
};

function getConfiguration(options) {
  return new Promise(function getConfiguration(resolve, reject) {
    options.sources.forEach(function getUUID(source) {
      source.id = uuid.v4();
    });

    let toProcess = filterByEnvironment(options.sources);

    let promises = toProcess.map(function toPromise(source) {
      return loadConfig(options.plugins, source);
    });

    Promise.all(promises)
      .then(function onFinished(results) {
        return merge(options.sources, results);
      })
      .then(resolve)
      .catch(reject);
  });
}

function loadConfig(plugins, source) {
  return new Promise(function loadConfig(resolve, reject) {
    let plugin = plugins.find(function getPlugin(plugin) {
      return source.type === plugin.name;
    });
    plugin.load({
      plugins: plugins,
      source: source,
    }).then(function onLoaded(result) {
      if (h.exist(source.discriminator)) {
        let newConfig = {};
        newConfig[source.discriminator] = result.config;
        result.config = newConfig;
      }

      result.sourceID = source.id;
      resolve(result);
    }).catch(reject);
  });
}

function filterByEnvironment(sources) {
  let toProcess = sources;
  let environment = process.env.NODE_ENV;
  if (h.exist(environment)) {
    toProcess = sources.filter(function filterOnEnvironment(source) {
      let env = source.environment;
      if (!h.exist(env)) {
        return true;
      } else {
        return environment === env;
      }
    });
  }
  return toProcess;
}
