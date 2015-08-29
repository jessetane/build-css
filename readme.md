# build-css
Personal flavor of css build script

## Why
Not crazy about the build frameworks

## How
[glob](https://github.com/isaacs/node-glob) + [multistream](https://github.com/feross/multistream) + [postcss](https://github.com/postcss/postcss) + [autoprefixer](https://github.com/postcss/autoprefixer-core)

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
$ CSS_SRC='**/*.css' CSS_DEST=share/build.css CSS_IGNORE=share build-css
```

As a JavaScript library:
```javascript
var Builder = require('build-css')

// env vars are respected, but you can override them:
var b = new Builder({
  src: '**/*.css',
  dest: 'share/build.css',
  ignore: 'share'
})

b['build' || 'watch'](function (err) {
  if (err) console.error(err.message)
  else console.log('css built successfully')
})
```

## Install
```bash
$ npm install jessetane/build-css#1.0.0
```

## Test
```bash
$ npm run test
```

## License
WTFPL
