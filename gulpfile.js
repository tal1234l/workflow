var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
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
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

jsSources = [
  'components/lib/angular/angular.min.js',
  'components/lib/angular/angular-animate.min.js',
  'components/lib/angular/angular-route.min.js'
];

jsonSources = [
    'builds/development/js/*.json',
    'components/lib/angular/angular.min.js.map',
    'components/lib/angular/angular-animate.min.js.map',
    'components/lib/angular/angular-route.min.js.map'
];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html', outputDir +'/views/*.html'];
jsonSources = [outputDir + 'js/*.json'];


gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: outputDir + 'images',
      style: sassStyle
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/views/*.html', ['views']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch('builds/development/images/**/*.*', ['images']);
});

gulp.task('connect', function() {
  connect.server({
	port: 9000,
    root: outputDir,
    livereload: true
  });
});

gulp.task('views', function() {
    gulp.src('builds/development/views/*.html')
        .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('images', function() {
  gulp.src('builds/development/images/**/*.*')
    .pipe(gulpif(env === 'production', imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('open', function(){
    gulp.src('builds/development/*.html')
        .pipe(open('', {app: 'chrome', url: 'http://localhost:9000'}));
});

// JSHint task
gulp.task('lint', function() {
    return gulp.src(gulp.dest(outputDir)+'/js/*.js')
        .pipe(jshint())
        // You can look into pretty reporters as well
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['html','views', 'json', 'js', 'compass', 'images','sprites', 'connect', 'watch', 'lint', 'open']);