'use strict';

var assert = require('chai').assert;
var h = require('./resources/tools/helper');
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
      object: {},
    }
  ];
  var config = h.config;
  var results = [
    {
      type: 'DefaultValues',
      sourceID: '1',
      config:{
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
      config:{
        test: 'test.ObjectValue',
        testNumber: 0,
        priorityTest: 'RightDefaultValue',
        object: {
            test2: 'object.test2.ObjectValue'
        },
        array: [5, 6, 7],
      },
    },
  ];

  var response;
  before(function(done) {
     response = merge({
      sources: sources,
      config: config,
    }, results);
    done();
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
    done();
  });

  it('does work with arrays as config parameter', function(done) {
    var array = [5, 6, 7];
    assert.equal(response.array.length, array.length);
    for (var i = 0; i < config.array.length; i++) {
      assert.equal(config.array[i], array[i]);
    }
    done();
  });
});
