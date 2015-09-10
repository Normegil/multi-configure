'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var config = require('../index.js');

describe('Main', function() {
  describe('\'config\' function', function() {
    var configOptions;

    before(function(done) {
      configOptions = {
        test: {
          default: 'Test',
          sources: [
            {
              type: 'commandLine',
              priority: 50,
              option: '-t --Test',
            },
            {
              type: 'environment',
              priority: 100,
              name: 'TEST',
            },
            {
              type: 'JSON',
              priority: 150,
              path: 'config.test',
            },
            {
              type: 'XML',
              priority: 175,
              path: 'config.test',
            },
            {
              type: 'plainText',
              priority: 200,
              key: 'test',
            },
          ],
        },
      };
      done();
    });

    after(function(done) {
      configOptions = undefined;
      done();
    });

    it('should be a function', function(done) {
      assert.ok(u.isFunction(config), 'config is not a function');
      done();
    });

    it('return all default config values', function(done) {
      var config = config(configOptions);
      assert.equal('DefaultTest', config.test);
      done();
    });
  });
});
