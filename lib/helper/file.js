'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var h = require('./index');

module.exports.getFileFromHierarchy =
  function getFileFromHierarchy(pathToCheck, fileName, callback) {
    fs.readdir(pathToCheck, function onRead(err, files) {
      if (err) {
        return callback(err);
      }
      var filesfound = _.filter(files, function searchForFilename(file) {
        return fileName === file;
      });
      if (h.exist(filesfound[0])) {
        fs.readFile(pathToCheck + filesfound[0], 'utf8', callback);
      } else {
        var nextPath = path.normalize(pathToCheck + '../');
        if (nextPath === pathToCheck) { // isRoot
          return callback();
        } else {
          getFileFromHierarchy(nextPath, fileName, callback);
        }
      }
    });
  };
