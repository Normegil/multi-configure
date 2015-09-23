'use strict';

var fs = require('fs');
var assert = require('chai').assert;
var parser = require('../../../lib/plugins/parser/properties');

var name = 'Properties';

describe('Plugin: Properties Parser', function() {
  var resourceDirectory = __dirname + '/../../resources/assets/';

  it('should have name ' + name, function(done) {
    assert.equal(parser.name, name);
    done();
  });

  it('should be \'parser\' type', function(done) {
    assert.equal(parser.type, 'parser');
    done();
  });

  it('should parse properties file', function(done) {
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
    parser.parse(content, function(err, object) {
      if (err) {return done(err);}
      assert.deepEqual(object, expected);
      done();
    });
  });
  it('should not parse wrong properties format', function(done) {
    var xmlContent = fs.readFileSync(resourceDirectory + 'wrong.properties');
    parser.parse(xmlContent, function(err) {
      assert.notEqual(err, undefined);
      assert.notEqual(err, null);
      done();
    });
  });
});
