'use strict';

let fs = require('fs');
let path = require('path');
let h = require('./index');

module.exports.getFileFromHierarchy =
  function getFileFromHierarchy(pathToCheck, fileName) {
    return new Promise(function searchDirectoryFor(resolve, reject) {
      getFilesFromDirectory(pathToCheck)
        .then(function checkFilesForSearchedFile(files) {
          let fileFound = files.find(function searchForFilename(file) {
            return fileName === file;
          });
          let pathToParent = path.normalize(pathToCheck + '../');
          if (h.exist(fileFound)) {
            return pathToCheck + fileFound;
          } else if (rootReachedAndChecked(pathToCheck, pathToParent)) {
            return resolve();
          } else {
            return getFileFromHierarchy(pathToParent, fileName);
          }
        }).then(resolve).catch(reject);
    });
  };

module.exports.readFile = function readFile(filePath) {
  return new Promise(function readFile(resolve, reject) {
    fs.readFile(filePath, function onRead(err, content) {
      if (err) {
        reject(err);
      }
      resolve(content);
    });
  });
};

function getFilesFromDirectory(path) {
  return new Promise(function readFileContent(resolve, reject) {
    fs.readdir(path, function onRead(err, fileList) {
      if (err) {
        return reject(err);
      }
      resolve(fileList);
    });
  });
}

function rootReachedAndChecked(pathToCheck, pathToParent) {
  return pathToCheck === pathToParent; // '/../' Still gives '/'
}
