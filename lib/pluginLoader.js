'use strict';

var fs = require('fs');
var u = require('underscore');

module.exports = function load(path, type, callback) {
  fs.readdir(path, function onRead(err, files) {
    if (err) {
      return callback(err);
    }

    var allPlugins = u.map(files, function loadPlugin(file) {
      return require(path + file);
    });
    var plugins = u.filter(allPlugins, function filterPlugin(plugin) {
      return type === plugin.type;
    });

    callback(null, plugins);
  });
};
