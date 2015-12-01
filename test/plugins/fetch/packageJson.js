'use strict';

let relativePathToPlugins = '../../../lib/plugins/';

let test = require('tape');
let plugin = require('./' + relativePathToPlugins + 'fetch/packageJson');
let log = require('log-wrapper')(undefined);

let pluginName = 'package.json';
let moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(pluginName, plugin.name);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

let expected = {
  jsonField: 'JsonValue',
  test: 'Test',
  testNumber: 2,
  priorityTest: 'Something\'s wrong',
  array: [3, 4, 5],
  object: {
    test1: 'object.test1.value',
    test2: 'object.test2.value',
  },
};

test(moduleName + 'should return plugin name', function(assert) {
  callPlugin()
    .then(function onSuccess(result) {
      assert.equal(result.plugin, pluginName);
      assert.end();
    }).catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should load from path given', function(assert) {
  callPlugin()
    .then(function onSuccess(result) {
      assert.deepEqual(result.config, expected);
      assert.end();
    }).catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return empty config if file doesn\'t exist', function(assert) {
  plugin.load({
    source: {
      type: pluginName,
      priority: 50,
      path: __dirname + 'noFound',
    },
  }, log).then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.end(err);
    });
});

test(moduleName + 'should return exception if error is not ENOENT', function(assert) {
  plugin.load()
    .then(function onSuccess() {
      assert.fail(new Error('Should have send an error'));
      assert.end();
    }).catch(function onError() {
      assert.end();
    });
});

function callPlugin() {
  return new Promise(function(resolve, reject) {
    plugin.load({
      source: {
        type: pluginName,
        priority: 50,
        path: __dirname + '/../../resources/assets/package.json',
      },
    }, log).then(resolve).catch(reject);
  });
}
