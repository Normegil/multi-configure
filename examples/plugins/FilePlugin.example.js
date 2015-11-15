var config = require('multi-configure');

/*
  Use of the file plugin
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'file',
        path: __dirname + 'config.json', // extention determine which parser will be used
      },
    ],
  }).then(function onSuccess(myConfig) {
    /** My Config contains your merged object config.
      Configuration will copy your data structure in the file given.
    */
  }).catch(function onError(err) {

  });
