'use strict';

let _ = require('lodash');
let h = require('./index');

let visit = module.exports.visit = function visit(toVisit, path, actions) {
  return new Promise(function visit(resolve, reject) {
    if (!h.isObject(toVisit)) {
      onLeaf(toVisit, path, actions)
        .then(resolve)
        .catch(reject);
    } else {
      visitObject(toVisit, path, actions)
        .then(resolve)
        .catch(reject);
    }
  });
};

function visitObject(toVisit, path, actions) {
  return new Promise(function visitObjectAndQuit(resolve, reject) {
    enterObject(toVisit, path, actions)
      .then(function onEntered() {
        return getVisitSubObjectPromises(toVisit, path, actions);
      }).then(function onVisited() {
        return quitObject(toVisit, path, actions);
      }).then(function onExited() {
        resolve();
      }).catch(reject);
  });
}

function onLeaf(toVisit, path, actions) {
  return new Promise(function onLeaf(resolve, reject) {
    if (_.isFunction(actions.onLeaf)) {
      actions.onLeaf(toVisit, path)
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });
}

function enterObject(toVisit, path, actions) {
  return new Promise(function enterObject(resolve, reject) {
    if (_.isFunction(actions.enterObject)) {
      actions.enterObject(toVisit, path)
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });
}

function quitObject(toVisit, path, actions) {
  return new Promise(function quitObject(resolve, reject) {
    if (_.isFunction(actions.quitObject)) {
      actions.quitObject(toVisit, path)
        .then(resolve)
        .catch(reject);
    } else {
      resolve();
    }
  });
}

function getVisitSubObjectPromises(toVisit, path, actions) {
  let keys = Object.keys(toVisit);

  let nextPath = path;
  if ('' !== path) {
    nextPath += '.';
  }
  let promise = keys.reduce(function reduce(memo, key) {
    return memo
      .then(function onSuccess() {
        return visit(toVisit[key], nextPath + key, {
          enterObject: actions.enterObject,
          quitObject: actions.quitObject,
          onLeaf: actions.onLeaf,
        });
      });
  }, Promise.resolve({}));
  return promise;
}
