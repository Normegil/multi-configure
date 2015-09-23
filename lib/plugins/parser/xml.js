'use strict';

var Parser = require('xml2js').Parser;
var parseXMLNumbers = require('xml2js/lib/processors').parseNumbers;

var name = 'XML';

module.exports = {
  name: name,
  type: 'parser',
  parse: function parse(source, callback) {
    var parser = new Parser({
      explicitRoot: false,
      explicitArray: false,
      valueProcessors: [
        parseXMLNumbers,
      ],
    });
    parser.parseString(source, callback);
  },
};
