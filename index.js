#!/usr/bin/env node

module.exports = Builder

var watch = require('chokidar').watch
var glob = require('glob')
var multistream = require('multistream')
var concat = require('concat-transform')
var postcss = require('postcss')
var autoprefixer = require('autoprefixer-core')
var fs = require('fs')

var SRC = process.env.CSS_SRC || '**/*.css'
var DEST = process.env.CSS_DEST || 'public/build.css'
var IGNORE = (process.env.CSS_IGNORE || 'public/**,node_modules/**').split(',')

function Builder (opts) {
  opts = opts || {}
  this.src = opts.src || SRC
  this.dest = opts.dest || DEST
  this.ignore = opts.ignore || IGNORE
}

Builder.prototype.build = function (cb) {
  glob(this.src, {
    ignore: this.ignore
  }, this._onfiles.bind(this, cb))
}

Builder.prototype.watch = function (cb) {
  this.w = watch(this.src, {
    ignored: this.ignore,
    ignoreInitial: true
  }).on('all', this.build.bind(this, cb))
  this.build(cb)
}

Builder.prototype.unwatch = function () {
  this.w.close()
  delete this.w
}

Builder.prototype._onfiles = function (cb, err, files) {
  if (err) return this._done(cb, err)

  files.sort(function (a, b) {
    a = a.split('/').slice(-1)[0]
    b = b.split('/').slice(-1)[0]
    return a > b ? 1 : a < b ? -1 : 0
  })

  var src = multistream(files.map(function (file) {
    var rs = fs.createReadStream(file)
    var tr = concat()
    tr._transform = function (chunk, enc, cb) {
      try {
        cb(null, postcss([ autoprefixer ]).process(chunk).css)
      } catch (err) {
        var line = err.source.split('\n')[err.line - 1]
        var pointer = (new Array(err.column)).join(' ') + '^\n'
        err.message = __dirname + '/' + file + ':' + err.line + '\n' + line + '\n' + pointer + 'ParseError: ' + err.reason
        cb(err)
      }
    }
    // multistream stops listening for errors after the first one
    tr.on('error', function () {})
    return rs.pipe(tr)
  }))

  var dest = fs.createWriteStream(this.dest)

  var ctx = {}
  src.on('error', this._done.bind(ctx, cb))
  dest.on('finish', this._done.bind(ctx, cb))
  src.pipe(dest)
}

Builder.prototype._done = function (cb, err) {
  if (err) {
    err.message = 'error building css: ' + err.message
  }
  !this._called && cb(err)
  this._called = true
}

if (!module.parent) {
  var builder = new Builder()

  if (process.argv[2] === '--watch' || process.argv[2] === '-w') {
    builder.watch(function (err) {
      if (err) console.error(err.message)
      else console.log('css built successfully')
    })
  } else {
    builder.build(function (err) {
      if (err) throw err
      else console.log('css built successfully')
    })
  }
}
