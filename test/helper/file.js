'use strict';

var assert = require('chai').assert;
var uuid = require('node-uuid');
var fileHelper = require('../../lib/helper/file');

describe('Helper', function() {
  describe('.getFileFromHierarchy()', function() {
    it('should get file from sub directory', function(done) {
      fileHelper.getFileFromHierarchy(__dirname + '/../resources/assets/helper/testFolder/', 'toSearch.txt', function onLoad(err, content) {
        if (err) {return done(err);}
        assert.equal(content, 'test\n');
        done();
      });
    });
    it('should get file from directory given', function(done) {
      fileHelper.getFileFromHierarchy(__dirname + '/../resources/assets/helper/', 'toSearch.txt', function onLoad(err, content) {
        if (err) {return done(err);}
        assert.equal(content, 'test\n');
        done();
      });
    });
    it('should stop if not found in root directory', function(done) {
      fileHelper.getFileFromHierarchy('/', 'IDontExist.txt' + uuid.v4(), function onLoad(err, content) {
        if (err) {return done(err);}
        assert.equal(content, undefined);
        done();
      });
    });
  });
});
