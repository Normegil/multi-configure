'use strict';

var fs = require('fs');
var test = require('tape');
var parser = require('../../../lib/plugins/parser/yaml');

var name = 'yaml';
var moduleName = 'Plugin: ' + name.toUpperCase() + ' Parser ';
test(moduleName + 'should have name ' + name.toUpperCase(), function(assert) {
  assert.equal(parser.name, name.toUpperCase());
  assert.end();
});

test(moduleName + 'should be \'parser\' type', function(assert) {
  assert.equal(parser.type, 'parser');
  assert.end();
});

test(moduleName + 'should parse yaml file', function(assert) {
  var content = fs.readFileSync(__dirname + '/../../resources/assets/config.yaml');
  var expected = {
    yamlField: 'YamlValue',
    testNumber: 2,
    priorityTest: 'HasPriority',
    array: [3, 4, 5],
    object: {
      test1: 'object.test1.YAML',
      test2: 'object.test2.YAML',
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
