'use strict';

var u = require('underscore');
var uuid = require('node-uuid');
var async = require('async');
var merge = require('./lib/merge');
var pluginManager = require('./lib/pluginLoader');
var helper = require('./lib/helper');

module.exports.helper = helper;

module.exports = function config(plugins, options, callback) {
  loadPlugins(plugins, function onLoad(err, plugins) {
    if (err) {
      return callback(err);
    }
    getConfiguration(plugins, options, callback);
  });
};

function loadPlugins(pluginDefinitions, callback) {
  var pluginFolder = __dirname + '/lib/plugins/fetch/';
  var pluginType = 'fetch';
  pluginManager.load(
    {
      path: pluginFolder,
      definitions: pluginDefinitions,
    },
    pluginType,
    callback);
}

function getConfiguration(plugins, options, callback) {
  u.each(options.sources, function getUUID(source) {
    source.id = uuid.v4();
  });

  async.map(
    options.sources,
    function loadConfig(definition, asyncCallback) {
      var plugin = u.filter(plugins, function getPlugin(plugin) {
        return definition.type === plugin.name;
      });
      plugin[0].load(
        plugins,
        {source: definition, config: options.config},
        function assignIDToResult(err, result) {
          if (err) {
            return asyncCallback(err);
          }
          result.sourceID = definition.id;
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
