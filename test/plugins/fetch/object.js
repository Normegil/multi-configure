'use strict';

var pathToLib = '../../../lib/';
var relativePathToPlugins = pathToLib + 'plugins/';
var relativePathToParsers = relativePathToPlugins + 'parser/';

var fs = require('fs');
var test = require('tape');
var plugin = require('./' + relativePathToPlugins + 'fetch/object');
var jsonParser = require('./' + relativePathToParsers + 'json');
var xmlParser = require('./' + relativePathToParsers + 'xml');
var propertiesParser = require('./' + relativePathToParsers + 'properties');
var yamlParser = require('./' + relativePathToParsers + 'yaml');
var csonParser = require('./' + relativePathToParsers + 'cson');

var pluginName = 'Object';
var moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(pluginName, plugin.name);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

test(moduleName + 'should return plugin name', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 50,
    parser: 'RAW',
    object: {
      test: 'test.ObjectValue',
      testNumber: 5,
      object: {
        test1: 'object.test1.ObjectValue',
        test2: 'object.test2.ObjectValue',
      },
      array: [5, 6, 7],
    },
  }).then(function onSuccess(result) {
    assert.equal(result.plugin, pluginName);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load root nodes', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 50,
    parser: 'RAW',
    object: {
      test: 'test.ObjectValue',
      testNumber: 5,
      object: {
        test1: 'object.test1.ObjectValue',
        test2: 'object.test2.ObjectValue',
      },
      array: [5, 6, 7],
    },
  }).then(function onSuccess(result) {
    assert.equal(result.config.test, 'test.ObjectValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load numbers', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 50,
    parser: 'RAW',
    object: {
      test: 'test.ObjectValue',
      testNumber: 5,
      object: {
        test1: 'object.test1.ObjectValue',
        test2: 'object.test2.ObjectValue',
      },
      array: [5, 6, 7],
    },
  }).then(function onSuccess(result) {
    assert.equal(result.config.testNumber, 5);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load objects', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 50,
    parser: 'RAW',
    object: {
      test: 'test.ObjectValue',
      testNumber: 5,
      object: {
        test1: 'object.test1.ObjectValue',
        test2: 'object.test2.ObjectValue',
      },
      array: [5, 6, 7],
    },
  }).then(function onSuccess(result) {
    assert.equal(result.config.object.test1, 'object.test1.ObjectValue');
    assert.equal(result.config.object.test2, 'object.test2.ObjectValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load array', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 50,
    parser: 'RAW',
    object: {
      test: 'test.ObjectValue',
      testNumber: 5,
      object: {
        test1: 'object.test1.ObjectValue',
        test2: 'object.test2.ObjectValue',
      },
      array: [5, 6, 7],
    },
  }).then(function onSuccess(result) {
    assert.deepEqual(result.config.array, [5, 6, 7]);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

var resourceDirectoryName = __dirname + '/../../resources/assets/';
test(moduleName + 'should load JSON', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'JSON',
    object: fs.readFileSync(resourceDirectoryName + 'config.json'),
  }).then(function onSuccess(result) {
    assert.equal(result.config.jsonField, 'JsonValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load XML', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'XML',
    object: fs.readFileSync(resourceDirectoryName + 'config.xml'),
  }).then(function onSuccess(result) {
    assert.equal(result.config.xmlField, 'XMLValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load Properties', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'Properties',
    object: fs.readFileSync(resourceDirectoryName + 'config.properties'),
  }).then(function onSuccess(result) {
    assert.equal(result.config.propertiesField, 'PropertiesValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load YAML', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'YAML',
    object: fs.readFileSync(resourceDirectoryName + 'config.yaml'),
  }).then(function onSuccess(result) {
    assert.equal(result.config.yamlField, 'YamlValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should load CSON', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'CSON',
    object: fs.readFileSync(resourceDirectoryName + 'config.cson'),
  }).then(function onSuccess(result) {
    assert.equal(result.config.csonField, 'CsonValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should return empty object if object is undefined', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'CSON',
    object: undefined,
  }).then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should return empty object if object is null', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'CSON',
    object: null,
  }).then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should return empty object if object is empty', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    parser: 'CSON',
    object: '',
  }).then(function onSuccess(result) {
      assert.deepEqual(result.config, {});
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

function callPlugin(sources) {
  return plugin.load({
    plugins: [csonParser, yamlParser, xmlParser, propertiesParser, jsonParser],
    source: sources,
  });
}
