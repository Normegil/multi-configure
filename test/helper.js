'use strict';

var assert = require('chai').assert;
var helper = require('../lib/helper');

describe('Helper', function() {
  describe('.visit()', function() {

    var configOptions;
    var config;
    before(function(done) {
      configOptions = {
        test: {
          defaultValue: 'test.DefaultValue',
        },
        testNumber: {
          defaultValue: 0,
        },
        object: {
          test1: {
            defaultValue: 'object.test1.DefaultValue1',
          },
          test2: {
            defaultValue: 'object.test2.DefaultValue1',
          },
        },
        array: {
          defaultValue: [1, 2, 3],
        },
      };
      config = helper.visit(configOptions, function getValue(object, path) {
        return {
          value: object.defaultValue,
          path: path,
        };
      });
      done();
    });

    it('should visit root nodes', function(done) {
      assert.equal(config.test.value, configOptions.test.defaultValue);
      assert.equal(config.test.path, 'test');
      done();
    });
    it('should visit all sub objects properties', function(done) {
      assert.equal(config.object.test1.value, configOptions.object.test1.defaultValue);
      assert.equal(config.object.test2.value, configOptions.object.test2.defaultValue);
      assert.equal(config.object.test1.path, 'object.test1');
      assert.equal(config.object.test2.path, 'object.test2');
      done();
    });
    it('should visit array as values', function(done) {
      assert.equal(config.array.value, configOptions.array.defaultValue);
      assert.equal(config.array.path, 'array');
      done();
    });
  });

  describe('.getValue()', function() {
    it('should get root value', function(done) {
      var object = 'Test';
      var value = helper.getValue(object, '');
      assert.equal(value, object);
      done();
    });

    it('should get undefined for undefined object', function(done) {
      var value = helper.getValue(undefined, '');
      assert.equal(value, undefined);
      done();
    });

    it('should get undefined if path doesn\'t exist', function(done) {
      var object = {};
      var value = helper.getValue(object, 'test.test1');
      assert.equal(value, undefined);
      done();
    });

    it('should be able to get value', function(done) {
      var object = {test: 'test1'};
      var value = helper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get array', function(done) {
      var object = {test: [1,2,3]};
      var value = helper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get object', function(done) {
      var object = {test: {test1:1, test2: 'test2'}};
      var value = helper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get deep value', function(done) {
      var object = {test: {test1:{ test2: {test3: 'test3'}}}};
      var value = helper.getValue(object, 'test.test1.test2.test3');
      assert.equal(value, object.test.test1.test2.test3);
      done();
    });

    it('should be able to get previous value if end with \'.\' notation', function(done) {
      var object = {test: {test1: 'Test'}};
      var value = helper.getValue(object, 'test.test1.');
      assert.equal(value, object.test.test1);
      done();
    });

    it('should be able to get deep value behind array', function(done) {
      var object = {test: [
        {testX: "test1"},
        {testX: "test2"}
      ]};
      var value = helper.getValue(object, 'test[1].testX');
      assert.equal(value, object.test[1].testX);
      done();
    });

    it('should be able to get deep value behind multiple dimension array', function(done) {
      var object = {test: [
        [
          {testX: "test1"},
          {testX: "test2"}
        ],
        [
          {testX: "test3"},
          {testX: "test4"}
        ]
      ]};
      var value = helper.getValue(object, 'test[1][0].testX');
      assert.equal(value, object.test[1][0].testX);
      done();
    });
  });
});
