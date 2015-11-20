# Multi-configure
Small library (for NodeJs apps) built to manage the configuration of your application. It will let you define what your configuration looks like, which sources to use and even use your own plugins for non-forseen source types. Finally, you will be able to set priority for all those sources. It currently support as sources:
- Default Values
- Environment Variables
- Files
- Objects
- package.json
- Command Line arguments

The file formats supported are (Both for the *file* plugin and the *object* plugin):
- JSON
- XML
- YAML
- Java-based properties file
- CSON

Additionally, you can give a javascript object to the *object* plugin, which will be treated as-is.

## Features
- Multiple sources (See all the predefined plugins and parsers)
- Plugin system for easy extensibility and even more possibilities
- Merge with priority settings
- Discriminators for each sources
- Support of NODE_ENV variable for selection of a set of sources to use (production, development, test, ...)

## Installation

To install the library, just use [npm](https://fr.wikipedia.org/wiki/Npm_%28logiciel%29):
`
npm install multi-configure
`

## Usage

The library will send back a function to use like this (More [examples](https://github.com/Normegil/multi-configure/tree/develop/examples)):
```javascript
var config = require('multi-configure');
config(
  {
    // Custom plugins
    plugins: [
      {
        name: 'DBFetcher',
        type: 'fetch',
        load: function load(plugins, options) {}
      },
      {,
        name: 'MyFormatParser',
        type: 'parser'
        parse: function parse(source) {}
      },
    ],
    // Sources definitions
    sources: [
      {
        type: 'DefaultValues',
        priority: 0,
        structure: {
          test: {
            defaultValue: 'test',
          },
          object: {
            test1: {
              defaultValue: 'object.test1',
            },
            test2: {
              defaultValue: 'object.test2',
            },
          },
          array: {
            defaultValue: [1, 2, 3],
          },
        },
      },
      {
        type: 'package.json',
        path: '../../package.json',
        priority: 0,
      },
      {
        type: 'Object',
        parser: 'XML',
        object: '<config><test>XMLTest</test></config>',
        priority: 10,
      },
      {
        type: 'File',
        path: __dirname + 'config.json'
      },
      {
        type: 'Object',
        parser: 'RAW',
        object: {
          test: 'test.ObjectValue'
        },
        priority: 30,
      },
      {
        type: 'EnvironmentVariables',
        priority: 40,
        structure: {
          envVarPrefix: 'TEST_STRUCTURE_',
          test: {
            envVar: 'TEST',
          },
          object: {
            envVarPrefix: 'OBJECT_',
            test1: {
              envVar: 'OBJECT_TEST1',
            },
            test2: {
              envVar: 'TEST2',
            },
          },
          array: {
            envVar: 'ARRAY',
            isArray: true,
          },
        },
      },
      {
        type: 'Command Line',
        priority: 100,
        structure: {
          envVarPrefix: 'TEST_STRUCTURE_',
          test: {
            cmdOpts: ['t', 'test'],
          },
          object: {
            envVarPrefix: 'OBJECT_',
            test1: {
              cmdOpts: 'object-test1',
            },
            test2: {
              cmdOpts: 'object-test2',
            },
          },
          array: {
            cmdOpts: 'array',
            isArray: true,
          },
        },
      },
    ],
  }).then(function onSuccess(myConfig) {
    /** My Config contains your merged object config. Something like:
     * {
     *   test: 'test',
     *   number: 2,
     *   object: {
     *     test1: 'test1',
     *     test2: 'test2',
     *   }
     *   array: [1, 2, 3],
     * }
    */
  }).catch(function onError(err) {

  });
```
Everything is specified in an object, with the following fields:

`plugins`: Optional. An array with your custom plugins. To see how to create and define a plugin, go to the [plugins](https://github.com/Normegil/multi-configure/wiki/Plugins) wiki page.

`sources`: Mandatory. define all the sources of configuration you need, with the following options:
- `type`: Mandatory. Define plugin that will fetch your datas. The name should match exactly the name of the plugin you want to use.
- `priority` Optional. Define priority to order the sources. The higher the number, the more prioritized a source is. Source without this fields will have the lowest priority (0).
- `discriminator`: Optional. If present, it will define the name of the object acting as container for the source's configuration. You will access your configuration through `response.config.<discriminator>.blabla` instead of `response.config.blabla`. Done prior to merging, usefull to keep types of configuration (DB, Logging, ...) without property override.
- `environment`: Optional. If not present, source will be used even if *NODE_ENV* is set. If the property exist, it will be loaded only if `environment` values exactly equals *NODE_ENV* value, or if *NODE_ENV* doesn't exist.
- `structure`: Optional/Mandatory (Some  plugins use and require it, some don't). Define your configuration structure & settings. You can create a tree of values, which define what your final configuration will look like. Each leaves is an object containing properties used by plugins (Like `defaultValue` or `envVar`).
- Custom fields: Some plugins will require other fields that could be precised here (Like a `path` for the *File* plugin).

As return, you get a Promise.

### Plugins
See [Plugins](https://github.com/Normegil/multi-configure/wiki/Plugins)

### Defining a structure
If a structure is defined, the plugin will send back an object that looks like this structure. (But, for example, the *File* and *Object* don't use the structure at all). You need to define a hierarchy  of objects to represent your configuration. Once you have your hierarchy, check the [documentation of the plugins](https://github.com/Normegil/multi-configure/wiki/Plugins) you want to use to know how to define the properties of your structure.

### Merging and prioritize mecanism
The merging operation happens when all the sources are parsed and the configurations are loaded. Using `priority` fields from the sources, the merge process will get the value from the most prioritized sources (Higher number) and if the value is *undefined* (*null* values will be kept), it will got to the next source by order of priority. Once all values are filled or all configuration are used, the library will send back the object built.

## Enhancements, Issues and bugs
Please report any enhancement, issue or bug you find while using this library to the github of the project. I will look at it and  fix it as soon as I can.

## Developers
See [Developers](https://github.com/Normegil/multi-configure/wiki/Developers)
