'use strict';

var _ = require('lodash');
var test = require('tape');
var config = require('../index.js');

var moduleName = 'Main';
var functionName = 'config';
test(moduleName + '.' + functionName + '() ' + 'should be a function', function(assert) {
  assert.ok(_.isFunction(config), 'config is not a function');
  assert.end();
});

test(moduleName + '.' + functionName + '() ' + 'return all default config values', function(assert) {
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
    }).then(function testResult(result) {
      assert.equal(result.test, 'DefaultTest');
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + '.' + functionName + '() ' + 'load and use custom parser plugins', function(assert) {
  config({
    plugins: [
      {
        type: 'parser',
        name: 'MyParser',
        parse: function parse() {
          return new Promise(function parse(resolve) {
            resolve({
              test: 'MyParserTest',
            });
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
  }).then(function testResult(result) {
      assert.equal(result.test, 'MyParserTest');
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + '.' + functionName + '() ' + 'use discriminator if precised', function(assert) {
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
    }).then(function testResult(result) {
      assert.equal(result.discriminator.test, 'DefaultTest');
      assert.equal(result.otherDiscriminator.test, 'DefaultTest');
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});
