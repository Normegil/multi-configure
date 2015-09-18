'use strict';

var fs = require('fs');
var u = require('underscore');
var pluginLoader = require('../../pluginLoader');
var objectsPlugin = require('./object');

var name = 'File';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(plugins, options, callback) {
    var filePath = options.source.path;
    loadFile(plugins, filePath, function onLoaded(err, object) {
      if (err) {
        return callback(err);
      }
      objectsPlugin.load(
        {},
        {
          config: options.config,
          source: {
            object: object,
            type: objectsPlugin.name,
            parser: 'RAW',
          },
        },
        function changePluginName(err, result) {
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

function loadFile(pluginDefinitions, path, callback) {
  pluginLoader.load(
    {
      path: __dirname + '/../parser/',
      definitions: pluginDefinitions,
    },
    'parser',
    function onLoad(err, allParsers) {
      var content = fs.readFileSync(path);
      var parser = getParser(path, allParsers);
      if (undefined === parser) {
        callback(new Error('Unsupported file type: ' + path));
      }
      parser.parse(content, callback);
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
