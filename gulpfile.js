var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sprite = require('gulp-sprite-generator'),
    concat = require('gulp-concat'),
    open = require('gulp-open');

var env,
    jsSources,
    htmlSources,
    devDir,
    prodDir,
    filesToMove;

env = process.env.NODE_ENV || 'development';
devDir = 'builds/development/';
prodDir = 'builds/production/';


jsSources = [
    devDir+'/js/*.js',
    devDir+'/js/**/*.js'
];
htmlSources = [devDir + '*.html', devDir +'/pages/*.html'];

filesToMove = [
    '/lib/**/*.*'
];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(gulpif(env === 'production',concat('script.js')))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'production',gulp.dest(prodDir + 'js')))
    .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(prodDir)))
        .pipe(connect.reload())
});

gulp.task('move',['clean'], function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(filesToMove, { base: './' })
        .pipe(gulpif(env === 'production',gulp.dest('dist')));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(devDir+'/*.html', ['html']);
  gulp.watch(devDir+'/pages/*.html', ['pages']);
});

gulp.task('connect', function() {
  connect.server({
	port: 9000,
    root: outputDir,
    livereload: true
  });
});

gulp.task('open', function(){
    gulp.src('builds/'+env+'/*.html')
        .pipe(open('', {app: 'chrome', url: 'http://localhost:9000'}));
});

// JSHint task
gulp.task('lint', function() {
    return gulp.src(gulp.dest(devDir)+'/js/**/*.js')
        .pipe(jshint())
        // You can look into pretty reporters as well
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['html','move', 'js', 'connect', 'watch', 'lint', 'open']);