'use strict';

var relativePathToPlugins = '../../../lib/plugins/';
var relativePathToParsers = relativePathToPlugins + 'parser/';

var fs = require('fs');
var assert = require('chai').assert;
var plugin = require('./' + relativePathToPlugins + 'fetch/object');
var pluginLoader = require('../../../lib/pluginLoader');
var jsonParser = require('./' + relativePathToParsers + 'json');
var xmlParser = require('./' + relativePathToParsers + 'xml');
var propertiesParser = require('./' + relativePathToParsers + 'properties');
var yamlParser = require('./' + relativePathToParsers + 'yaml');

var pluginName = 'Object';
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
    var config = {
      test: {
        defaultValue: null,
      },
      jsonField: {
        defaultValue: null,
      },
      xmlField: {
        defaultValue: null,
      },
      propertiesField: {
        defaultValue: null,
      },
      yamlField: {
        defaultValue: null,
      },
      testNumber: {
        defaultValue: null,
      },
      object: {
        test1: {
          defaultValue: null,
        },
        test2: {
          defaultValue: null,
        },
      },
      array: {
        defaultValue: null,
      },
    };
    var response;
    before(function(done) {
      pluginLoader.load(
        {path: __dirname + '/' + relativePathToParsers},
        {
          type: 'parser',
        },
        function onPluginLoaded(err, parsers) {
          if (err) {return done(err);}
          plugin.load(
            parsers,
            {
              config: config,
              source: {
                type: pluginName,
                priority: 50,
                parser: 'RAW',
                object: {
                  test: 'test.ObjectValue',
                  testNumber: 5,
                  object: {
                    test1: 'object.test1.ObjectValue',
                    test2: 'object.test2.ObjectValue',
                  },
                  array: [5, 6, 7],
                },
              },
            },
            function(err, result) {
              if (err) {return done(err);}
              response = result;
              done();
            });
        }
      );
    });

    it('should return plugin name', function(done) {
      assert.equal(response.plugin, pluginName);
      done();
    });

    it('should load root nodes', function(done) {
      assert.equal(response.config.test, 'test.ObjectValue');
      done();
    });

    it('should load numbers', function(done) {
      assert.equal(response.config.testNumber, 5);
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, 'object.test1.ObjectValue');
      assert.equal(response.config.object.test2, 'object.test2.ObjectValue');
      done();
    });

    it('should load array', function(done) {
      var array = [5, 6, 7];
      assert.equal(response.config.array.length, array.length);
      for (var i = 0;i < response.config.array.length;i++) {
        assert.equal(response.config.array[i], array[i]);
      }
      done();
    });

    var resourceDirectoryName = __dirname + '/../../resources/assets/';
    describe('- JSON format', function() {
      var source = fs.readFileSync(resourceDirectoryName + 'config.json');

      var response;
      before(function(done) {
        plugin.load(
          [jsonParser],
          {
            config: config,
            source: {
              type: pluginName,
              priority: 0,
              parser: 'JSON',
              object: source,
            },
          },
          function(err, result) {
            if (err) {return done(err);}
            response = result;
            done();
          });
      });

      it('should load JSON', function(done) {
        assert.equal(response.config.jsonField, 'JsonValue');
        done();
      });
    });

    describe('- XML format', function() {
      var source = fs.readFileSync(resourceDirectoryName + 'config.xml');

      var response;
      before(function(done) {
        plugin.load(
          [xmlParser],
          {
            config: config,
            source: {
              type: pluginName,
              priority: 0,
              parser: 'XML',
              object: source,
            },
          },
          function(err, result) {
            if (err) {return done(err);}
            response = result;
            done();
          });
      });

      it('should load XML', function(done) {
        assert.equal(response.config.xmlField, 'XMLValue');
        done();
      });
    });

    describe('- Properties format', function() {
      var source = fs.readFileSync(resourceDirectoryName + 'config.properties');

      var response;
      before(function(done) {
        plugin.load(
          [propertiesParser],
          {
            config: config,
            source: {
              type: pluginName,
              priority: 0,
              parser: 'Properties',
              object: source,
            },
          },
          function(err, result) {
            if (err) {return done(err);}
            response = result;
            done();
          });
      });

      it('should load Properties', function(done) {
        assert.equal(response.config.propertiesField, 'PropertiesValue');
        done();
      });
    });

    describe('- YAML format', function() {
      var source = fs.readFileSync(resourceDirectoryName + 'config.yaml');

      var response;
      before(function(done) {
        plugin.load(
          [yamlParser],
          {
            config: config,
            source: {
              type: pluginName,
              priority: 0,
              parser: 'YAML',
              object: source,
            },
          },
          function(err, result) {
            if (err) {return done(err);}
            response = result;
            done();
          });
      });

      it('should load YAML', function(done) {
        assert.equal(response.config.yamlField, 'YamlValue');
        done();
      });
    });
  });
});
