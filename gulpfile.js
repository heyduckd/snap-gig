'use strict';

let gulp = require('gulp');
let eslint = require('gulp-eslint');
let mocha = require('gulp-mocha');

var paths = ['*.js', 'models/*.js', 'routes/*.js', 'test/*.js'];

gulp.task('eslint', () => {
  gulp.src(paths)
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('test', () => {
  gulp.src(__dirname + '/test/*.js')
  .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch', () => {
  gulp.watch(paths);
});

gulp.task('default', ['eslint', 'test']);
