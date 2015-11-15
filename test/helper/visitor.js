'use strict';

var test = require('tape');
var set = require('path-explorer').set;
var visitor = require('../../lib/helper/visitor.js');

var moduleName = 'Visitor';
var functionName = '.visit() ';
test(moduleName + functionName + 'should send error when error during enter object', function(assert) {
  visitor.visit({test: 'test'}, '', {
    enterObject: function() {
      return new Promise(function(resolve, reject) {
        reject(new Error('fake error'));
      });
    },
  }).then(function testResult() {
    assert.fail(new Error('An error should have been received'));
    assert.end();
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + functionName + 'should send error when error during quit object', function(assert) {
  visitor.visit({test: 'test'}, '', {
    quitObject: function() {
      return new Promise(function(resolve, reject) {
        reject(new Error('fake error'));
      });
    },
  }).then(function testResult() {
    assert.fail(new Error('An error should have been received'));
    assert.end();
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + functionName + 'should send error when error during visit leaf', function(assert) {
  visitor.visit({test: 'test'}, '', {
    onLeaf: function() {
      return new Promise(function(resolve, reject) {
        reject(new Error('fake error'));
      });
    },
  }).then(function testResult() {
    assert.fail(new Error('An error should have been received'));
    assert.end();
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + functionName + 'should visit empty object', function(assert) {
  visitor.visit({}, '', {
    onLeaf: function() {
      return new Promise(function(resolve, reject) {
        reject(new Error('No leaf in an empty object'));
      });
    },
    enterObject: function(toVisit, path) {
      return new Promise(function(resolve) {
        assert.deepEqual({}, toVisit);
        assert.equal(path, '');
        resolve();
      });
    },
    quitObject: function(toVisit, path) {
      return new Promise(function(resolve) {
        assert.deepEqual({}, toVisit);
        assert.equal(path, '');
        resolve();
      });
    },
  }).then(function testResult() {
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + functionName + 'should visit all objects properties', function(assert) {
  var toVisit = {
    testProperty: 'test',
    testProperty2: 'test1',
  };
  var target = {};
  visitor.visit(toVisit, '', {
      onLeaf: function onLeaf(value, path) {
        return new Promise(function(resolve, reject) {
          set({
            target: target,
            path: path,
            value: true,
          }).then(function onSuccess(result) {
            target = result;
            resolve(result);
          }).catch(reject);
        });
      },
    }).then(function testResult() {
      assert.equal(target.testProperty, true, 'Difference in testProperty1');
      assert.equal(target.testProperty2, true, 'Difference in testProperty2');
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + functionName + 'should visit all objects', function(assert) {
  var toVisit = {
    object1: {
      testProperty: 'test',
    },
    object2: {
      testProperty2: 'test1',
    },
  };
  visitor.visit(toVisit, '', {
    enterObject: function(toVisit) {
      return new Promise(function(resolve) {
        toVisit.entered = true;
        return resolve();
      });
    },
    quitObject: function(toVisit) {
      return new Promise(function(resolve) {
        toVisit.quitted = true;
        return resolve();
      });
    },
  }).then(function testResult() {
    assert.ok(toVisit.entered, 'Root not entered');
    assert.ok(toVisit.object1.entered, 'Object1 not entered');
    assert.ok(toVisit.object2.entered, 'Object2 not entered');
    assert.ok(toVisit.quitted, 'Root not quitted');
    assert.ok(toVisit.object1.quitted, 'Object1 not quitted');
    assert.ok(toVisit.object2.quitted, 'Object2 not quitted');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + functionName + 'should visit array as values', function(assert) {
  var toVisit = {test: [1, 2, 3]};
  var target;
  visitor.visit(toVisit, '', {
    onLeaf: function(value, path) {
      return new Promise(function(resolve, reject) {
        set({
          target: target,
          path: path,
          value: true,
        }).then(function onSuccess(result) {
          target = result;
          resolve(result);
        }).catch(reject);
      });
    },
  }).then(function testResult() {
    assert.equal(target.test, true);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});
