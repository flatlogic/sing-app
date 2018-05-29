'use strict';

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const rename = require ('gulp-rename');
const hb = require('gulp-hb');
const layouts = require('handlebars-layouts');

const srcPaths = {
    scripts: ['./src/js/**/*'],
    fonts: ['./src/fonts/**/*'],
    images: ['./src/img/**/*'],
    styles: ['./src/sass/*.scss'],
    cssEntries: ['./src/sass/application.scss'],
    static: ['./src/demo/**/*'],
    templates: [
        'src/*.hbs',
        'src/pages/**/*.hbs'
    ],
    partials: ['./src/partials/*.hbs'],
    helpers: [
        './node_modules/handlebars-layouts/index.js',
        './src/helpers/index.js'
    ]
};

hb.handlebars.registerHelper(layouts(hb.handlebars));

gulp.task('clean', () => {
   del(['dist']);
});

// Copy demo, img, js, fonts folders from src to dist
gulp.task('copy', ['copy:js'], function () {
    gulp.src(srcPaths.static)
        .pipe(gulp.dest('dist/demo'));
    
    gulp.src(srcPaths.images)
        .pipe(gulp.dest('dist/img'));

    gulp.src(srcPaths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy:js', function () {
    gulp.src(srcPaths.scripts)
        .pipe(gulp.dest('dist/js'));
});

// Handle handlebars
gulp.task('hbs', function () {
    gulp.src(srcPaths.templates)
        .pipe(hb({
            partials: srcPaths.partials,
            helpers: srcPaths.helpers
        }))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest('dist'));
});

// Handle sass
gulp.task('styles', function () {
    gulp.src(srcPaths.styles)
        .pipe(sass({
            precision: 10
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
    gulp.src(srcPaths.cssEntries)
        .pipe(sass({
            precision: 10,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});

// Development
gulp.task('watch', ['build'], function () {
    gulp.watch(srcPaths.scripts, ['copy:js']);
    gulp.watch(srcPaths.styles, ['styles']);
    gulp.watch([...srcPaths.templates, ...srcPaths.partials], ['hbs']);
});

gulp.task('build', ['hbs', 'styles', 'copy']);