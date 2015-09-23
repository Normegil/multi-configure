'use strict';

var u = require('underscore');
var h = require('../../helper');

var name = 'Object';

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

function parse(plugins, unparsedSource, callback) {
  var allParsers = u.filter(plugins, function filter(plugin) {
    return 'parser' === plugin.type.toLowerCase();
  });
  var parsers = u.filter(allParsers, function getParser(parser) {
    return parser.name.toLowerCase() === unparsedSource.parser.toLowerCase();
  });
  if (undefined === parsers || null === parsers || 0 === parsers.length) {
    return callback(new Error('Parser not found for type: ' + unparsedSource.parser));
  }

  parsers[0].parse(unparsedSource.object, callback);
}
