var gulp = require('gulp');
var webserver = require('gulp-webserver');
var clean = require('gulp-clean');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var runSequence = require('run-sequence');

var paths = {
	frameworkFiles: ['root/framework/**/*.*'],
	customGameFiles: ['root/src/**/*.*'],
	assets: ['root/assets/**/*.*'],
	index: ['root/index.html']
};

gulp.task('clean', function() {
	return gulp.src('./dist/*', {read: false})
				.pipe(clean());
});

gulp.task('scriptAndStyleFiles', function() {
	return gulp.src('./root/index.html')
				.pipe(useref())
				.pipe(gulpif('*.js', uglify()))
				.pipe(gulpif('*.css', minifyCss()))
				.pipe(gulp.dest('./dist'));
});

gulp.task('scriptAndStyleFilesDev', function() {
	return gulp.src('./root/index.html')
				.pipe(useref())
				.pipe(gulp.dest('./dist'));
});

gulp.task('assets', function() {
	return gulp.src(paths.assets)
				.pipe(gulp.dest('./dist/assets'));
});

gulp.task('webserver', function() {
	gulp.src('./dist')
		.pipe(webserver({
			livereload: true,
			directoryListing: false,
			open: true
		}));
});

gulp.task('watch', function() {
	gulp.watch(paths.frameworkFiles, ['scriptAndStyleFiles']);
	gulp.watch(paths.customGameFiles, ['scriptAndStyleFiles']);
	gulp.watch(paths.assets, ['assets']);
	gulp.watch(paths.index, ['scriptAndStyleFiles']);
});

gulp.task('watchDev', function() {
	gulp.watch(paths.frameworkFiles, ['scriptAndStyleFilesDev']);
	gulp.watch(paths.customGameFiles, ['scriptAndStyleFilesDev']);
	gulp.watch(paths.assets, ['assets']);
	gulp.watch(paths.index, ['scriptAndStyleFilesDev']);
});

gulp.task('default', function(callback) {
	runSequence('clean', 'scriptAndStyleFiles', 'assets', 'webserver', 'watch', callback);
});

gulp.task('dev', function(callback) {
	runSequence('clean', 'scriptAndStyleFilesDev', 'assets', 'webserver', 'watchDev', callback);
});