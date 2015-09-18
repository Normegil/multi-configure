'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var pluginManager = require('../lib/pluginLoader');

describe('PluginLoader', function() {
  describe('\'load\' function', function() {
    var typeOfPlugins = 'right';

    var pathToPlugins = __dirname + '/resources/assets/plugins/';
    var filePlugin = require(pathToPlugins + 'file');
    var notAPlugin = require(pathToPlugins + 'notAPlugin');
    var wrongTypePlugin = require(pathToPlugins + 'wrongType');
    var folderPlugin = require(pathToPlugins + 'folder');

    it('should be a function', function(done) {
      assert.ok(u.isFunction(pluginManager.load), 'load is not a function');
      done();
    });

    it('load plugins in file format', function(done) {
      pluginManager.load({path: pathToPlugins}, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, filePlugin), 'Should load plugin in file format');
        done();
      });
    });

    it('load plugins in folder format', function(done) {
      pluginManager.load({path: pathToPlugins}, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, folderPlugin), 'Should load plugin in folder format');
        done();
      });
    });

    it('doesn\'t load file that are not plugins', function(done) {
      pluginManager.load({path: pathToPlugins}, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, notAPlugin), 'Shouldn\'t load file that are not a plugin');
        done();
      });
    });

    it('doesn\'t load plugin of the wrong type', function(done) {
      pluginManager.load({path: pathToPlugins}, typeOfPlugins, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, wrongTypePlugin), 'Shouldn\'t load plugins of the wrong type');
        done();
      });
    });

    it('should load right type of plugin', function(done) {
      var plugin = {type: 'right'};
      pluginManager.load({definitions: [plugin]}, 'right', function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt load the wrong type of plugin', function(done) {
      var plugin = {type: 'wrong'};
      pluginManager.load({definitions: [plugin]}, 'right', function(err, plugins) {
        if (err) {return done(err);}
        assert.equal(0, plugins.length);
        done();
      });
    });

    it('should\'nt load objects that are not plugins', function(done) {
      var notAPlugin = {test: 'right'};
      pluginManager.load({definitions: [notAPlugin]}, 'right', function(err, plugins) {
        if (err) {return done(err);}
        assert.equal(0, plugins.length);
        done();
      });
    });

    it('should load objects & files at the same time', function(done) {
      var plugin = {type: 'right'};
      pluginManager.load({path: pathToPlugins, definitions: [plugin]}, 'right', function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, filePlugin), 'didn\'t load file plugin');
        assert.ok(u.contains(plugins, plugin), 'Didn\'t load plugin passed by definition');
        done();
      });
    });
  });
});
