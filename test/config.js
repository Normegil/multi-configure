'use strict';

var _ = require('underscore');
var assert = require('chai').assert;
var config = require('../index.js');
var rawParser = require('../lib/plugins/parser/raw');

describe('Main', function() {
  describe('.config()', function() {
    it('should be a function', function(done) {
      assert.ok(_.isFunction(config), 'config is not a function');
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

    it('use discriminator if precised', function(done) {
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
              discriminator: 'discriminator',
            },
            {
              type: 'DefaultValues',
              priority: 5,
              discriminator: 'otherDiscriminator',
            },
          ],
        },
        function(err, config) {
          if (err) { return done(err); }
          assert.equal(config.discriminator.test, 'DefaultTest');
          assert.equal(config.otherDiscriminator.test, 'DefaultTest');
          done();
        });
    });

    describe('- Environment', function() {
      before(function(done) {
        process.env.NODE_ENV = 'BLABLA';
        done();
      });

      after(function(done) {
        delete process.env.NODE_ENV;
        done();
      });

      it('use environment settings', function(done) {
        config(
          {
            plugins: [rawParser],
            structure: {
              test: {
                defaultValue: 'DefaultTest',
              },
            },
            sources: [
              {
                type: 'DefaultValues',
                priority: 5,
                environment: 'PRODUCTION',
              },
              {
                type: 'Object',
                priority: 5,
                environment: 'BLABLA',
                parser: 'RAW',
                object: {
                  testObject: 'Test',
                },
              },
            ],
          },
          function(err, config) {
            if (err) { return done(err); }
            assert.equal(config.testObject, 'Test');
            assert.equal(config.test, undefined);
            done();
          });
      });

      it('ignore environment settings if none specified', function(done) {
        config(
          {
            plugins: [rawParser],
            structure: {
              test: {
                defaultValue: 'DefaultTest',
              },
            },
            sources: [
              {
                type: 'Object',
                priority: 5,
                parser: 'RAW',
                object: {
                  testObject: 'Test',
                },
              },
            ],
          },
          function(err, config) {
            if (err) { return done(err); }
            assert.equal(config.testObject, 'Test');
            done();
          });
      });
    });
  });
});
