'use strict';

var assert = require('chai').assert;
var h = require('../../lib/helper');
var visitor = require('../../lib/helper/visitor.js');

describe('Visitor', function() {
  describe('.visit()', function() {
    it('should send error when error during enter object', function(done) {
      visitor.visit(
        {
          toVisit: {test: 'test'},
          path: '',
        },
        {
          enterObject: function(toVisit, path, callback) {
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

    it('should send error when error during quit object', function(done) {
      visitor.visit(
        {
          toVisit: {test: 'test'},
          path: '',
        },
        {
          quitObject: function(toVisit, path, callback) {
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

    it('should send error when error during visit leaf', function(done) {
      visitor.visit(
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
      visitor.visit(
        {
          toVisit: {},
          path: '',
        },
        {
          onLeaf: function(value, path, callback) {
            return callback(new Error('No leaf in an empty object'));
          },
          enterObject: function(toVisit, path, callback) {
            assert.deepEqual({}, toVisit);
            assert.equal(path, '');
            return callback();
          },
          quitObject: function(toVisit, path, callback) {
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
      visitor.visit(
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
      visitor.visit(
        {
          toVisit: toVisit,
          path: '',
        },
        {
          enterObject: function(toVisit, path, callback) {
            toVisit.entered = true;
            return callback();
          },
          quitObject: function(toVisit, path, callback) {
            toVisit.quitted = true;
            return callback();
          },
        },
        function(err) {
          if (err) {return done(err);}
          assert.ok(toVisit.entered, 'Root not entered');
          assert.ok(toVisit.object1.entered, 'Object1 not entered');
          assert.ok(toVisit.object2.entered, 'Object2 not entered');
          assert.ok(toVisit.quitted, 'Root not quitted');
          assert.ok(toVisit.object1.quitted, 'Object1 not quitted');
          assert.ok(toVisit.object2.quitted, 'Object2 not quitted');
          return done();
        });
    });

    it('should visit array as values', function(done) {
      var toVisit = {test: [1, 2, 3]};
      var target;
      visitor.visit(
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
});
