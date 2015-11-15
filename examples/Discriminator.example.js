var config = require('multi-configure');

/*
USE OF DISCRIMINATORS
*/

var rawObject1 = {
  test: 'test1',
};
var rawObject2 = {
  test: 'test2',
};
var rawObject3 = {
  test: 'test3',
};

config(
  {
    // Sources definitions
    sources: [
      {
        type: 'Object',
        object: rawObject1,
        discriminator: 'DB', // name of the wrapper object
      },
      {
        type: 'Object',
        object: rawObject2,
        discriminator: 'Logging',
      },
      {
        type: 'Object',
        object: rawObject3,
        priority: 10,
        discriminator: 'DB',
      },
    ],
  }).then(function onSuccess() {
    // My Config contains your merged object config. Something like:
    myConfig = {
      DB: {
        test: 'test3', // Overriten because of priority
      },
      Logging: {
        test: 'test2',
      },
    };
  }).catch(function onError(err) {

  });
