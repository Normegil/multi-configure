'use strict';

var assert = require('chai').assert;
var plugin = require('../../../lib/plugins/fetch/defaultValue');

var pluginName = 'DefaultValues';

describe('Plugin: ' + pluginName, function() {
  it('should be named \'' + pluginName + '\'', function(done) {
    assert.equal(pluginName, plugin.name);
    done();
  });

  it('should be a \'fetch\' type plugin', function(done) {
    assert.equal('fetch', plugin.type);
    done();
  });

  describe('.load())', function() {
    var config = {
      test: {
        defaultValue: 'test.DefaultValue',
      },
      testNumber: {
        defaultValue: 0,
      },
      priorityTest: {
        defaultValue: 'WrongValue',
      },
      object: {
        test1: {
          defaultValue: 'object.test1.DefaultValue1',
        },
        test2: {
          defaultValue: 'object.test2.DefaultValue2',
        },
      },
      array: {
        defaultValue: [1, 2, 3],
      },
    };
    var response;
    before(function(done) {
      plugin.load(
        {
          config: config,
          sources: {
            type: pluginName,
            priority: 0,
          },
        }, function(err, result) {
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
      assert.equal(response.config.test, config.test.defaultValue);
      done();
    });

    it('should return numbers', function(done) {
      assert.equal(response.config.testNumber, config.testNumber.defaultValue);
      done();
    });

    it('should load objects', function(done) {
      assert.equal(response.config.object.test1, config.object.test1.defaultValue);
      assert.equal(response.config.object.test2, config.object.test2.defaultValue);
      done();
    });

    it('should load array', function(done) {
      assert.equal(response.config.array, config.array.defaultValue);
      done();
    });
  });
});
