'use strict';

var objectsPlugin = require('./object');
var h = require('../../helper');

var name = 'File';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, log) {
    return new Promise(function load(resolve, reject) {
      var filePath = options.source.path;
      log.debug({path: filePath}, 'File: Load config file ' + filePath);
      h.readFile(filePath)
        .then(function onRead(content) {
          log.debug({path: filePath, content: content}, 'File: Config file found: ' + filePath);
          let objectsPluginOpts = {
            plugins: options.plugins,
            structure: options.structure,
            source: {
              object: content,
              type: objectsPlugin.name,
              parser: getExtention(filePath),
            },
          };
          log.debug({path: filePath, content: content, options: objectsPluginOpts},
            'File: Call object plugin for file: ' + filePath);
          return objectsPlugin.load(objectsPluginOpts, log);
        }).then(function onLoaded(result) {
          resolve({
            plugin: name,
            config: result.config,
          });
        }).catch(function onError(err) {
          if (h.exist(err) && h.exist(err.code) && 'ENOENT' === err.code) {
            log.warn('File not found - sending empty config');
            resolve({
              plugin: name,
              config: {},
            });
          } else {
            reject(err);
          }
        });
    });
  },
};

function getExtention(path) {
  var splitted = path.split('.');
  var format = splitted[splitted.length - 1];
  return format;
}
