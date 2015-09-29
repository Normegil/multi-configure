'use strict';

var relativePathToPlugins = '../../../lib/plugins/';

var assert = require('chai').assert;
var plugin = require('./' + relativePathToPlugins + 'fetch/packageJson');

var pluginName = 'package.json';
describe('Plugin: ' + pluginName, function() {
  it('should be named \'' + pluginName + '\'', function(done) {
    assert.equal(pluginName, plugin.name);
    done();
  });

  it('should be a \'fetch\' type plugin', function(done) {
    assert.equal('fetch', plugin.type);
    done();
  });

  describe('.load()', function() {
    var expected = {
      jsonField: 'JsonValue',
      test: 'Test',
      testNumber: 2,
      priorityTest: 'Something\'s wrong',
      array: [3, 4, 5],
      object: {
        test1: 'object.test1.value',
        test2: 'object.test2.value',
      },
    };

    it('should return plugin name', function(done) {
      plugin.load(
        {
          source: {
            type: pluginName,
            priority: 50,
            path: __dirname + '/../../resources/assets/package.json',
          },
        },
        function(err, result) {
          if (err) {return done(err);}
          assert.equal(result.plugin, pluginName);
          done();
        });
    });

    it('should load from path given', function(done) {
      plugin.load(
        {
          source: {
            type: pluginName,
            priority: 50,
            path: __dirname + '/../../resources/assets/package.json',
          },
        },
        function(err, result) {
          if (err) {return done(err);}
          assert.deepEqual(result.config, expected);
          done();
        });
    });
  });
});
