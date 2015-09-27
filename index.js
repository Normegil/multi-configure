'use strict';

var u = require('underscore');
var uuid = require('node-uuid');
var async = require('async');
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
        config: options.config,
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

  async.map(
    options.sources,
    function loadConfig(source, asyncCallback) {
      var plugin = u.filter(options.plugins, function getPlugin(plugin) {
        return source.type === plugin.name;
      });
      plugin[0].load(
        {plugins: options.plugins, source: source, config: options.config},
        function assignIDToResult(err, result) {
          if (err) {
            return asyncCallback(err);
          }
          result.sourceID = source.id;
          asyncCallback(null, result);
        });
    },
    function onFinished(err, results) {
      if (err) {
        callback(err);
      }
      merge(options.sources, results, callback);
    });
}
