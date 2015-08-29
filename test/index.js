var fs = require('fs')
var expected = fs.readFileSync(__dirname + '/expected.css', 'utf8')
var build = fs.readFileSync(__dirname + '/build.css', 'utf8')

if (expected !== build) {
  throw new Error('build does not match expected')
}
