'use strict';

var u = require('underscore');
var assert = require('chai').assert;
var pluginManager = require('../lib/pluginLoader');

describe('PluginLoader', function() {
  describe('\'.loadAll()\'', function() {
    var pathToPlugins = __dirname + '/resources/assets/plugins/';
    var filePlugin = require(pathToPlugins + 'file');
    var notAPlugin = require(pathToPlugins + 'notAPlugin');
    var wrongTypePlugin = require(pathToPlugins + 'wrongType');
    var folderPlugin = require(pathToPlugins + 'folder');

    it('should be a function', function(done) {
      assert.ok(u.isFunction(pluginManager.loadAll), 'loadAll is not a function');
      done();
    });

    it('load plugins in file format', function(done) {
      pluginManager.loadAll({path: pathToPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, filePlugin), 'Should load plugin in file format');
        done();
      });
    });

    it('load plugins in folder format', function(done) {
      pluginManager.loadAll({path: pathToPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, folderPlugin), 'Should load plugin in folder format');
        done();
      });
    });

    it('doesn\'t load file that are not plugins', function(done) {
      pluginManager.loadAll({path: pathToPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, notAPlugin), 'Shouldn\'t load file that are not a plugin');
        done();
      });
    });

    it('load all types of plugins', function(done) {
      var testPlugin = {type: 'test', name: 'Test',};
      var test1Plugin = {type: 'test1', name: 'Test1',};
      pluginManager.loadAll(
        {
          path: pathToPlugins,
          custom: [testPlugin, test1Plugin],
        },
        function(err, plugins) {
          if (err) { return done(err); }
          assert.ok(u.contains(plugins, filePlugin), 'Should load file plugin');
          assert.ok(u.contains(plugins, wrongTypePlugin), 'Should load file plugin (Wrong type)');
          assert.ok(u.contains(plugins, testPlugin), 'Should load object plugin (Test)');
          assert.ok(u.contains(plugins, test1Plugin), 'Should load object plugin (Test1)');
          done();
        });
    });

    it('should\'nt load objects that are not plugins', function(done) {
      var notAPlugin = {test: 'right'};
      pluginManager.loadAll({custom: [notAPlugin]}, function(err, plugins) {
        if (err) {return done(err);}
        assert.equal(plugins.length, 0);
        done();
      });
    });

    it('should load objects & files at the same time', function(done) {
      var plugin = {type: 'right', name: 'Right'};
      pluginManager.loadAll({path: pathToPlugins, custom: [plugin]}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, filePlugin), 'Doesn\'t contains file plugin');
        assert.ok(u.contains(plugins, plugin), 'Doesn\'t contains object plugin');
        done();
      });
    });
  });

  describe('\'.load()\'', function() {
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
      pluginManager.load({path: pathToPlugins}, {type: typeOfPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, filePlugin), 'Should load plugin in file format');
        done();
      });
    });

    it('load plugins in folder format', function(done) {
      pluginManager.load({path: pathToPlugins}, {type: typeOfPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.ok(u.contains(plugins, folderPlugin), 'Should load plugin in folder format');
        done();
      });
    });

    it('doesn\'t load file that are not plugins', function(done) {
      pluginManager.load({path: pathToPlugins}, {type: typeOfPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, notAPlugin), 'Shouldn\'t load file that are not a plugin');
        done();
      });
    });

    it('doesn\'t load plugin of the wrong type', function(done) {
      pluginManager.load({path: pathToPlugins}, {type: typeOfPlugins}, function(err, plugins) {
        if (err) { return done(err); }
        assert.notOk(u.contains(plugins, wrongTypePlugin), 'Shouldn\'t load plugins of the wrong type');
        done();
      });
    });

    it('should load right type of plugin', function(done) {
      var plugin = {type: 'right', name: 'Right'};
      pluginManager.load({custom: [plugin]}, {type: 'right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt load the wrong type of plugin', function(done) {
      var plugin = {type: 'wrong'};
      pluginManager.load({custom: [plugin]}, {type: 'right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.notOk(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt load objects that are not plugins', function(done) {
      var notAPlugin = {test: 'right'};
      pluginManager.load({custom: [notAPlugin]}, {type: 'right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.equal(0, plugins.length);
        done();
      });
    });

    it('should load objects & files at the same time', function(done) {
      var plugin = {type: 'right', name: 'Right'};
      pluginManager.load({path: pathToPlugins, custom: [plugin]}, {type: 'right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, filePlugin));
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should load plugin with the right name when using name filter', function(done) {
      var plugin = {type: 'right', name: 'Right'};
      pluginManager.load({custom: [plugin]}, {name: 'Right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt load plugin with the wrong name when using name filter', function(done) {
      var plugin = {type: 'wrong', name: 'Wrong'};
      pluginManager.load({custom: [plugin]}, {name: 'Right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.notOk(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt filter plugins based on type when using name filter', function(done) {
      var plugin = {type: 'wrong', name: 'Right'};
      pluginManager.load({custom: [plugin]}, {name: 'Right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should\'nt filter plugins based on name when using type filter', function(done) {
      var plugin = {type: 'right', name: 'Wrong'};
      pluginManager.load({custom: [plugin]}, {type: 'right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, plugin));
        done();
      });
    });

    it('should be able to use all filters at the same time', function(done) {
      var rightPlugin = {type: 'right', name: 'Right'};
      var wrongPluginName = {type: 'right', name: 'Wrong'};
      var wrongPluginType = {type: 'wrong', name: 'Right'};
      pluginManager.load({custom: [rightPlugin, wrongPluginType, wrongPluginName]}, {type: 'right', name: 'Right'}, function(err, plugins) {
        if (err) {return done(err);}
        assert.ok(u.contains(plugins, rightPlugin));
        assert.notOk(u.contains(plugins, wrongPluginType));
        assert.notOk(u.contains(plugins, wrongPluginName));
        done();
      });
    });
  });
});
