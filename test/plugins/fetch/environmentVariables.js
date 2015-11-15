'use strict';

var test = require('tape');
var plugin = require('../../../lib/plugins/fetch/environmentVariables');

var pluginName = 'EnvironmentVariables';
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
  envVarPrefix: 'CONFIG_MANAGER_TEST_',
  test: {
    envVar: 'TEST',
  },
  testNumber: {
    envVar: 'TEST_NUMBER',
  },
  object: {
    envVarPrefix: 'OBJECT_',
    test1: {
      envVar: 'TEST1',
    },
    test2: {
      envVar: 'TEST2',
    },
  },
  array: {
    envVar: 'ARRAY',
  },
};
test(moduleName + 'should return plugin name', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(pluginName, result.plugin);
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should load root nodes', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.test, 'test.EnvVar');
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should load numbers', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.testNumber, 2);
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should load objects', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.object.test1, 'object.test1.EnvVar');
      assert.equal(result.config.object.test2, 'object.test2.EnvVar');
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should load array', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.array, '[1, 2, 3]');
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

function callPlugin(structure) {
  process.env.CONFIG_MANAGER_TEST_TEST = 'test.EnvVar';
  process.env.CONFIG_MANAGER_TEST_TEST_NUMBER = '2';
  process.env.CONFIG_MANAGER_TEST_OBJECT_TEST1 = 'object.test1.EnvVar';
  process.env.CONFIG_MANAGER_TEST_OBJECT_TEST2 = 'object.test2.EnvVar';
  process.env.CONFIG_MANAGER_TEST_ARRAY = '[1, 2, 3]';

  return new Promise(function(resolve, reject) {
    plugin.load({
      structure: structure,
      sources: {
        type: pluginName,
        priority: 0,
      },
    }).then(function onSuccess(result) {
      delete process.env.CONFIG_MANAGER_TEST_TEST;
      delete process.env.CONFIG_MANAGER_TEST_TEST_NUMBER;
      delete process.env.CONFIG_MANAGER_TEST_OBJECT_TEST1;
      delete process.env.CONFIG_MANAGER_TEST_OBJECT_TEST2;
      delete process.env.CONFIG_MANAGER_TEST_ARRAY;
      resolve(result);
    }).catch(function onError(err) {
      delete process.env.CONFIG_MANAGER_TEST_TEST;
      delete process.env.CONFIG_MANAGER_TEST_TEST_NUMBER;
      delete process.env.CONFIG_MANAGER_TEST_OBJECT_TEST1;
      delete process.env.CONFIG_MANAGER_TEST_OBJECT_TEST2;
      delete process.env.CONFIG_MANAGER_TEST_ARRAY;
      reject(err);
    });
  });
}
