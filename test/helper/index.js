'use strict';

var assert = require('chai').assert;
var h = require('../../lib/helper');

describe('Helper', function() {
  describe('.exist()', function() {
    it('should be false if undefined', function() {
      assert.equal(h.exist(undefined), false);
    });

    it('should be false if null', function() {
      assert.equal(h.exist(null), false);
    });

    it('should be true if array', function() {
      assert.equal(h.exist([]), true);
    });

    it('should be false if object', function() {
      assert.equal(h.exist({}), true);
    });

    it('should be false if value', function() {
      assert.equal(h.exist(0), true);
    });
  });

  describe('.isObject()', function() {
    it('should be true when object', function() {
      assert.ok(h.isObject({
        test: 'Test',
      }));
    });

    it('should be true when empty object', function() {
      assert.ok(h.isObject({}));
    });

    it('should be true when nested object', function() {
      assert.ok(h.isObject({
        object1: {
          test: 'Test',
        },
        object2: {
          test2: 2,
        },
      }));
    });

    it('should be false when number', function() {
      assert.notOk(h.isObject(2));
    });

    it('should be false when strings', function() {
      assert.notOk(h.isObject('Test'));
    });

    it('should be false when function', function() {
      assert.notOk(h.isObject(function test() {}));
    });

    it('should be false when array', function() {
      assert.notOk(h.isObject([1, 2, 3]));
    });
  });
});
