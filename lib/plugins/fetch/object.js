'use strict';

var _ = require('underscore');
var h = require('../../helper');

var name = 'Object';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    if (!h.exist(options.source.parser) || 'RAW' === options.source.parser) {
      return callback(null, {
        plugin: name,
        config: options.source.object,
      });
    }

    parse(options, function onParsed(err, object) {
      if (err) {
        return callback(err);
      }
      callback(null, {
        plugin: name,
        config: object,
      });
    });
  },
};

function parse(options, callback) {
  var allParsers = _.filter(options.plugins, function filter(plugin) {
    return 'parser' === plugin.type.toLowerCase();
  });
  var parsers = _.filter(allParsers, function getParser(parser) {
    return parser.name.toLowerCase() === options.source.parser.toLowerCase();
  });
  if (undefined === parsers || null === parsers || 0 === parsers.length) {
    return callback(new Error('Parser not found for type: ' + options.source.parser));
  }

  parsers[0].parse(options.source.object, callback);
}
