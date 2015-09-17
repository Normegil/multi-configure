'use strict';

var fs = require('fs');
var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/object');

describe('Plugin: Objects', function() {
  var pluginName = 'Objects';

  it('should be named \'' + pluginName + '\'', function(done) {
    assert.equal(pluginName, plugin.name);
    done();
  });

  it('should be a \'fetch\' type plugin', function(done) {
    assert.equal('fetch', plugin.type);
    done();
  });

  describe('.load()', function() {
    var configOptions;
    var response;
    before(function(done) {
      var resourceDirectoryName = __dirname + '/../../resources/';
      var jsonSource = fs.readFileSync(resourceDirectoryName + 'config.json');
      var xmlSource = fs.readFileSync(resourceDirectoryName + 'config.xml');
      var propertiesSource = fs.readFileSync(resourceDirectoryName + 'config.properties');
      var yamlSource = fs.readFileSync(resourceDirectoryName + 'config.yaml');

      var sources = {
        parameters: [
          {
            type: pluginName,
            priority: 50,
            parser: 'RAW',
            object: {
              test: 'test.ObjectValue',
              testNumber: 5,
              object: {
                  test1: 'object.test1.ObjectValue',
                  test2: 'object.test2.ObjectValue'
              },
              array: [5, 6, 7],
              priorityTest: 'Something\'s wrong',
            },
          },
          {
            type: pluginName,
            priority: 10,
            parser: 'JSON',
            object: jsonSource,
          },
          {
            type: pluginName,
            priority: 20,
            parser: 'XML',
            object: xmlSource,
          },
          {
            type: pluginName,
            priority: 30,
            parser: 'Properties',
            object: propertiesSource,
          },
          {
            type: pluginName,
            priority: 40,
            parser: 'YAML',
            object: yamlSource,
          },
          {
            type: pluginName,
            priority: 100,
            parser: 'RAW',
            object: {
              priorityTest: 'HasPriority',
            },
          },
        ],
      };
      configOptions = {
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
        priorityTest:{
          defaultValue: null,
        }
      };
      plugin.load(sources, configOptions, function(err, configLoaded) {
        if(err) return done(err);
        response = configLoaded;
        done();
      });
    });

    it('should load JSON', function(done) {
      assert.equal(response.config.jsonField, 'JsonValue');
      done();
    });

    it('should load XML', function(done) {
      assert.equal(response.config.xmlField, 'XMLValue');
      done();
    });

    it('should load Properties', function(done) {
      assert.equal(response.config.propertiesField, 'PropertiesValue');
      done();
    });

    it('should load YAML', function(done) {
      assert.equal(response.config.yamlField, 'YamlValue');
      done();
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
      for (var i = 0; i < response.config.array.length; i++) {
        assert.equal(response.config.array[i], array[i]);
      }
      done();
    });

    it('should manage priority between objects', function(done) {
      assert.equal(response.config.priorityTest, 'HasPriority');
      done();
    });
  });

  describe('.loadObjects()', function() {

    var configOptions;
    var response;
    before(function(done) {
      var sources = [
        {
            priorityTest: 'HasPriority',
        },
        {
          test: 'test.ObjectValue',
          testNumber: 5,
          object: {
              test1: 'object.test1.ObjectValue',
              test2: 'object.test2.ObjectValue'
          },
          array: [5, 6, 7],
          priorityTest: 'Something\'s wrong',
        }
      ];
      configOptions = {
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
        priorityTest:{
          defaultValue: null,
        }
      };
      plugin.loadObjects(sources, configOptions, function(err, configLoaded) {
        if(err) return done(err);
        response = configLoaded;
        done();
      });
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
      for (var i = 0; i < response.config.array.length; i++) {
        assert.equal(response.config.array[i], array[i]);
      }
      done();
    });

    it('should manage priority between objects', function(done) {
      assert.equal(response.config.priorityTest, 'HasPriority');
      done();
    });
  });
});
