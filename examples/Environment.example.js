var config = require('multi-configure');

/*
  USE OF ENVIRONMENTS (NODE_ENV)
*/

config(
  {
    // Sources definitions
    sources: [
      {
        type: 'Object',
        object: {
          test: 1,
        },
        priority: 1,
      },
      {
        type: 'Object',
        object: {
          test: 2,
        },
        environment: 'Test',
        priority: 2,
      },
      {
        type: 'Object',
        object: {
          test: 3,
        },
        environment: 'Production', // name of the environment
        priority: 3,
      },
      {
        type: 'Object',
        object: {
          test: 4,
        },
        environment: 'Other',
        priority: 4,
      },
    ],
  },
  function callback(err, myConfig) {
    // My Config contains your merged object config. Something like:

    // NODE_ENV not set - Every source is used
    var config = {
      test: 4,
    };

    // NODE_ENV = blabla - Source with no 'environment' used + Source with 'environment' = 'blabla'
    var blablaConfig = {
      test: 1,
    };

    // NODE_ENV = Test - Source with no 'environment' used + Source with 'environment' = 'Test'
    var testConfig = {
      test: 2,
    };

    // NODE_ENV = Production - Source with no 'environment' used + Source with 'environment' = 'Production'
    var prodConfig = {
      test: 3,
    };
  });
