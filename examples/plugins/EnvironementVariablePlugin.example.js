var config = require('multi-configure');

/*
  Use of the environment variable plugin
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'EnvironmentVariables',
      },
    ],
    // Configuration data & structure
    structure: {
      test: {
        envVar: 'TEST', // The envVar field define the encironment variable name to check for value
      },
      object: {
        envVarPrefix: 'OBJECT_', // A prefix can be precised, which will be added at the beginning of each properties of object. You can define multiple prefix, one per object.
        otherObject: {
          envVarPrefix: 'OTHER_OBJECT_',
          test: {
            envVar: 'TEST', // Result variable name: OBJECT_ + OTHER_OBJECT_ + TEST = OBJECT_OTHER_OBJECT_TEST
          },
        },
      },
    },
  }).then(function onSuccess(myConfig) {
    // My Config contains your merged object config. Something like:
    // TEST=test ; OBJECT_OTHER_OBJECT_TEST=xTest
    myConfig = {
      test: 'test',
      object: {
        test: 'xTest',
      },
    };
  }).catch(function onError(err) {

  });
