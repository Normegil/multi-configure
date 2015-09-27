'use strict';

var assert = require('chai').assert;
var h = require('../lib/helper');

describe('Helper', function() {
  describe('.visit()', function() {
    it('should send errors when error during visit object', function(done) {
      h.visit(
        {
          toVisit: {test: 'test'},
          path: '',
        },
        {
          onObject: function(toVisit, path, callback) {
            return callback(new Error('fake error'));
          },
        },
        function(err) {
          if (!err) {
            return done(new Error('An error should have been received'));
          }
          return done();
        });
    });

    it('should send errors when error during visit leaf', function(done) {
      h.visit(
        {
          toVisit: {test: 'test'},
          path: '',
        },
        {
          onLeaf: function(value, path, callback) {
            return callback(new Error('fake error'));
          },
        },
        function(err) {
          if (!err) {
            return done(new Error('An error should have been received'));
          }
          return done();
        });
    });

    it('should visit empty object', function(done) {
      h.visit(
        {
          toVisit: {},
          path: '',
        },
        {
          onLeaf: function(value, path, callback) {
            return callback(new Error('No leaf in an empty object'));
          },
          onObject: function(toVisit, path, callback) {
            assert.deepEqual({}, toVisit);
            assert.equal(path, '');
            return callback();
          },
        },
        function(err) {
          if (err) {return done(err);}
          return done();
        });
    });

    it('should visit all objects properties', function(done) {
      var toVisit = {
        testProperty: 'test',
        testProperty2: 'test1',
      };
      var target;
      h.visit(
        {
          toVisit: toVisit,
          path: '',
        },
        {
          onLeaf: function(value, path, callback) {
            h.setValue({
              target: target,
              path: path,
              value: true,
            }, function(err, result) {
              target = result;
              return callback(err, result);
            });
          },
        },
        function(err) {
          if (err) {return done(err);}
          assert.equal(target.testProperty, true, 'Difference in testProperty1');
          assert.equal(target.testProperty2, true, 'Difference in testProperty2');
          return done();
        });
    });

    it('should visit all objects', function(done) {
      var toVisit = {
        object1: {
          testProperty: 'test',
        },
        object2: {
          testProperty2: 'test1',
        },
      };
      h.visit(
        {
          toVisit: toVisit,
          path: '',
        },
        {
          onObject: function(toVisit, path, callback) {
            toVisit.visited = true;
            return callback();
          },
        },
        function(err) {
          if (err) {return done(err);}
          assert.ok(toVisit.visited);
          assert.ok(toVisit.object1.visited);
          assert.ok(toVisit.object2.visited);
          return done();
        });
    });

    it('should visit array as values', function(done) {
      var toVisit = {test: [1, 2, 3]};
      var target;
      h.visit(
        {
          toVisit: toVisit,
          path: '',
        },
        {
          onLeaf: function(value, path, callback) {
            h.setValue({
              target: target,
              path: path,
              value: true,
            }, function(err, result) {
              target = result;
              return callback(err, result);
            });
          },
        },
        function(err) {
          if (err) {return done(err);}
          assert.equal(target.test, true);
          return done();
        });
    });
  });

  describe('.getValue()', function() {
    it('should get root value', function(done) {
      var object = 'Test';
      var value = h.getValue(object, '');
      assert.equal(value, object);
      done();
    });

    it('should get undefined for undefined object', function(done) {
      var value = h.getValue(undefined, '');
      assert.equal(value, undefined);
      done();
    });

    it('should get undefined if path doesn\'t exist', function(done) {
      var object = {};
      var value = h.getValue(object, 'test.test1');
      assert.equal(value, undefined);
      done();
    });

    it('should be able to get value', function(done) {
      var object = {test: 'test1'};
      var value = h.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get array', function(done) {
      var object = {test: [1,2,3]};
      var value = h.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get object', function(done) {
      var object = {test: {test1: 1, test2: 'test2'}};
      var value = h.getValue(object, 'test');
      assert.equal(value, object.test);
      done();
    });

    it('should be able to get deep value', function(done) {
      var object = {test: {test1: {test2: {test3: 'test3'}}}};
      var value = h.getValue(object, 'test.test1.test2.test3');
      assert.equal(value, object.test.test1.test2.test3);
      done();
    });

    it('should be able to get previous value if end with \'.\' notation', function(done) {
      var object = {test: {test1: 'Test'}};
      var value = h.getValue(object, 'test.test1.');
      assert.equal(value, object.test.test1);
      done();
    });

    it('should be able to get deep value behind array', function(done) {
      var object = {test: [
        {testX: 'test1',},
        {testX: 'test2',},
      ],};
      var value = h.getValue(object, 'test[1].testX');
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
      var value = h.getValue(object, 'test[1][0].testX');
      assert.equal(value, object.test[1][0].testX);
      done();
    });
  });

  describe('.setValue()', function() {
    it('should send an error if path is null', function(done) {
      var target = {};
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
      h.setValue(
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
});
