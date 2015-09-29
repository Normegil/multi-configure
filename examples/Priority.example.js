var config = require('multi-configure');

/*
  USE OF PRIORITY
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'Object',
        object: {
          test: 1,
          noPriorityField: true,
          nullField: 'I have a value !',
        },
      },
      {
        type: 'Object',
        object: {
          test: 1,
          nullField: null,
        },
        priority: 1,
      },
      {
        type: 'Object',
        object: {
          test: 2,
          nullField: undefined,
        },
        environment: 'Test',
        priority: 2,
      },
    ],
  },
  function callback(err, myConfig) {
    // My Config contains your merged object config. Something like:
    var config = {
      test: 2,
      nullField: null, // Undefined is never taken, but null is
      noPriorityField: true, // Not overriten so loaded from first source
    };
  });
