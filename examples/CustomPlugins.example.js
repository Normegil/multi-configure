/*
  PASSING CUSTOM PLUGINS
*/

var config = require('multi-configure');

// DEFINE YOUR CUSTOM PLUGINS
var fetchTypePlugin = {
  name: 'MyCustomFetchPlugin',
  type: 'fetch',
  load: function load(options, callback) {
    var plugins = options.plugins; // All the plugins loaded (Default + customs)
    var source = options.source; // The source to use with your plugin. It already have the right type
    var structure = options.structure; // The structure as it is defined when calling the config() function
    // The code to load your configuration
    // Call your callback (classic Node callback, err first & config second)
    // Your final config should not have a root 'sourceID' field
  },
};

var parserTypePlugin = {
  name: 'MyCustomFormat',
  type: 'parser',
  parse: function parse(source, callback) {
    // source: a string with your formatted content
    // The code to format the source as a JS object
    // Call your callback (classic Node callback, err first & object second)
  },
};

// CALL THE CONFIG
config(
  {
    // Custom plugins
    plugins: [
      fetchTypePlugin,
      parserTypePlugin,
    ],
    // Sources definitions
    sources: [
      {
        type: 'File',
        path: __dirname + './config.mycustomformat', // extention should be the parser plugin name
      },
      {
        type: 'Object',
        object: 'blabla', // A string of your custom format
        parser: 'MyCustomFormat',
      },
      {
        type: 'MyCustomFetchPlugin',
        // Reserved names: id, internalPriority
        customField: [1, 3], // A custom field needed by your plugin, define as you want (The source is  passed as-is with no modification).'
      },
    ],
    // Configuration data & structure
    structure: {
      test: {
        fieldUsedByYourFetchPlugin: '', // Structure is passed as-is, with no modification. You can ask for custom fields
      },
      objectTest: {
        anotherTestField: {
          fieldUsedByYourFetchPlugin: '',
        },
      },
    },
  },
  function callback(err, myConfig) {
    /** My Config contains your merged object config. Something like:
     * {
     *   test: 'test',
     *   objectTest: {
     *     anotherTestField: 'anotherTestFieldValue',
     *   }
     * }
    */
  });
