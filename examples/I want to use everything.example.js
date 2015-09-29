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
  },
  function callback(err, myConfig) {
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
  });
