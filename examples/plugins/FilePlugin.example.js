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
  },
  function callback(err, myConfig) {
    /** My Config contains your merged object config.
      Configuration will copy your data structure in the file given.
    */
  });
