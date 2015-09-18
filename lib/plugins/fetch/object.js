'use strict';

var u = require('underscore');
var pluginLoader = require('../../pluginLoader');
var h = require('../../helper');

var name = 'Objects';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(plugins, options, callback) {
    var config = options.config;
    var unparsedSource = options.source;
    parse(plugins, unparsedSource, function onParsed(err, object) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        plugin: name,
        config: loadObject(object, config),
      });
    });
  },
};

function loadObject(object, config) {
  return h.visit(config, function getValue(configObject, path) {
    return h.getValue(object, path);
  });
}

function parse(pluginDefinitions, unparsedSource, callback) {
  pluginLoader.load(
    {
      path: __dirname + '/../parser/',
      definitions: pluginDefinitions,
    },
    'parser',
    function onLoad(err, allParsers) {
      if (err) {
        return callback(err);
      }

      var parsers = u.filter(allParsers, function getParser(parser) {
        return parser.name === unparsedSource.parser;
      });
      parsers[0].parse(unparsedSource.object, callback);
    });
}
