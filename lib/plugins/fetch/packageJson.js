'use strict';

var h = require('../../helper');

var name = 'package.json';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, log) {
    return new Promise(function load(resolve, reject) {
      log.debug({path: options.source.path}, name + ': Load file');
      h.readFile(options.source.path)
        .then(function parseFile(content) {
          try {
            var packageJson = JSON.parse(content);
            log.debug({path: options.source.path, content: packageJson}, name + ': Parsed file');
            resolve({
              plugin: name,
              config: packageJson.config,
            });
          } catch (err) {
            reject(err);
          }
        })
        .catch(function onError(err) {
          if (h.exist(err) && h.exist(err.code) && 'ENOENT' === err.code) {
            log.debug({path: options.source.path}, name + ': file not found');
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
