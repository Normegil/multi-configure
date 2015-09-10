'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var load = require('../lib/pluginLoader');

describe('PluginLoader', function() {
  describe('\'load\' function', function() {

    var pathToPlugins = __dirname + '/resources/plugins/';
    var typeOfPlugins = 'right';

    var filePlugin = require(pathToPlugins + 'file');
    var notAPlugin = require(pathToPlugins + 'notAPlugin');
    var wrongTypePlugin = require(pathToPlugins + 'wrongType');
    var folderPlugin = require(pathToPlugins + 'folder');

    it('should be a function', function(done) {
      assert.ok(u.isFunction(load), 'load is not a function');
      done();
    });

    it('load plugins in file format', function(done) {
      load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) return done(err);
        assert.ok(u.contains(plugins, filePlugin), 'Should load plugin in file format');
        done();
      });
    });

    it('load plugins in folder format', function(done) {
      load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) return done(err);
        assert.ok(u.contains(plugins, folderPlugin), 'Should load plugin in folder format');
        done();
      });
    });

    it('doesn\'t load file that are not plugins', function(done) {
      load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) return done(err);
        assert.notOk(u.contains(plugins, notAPlugin), 'Shouldn\'t load file that are not a plugin');
        done();
      });
    });

    it('doesn\'t load plugin of the wrong type', function(done) {
      load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) return done(err);
        assert.notOk(u.contains(plugins, wrongTypePlugin), 'Shouldn\'t load plugins of the wrong type');
        done();
      });
    });
  });
});
