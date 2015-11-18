'use strict';

var relativePathToPlugins = '../../../lib/plugins/';
var relativePathToParsers = relativePathToPlugins + 'parser/';
var test = require('tape');
var plugin = require(relativePathToPlugins + 'fetch/file');
var jsonParser = require('./' + relativePathToParsers + 'json');
var xmlParser = require('./' + relativePathToParsers + 'xml');
var propertiesParser = require('./' + relativePathToParsers + 'properties');
var yamlParser = require('./' + relativePathToParsers + 'yaml');
var csonParser = require('./' + relativePathToParsers + 'cson');

var pluginName = 'File';
var moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(pluginName, plugin.name);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

var resourceFolder = __dirname + '/../../resources/assets/';
test(moduleName + 'should return plugin name', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: __dirname + '/../../resources/assets/config.json',
  }).then(function onSuccess(result) {
    assert.equal(pluginName, result.plugin);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load root nodes', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: __dirname + '/../../resources/assets/config.json',
  }).then(function onSuccess(result) {
    assert.equal(result.config.test, 'Test');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load numbers', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: __dirname + '/../../resources/assets/config.json',
  }).then(function onSuccess(result) {
    assert.equal(result.config.testNumber, 2);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load objects', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: __dirname + '/../../resources/assets/config.json',
  }).then(function onSuccess(result) {
    assert.equal(result.config.object.test1, 'object.test1.value');
    assert.equal(result.config.object.test2, 'object.test2.value');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load array', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: __dirname + '/../../resources/assets/config.json',
  }).then(function onSuccess(result) {
    assert.deepEqual(result.config.array, [3,4,5]);
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should handle unknown file type errors', function(assert) {
  callPlugin({
    type: pluginName,
    path: resourceFolder + 'wrong.unknown',
  }).then(function onSuccess() {
    assert.fail(new Error('Should have failed on loading a wrong config file type'));
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + 'should load Json file', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'config.json',
  }).then(function onSuccess(result) {
    assert.equal(result.config.jsonField, 'JsonValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should handle JSON parsing errors', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'wrong.json',
  }).then(function onSuccess() {
    assert.fail(new Error('Should have failed on loading a wrong config file'));
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + 'should load XML file', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'config.xml',
  }).then(function onSuccess(result) {
    assert.equal(result.config.xmlField, 'XMLValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should handle XML parsing errors', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'wrong.xml',
  }).then(function onSuccess() {
    assert.fail(new Error('Should have failed on loading a wrong config file'));
  }).catch(function onError() {
    assert.end();
  });
});

test(moduleName + 'should load Properties file', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'config.properties',
  }).then(function onSuccess(result) {
    assert.equal(result.config.propertiesField, 'PropertiesValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load YAML file', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'config.yaml',
  }).then(function onSuccess(result) {
    assert.equal(result.config.yamlField, 'YamlValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should load CSON file', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'config.cson',
  }).then(function onSuccess(result) {
    assert.equal(result.config.csonField, 'CsonValue');
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
  });
});

test(moduleName + 'should return empty object if no file found', function(assert) {
  callPlugin({
    type: pluginName,
    priority: 0,
    path: resourceFolder + 'notExisting.notFound',
  }).then(function onSuccess(result) {
    assert.deepEqual(result.config, {});
    assert.end();
  }).catch(function onError(err) {
    assert.fail(err);
    assert.end();
  });
});

test(moduleName + 'should return exception if error is not ENOENT', function(assert) {
  callPlugin({}).then(function onSuccess() {
    assert.fail(new Error('Should send an error'));
    assert.end();
  }).catch(function onError() {
    assert.end();
  });
});

function callPlugin(sources) {
  return plugin.load({
    plugins: [csonParser, yamlParser, xmlParser, propertiesParser, jsonParser],
    source: sources,
  });
}
