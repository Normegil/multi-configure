'use strict';

var fs = require('fs');
var test = require('tape');
var parser = require('../../../lib/plugins/parser/cson');

var name = 'cson';

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

test(moduleName + 'should parse cson file', function(assert) {
  var content = fs.readFileSync(resourceDirectory + 'config.cson');
  var expected = {
    csonField: 'CsonValue',
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
    .then(function testResult(result) {
      assert.deepEqual(result, expected);
      assert.end();
    })
    .catch(function onError(err) {
      assert.fail(err);
    });
});

test(moduleName + 'should not parse wrong cson format', function(assert) {
  var xmlContent = fs.readFileSync(resourceDirectory + 'wrong.xml');
  parser.parse(xmlContent).then(function onSuccess() {
    assert.end();
  }).catch(function onError(err) {
    assert.notEqual(err, undefined);
    assert.notEqual(err, null);
    assert.end();
  });
});
