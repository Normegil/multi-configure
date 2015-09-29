var config = require('multi-configure');

/*
  USE OF THE STRUCTURE
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'DefaultValues',
      },
    ],
    // Configuration data & structure
    structure: { // Define (for the plugins that use it) the structure of the configuration
      test: {
        defaultValue: 'test', // You can define plugin-specific fields and values
      },
      testNumber: {
        defaultValue: 1,
      },
      object: { // Objects will be traversed and used
        test1: {
          defaultValue: 'object.test1',
        },
        test2: {
          defaultValue: 'object.test2',
        },
      },
      array: { // An array is not an object. It will be considered as a value that will need to be fetched like any value. Nest a configuration inside an array won't work.
        defaultValue: [1, 2, 3],
      },
    },
  },
  function callback(err, myConfig) {
    // My Config contains your merged object config. Something like:
    myConfig = {
      test: 'test',
      testNumber: 1,
      object: {
        test1: 'object.test1',
        test2: 'object.test2',
      },
      array: [1, 2, 3],
    };
  });
