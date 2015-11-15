'use strict';

var objectsPlugin = require('./object');
var h = require('../../helper');

var name = 'File';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options) {
    return new Promise(function load(resolve, reject) {
      var filePath = options.source.path;
      h.readFile(filePath)
        .then(function onRead(content) {
          return objectsPlugin.load({
            plugins: options.plugins,
            structure: options.structure,
            source: {
              object: content,
              type: objectsPlugin.name,
              parser: getExtention(filePath),
            },
          });
        }).then(function onLoaded(result) {
          resolve({
            plugin: name,
            config: result.config,
          });
        }).catch(reject);
    });
  },
};

function getExtention(path) {
  var splitted = path.split('.');
  var format = splitted[splitted.length - 1];
  return format;
}
