'use strict';

var test = require('tape');
var h = require('../../lib/helper');

var moduleName = 'Helper';
var existFunctionName = '.exist() ';
test(moduleName + existFunctionName + 'should be false if undefined', function(assert) {
  assert.equal(h.exist(undefined), false);
  assert.end();
});

test(moduleName + existFunctionName + 'should be false if null', function(assert) {
  assert.equal(h.exist(null), false);
  assert.end();
});

test(moduleName + existFunctionName + 'should be true if array', function(assert) {
  assert.equal(h.exist([]), true);
  assert.end();
});

test(moduleName + existFunctionName + 'should be false if object', function(assert) {
  assert.equal(h.exist({}), true);
  assert.end();
});

test(moduleName + existFunctionName + 'should be false if value', function(assert) {
  assert.equal(h.exist(0), true);
  assert.end();
});

var isObjectFunctionName = '.isObject() ';
test(moduleName + isObjectFunctionName + 'should be true when object', function(assert) {
  assert.ok(h.isObject({
    test: 'Test',
  }));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be true when empty object', function(assert) {
  assert.ok(h.isObject({}));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be true when nested object', function(assert) {
  assert.ok(h.isObject({
    object1: {
      test: 'Test',
    },
    object2: {
      test2: 2,
    },
  }));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be false when number', function(assert) {
  assert.notOk(h.isObject(2));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be false when strings', function(assert) {
  assert.notOk(h.isObject('Test'));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be false when function', function(assert) {
  assert.notOk(h.isObject(function test() {}));
  assert.end();
});

test(moduleName + isObjectFunctionName + 'should be false when array', function(assert) {
  assert.notOk(h.isObject([1, 2, 3]));
  assert.end();
});
