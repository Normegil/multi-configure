'use strict';

var fs = require('fs');
var assert = require('chai').assert;
var parser = require('../../../lib/plugins/parser/xml');

var name = 'xml';

describe('Plugin: XML Parser', function() {

  var resourceDirectory = __dirname + '/../../resources/assets/';
  it('should accept format ' + name, function(done) {
    assert.equal(parser.format, name);
    done();
  });

  it('should have name ' + name.toUpperCase(), function(done) {
    assert.equal(parser.name, name.toUpperCase());
    done();
  });

  it('should be \'parser\' type', function(done) {
    assert.equal(parser.type, 'parser');
    done();
  });

  it('should parse xml file', function(done) {
    var xmlContent = fs.readFileSync(resourceDirectory + 'config.xml');
    var expected = {
      xmlField: 'XMLValue',
      testNumber: 2,
      priorityTest: 'Something\'s wrong',
      array: [3, 4, 5],
      object: {
        test1: 'object.test1.XMLValue',
        test2: 'object.test2.XMLValue',
      },
    };
    parser.parse(xmlContent, function(err, object) {
      assert.deepEqual(object, expected);
      done();
    });
  });
  
  it('should not parse wrong xml format', function(done) {
    var xmlContent = fs.readFileSync(resourceDirectory + 'wrong.xml');
    parser.parse(xmlContent, function(err) {
      assert.notEqual(err, undefined);
      assert.notEqual(err, null);
      done();
    });
  });

});
