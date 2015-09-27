'use strict';

var fs = require('fs');
var objectsPlugin = require('./object');

var name = 'File';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    var filePath = options.source.path;
    fs.readFile(filePath, function onRead(err, content) {
      if (err) {
        return callback(err);
      }
      objectsPlugin.load(
        {
          plugins: options.plugins,
          structure: options.structure,
          source: {
            object: content,
            type: objectsPlugin.name,
            parser: getExtention(filePath),
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

function getExtention(path) {
  var splitted = path.split('.');
  var format = splitted[splitted.length - 1];
  return format;
}
