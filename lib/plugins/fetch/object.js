'use strict';

var h = require('../../helper');

var name = 'Object';

module.exports = {
  name: name,
  type: 'fetch',
  load: function load(options, log) {
    return new Promise(function load(resolve, reject) {
      let object = options.source.object;
      log.debug({object: object}, 'Object: load object');
      if (!h.exist(object) || '' === object) {
        log.warn({object: object}, 'Object: Object doesn\'t exist or is empty');
        return resolve({
          plugin: name,
          config: {},
        });
      }

      if (doesNotNeedToBeParsed(options.source)) {
        log.debug({object: object}, 'Object: raw object');
        return resolve({
          plugin: name,
          config: options.source.object,
        });
      }

      parse(options.plugins, options.source).then(function onLoaded(result) {
        log.debug({object: object, result: result}, 'Object: parsed object');
        resolve({
          plugin: name,
          config: result,
        });
      }).catch(reject);
    });
  },
};

function parse(plugins, source) {
  return new Promise(function parse(resolve, reject) {
    let parser = plugins.find(function find(plugin) {
      return 'parser' === plugin.type.toLowerCase() &&
        plugin.name.toLowerCase() === source.parser.toLowerCase();
    });
    if (!h.exist(parser)) {
      return reject(new Error('Parser not found for type: ' + source.parser));
    }
    parser.parse(source.object)
      .then(resolve)
      .catch(reject);
  });
}

function doesNotNeedToBeParsed(source) {
  return !h.exist(source.parser) || 'RAW' === source.parser;
}
