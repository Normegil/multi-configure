'use strict';

var u = require('underscore');

var name = 'Object';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
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
  var allParsers = u.filter(options.plugins, function filter(plugin) {
    return 'parser' === plugin.type.toLowerCase();
  });
  var parsers = u.filter(allParsers, function getParser(parser) {
    return parser.name.toLowerCase() === options.source.parser.toLowerCase();
  });
  if (undefined === parsers || null === parsers || 0 === parsers.length) {
    return callback(new Error('Parser not found for type: ' + options.source.parser));
  }

  parsers[0].parse(options.source.object, callback);
}
