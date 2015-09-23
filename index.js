'use strict';

var u = require('underscore');
var uuid = require('node-uuid');
var async = require('async');
var merge = require('./lib/merge');
var pluginManager = require('./lib/pluginLoader');

module.exports = function config(plugins, options, callback) {
  loadPlugins(plugins, function onLoad(err, plugins) {
    if (err) {
      return callback(err);
    }
    getConfiguration(plugins, options, callback);
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

function getConfiguration(plugins, options, callback) {
  u.each(options.sources, function getUUID(source) {
    source.id = uuid.v4();
  });

  async.map(
    options.sources,
    function loadConfig(source, asyncCallback) {
      var plugin = u.filter(plugins, function getPlugin(plugin) {
        return source.type === plugin.name;
      });
      plugin[0].load(
        plugins,
        {source: source, config: options.config},
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
      var config = merge(options, results);
      callback(null, config);
    });
}
