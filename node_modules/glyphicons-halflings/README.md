
# glyphicons-halflings

This is Sass (Syntactically Awesome StyleSheets) based stylesheet generator for GLYPHICONS Halflings.

## Installing

```shell
bower install glyphicons-halflings
```

## Building

Just install all deps and call `gulp`

```shell
npm install
gulp
```

## Inject into Bootstrap 4

As Bootstrap 4 will drop GLYPHICONS support you can use this project to simply inject icons into their CSS.

Modify `lib/glyphicons-halflings/scss/glyphicons-halflings/_variables.scss` and change it to:

```Sass
$glyphicons-halflings-class-prefix: glyphicon !default;
$glyphicons-halflings-font-base-size: 12px !default;
$glyphicons-halflings-include-bonus: false !default;
```

After that you can include this in `bootstrap.scss` from Boostrap 4 source tree:

```Sass
@include "glyphicons-halflings"
```

You also can set the font base path by setting the `$glyphicons-halflings-font-path`:

```Sass
$glyphicons-halflings-font-path: '../fonts' !default;
```

And compile.
