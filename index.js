/*
-----------------------------------------------------------------------------------
|
| Imports
|
-----------------------------------------------------------------------------------
*/

var fs = require('fs')
var path = require('path')

/*
-----------------------------------------------------------------------------------
|
| Start application
|
-----------------------------------------------------------------------------------
*/

// Enable transpilation
require('babel-core/register')

// Make config globally available
var config = fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8')
global.config = JSON.parse(config)

// Start application
require('./lib/cli')
