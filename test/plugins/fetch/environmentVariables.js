'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/environmentVariables');

describe('Plugin: Environment Variables', function() {
  var pluginName = 'Environment Variables';

  it('should be named \'' + pluginName + '\'', function(done) {
    assert.equal(pluginName, plugin.name);
    done();
  });

  it('should be a \'fetch\' type plugin', function(done) {
    assert.equal('fetch', plugin.type);
    done();
  });

  describe('.load()', function() {
    var variablePrefix = 'CONFIG_MANAGER_TEST_';

    var configOptions;
    var response;
    before(function(done) {
      configOptions = {
        test: {
          defaultValue: null,
          environmentVariable: variablePrefix + 'TEST',
        },
        testNumber: {
          defaultValue: null,
          environmentVariable: variablePrefix + 'TEST_NUMBER',
        },
        object: {
          test1: {
            defaultValue: null,
            environmentVariable: variablePrefix + 'OBJECT_TEST1',
          },
          test2: {
            defaultValue: null,
            environmentVariable: variablePrefix + 'OBJECT_TEST2',
          },
        },
        array: {
          defaultValue: null,
          environmentVariable: variablePrefix + 'ARRAY',
        },
      };
      plugin.load({}, configOptions, function(err, configLoaded) {
        if(err) return done(err);
        response = configLoaded;
        done();
      });
    });

    it('should return plugin name', function(done) {
      assert.equal(pluginName, response.plugin);
      done();
    });

    it('should load root nodes', function(done) {
      assert.equal(response.config.test, 'test.EnvVar');
      done();
    });

    it('should load numbers', function(done) {
      assert.equal(response.config.testNumber, 'testNumber.EnvVar');
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, 'object.test1.EnvVar');
      assert.equal(response.config.object.test2, 'object.test2.EnvVar');
      done();
    });

    it('should load array', function(done) {
      assert.equal(response.config.array, '[1, 2, 3]');
      done();
    });
  });
});
