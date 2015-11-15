'use strict';

var relativePathToPlugins = '../../../lib/plugins/';

var test = require('tape');
var plugin = require('./' + relativePathToPlugins + 'fetch/packageJson');

var pluginName = 'package.json';
var moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(pluginName, plugin.name);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

var expected = {
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
      assert.fail(err);
    });
});

test(moduleName + 'should load from path given', function(assert) {
  callPlugin()
    .then(function onSuccess(result) {
      assert.deepEqual(result.config, expected);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
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
    }).then(resolve).catch(reject);
  });
}
