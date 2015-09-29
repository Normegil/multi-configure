'use strict';

var _ = require('underscore');
var async = require('async');
var h = require('./index');

var visit = module.exports.visit = function visit(options, actions, callback) {
  if (!h.isObject(options.toVisit)) {
    visitLeaf(options, actions, callback);
  } else {
    visitObject(options, actions, callback);
  }
};

function visitLeaf(options, actions, callback) {
  if (_.isFunction(actions.onLeaf)) {
    actions.onLeaf(options.toVisit, options.path, callback);
  } else {
    return callback();
  }
}

function visitObject(options, actions, callback) {
  if (_.isFunction(actions.enterObject)) {
    actions.enterObject(options.toVisit, options.path, function onVisited(err) {
      if (err) {
        return callback(err);
      }
      visitObjectAndQuit(options, actions, callback);
    });
  } else {
    visitObjectAndQuit(options, actions, callback);
  }
}

function visitObjectAndQuit(options, actions, callback) {
  visitObjectStructure(options, actions, function onStructureVisited(err) {
    if (err) {
      return callback(err);
    }
    if (_.isFunction(actions.quitObject)) {
      actions.quitObject(options.toVisit, options.path, callback);
    } else {
      callback();
    }
  });
}

function visitObjectStructure(options, actions, callback) {
  var toVisit = options.toVisit;
  var path = options.path;
  var keys = Object.keys(toVisit);
  async.each(
    keys,
    function treatKey(key, asyncCallback) {
      var nextPath = path;
      if ('' !== path) {
        nextPath += '.';
      }
      nextPath += key;
      visit(
        {
          toVisit: toVisit[key],
          path: nextPath,
        },
        actions,
        asyncCallback);
    },
    function keysTreated(err) {
      callback(err);
    }
  );
}
