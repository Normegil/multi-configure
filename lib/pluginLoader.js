'use strict';

var fs = require('fs');
var u = require('underscore');

module.exports.load = function load(pluginOpts, type, callback) {
  var path = pluginOpts.path;
  var definitions = pluginOpts.definitions;

  var plugins = [];
  if (undefined !== definitions && null !== definitions && 0 < definitions.length) {
    plugins = filterPlugins(type, definitions);
  }
  if (undefined !== path && null !== path) {
    fs.readdir(path, function onRead(err, files) {
      if (err) {
        return callback(err);
      }

      var allPlugins = u.map(files, function loadPlugin(file) {
        return require(path + file);
      });
      var pluginsFromFiles = filterPlugins(type, allPlugins);
      plugins = u.union(plugins, pluginsFromFiles);

      return callback(null, plugins);
    });
  } else {
    return callback(null, plugins);
  }
};

function filterPlugins(type, allPlugins) {
  return u.filter(allPlugins, function filterPlugin(plugin) {
    return type === plugin.type;
  });
}
