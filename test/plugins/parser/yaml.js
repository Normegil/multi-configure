'use strict';

var fs = require('fs');
var assert = require('chai').assert;
var parser = require('../../../lib/plugins/parser/yaml');

var name = 'yaml';

describe('Plugin: YAML Parser', function() {
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

  it('should parse yaml file', function(done) {
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
    parser.parse(content, function(err, object) {
      if (err) {return done(err);}
      assert.deepEqual(object, expected);
      done();
    });
  });
});
