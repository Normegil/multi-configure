'use strict';

var assert = require('chai').assert;
var merge = require('../lib/merge');

describe('\'merge\' method', function() {

  var sources;
  var referenceConfig;
  var fakeParsedConfig;
  before(function(done) {
    sources = {
      plugins: [
        {
          type: 'DefaultValueParser',
          priority: 30,
        },
        {
          type: 'OtherDefaultValueParser',
          priority: 50,
        },
      ],
    };
    referenceConfig = {
      test: 'Test.DefaultValue',
      testObject: {
        testParameter: 'TestObject.TestParameter.DefaultValue',
      },
      priorityTest: 'PriorityTest.GoodValue',
      multipleParameterObject: {
        test1: 'multipleParameterObject.test1.DefaultValue',
        test2: 'multipleParameterObject.test2.DefaultValue',
      },
      array: ['a', 'b', 'c'],
      arrayToNotOverride: ['n', 'o', 't', 'o', 'v', 'e' ,'r' ,'r' ,'i' ,'d' ,'e'],
    };
    fakeParsedConfig = [
      {
        plugin: 'DefaultValueParser',
        config:{
          test: referenceConfig.test,
          testObject: {
            testParameter: referenceConfig.testObject.testParameter,
          },
          priorityTest: 'WrongDefaultValue',
          multipleParameterObject: {
            test1: referenceConfig.multipleParameterObject.test1,
          },
          array: ['a', 'b', 'c'],
          arrayToNotOverride: ['o', 'v', 'e' ,'r' ,'r' ,'i' ,'d' ,'e'],
        },
      },
      {
        plugin: 'OtherDefaultValueParser',
        config:{
          priorityTest: referenceConfig.priorityTest,
          multipleParameterObject: {
            test2: referenceConfig.multipleParameterObject.test2,
          },
          arrayToNotOverride: referenceConfig.arrayToNotOverride,
        },
      },
    ];
    done();
  });

  var config;
  beforeEach(function(done) {
    config = merge(sources, fakeParsedConfig);
    done();
  });
  afterEach(function(done) {
    config = undefined;
    done();
  });

  it('return a config', function(done) {
    assert.equal(referenceConfig.test, config.test);
    done();
  });

  it('can parse sub levels', function(done) {
    assert.equal(referenceConfig.testObject.testParameter, config.testObject.testParameter);
    done();
  });

  it('can prioritize plugins', function(done) {
    assert.equal(referenceConfig.priorityTest, config.priorityTest);
    done();
  });

  it('does fill all parameters (without conflicts) with different plugins results', function(done) {
    assert.equal(referenceConfig.multipleParameterObject.test1, config.multipleParameterObject.test1);
    assert.equal(referenceConfig.multipleParameterObject.test2, config.multipleParameterObject.test2);
    done();
  });

  it('does work with arrays as config parameter', function(done) {
    assert.equal(referenceConfig.array.length, config.array.length);
    for (var i = 0; i < config.array.length; i++) {
      assert.equal(referenceConfig.array[i], config.array[i]);
    }
    done();
  });

  it('doesn\'t override arrays when already setted in the config', function(done) {
    assert.equal(referenceConfig.arrayToNotOverride, config.arrayToNotOverride);
    done();
  });
});
