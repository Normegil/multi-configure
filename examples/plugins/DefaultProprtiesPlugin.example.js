var config = require('multi-configure');

/*
  Use of the default values plugin
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
    structure: {
      test: {
        defaultValue: 'value', // The plugin fetch the value from this field and copy it in the config.
      },
    },
  },
  function callback(err, myConfig) {
    // My Config contains your merged object config. Something like:
    myConfig = {
      test: 'value',
    };
  });
