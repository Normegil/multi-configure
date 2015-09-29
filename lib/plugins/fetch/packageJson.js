'use strict';

var fs = require('fs');

var name = 'package.json';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, callback) {
    fs.readFile(options.source.path, function onLoaded(err, content) {
      if (err) {
        return callback(err);
      }
      var packageJson = JSON.parse(content);
      return callback(null, {
        plugin: name,
        config: packageJson.config,
      });
    });
  },
};
