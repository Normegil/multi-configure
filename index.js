'use strict';

var u = require('underscore');
var async = require('async');

var merge = require('./lib/merge');
var pluginManager = require('./lib/pluginLoader');
var helper = require('./lib/helper');

module.exports = function config(sources, configOptions, callback) {
  var pluginFolders = [
    __dirname + 'lib/plugins',
  ];

  var pluginType = 'fetch';
  var loadedPlugins = pluginManager.load(pluginFolders, pluginType);
  var customFetchPlugins = pluginManager.extract(customPlugins, pluginType);
  var plugins = u.union(loadedPlugins, customFetchPlugins);

  async.each(
    plugins,
    function loadConfig(plugin, callback) {
      plugin.load(sources, configOptions, callback);
    },
    function onFinished(err, results) {
      if (err) {
        callback(err);
      }
      var config = merge(sources, results);
      callback(null, config);
    }
  );
};

module.exports.helper = helper;
