# Get-multi-config
**Still a early version, API can still change**

Get-multi-config is a small library built to manage the configuration of your application. It will let you define what your configuration looks like, which sources to use and even use your own plugins for non-forseen source types. Finally, you will be able to set priority between multiple sources to define which source your prefer over other ones. It currently support as sources:
- Default Values
- Environment Variables
- Files
- Objects

The file formats supported are (Both for the **file** plugin and the **object** plugin):
- JSON
- XML
- YAML
- Java-based properties file

Additionaly, you can give an javascript object to the **object** plugin using RAW as a parser.

## Installation

To install the library, just  use [npm] (https://fr.wikipedia.org/wiki/Npm_%28logiciel%29):

`
npm install get-multi-config
`

## Usage

The library will send back a function to use like this (More [examples] (https://github.com/Normegil/get-multi-config/tree/develop/examples)):
```javascript
var config = require('get-multi-config');
config(
  // Custom plugins
  [
    {
      name: 'DBFetcher',
      type: 'fetch',
      load: function load(plugins, options, callback) {}
    },
    {,
      name: 'MyFormatParser',
      type: 'parser'
      parse: function parse(source, callback) {}
    },
  ],
  {
    // Sources definitions
    sources: [
      {
        type: 'DefaultValues',
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
        priority: 20,
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
      },
    ],
    // Configuration data & structure
    config: {
      test: {
        defaultValue: 'test',
        environmentVariable: 'MYAPP_TEST',
      },
      object: {
        test1: {
          defaultValue: 'object.test1',
          environmentVariable: 'MYAPP_OBJECT_TEST1',
        },
        test2: {
          defaultValue: 'object.test2',
          environmentVariable: 'MYAPP_OBJECT_TEST2',
        },
      },
      array: {
        defaultValue: [1, 2, 3],
        environmentVariable: 'MYAPP_ARRAY',
      },
    },
  },
  function callback(err, myConfig) {
    // My Config contains your merged object
  });
```
You need to provide your custom plugins first, or an empty array if you don't have custom plugins.

Then an object with two properties, `sources` and `config`.

- `sources`: define all the sources of configuration you need, with at least two mandatory field for each source: `type` which define plugin that will fetch your datas and `priority` to define which source to favorized over the others (Speaking of which, a null value is kept but an undefined value in a high priority source is ignored and will be replaced by lower priority values if needed).

`config` define your configuration structure. You can create a tree of values, where configuration properties are only found on the leaves. Those properties are deteected by the mandatory `defaultValue` property, which can be null but not undefined. Next to it, you can pass custom field needed by other eeventual plugins.

Lastly, you have the classic NodeJS callback, starting with the `err` field in case of errors in the process, and the configuration as loaded by the library.

### Plugins
See [Plugins] (https://github.com/Normegil/get-multi-config/wiki/)

### Merging and prioritize mecanism
The merging operation happens when all the source are parsed and the configurations are loaded. Using `priority` fields from the sources, The merge will get the value from the most prioritized source (Higher number) and if the value is *undefined* (*null* values will be kept), it will got to the next source by order of priority. Once all values are filled or all configuration are used, the library will send back the object built.

## Developers
See [Developers] (https://github.com/Normegil/get-multi-config/wiki/)
