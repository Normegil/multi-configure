'use strict';

var assert = require('chai').assert;
var _ = require('underscore');
var h = require('../../../lib/helper');
var plugin = require('../../../lib/plugins/fetch/commandLine');

var pluginName = 'Command Line';

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
    var expected = {
      test: 'test.cmdVal',
      testNumber: 42,
      testBoolean: true,
      testBoolean3: true,
      testSeparatedBoolean: true,
      object: {
        test1: 'object.test1.cmdVal',
        test2: 'object.test2.cmdVal',
      },
      array: [1, 2, 3],
      oneArgArray: [4],
    };
    var structure = {
      test: {
        cmdOpts: 'test',
      },
      testNumber: {
        cmdOpts: 'testNumber',
      },
      testBoolean: {
        cmdOpts: 'x',
      },
      testBoolean2: {
        cmdOpts: 'y',
      },
      testBoolean3: {
        cmdOpts: 'z',
      },
      testSeparatedBoolean: {
        cmdOpts: 'u',
      },
      object: {
        test1: {
          cmdOpts: 'object-test1',
        },
        test2: {
          cmdOpts: 'object-test2',
        },
      },
      array: {
        cmdOpts: ['array', 'a'],
        isArray: true,
      },
      oneArgArray: {
        cmdOpts: ['oneArgArray'],
        isArray: true,
      },
    };
    var response;
    var originalArgv;
    before(function(done) {
      originalArgv = process.argv;
      process.argv = [
        'npm', 'test',
        '--test', 'test.cmdVal',
        '-xz',
        '-u',
        '--testNumber', '42',
        '--object-test1', 'object.test1.cmdVal',
        '--object-test2', 'object.test2.cmdVal',
        '--array', '1',
        '-a', '2',
        '--array', '3',
        '--oneArgArray', '4',
      ];

      plugin.load(
        {
          structure: structure,
          sources: {
            type: pluginName,
            priority: 0,
          },
        }, function(err, result) {
          if (err) {return done(err);}
          response = result;

          if (h.exist(response.config.array) && Array.isArray(response.config.array)) {
            response.config.array = _.sortBy(response.config.array, function(value) {
              return value;
            });
          }

          done();
        });
    });

    after(function(done) {
      process.argv = originalArgv;
      done();
    });

    it('should return plugin name', function(done) {
      assert.equal(pluginName, response.plugin);
      done();
    });

    it('should return a config with value from command line', function(done) {
      assert.deepEqual(expected, response.config);
      done();
    });
  });
});
