'use strict';

var assert = require('chai').assert;
var parser = require('../../../lib/plugins/parser/raw');

var name = 'raw';

describe('Plugin: '+name.toUpperCase()+' Parser', function() {

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

  it('should parse raw js object', function(done) {
    var expected = {
      testNumber: 2,
      priorityTest: 'Something\'s wrong',
      array: [3, 4, 5],
      object: {
        test1: 'object.test1.value',
        test2: 'object.test2.value',
      },
    };
    parser.parse(expected, function(err, object) {
      if (err) return done(err);
      assert.deepEqual(object, expected);
      done();
    });
  });
});
