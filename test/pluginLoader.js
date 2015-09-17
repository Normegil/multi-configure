'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var pluginManager = require('../lib/pluginLoader');

describe('PluginLoader', function() {
  describe('\'load\' function', function() {
    var pathToPlugins = __dirname + '/resources/plugins/';
    var typeOfPlugins = 'right';

    var filePlugin = require(pathToPlugins + 'file');
    var notAPlugin = require(pathToPlugins + 'notAPlugin');
    var wrongTypePlugin = require(pathToPlugins + 'wrongType');
    var folderPlugin = require(pathToPlugins + 'folder');

    it('should be a function', function(done) {
      assert.ok(u.isFunction(pluginManager.load), 'load is not a function');
      done();
    });

    it('load plugins in file format', function(done) {
      pluginManager.load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, filePlugin), 'Should load plugin in file format');
        done();
      });
    });

    it('load plugins in folder format', function(done) {
      pluginManager.load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, folderPlugin), 'Should load plugin in folder format');
        done();
      });
    });

    it('doesn\'t load file that are not plugins', function(done) {
      pluginManager.load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, notAPlugin), 'Shouldn\'t load file that are not a plugin');
        done();
      });
    });

    it('doesn\'t load plugin of the wrong type', function(done) {
      pluginManager.load(pathToPlugins, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, wrongTypePlugin), 'Shouldn\'t load plugins of the wrong type');
        done();
      });
    });
  });

  describe('\'extract\' function', function() {
    var plugins;
    before(function(done) {
      plugins = [
        {
          type: 'right',
        },
        {
          type: 'wrong',
        },
        {
          test: 'Not a plugin',
        },
        { // Empty object
        },
      ];
      done();
    });

    after(function(done) {
      plugins = undefined;
      done();
    });

    it('should be a function', function(done) {
      assert.ok(u.isFunction(pluginManager.extract), 'load is not a function');
      done();
    });

    it('should load right type of plugin', function(done) {
      var plugin = {type: 'right'};
      var extractedPlugins = pluginManager.extract([plugin], 'right');
      assert.equal(plugin, extractedPlugins[0]);
      done();
    });

    it('should\'nt load the wrong type of plugin', function(done) {
      var plugin = {type: 'wrong'};
      var extractedPlugins = pluginManager.extract([plugin], 'right');
      assert.equal(0, extractedPlugins.length);
      done();
    });

    it('should\'nt load objects that are not plugins', function(done) {
      var notAPlugin = {test: 'right'};
      var extractedPlugins = pluginManager.extract([notAPlugin], 'right');
      assert.equal(0, extractedPlugins.length);
      done();
    });
  });
});
