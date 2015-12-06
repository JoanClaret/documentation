'use strict';

/* eslint no-console: 0 */

module.exports = lint;
module.exports.description = 'check for common style and uniformity mistakes'

function lint(documentation, parsedArgs) {
  documentation.lint(parsedArgs.inputs, parsedArgs.options, function (err, lintOutput) {
    if (err) {
      throw err;
    }
    if (lintOutput) {
      console.log(lintOutput);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
}