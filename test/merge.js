'use strict';

var assert = require('chai').assert;
var merge = require('../lib/merge');

describe('\'merge\' method', function() {
  var sources = [
    {
      type: 'DefaultValues',
      priority: 0,
      id: '1',
    },
    {
      type: 'Objects',
      parser: 'RAW',
      priority: 10,
      id: '3',
    },
  ];
  var results = [
    {
      type: 'DefaultValues',
      sourceID: '1',
      config: {
        test: 'test.DefaultValue',
        testNumber: 0,
        priorityTest: 'WrongDefaultValue',
        object: {
          test1: 'object.test1.DefaultValue',
        },
        array: [5, 6, 7],
      },
    },
    {
      plugin: 'Objects',
      sourceID: '3',
      config: {
        test: 'test.ObjectValue',
        testNumber: 0,
        priorityTest: 'RightDefaultValue',
        object: {
          test2: 'object.test2.ObjectValue',
          test3: 'object.test3.ObjectValue',
        },
        array: [5, 6, 7],
      },
    },
  ];

  var response;
  before(function(done) {
    merge(sources, results, function(err, result) {
      if (err) {return done(err);}
      response = result;
      return done();
    });
  });

  it('return a config', function(done) {
    assert.equal(response.test, 'test.ObjectValue');
    done();
  });

  it('can parse sub levels', function(done) {
    assert.equal(response.object.test1, 'object.test1.DefaultValue');
    done();
  });

  it('can prioritize sources', function(done) {
    assert.equal(response.priorityTest, 'RightDefaultValue');
    done();
  });

  it('does fill all parameters (without conflicts) with different plugins results', function(done) {
    assert.equal(response.object.test1, 'object.test1.DefaultValue');
    assert.equal(response.object.test2, 'object.test2.ObjectValue');
    assert.equal(response.object.test3, 'object.test3.ObjectValue');
    done();
  });

  it('does work with arrays as config parameter', function(done) {
    var array = [5, 6, 7];
    assert.equal(response.array.length, array.length);
    for (var i = 0;i < response.array.length;i++) {
      assert.equal(response.array[i], array[i]);
    }
    done();
  });
});
