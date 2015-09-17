'use strict';

var fs = require('fs');
var async = require('async');
var u = require('underscore');
var pluginLoader = require('../../pluginLoader');
var objectsPlugin = require('./object');

var name = 'File';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(sources, configOptions, callback) {
    var filePaths = getFilesFrom(sources.parameters);
    loadObjects(filePaths, function onLoaded(err, objects) {
      if (err) {
        return callback(err);
      }
      objectsPlugin.loadObjects(objects, configOptions, function changePluginName(err, result) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          plugin: name,
          config: result.config,
        });
      });
    });
  },
};

function getFilesFrom(sources) {
  var sortedSources = u.sortBy(sources, function sortOn(source) {
    if (undefined === source.priority) {
      return 0;
    } else {
      return -source.priority;
    }
  });
  return u.filter(sortedSources, function filter(source) {
    return source.type === name;
  });
}

function loadObjects(sources, callback) {
  pluginLoader.load(__dirname + '/../parser/', 'parser', function onLoad(err, allParsers) {
    async.map(
      sources,
      function load(source, asyncCallback) {
        var content = fs.readFileSync(source.path);
        var parser = getParser(source.path, allParsers);
        if (undefined === parser) {
          callback(new Error('Unsupported file type: ' + source.path));
        }
        parser.parse(content, asyncCallback);
      },
      callback
    );
  });
}

function getParser(path, allParsers) {
  var splitted = path.split('.');
  var format = splitted[splitted.length - 1];
  var parser = u.filter(allParsers, function getParser(parser) {
    return parser.format === format.toLowerCase();
  });
  if (undefined === parser) {
    return undefined;
  }
  return parser[0];
}
