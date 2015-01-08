var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    htmlreplace = require('gulp-html-replace'),
    minifyCSS = require('gulp-minify-css'),
    jsonminify = require('gulp-jsonminify'),
    sprite = require('gulp-sprite-generator'),
    concat = require('gulp-concat'),
    open = require('gulp-open');

var env,
    jsSources,
    htmlSources,
    cssSources,
    devDir,
    prodDir,
    filesToMove,
    pageSources;

env = process.env.NODE_ENV || 'development';
devDir = 'builds/development/';
prodDir = 'builds/production/';

jsSources = [
    devDir+'/js/*.js',
    devDir+'/js/**/*.js'
];
htmlSources = [devDir + '*.html'];
pageSources = [devDir +'pages/*.html'];
cssSources =  [devDir +'css/*.css'];
filesToMove = [devDir+'/lib/**/*.*'];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(gulpif(env === 'production',concat('script.js')))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify({mangle: false})))
    .pipe(gulpif(env === 'production',gulp.dest(prodDir + 'js')))
    .pipe(connect.reload())
});

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', htmlreplace({
            'js': 'js/script.js',
            'css': 'css/style.css'
        })))
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(prodDir)))
        .pipe(connect.reload())
});

gulp.task('pages', function() {
    gulp.src(pageSources)
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(prodDir+'pages')))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(cssSources)
        .pipe(gulpif(env === 'production', minifyCSS({keepBreaks:true})))
        .pipe(gulpif(env === 'production', gulp.dest(prodDir+'css')))
        .pipe(connect.reload())
});

gulp.task('move', function(){
    gulp.src(filesToMove)
        .pipe(gulpif(env === 'production',gulp.dest(prodDir+'lib')));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(devDir+'/*.html', ['html']);
  gulp.watch(devDir+'/pages/*.html', ['pages']);
  gulp.watch(devDir+'/css/*.css', ['css']);
});

gulp.task('connect', function() {
  connect.server({
	port: 9000,
    root: 'builds/'+env+'/',
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

gulp.task('default', ['html','move','pages', 'js','css', 'connect', 'watch', 'lint', 'open']);