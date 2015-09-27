'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var config = require('../index.js');

describe('Main', function() {
  describe('.config()', function() {
    it('should be a function', function(done) {
      assert.ok(u.isFunction(config), 'config is not a function');
      done();
    });

    it('return all default config values', function(done) {
      config(
        {
          structure: {
            test: {
              defaultValue: 'DefaultTest',
            },
          },
          sources: [
            {
              type: 'DefaultValues',
              priority: 5,
            },
          ],
        },
        function(err, config) {
          if (err) { return done(err); }
          assert.equal(config.test, 'DefaultTest');
          done();
        });
    });

    it('load and use custom parser plugins', function(done) {
      config(
        {
          plugins: [
            {
              type: 'parser',
              name: 'MyParser',
              parse: function parse(source, callback) {
                callback(null, {
                  test: this.name + 'Test',
                });
              },
            },
          ],
          structure: {
            test: {
              defaultValue: 'DefaultTest',
            },
          },
          sources: [
            {
              type: 'Object',
              parser: 'MyParser',
              priority: 0,
            },
          ],
        },
        function(err, config) {
          if (err) { return done(err); }
          assert.equal(config.test, 'MyParserTest');
          done();
        });
    });
  });
});
