var config = require('multi-configure');

/*
*/
config(
  {
    // Custom plugins
    plugins: [],
    // Sources definitions
    sources: [],
    // Configuration data & structure
    structure: {},
  }).then(function onSuccess() {
    /** My Config contains your merged object config. Something like:
     * {
     *   test: 'test',
     *   number: 2,
     *   object: {
     *     test1: 'test1',
     *     test2: 'test2',
     *   }
     *   array: [1, 2, 3],
     * }
    */
  }).catch(function onError(err) {

  });
