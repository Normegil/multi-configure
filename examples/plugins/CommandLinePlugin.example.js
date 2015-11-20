var config = require('multi-configure');

/*
  Use of the command-Line plugin
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'Command Line',
        structure: {
          test: {
            cmdOpts: 't', // A cmdOpts define what will be used as on option
          },
          testBoolean: {
            cmdOpts: 'x', // Either true or undefined
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
            cmdOpts: ['array', 'a'], // If multiple options can be used for one config value, precise them in an array
            isArray: true,  // Define if the config value can potentially be an array
          },
        },
      },
    ],
  }).then(function onSuccess(myConfig) {
    // My Config contains your merged object config. Something like:

    // CMD: node program.js -x --test value --object-test1 test1 -a option1 --array option2 -a option3
    myConfig = {
      test: 'value',
      testBoolean: true,
      object: {
        test1: 'test1',
      },
      array: [
        'option1',
        'option2',
        'option3',
      ],
    };

    // CMD: node program.js --object-test1 -a option1
    myConfig = {
      object: {
        test1: true,
      },
      array: [
        'option1',
      ],
    };
  }).catch(function onError(err) {

  });
