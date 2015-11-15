'use strict';

let test = require('tape');
let path = require('path');
let uuid = require('node-uuid');
let pathToLib = '../../../lib/';
let fileHelper = require(pathToLib + 'helper/file');

let moduleName = 'Helper';
let functionName = '.getFileFromHierarchy() ';
let pathToFile = path.normalize(__dirname + '/../../resources/assets/helper/toSearch.txt');
test(moduleName + functionName + 'should get file from sub directory', function(assert) {
  fileHelper.getFileFromHierarchy(__dirname + '/../../resources/assets/helper/testFolder/', 'toSearch.txt')
    .then(function testResult(content) {
      assert.equal(content, pathToFile);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});
test(moduleName + functionName + 'should get file from directory given', function(assert) {
  fileHelper.getFileFromHierarchy(__dirname + '/../../resources/assets/helper/', 'toSearch.txt')
    .then(function testResult(content) {
      assert.equal(path.normalize(content), pathToFile);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});
test(moduleName + functionName + 'should stop if not found in root directory', function(assert) {
  fileHelper.getFileFromHierarchy('/', 'IDontExist.txt' + uuid.v4())
    .then(function testResult(content) {
      assert.equal(content, undefined);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});
