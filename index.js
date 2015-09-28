'use strict';

var u = require('underscore');
var uuid = require('node-uuid');
var async = require('async');
var h = require('./lib/helper');
var merge = require('./lib/merge');
var pluginManager = require('./lib/pluginLoader');

module.exports = function config(options, callback) {
  loadPlugins(options.plugins, function onLoad(err, pluginsLoaded) {
    if (err) {
      return callback(err);
    }
    getConfiguration(
      {
        plugins: pluginsLoaded,
        structure: options.structure,
        sources: options.sources,
      }, callback);
  });
};

function loadPlugins(customPlugins, callback) {
  var pluginFolder = __dirname + '/lib/plugins/fetch/';
  pluginManager.loadAll(
    {
      path: pluginFolder,
      custom: customPlugins,
    },
    callback);
}

function getConfiguration(options, callback) {
  u.each(options.sources, function getUUID(source) {
    source.id = uuid.v4();
  });

  var toProcess = filterByEnvironment(options.sources);

  async.map(
    toProcess,
    function fromSource(source, asyncCallback) {
      loadConfig({
        source: source,
        plugins: options.plugins,
        structure: options.structure,
      }, asyncCallback);
    },
    function onFinished(err, results) {
      if (err) {
        callback(err);
      }
      merge(options.sources, results, callback);
    });
}

function loadConfig(options, callback) {
  var plugins = options.plugins;
  var source = options.source;
  var plugin = u.filter(plugins, function getPlugin(plugin) {
    return source.type === plugin.name;
  });
  plugin[0].load(
    options,
    function assignIDToResult(err, result) {
      if (err) {
        return callback(err);
      }

      if (h.exist(source.discriminator)) {
        var newConfig = {};
        newConfig[source.discriminator] = result.config;
        result.config = newConfig;
      }

      result.sourceID = source.id;
      callback(null, result);
    });
}

function filterByEnvironment(sources) {
  var toProcess = sources;
  var environment = process.env.NODE_ENV;
  if (h.exist(environment)) {
    toProcess = u.filter(sources, function filterOnEnvironment(source) {
      var env = source.environment;
      if (!h.exist(env)) {
        return true;
      } else {
        return environment === env;
      }
    });
  }
  return toProcess;
}
