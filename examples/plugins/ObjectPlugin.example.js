var config = require('multi-configure');

/*
  Use of the object plugin
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'Object',
        parser: 'XML', // Name of the parser plugin that will parse the string in 'object'
        object: '<config><test>1<test></config>', // object to parse
      },
      { // RAW object don't need a parser field (or use 'RAW' as parser)
        type: 'Object',
        object: {
          test: 'value',
        },
        priority: 1,
      },
    ],
  }).then(function onSuccess(myConfig) {
    // My Config contains your merged object config. Something like:
    myConfig = {
      test: 'value',
    };
  }).catch(function onError(err) {

  });
