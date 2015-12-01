'use strict';

var test = require('tape');
var pathToLib = '../../../lib/';
var plugin = require(pathToLib + 'plugins/fetch/defaultValue');
let log = require('log-wrapper')(undefined);

var pluginName = 'DefaultValues';
var moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(pluginName, plugin.name);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

var structure = {
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

test(moduleName + 'should return plugin name', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(pluginName, result.plugin);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should load root nodes', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.test, structure.test.defaultValue);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return numbers', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.testNumber, structure.testNumber.defaultValue);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should load objects', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.object.test1, structure.object.test1.defaultValue);
      assert.equal(result.config.object.test2, structure.object.test2.defaultValue);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should load array', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.array, structure.array.defaultValue);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return empty object if no default value found', function(assert) {
  callPlugin({test: {}})
    .then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return value of deeply nested structure', function(assert) {
  callPlugin({
    test: {
      test1: {
        test2: {
          test3: {
            defaultValue: 'testValue',
          },
        },
      },
    },
  })
    .then(function onSuccess(result) {
      assert.equal(result.config.test.test1.test2.test3, 'testValue');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

function callPlugin(structure) {
  return new Promise(function(resolve, reject) {
    plugin.load({
      source: {
        type: pluginName,
        priority: 0,
        structure: structure,
      },
    }, log).then(resolve).catch(reject);
  });
}
