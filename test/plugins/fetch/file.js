'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/file');

var pluginName = 'File';
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
      priorityTest: {
        defaultValue: null,
      },
    };
    var response;
    var resourceFolder = __dirname + '/../../resources/assets/';

    before(function(done) {
      plugin.load(
        {},
        {
          config: config,
          source: {
              type: pluginName,
              priority: 0,
              path: resourceFolder + 'config.json',
          },
        },
        function(err, result) {
          if(err) return done(err);
          response = result;
          done();
        });
    });

    it('should return plugin name', function(done) {
      assert.equal(pluginName, response.plugin);
      done();
    });

    it('should load root nodes', function(done) {
      assert.equal(response.config.test, 'Test');
      done();
    });

    it('should load numbers', function(done) {
      assert.equal(response.config.testNumber, 2);
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, 'object.test1.value');
      assert.equal(response.config.object.test2, 'object.test2.value');
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

    it('should handle unknown file type errors', function(done) {
      plugin.load(
        {}, {
          config: config,
          source: {
            type: pluginName,
            path: resourceFolder + 'wrong.unknown',
          }
        }, function(err) {
          if(err) return done();
          else return done(new Error('Should have failed on loading a wrong config file type'));
        });
    });

    describe('- JSON Specific', function() {

      var response;
      before(function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
                type: pluginName,
                priority: 0,
                path: resourceFolder + 'config.json',
            },
          },
          function(err, result) {
            if(err) return done(err);
            response = result;
            done();
          });
      });

      it('should load Json file', function(done) {
        assert.equal(response.config.jsonField, 'JsonValue');
        done();
      });

      it('should handle parsing errors', function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
              type: pluginName,
              path: resourceFolder + 'wrong.json',
            }
          },
          function(err) {
            if(err) return done();
            else return done(new Error('Should have failed on loading a wrong config file'));
          });
      });
    });

    describe('- XML Specific', function() {

      var response;
        before(function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
                type: pluginName,
                priority: 0,
                path: resourceFolder + 'config.xml',
            },
          },
          function(err, result) {
            if(err) return done(err);
            response = result;
            done();
          });
      });

      it('should load XML file', function(done) {
        assert.equal(response.config.xmlField, 'XMLValue');
        done();
      });

      it('should handle parsing errors', function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
              type: pluginName,
              path: resourceFolder + 'wrong.xml',
            }
          },
          function(err) {
            if(err) return done();
            else return done(new Error('Should have failed on loading a wrong config file'));
          });
      });
    });

    describe('- Properties Specific', function() {

      var response;
      before(function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
                type: pluginName,
                priority: 0,
                path: resourceFolder + 'config.properties',
            },
          },
          function(err, result) {
            if(err) return done(err);
            response = result;
            done();
          });
      });

      it('should load Properties file', function(done) {
        assert.equal(response.config.propertiesField, 'PropertiesValue');
        done();
      });
    });

    describe('- YAML Specific', function() {
      var response;
      before(function(done) {
        plugin.load(
          {},
          {
            config: config,
            source: {
                type: pluginName,
                priority: 0,
                path: resourceFolder + 'config.yaml',
            },
          },
          function(err, result) {
            if(err) return done(err);
            response = result;
            done();
          });
      });

      it('should load YAML file', function(done) {
        assert.equal(response.config.yamlField, 'YamlValue');
        done();
      });
    });
  });
});
