#!/usr/bin/env node
'use strict';

var program    = require('commander'),
    ZestRunner = require('zest-runner');

var tokens = {};

// Set options.
program
  .version('0.0.1')
  .option('-s, --script [file]', 'run script file', scriptRun)
  .option('-d, --debug', 'show debug messages')
  .option('-t, --token <name>=<value>', 'pass argument token');


// Custom help messages.
program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    zest -s foo.zst');
  console.log('    zest -s foo.zst -d');
  console.log('    zest -s foo.zst -t request.url=http://foo.com -t request.method=GET');
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
  if ((process.argv.indexOf('-d') > -1) ||
      (process.argv.indexOf('--debug') > -1)) {
    opts.debug = true;
  }

  extractTokens('-t');
  extractTokens('--token');
  opts.tokens = tokens;

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


/**
 * Extract argument tokens belonging to the given option.
 *
 * @param [String] option - An command line option string, like '-t'.
 */
function extractTokens(option) {
  var pos = 0,
      token, key, val, temp;

  pos = process.argv.indexOf(option, (pos + 1));
  while(pos != -1) {
    token = process.argv[pos + 1];
    temp = token.split('=');
    key = temp[0];
    val = temp[1];
    tokens[key] = val;
    pos = process.argv.indexOf(option, (pos + 1));
  }
}
