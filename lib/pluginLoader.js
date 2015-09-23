'use strict';

var fs = require('fs');
var u = require('underscore');

var loadAll = module.exports.loadAll = function loadAll(pluginOpts, callback) {
  var path = pluginOpts.path;
  var custom = pluginOpts.custom;

  var plugins = [];
  if (undefined !== custom && null !== custom && 0 < custom.length) {
    plugins = custom;
  }
  if (undefined !== path && null !== path) {
    fs.readdir(path, function onRead(err, files) {
      if (err) {
        return callback(err);
      }

      var pluginsFromFiles = u.map(files, function loadPlugin(file) {
        return require(path + file);
      });
      plugins = u.union(plugins, pluginsFromFiles);

      plugins = u.filter(plugins, function filter(plugin) {
        return undefined !== plugin.name && null !== plugin.name &&
          undefined !== plugin.type && null !== plugin.type;
      });

      return callback(null, plugins);
    });
  } else {
    plugins = u.filter(plugins, function filter(plugin) {
      return undefined !== plugin.name && null !== plugin.name &&
        undefined !== plugin.type && null !== plugin.type;
    });
    return callback(null, plugins);
  }
};

module.exports.load = function load(pluginOpts, filters, callback) {
  loadAll(pluginOpts, function onLoad(err, plugins) {
    if (err) {
      return callback(err);
    }

    var filteredPlugins = plugins;
    if (undefined !== filters.type && null !== filters.type) {
      filteredPlugins = u.filter(filteredPlugins, function filterPlugin(plugin) {
        return filters.type === plugin.type;
      });
    }

    if (undefined !== filters.name && null !== filters.name) {
      filteredPlugins = u.filter(filteredPlugins, function filterPlugin(plugin) {
        return filters.name === plugin.name;
      });
    }

    return callback(null, filteredPlugins);
  });
};
