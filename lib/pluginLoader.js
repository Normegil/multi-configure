'use strict';

var fs = require('fs');
var u = require('underscore');

module.exports.load = function load(path, type, callback) {
  fs.readdir(path, function onRead(err, files) {
    if (err) {
      return callback(err);
    }

    var allPlugins = u.map(files, function loadPlugin(file) {
      return require(path + file);
    });
    var plugins = filterPlugins(allPlugins, type);

    callback(null, plugins);
  });
};

module.exports.extract = function extract(pluginDefinitions, type) {
  return filterPlugins(pluginDefinitions, type);
};

function filterPlugins(pluginsToFilter, type) {
  var plugins = u.filter(pluginsToFilter, function filterPlugin(plugin) {
    return type === plugin.type;
  });
  return plugins;
}
