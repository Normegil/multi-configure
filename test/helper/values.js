'use strict';

var assert = require('chai').assert;
var valueHelper = require('../../lib/helper/value');

describe('Values Helper', function() {
  describe('.getValue()', function() {
    it('should get root value', function(done) {
      var object = 'Test';
      var value = valueHelper.getValue(object, '');
      assert.equal(value, object);
      done();
    });

    it('should get undefined for undefined object', function(done) {
      var value = valueHelper.getValue(undefined, '');
      assert.equal(value, undefined);
      done();
    });

    it('should get undefined if path doesn\'t exist', function(done) {
      var object = {};
      var value = valueHelper.getValue(object, 'test.test1');
      assert.equal(value, undefined);
      done();
    });

    it('should be able to get value', function(done) {
      var object = {test: 'test1'};
      var value = valueHelper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get array', function(done) {
      var object = {test: [1,2,3]};
      var value = valueHelper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get object', function(done) {
      var object = {test: {test1: 1, test2: 'test2'}};
      var value = valueHelper.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get deep value', function(done) {
      var object = {test: {test1: {test2: {test3: 'test3'}}}};
      var value = valueHelper.getValue(object, 'test.test1.test2.test3');
      assert.equal(value, object.test.test1.test2.test3);
      done();
    });

    it('should be able to get previous value if end with \'.\' notation', function(done) {
      var object = {test: {test1: 'Test'}};
      var value = valueHelper.getValue(object, 'test.test1.');
      assert.equal(value, object.test.test1);
      done();
    });

    it('should be able to get deep value behind array', function(done) {
      var object = {test: [
        {testX: 'test1',},
        {testX: 'test2',},
      ],};
      var value = valueHelper.getValue(object, 'test[1].testX');
      assert.equal(value, object.test[1].testX);
      done();
    });

    it('should be able to get deep value behind multiple dimension array', function(done) {
      var object = {
        test: [
          [
            {testX: 'test1',},
            {testX: 'test2',},
          ],
          [
            {testX: 'test3',},
            {testX: 'test4',},
          ],
        ],
      };
      var value = valueHelper.getValue(object, 'test[1][0].testX');
      assert.equal(value, object.test[1][0].testX);
      done();
    });
  });

  describe('.setValue()', function() {
    it('should send an error if path is null', function(done) {
      var target = {};
      valueHelper.setValue(
        {
          target: target,
          path: null,
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          return done(new Error('didn \'t send an error as expected'));
        });
    });

    it('should send an error if path is undefined', function(done) {
      var target = {};
      valueHelper.setValue(
        {
          target: target,
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          return done(new Error('didn \'t send an error as expected'));
        });
    });

    it('should not send an error if target is undefined', function(done) {
      var target;
      valueHelper.setValue(
        {
          target: target,
          path: '',
          value: 'test',
        },
        function(err, result) {
          if (err) {return done(err);}
          assert.equal(result, 'test');
          return done();
        });
    });

    it('should not send an error if target is null', function(done) {
      var target = null;
      valueHelper.setValue(
        {
          target: target,
          path: '',
          value: 'test',
        },
        function(err, result) {
          if (err) {return done(err);}
          assert.equal(result, 'test');
          return done();
        });
    });

    it('should set root value', function(done) {
      var target = {};
      valueHelper.setValue(
        {
          target: target,
          path: '',
          value: 'test',
        },
        function(err, result) {
          if (err) {return done();}
          assert.equal(result, 'test');
          return done();
        });
    });

    it('should set root value of undefined target', function(done) {
      var target;
      valueHelper.setValue(
        {
          target: target,
          path: 'testField',
          value: 'test',
        },
        function(err, result) {
          if (err) {return done();}
          assert.equal(result.testField, 'test');
          return done();
        });
    });

    it('should set root value of null target', function(done) {
      var target = null;
      valueHelper.setValue(
        {
          target: target,
          path: 'testField',
          value: 'test',
        },
        function(err, result) {
          if (err) {return done();}
          assert.equal(result.testField, 'test');
          return done();
        });
    });

    it('should set property value', function(done) {
      var target = {};
      valueHelper.setValue(
        {
          target: target,
          path: 'testProperty',
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          assert.equal(target.testProperty, 'test');
          return done();
        });
    });

    it('should set property value in hierarchy', function(done) {
      var target = {object: {}};
      valueHelper.setValue(
        {
          target: target,
          path: 'object.testProperty',
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          assert.equal(target.object.testProperty, 'test');
          return done();
        });
    });

    it('should not change other values', function(done) {
      var target = {
        test1: 'test1',
        test2: 'test2',
      };
      valueHelper.setValue(
        {
          target: target,
          path: 'test1',
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          assert.equal(target.test1, 'test');
          assert.equal(target.test2, 'test2');
          return done();
        });
    });

    it('should set property value in non-existing hierarchy', function(done) {
      var target = {};
      valueHelper.setValue(
        {
          target: target,
          path: 'object.testProperty',
          value: 'test',
        },
        function(err) {
          if (err) {return done();}
          assert.equal(target.object.testProperty, 'test');
          return done();
        });
    });

    it('should set array as property value', function(done) {
      var target = {};
      var value = [1, 2, 3];
      valueHelper.setValue(
        {
          target: target,
          path: 'array',
          value: value,
        },
        function(err) {
          if (err) {return done();}
          assert.equal(target.array, value);
          return done();
        });
    });
  });
});
