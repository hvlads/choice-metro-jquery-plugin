var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
const minify = require('gulp-minify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var reload = browserSync.reload;

gulp.task('build-html', function () {
    return gulp.src('*.html')
        .pipe(reload({ stream:true }));
});


gulp.task('build-js', function () {
    return gulp.src('./src/*.js')
        .pipe(minify())
        .pipe(gulp.dest('./dist'))
        .pipe(reload({ stream:true }));
});

gulp.task('build-css', function () {
    return gulp.src('./src/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'))
        .pipe(reload({ stream:true }));
});

gulp.task('serve', function() {

    browserSync.init({
        server: "./"
        // or
        // proxy: 'yourserver.dev'
    });
    //gulp.watch("*").on('change', browserSync.reload);
});

gulp.task('default', ['build-html', 'build-css', 'build-js', 'serve'], function () {

    gulp.watch(['*.html'], ['build-html']);
    gulp.watch(['src/*.scss'], ['build-css']);
    gulp.watch(['src/*.js'], ['build-js']);
});
