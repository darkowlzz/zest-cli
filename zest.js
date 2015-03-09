#!/usr/bin/env node

var program    = require('commander'),
    ZestRunner = require('zest-runner');


// Set options.
program
  .version('0.0.1')
  .option('-s, --script [file]', 'run script file', scriptRun)
  .option('-d, --debug', 'show debug messages');


// Custom help messages.
program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    zest -s foo.zst');
  console.log('    zest -s foo.zst -d');
});

program.parse(process.argv);

// Display help by default.
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

/**
 * Run the script with options.
 *
 * @param [String] path - Path of the script file.
 */
function scriptRun (path) {
  var opts = {
    sourceType: 'file',
    file: path
  };

  // Check if debug option is passed.
  if (process.argv.indexOf('-d') > -1) {
    opts.debug = true;
  }

  var zr = new ZestRunner(opts);
  zr.run().then(function (r) {
    output(r);
  });
}

/**
 * Print output in console.
 *
 * @param [Array] results - An array of results.
 */
function output (results) {
  results.forEach(function (result) {
    if (result.type == 'ZestActionFail') {
      console.log('Fail:', result.print);
    } else if (result.type == 'ZestActionPrint') {
      console.log(result.print);
    }
  });
}
