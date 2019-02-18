const fs = require('fs')
const gulp = require('gulp')
const through = require('through2')
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
const Handlebars = require('handlebars')
const wrap = require('gulp-wrapper')

const tempData = require('./src/data.js')

const Dist = 'dist'
const Img = 'src/*.png'
const Style = 'src/index.scss'
const Script = 'src/index.js'
const Html = 'src/*.html'
const Temp = 'src/index.hbs'

const t = fs.readFileSync('src/svgIcon.hbs')
Handlebars.registerHelper('equals', function (a, b, options) {
  if ((a != null ? a.toString() : void 0) === (b != null ? b.toString() : void 0)) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})
Handlebars.registerPartial('svgIcon', Handlebars.compile(t.toString()))

gulp.task('clean', gulp.series(function () {
  return gulp.src(Dist, {
    allowEmpty: true,
  })
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

gulp.task('temp', gulp.series(function () {
  return gulp.src(Temp)
    .pipe(through.obj(function (file, enc, cb) {
      if (file.isNull()) {
        cb(null, file)
        return
      }
      if (file.isBuffer()) {
        const template = Handlebars.compile(file.contents.toString())
        file.contents = Buffer.from(template(tempData))
        file.path = file.path.replace(/\.hbs$/, '.html')
      }
      if (file.isStream()) {
        console.log('1')
      }

      cb(null, file)
    }))
    .pipe(wrap({
      header: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="stylesheet" href="./index.css">
        </head>`,
      footer: `    <script type="text/javascript" src="./index.js"></script>
      </body>
    </html>`,
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
    }))
    .pipe(gulp.dest(Dist))
}))

gulp.task('html', gulp.series(function () {
  return gulp.src(Html)
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
  'temp'
]))
