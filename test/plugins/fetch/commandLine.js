'use strict';

let test = require('tape');
let _ = require('lodash');
let pathToLib = '../../../lib/';
let h = require(pathToLib + 'helper');
let plugin = require(pathToLib + 'plugins/fetch/commandLine');

let pluginName = 'Command Line';
let moduleName = 'Plugin: ' + pluginName + ' ';
test(moduleName + 'should be named \'' + pluginName + '\'', function(assert) {
  assert.equal(plugin.name, pluginName);
  assert.end();
});

test(moduleName + 'should be a \'fetch\' type plugin', function(assert) {
  assert.equal('fetch', plugin.type);
  assert.end();
});

let expected = {
  test: 'test.cmdVal',
  testNumber: 42,
  testBoolean: true,
  testBoolean3: true,
  testSeparatedBoolean: true,
  object: {
    test1: 'object.test1.cmdVal',
    test2: 'object.test2.cmdVal',
  },
  array: [1, 2, 3],
  oneArgArray: [4],
};

test(moduleName + 'should return plugin name', function(assert) {
  callPlugin()
    .then(function onSuccess(result) {
      assert.equal(result.plugin, pluginName);
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      assert.end();
    });
});

test(moduleName + 'should return a config with value from command line', function(assert) {
  let originalArgv = process.argv;
  process.argv = [
    'npm', 'test',
    '--test', 'test.cmdVal',
    '-xz',
    '-u',
    '--testNumber', '42',
    '--object-test1', 'object.test1.cmdVal',
    '--object-test2', 'object.test2.cmdVal',
    '--array', '1',
    '-a', '2',
    '--array', '3',
    '--oneArgArray', '4',
  ];
  callPlugin()
    .then(function onSuccess(result) {
      assert.deepEqual(result.config, expected);
      process.argv = originalArgv;
      assert.end();
    }).catch(function onError(err) {
      assert.fail(err);
      process.argv = originalArgv;
      assert.end();
    });
});

function callPlugin() {
  return new Promise(function(resolve, reject) {
    let structure = {
      test: {
        cmdOpts: 'test',
      },
      testNumber: {
        cmdOpts: 'testNumber',
      },
      testBoolean: {
        cmdOpts: 'x',
      },
      testBoolean2: {
        cmdOpts: 'y',
      },
      testBoolean3: {
        cmdOpts: 'z',
      },
      testSeparatedBoolean: {
        cmdOpts: 'u',
      },
      object: {
        test1: {
          cmdOpts: 'object-test1',
        },
        test2: {
          cmdOpts: 'object-test2',
        },
      },
      array: {
        cmdOpts: ['array', 'a'],
        isArray: true,
      },
      oneArgArray: {
        cmdOpts: ['oneArgArray'],
        isArray: true,
      },
    };
    plugin.load({
      structure: structure,
      sources: {
        type: pluginName,
        priority: 0,
      },
    }).then(function onSuccess(result) {
      if (h.exist(result.config.array) && Array.isArray(result.config.array)) {
        result.config.array = _.sortBy(result.config.array, function(value) {
          return value;
        });
      }
      resolve(result);
    }).catch(reject);
  });
}
