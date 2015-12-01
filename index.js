'use strict';

let uuid = require('node-uuid');
let h = require('./lib/helper');
let merge = require('./lib/merge');
let loadPlugins = require('plugin-system');

let logWrapper = require('log-wrapper');
let log = logWrapper(undefined);

module.exports = function configWithLogs(options) {
  return config(options, log);
};

module.exports.registerLogger = function registerLogger(logger) {
  log = logWrapper(logger);
};

function config(options, log) {
  return new Promise(function config(resolve, reject) {
    log.info(options, 'Loading config');
    let pluginOpts = {
      paths: [__dirname + '/lib/plugins/'],
      custom: options.plugins,
    };
    log.debug(pluginOpts, 'Loading plugins');
    loadPlugins(pluginOpts)
      .then(function config(plugins) {
        log.info({plugins: plugins}, 'Plugins loaded');
        return getConfiguration({
            plugins: plugins,
            sources: options.sources,
          }, log);
      }).then(resolve).catch(reject);
  });
}

function getConfiguration(options, log) {
  return new Promise(function getConfiguration(resolve, reject) {
    options.sources.forEach(function getUUID(source) {
      source.id = uuid.v4();
    });

    let environment = process.env.NODE_ENV;
    let toProcess = filterByEnvironment(options.sources, environment);
    log.debug({before: options.source, after: toProcess, environment: environment},
      'Filter sources by environment');

    let promises = toProcess.map(function toPromise(source) {
      return loadConfig(options.plugins, source, log);
    });

    Promise.all(promises)
      .then(function onFinished(results) {
        log.info({configs: results}, 'Configuration loaded');
        let config = merge(options.sources, results, log);
        log.info({config: config}, 'Configuration merging done');
        return config;
      })
      .then(resolve)
      .catch(reject);
  });
}

function loadConfig(plugins, source, log) {
  return new Promise(function loadConfig(resolve, reject) {
    let plugin = plugins.find(function getPlugin(plugin) {
      return source.type === plugin.name;
    });
    log.trace({source: source}, 'Load config for ' + source.type);
    plugin.load({
      plugins: plugins,
      source: source,
    }, log).then(function onLoaded(result) {
      log.trace({source: source, config: result}, 'Config loaded for ' + source.type);
      if (h.exist(source.discriminator)) {
        log.trace({source: source}, 'Add discriminator to config for ' + source.type);
        let newConfig = {};
        newConfig[source.discriminator] = result.config;
        result.config = newConfig;
      }

      result.sourceID = source.id;
      resolve(result);
    }).catch(reject);
  });
}

function filterByEnvironment(sources, environment) {
  let toProcess = sources;
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
