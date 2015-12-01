'use strict';

var test = require('tape');
var plugin = require('../../../lib/plugins/fetch/environmentVariables');
let log = require('log-wrapper')(undefined);

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
      assert.end(err);
    });
});

test(moduleName + 'should load root nodes', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.test, 'test.EnvVar');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should load numbers', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.testNumber, 2);
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
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
      assert.end(err);
    });
});

test(moduleName + 'should load array', function(assert) {
  callPlugin(structure)
    .then(function onSuccess(result) {
      assert.equal(result.config.array, '[1, 2, 3]');
      assert.end();
    })
    .catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return empty object if no environment variable found', function(assert) {
  plugin.load({
    source: {
      type: pluginName,
      priority: 0,
      structure: {
        test: {
          envVar: 'TEST_ENV_VAR',
        },
      },
    },
  }, log).then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.end(err);
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
      source: {
        type: pluginName,
        priority: 0,
        structure: structure,
      },
    }, log).then(function onSuccess(result) {
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
