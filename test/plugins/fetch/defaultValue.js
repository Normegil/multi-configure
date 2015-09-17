'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/defaultValue');

describe('Plugin: Defaul Values', function() {
  var pluginName = 'DefaultValues';

  it('should be named \'' + pluginName + '\'', function(done) {
    assert.equal(pluginName, plugin.name);
    done();
  });

  it('should be a \'fetch\' type plugin', function(done) {
    assert.equal('fetch', plugin.type);
    done();
  });

  describe('\'load\' method', function() {
    var configOptions;
    var response;
    before(function(done) {
      configOptions = {
        test: {
          defaultValue: 'test.DefaultValue',
        },
        testNumber: {
          defaultValue: 0,
        },
        object: {
          test1: {
            defaultValue: 'object.test1.DefaultValue1',
          },
          test2: {
            defaultValue: 'object.test2.DefaultValue1',
          },
        },
        array: {
          defaultValue: [1, 2, 3],
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
      assert.equal(response.config.test, configOptions.test.defaultValue);
      done();
    });

    it('should return numbers', function(done) {
      assert.equal(response.config.testNumber, configOptions.testNumber.defaultValue);
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, configOptions.object.test1.defaultValue);
      assert.equal(response.config.object.test2, configOptions.object.test2.defaultValue);
      done();
    });

    it('should load array', function(done) {
      assert.equal(response.config.array, configOptions.array.defaultValue);
      done();
    });
  });
});
