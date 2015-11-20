'use strict';

let test = require('tape');
let config = require('../index.js');

let moduleName = 'Environment - Main';
let functionName = 'config';

test(moduleName + '.' + functionName + '() ' + 'use environment settings', function(assert) {
  process.env.NODE_ENV = 'BLABLA';
  config({
    sources: [
      {
        type: 'DefaultValues',
        priority: 10,
        environment: 'PRODUCTION',
        structure: {
          test: {
            defaultValue: 'DefaultTest',
          },
        },
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
  }).then(function testResult(result) {
    delete process.env.NODE_ENV;
    assert.equal(result.testObject, 'Test');
    assert.equal(result.test, undefined);
    assert.end();
  }).catch(function onError(err) {
    delete process.env.NODE_ENV;
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + '.' + functionName + '() ' + 'ignore environment settings if none specified', function(assert) {
  process.env.NODE_ENV = 'BLABLA';
  config({
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
  }).then(function testResult(result) {
    delete process.env.NODE_ENV;
    assert.equal(result.testObject, 'Test');
    assert.end();
  }).catch(function onError(err) {
    delete process.env.NODE_ENV;
    assert.fail(err);
    assert.end();
  });
});
