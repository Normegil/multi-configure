'use strict';

let test = require('tape');
let log = require('log-wrapper')(undefined);
let merge = require('../lib/merge');

var moduleName = '.merge() ';
let sources = [
  {
    type: 'DefaultValues',
    priority: 0,
    id: '1',
  },
  {
    type: 'Objects',
    parser: 'RAW',
    id: '3',
  },
  {
    type: 'Objects',
    parser: 'RAW',
    priority: 10,
    id: '5',
  },
];
let results = [
  {
    type: 'DefaultValues',
    sourceID: '1',
    config: {
      test: 'test.DefaultValue',
      testNumber: 0,
      priorityTest: 'WrongDefaultValue',
      object: {
        test1: 'object.test1.DefaultValue',
      },
      array: [5, 6, 7],
    },
  },
  {
    plugin: 'Objects',
    sourceID: '3',
    config: {
      object: {
        test1: 'object.test1.ObjectValue',
        test4: 'object.test4.ObjectValue',
      },
    },
  },
  {
    plugin: 'Objects',
    sourceID: '5',
    config: {
      test: 'test.ObjectValue',
      testNumber: 0,
      priorityTest: 'RightDefaultValue',
      object: {
        test2: 'object.test2.ObjectValue',
        test3: 'object.test3.ObjectValue',
      },
      array: [5, 6, 7],
    },
  },
];

test(moduleName + 'return a config', function(assert) {
  merge(sources, results, log)
    .then(function testResult(result) {
      assert.equal(result.test, 'test.ObjectValue');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'can parse sub levels', function(assert) {
  merge(sources, results, log)
    .then(function testResult(result) {
      assert.equal(result.object.test1, 'object.test1.DefaultValue');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'can prioritize sources', function(assert) {
  merge(sources, results, log)
    .then(function testResult(result) {
      assert.equal(result.priorityTest, 'RightDefaultValue');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'does fill all parameters (without conflicts) with different plugins results', function(assert) {
  merge(sources, results, log)
    .then(function testResult(result) {
      assert.equal(result.object.test1, 'object.test1.DefaultValue');
      assert.equal(result.object.test2, 'object.test2.ObjectValue');
      assert.equal(result.object.test3, 'object.test3.ObjectValue');
      assert.equal(result.object.test4, 'object.test4.ObjectValue');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'does work with arrays as config parameter', function(assert) {
  merge(sources, results, log)
    .then(function testResult(result) {
      let array = [5, 6, 7];
      assert.deepEqual(result.array, array);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});
