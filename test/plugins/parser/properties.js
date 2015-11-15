'use strict';

var fs = require('fs');
var test = require('tape');
var parser = require('../../../lib/plugins/parser/properties');

var name = 'Properties';
var moduleName = 'Plugin: ' + name.toUpperCase() + ' Parser ';
var resourceDirectory = __dirname + '/../../resources/assets/';

test(moduleName + 'should have name ' + name, function(assert) {
  assert.equal(parser.name, name);
  assert.end();
});

test(moduleName + 'should be \'parser\' type', function(assert) {
  assert.equal(parser.type, 'parser');
  assert.end();
});

test(moduleName + 'should parse properties file', function(assert) {
  var content = fs.readFileSync(resourceDirectory + 'config.properties');
  var expected = {
    propertiesField: 'PropertiesValue',
    testNumber: '2',
    priorityTest: 'Something\'s wrong',
    array: ['3', '4', '5'],
    object: {
      test1: 'object.test1.PropertiesValue',
      test2: 'object.test2.PropertiesValue',
    },
  };
  parser.parse(content)
    .then(function testResult(result) {
      assert.deepEqual(result, expected);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
    });
});
test(moduleName + 'should not parse wrong properties format', function(assert) {
  var xmlContent = fs.readFileSync(resourceDirectory + 'wrong.properties');
  parser.parse(xmlContent)
    .then(function testResult() {
      assert.end();
    }).catch(function onError(err) {
      assert.notEqual(err, undefined);
      assert.notEqual(err, null);
      assert.end();
    });
});
