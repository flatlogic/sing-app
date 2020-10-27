# `require-glob`

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url] [![Chat][gitter-img]][gitter-url] [![Tip][amazon-img]][amazon-url]

Requires multiple modules using glob patterns and combines them into a nested object.

## Install

    $ npm install --save require-glob

## Usage

```
┣━ unicorn.js
┣━ cake.js
┗━ rainbow/
   ┣━ red-orange.js
   ┣━ _yellow_green.js
   ┗━ BluePurple.js
```

```js
var requireGlob = require('require-glob');

requireGlob(['**/*.js', '!cake.js']).then(function (modules) {
    console.log(modules);
    // {
    //     unicorn: [object Object],
    //     rainbow: {
    //         redOrange: [object Object],
    //         _yellow_green: [object Object],
    //         BluePurple: [object Object]
    //     }
    // }
});
```

## API

### requireGlob(patterns [, options]): Promise

Returns a promise that resolves to an object containing the required contents of matching globbed files.

### requireGlob.sync(patterns [, options]): Object

Returns an object containing the required contents of matching globbed files.

#### patterns

Type: `{String|Array.<String>}`

One or more [`minimatch` glob patterns][minimatch] patterns. Supports negation.

[minimatch]: https://github.com/isaacs/minimatch#usage

#### options

Type: `{Object}` (optional)

This object is ultimately passed directly to [`node-glob`][glob] so check there for more options, in addition to those below.

[glob]: https://github.com/isaacs/node-glob#usage

##### cwd

Type: `{String}` (default: `__dirname`)

The current working directory in which to search. Defaults to the `__dirname` of the requiring module so relative paths work the same as Node.js's require.

##### base

Type: `{String}` (default: common non-glob parent)

Default is everything before the first glob starts in the first pattern (see [`glob-parent`][parent]).

_This option has no effect if you define your own `mapper` function._

[parent]: https://github.com/es128/glob-parent#usage

```js
requireGlob(['./src/**', './lib/**'], { cwd: '/home/jdoe/my-module' });
// base is: /home/jdoe/my-module/src

requireGlob('./{src,lib}/**', { cwd: '/home/jdoe/my-module' });
// base is: /home/jdoe/my-module
```

##### bustCache

Type: `{Boolean}` (default: `false`)

Whether to force the reload of modules by deleting them from the cache. Useful inside watch tasks.

_This option has no effect if you define your own `mapper` function._

##### mapper

Type: `{Function(options, filePath, i, filePaths) : Object}`

The [mapper][map] is reponsible for requiring the globbed modules. The default mapper returns an object containing path information and the result of requiring the module.

[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map

```js
// file: /home/jdoe/my-module/index.js
requireGlob('./src/**/*.js');

// the resulting list of files
[
    './src/unicorn.js',
    './src/rainbow/red-orange.js',
    './src/rainbow/_yellow_green.js',
    './src/rainbow/BluePurple.js',
]

// will be mapped to
[
    {
        cwd: '/home/jdoe/my-module',
        base: '/home/jdoe/my-module/src',
        path: '/home/jdoe/my-module/src/unicorn.js',
        exports: require('./src/unicorn')
    },
    {
        cwd: '/home/jdoe/my-module',
        base: '/home/jdoe/my-module/src',
        path: '/home/jdoe/my-module/src/rainbow/red-orange.js',
        exports: require('./src/rainbow/red-orange')
    },
    {
        cwd: '/home/jdoe/my-module',
        base: '/home/jdoe/my-module/src',
        path: '/home/jdoe/my-module/src/rainbow/_yellow_green.js',
        exports: require('./src/rainbow/_yellow_green')
    },
    {
        cwd: '/home/jdoe/my-module',
        base: '/home/jdoe/my-module/src',
        path: '/home/jdoe/my-module/src/rainbow/BluePurple.js',
        exports: require('./src/rainbow/BluePurple')
    }
]
```

##### reducer

Type: `{Function(options, result, fileObject, i, fileObjects): Object}`

The [reducer][reduce] is responsible for generating the final object structure. The default reducer expects an array as produced by the default mapper and turns it into a nested object. Path separators determine object nesting. Directory names and file names are converted to `camelCase`. File extensions are ignored.

[reduce]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce

```js
// mapper example is reduced to

{
    unicorn: require('./src/unicorn.js'),
    rainbow: {
        redOrange: require('./src/rainbow/red-orange.js'),
        _yellow_green: require('./src/rainbow/_yellow_green.js'),
        BluePurple: require('./src/rainbow/BluePurple.js'),
    }
}
```

##### keygen

Type: `{Function(options, fileObj): String|Array.<String>}`

The default reducer uses this function to generate a unique key path for every module. The default keygen converts hyphenated and dot-separated sections of directory names and the file name to `camelCase`. File extensions are ignored. Path separators determine object nesting.

_This option has no effect if you define your own `reducer` function._

```js
// given the mapped object
{
    cwd: '/home/jdoe/my-module',
    base: '/home/jdoe/my-module/src',
    path: '/home/jdoe/my-module/src/fooBar/bar-baz/_bat.qux.js',
    exports: require('./src/fooBar/bar-baz/_bat.qux.js')
}

// the keygen will produce
[
    'fooBar',
    'barBaz',
    '_batQux'
]

// which the reducer will use to construct
{
    fooBar: {
        barBaz: {
            _batQux: require('./src/fooBar/bar-baz/_bat.qux.js')
        }
    }
}
```

## Contribute

Standards for this project, including tests, code coverage, and semantics are enforced with a build tool. Pull requests must include passing tests with 100% code coverage and no linting errors.

### Test

    $ npm test

----

© 2016 Shannon Moeller <me@shannonmoeller.com>

Licensed under [MIT](http://shannonmoeller.com/mit.txt)

[amazon-img]:    https://img.shields.io/badge/amazon-tip_jar-yellow.svg?style=flat-square
[amazon-url]:    https://www.amazon.com/gp/registry/wishlist/1VQM9ID04YPC5?sort=universal-price
[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/require-glob/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/require-glob
[downloads-img]: http://img.shields.io/npm/dm/require-glob.svg?style=flat-square
[gitter-img]:    http://img.shields.io/badge/gitter-join_chat-1dce73.svg?style=flat-square
[gitter-url]:    https://gitter.im/shannonmoeller/shannonmoeller
[npm-img]:       http://img.shields.io/npm/v/require-glob.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/require-glob
[travis-img]:    http://img.shields.io/travis/shannonmoeller/require-glob.svg?style=flat-square
[travis-url]:    https://travis-ci.org/shannonmoeller/require-glob
