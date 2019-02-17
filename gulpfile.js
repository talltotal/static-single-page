const gulp = require('gulp')
const clean = require('gulp-clean')
const stylelint = require('gulp-stylelint')
const eslint = require('gulp-eslint')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const minifyCSS = require('gulp-minify-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')

const Dist = 'dist'
const Img = 'src/*.png'
const Style = 'src/*.scss'
const Script = 'src/*.js'
const Html = 'src/*.html'

gulp.task('clean', gulp.series(function () {
  return gulp.src(Dist)
    .pipe(clean())
}))

gulp.task('img', gulp.series(function () {
  return gulp.src(Img)
    .pipe(gulp.dest(Dist))
}))

gulp.task('styles', gulp.series(function () {
  return gulp.src(Style)
    .pipe(stylelint({
      fix: true
    }))
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer([
        '> 1%',
        'last 12 versions',
        'not ie <= 8'
      ])
    ]))
    .pipe(minifyCSS())
    .pipe(gulp.dest(Dist))
}))

gulp.task('script', gulp.series(function () {
  return gulp.src(Script)
    .pipe(eslint())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(Dist))
}))

gulp.task('html', gulp.series(function () {
  gulp.src(Html)
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
    }))
    .pipe(gulp.dest(Dist))
}))

gulp.task('default', gulp.series([
  'clean',
  'img',
  'styles',
  'script',
  'html'
]))
