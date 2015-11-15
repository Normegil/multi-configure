var config = require('multi-configure');

/*
  USE OF PACKAGE.JSON
  To use the plugin, define a 'config' field in your package.json, and a a JSON object with all your wanted values.
*/
config(
  {
    // Sources definitions
    sources: [
      {
        type: 'package.json',
        path: __dirname + '/package.json', // Path to your package.json
      },
    ],
  }).then(function onSuccess(myConfig) {
    /** My Config contains your merged object config. Something like:
     Configuration as defined in the package.json
    */
  }).catch(function onError(err) {

  });
