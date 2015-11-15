'use strict';

var fs = require('fs');
var test = require('tape');
var parser = require('../../../lib/plugins/parser/json');

var name = 'json';
var moduleName = 'Plugin: ' + name.toUpperCase() + ' Parser ';
var resourceDirectory = __dirname + '/../../resources/assets/';
test(moduleName + 'should have name ' + name.toUpperCase(), function(assert) {
  assert.equal(parser.name, name.toUpperCase());
  assert.end();
});

test(moduleName + 'should be \'parser\' type', function(assert) {
  assert.equal(parser.type, 'parser');
  assert.end();
});

test(moduleName + 'should parse json file', function(assert) {
  var content = fs.readFileSync(resourceDirectory + 'config.json');
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
  parser.parse(content)
    .then(function onParsed(result) {
      assert.deepEqual(result, expected);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
    });
});

test(moduleName + 'should not parse wrong json format', function(assert) {
  var xmlContent = fs.readFileSync(resourceDirectory + 'wrong.json');
  parser.parse(xmlContent)
    .then(function onParsed() {
      assert.end();
    }).catch(function onError(err) {
      assert.notEqual(err, undefined);
      assert.notEqual(err, null);
      assert.end();
    });
});
