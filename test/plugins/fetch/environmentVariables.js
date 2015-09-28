'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/environmentVariables');

var pluginName = 'EnvironmentVariables';
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
    var structure = {
      envVarPrefix: 'CONFIG_MANAGER_TEST_',
      test: {
        envVar: 'TEST',
      },
      testNumber: {
        envVar: 'TEST_NUMBER',
      },
      priorityTest: {
        envVar: 'PRIORITY_TEST',
      },
      object: {
        envVarPrefix: 'OBJECT_',
        test1: {
          envVar: 'TEST1',
        },
        test2: {
          envVar: 'TEST2',
        },
      },
      array: {
        envVar: 'ARRAY',
      },
    };
    var response;
    before(function(done) {
      plugin.load(
        {
          structure: structure,
          sources: {
            type: pluginName,
            priority: 20,
          },
        },
        function(err, result) {
          if (err) {return done(err);}
          response = result;
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
