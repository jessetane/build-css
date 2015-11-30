# build-css
Personal flavor of css build script

## Why
Not crazy about the build frameworks

## How
[glob](https://github.com/isaacs/node-glob) + [multistream](https://github.com/feross/multistream) + [postcss](https://github.com/postcss/postcss) + [autoprefixer](https://github.com/postcss/autoprefixer-core)

Note: `build-css` sorts all your stylesheets by name before concatenating - this is important (lol) since css cares about the ordering of things. For example you could prefix a reset with "-" to make sure gets written first, and a media query with "~" to make sure it gets written last.

## Example
As a standalone executable:
```bash
$ build-css
```

Watch:
```bash
$ build-css --watch
```

Use env vars to change the source pattern / destination / ignore pattern:
```bash
$ CSS_SRC='**/*.css' CSS_DEST=public/build.css CSS_IGNORE='public/**,node_modules/**' build-css
```

As a JavaScript library:
```javascript
var Builder = require('build-css')

// env vars are respected, but you can override them:
var b = new Builder({
  src: '**/*.css',
  dest: 'public/build.css',
  ignore: [ 'public/**', 'node_modules/**' ]
})

b['build' || 'watch'](function (err) {
  if (err) console.error(err.message)
  else console.log('css built successfully')
})
```

## Install
```bash
$ npm install jessetane/build-css#1.0.5
```

## Test
```bash
$ npm run test
```

## License
WTFPL
