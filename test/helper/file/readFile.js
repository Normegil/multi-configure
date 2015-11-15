'use strict';

var test = require('tape');
var uuid = require('node-uuid');
var pathToLib = '../../../lib/';
var fileHelper = require(pathToLib + 'helper/file');

var moduleName = 'Helper';
var functionName = '.readFile() ';
test(moduleName + functionName + 'should read existing file', function(assert) {
  fileHelper.readFile(__dirname + '/../../resources/assets/helper/toSearch.txt')
    .then(function testResult(content) {
      assert.equal(content.toString(), 'test\n');
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});
test(moduleName + functionName + 'should send an error if file doesn\'t exist', function(assert) {
  fileHelper.readFile('IDontExist.txt' + uuid.v4())
    .then(function testResult() {
      assert.fail(new Error('Should not be a success if file doesn\'t exist'));
      assert.end();
    }).catch(function onError() {
      assert.end();
    });
});
