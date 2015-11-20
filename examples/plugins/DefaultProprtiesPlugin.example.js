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
        structure: {
          test: {
            defaultValue: 'value', // The plugin fetch the value from this field and copy it in the config.
          },
        },
      },
    ],
  }).then(function onSuccess(myConfig) {
    // My Config contains your merged object config. Something like:
    myConfig = {
      test: 'value',
    };
  }).catch(function onError(err) {

  });
