'use strict';

var u = require('underscore');
var async = require('async');
var pluginLoader = require('../../pluginLoader');
var h = require('../../helper');

var name = 'Objects';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(sources, configOptions, callback) {
    var unparsedSources = getObjectsFrom(sources.parameters);
    parse(unparsedSources, function onParsed(err, objects) {
      if (err) {
        return callback(err);
      }
      loadObjects(objects, configOptions, callback);
    });
  },
};

module.exports.loadObjects = loadObjects;
function loadObjects(objects, configOptions, callback) {
  var config = loadConfig(objects, configOptions);
  callback(null, {
    plugin: name,
    config: config,
  });
}

function loadConfig(objects, configOptions) {
  var config = h.visit(configOptions, function getValue(configOptionsObject, path) {
    return getValueFromArrayOfObjects(objects, path);
  });
  return config;
}

function getValueFromArrayOfObjects(objects, path) {
  for (var i = 0;i < objects.length;i++) {
    var object = objects[i];
    var value = h.getValue(object, path);
    if (undefined !== value) {
      return value;
    }
  }
  return undefined;
}

function getObjectsFrom(sources) {
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

function parse(unparsedSources, callback) {
  pluginLoader.load(__dirname + '/../parser/', 'parser', function onLoad(err, allParsers) {
    if (err) {
      return callback(err);
    }
    async.map(
      unparsedSources,
      function parseSource(source, asyncCallback) {
        var parsers = u.filter(allParsers, function getParser(parser) {
          return parser.name === source.parser;
        });
        parsers[0].parse(source.object, asyncCallback);
      },
      callback
    );
  });
}
