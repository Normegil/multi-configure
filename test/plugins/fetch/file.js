'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/file');
var fs = require('fs');

describe('Plugin: File', function() {
  var pluginName = 'File';

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
    var resourceFolder = __dirname + '/../../resources/';
    before(function(done) {
      var sources = {
        parameters: [
          {
            type: pluginName,
            priority: 0,
            path: resourceFolder + 'config.xml',
          },
          {
            type: pluginName,
            priority: 5,
            path: resourceFolder + 'config.json',
          },
          {
            type: pluginName,
            priority: 10,
            path: resourceFolder + 'config.properties',
          },
          {
            type: pluginName,
            priority: 15,
            path: resourceFolder + 'config.yaml',
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
        priorityTest: {
          defaultValue: null,
        },
      };
      plugin.load(sources, configOptions, function(err, configLoaded) {
        if(err) return done(err);
        response = configLoaded;
        done();
      });
    });

    it('should return plugin name', function(done) {
      assert.equal(pluginName, response.plugin);
      done();
    });

    it('should handle JSON parsing errors', function(done) {
      var wrongSource = {
        parameters: [
          {
            type: pluginName,
            path: resourceFolder + 'wrong.json',
          },
        ],
      };
      plugin.load(wrongSource, configOptions, function(err) {
        if(err) return done();
        else return done(new Error('Should have failed on loading a wrong config file'));
      });
    });

    it('should handle XML parsing errors', function(done) {
      var wrongSource = {
        parameters: [
          {
            type: pluginName,
            path: resourceFolder + 'wrong.xml',
          },
        ],
      };
      plugin.load(wrongSource, configOptions, function(err) {
        if(err) return done();
        else return done(new Error('Should have failed on loading a wrong config file'));
      });
    });

    it('should handle unknown file type errors', function(done) {
      var wrongSource = {
        parameters: [
          {
            type: pluginName,
            path: resourceFolder + 'wrong.unknown',
          },
        ],
      };
      plugin.load(wrongSource, configOptions, function(err) {
        if(err) return done();
        else return done(new Error('Should have failed on loading a wrong config file type'));
      });
    });

    it('should load Json file', function(done) {
      assert.equal(response.config.jsonField, 'JsonValue');
      done();
    });

    it('should load XML file', function(done) {
      assert.equal(response.config.xmlField, 'XMLValue');
      done();
    });

    it('should load Properties file', function(done) {
      assert.equal(response.config.propertiesField, 'PropertiesValue');
      done();
    });

    it('should load YAML file', function(done) {
      assert.equal(response.config.yamlField, 'YamlValue');
      done();
    });

    it('should load root nodes', function(done) {
      assert.equal(response.config.xmlField, 'XMLValue');
      done();
    });

    it('should load numbers', function(done) {
      assert.equal(response.config.testNumber, 2);
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, 'object.test1.YAML');
      assert.equal(response.config.object.test2, 'object.test2.YAML');
      done();
    });

    it('should load array', function(done) {
      var array = [3,4,5];
      assert.equal(response.config.array.length, array.length);
      for (var i = 0; i < response.config.array.length; i++) {
        assert.equal(response.config.array[i], array[i]);
      }
      done();
    });

    it('should manage priorities between files', function(done) {
      assert.equal(response.config.priorityTest, 'HasPriority');
      done();
    });
  });
});
