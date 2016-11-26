var gulp = require('gulp');
var PipeQueue = require('pipe-queue');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('default',() => {
	var $queue = new PipeQueue();
	var stream1 = gulp.src('src/**/*.js').pipe(babel({presets:['latest']})).pipe(gulp.dest('dist/js'));
	var stream2 = gulp.src('src/**/*.scss').pipe(sass()).pipe(gulp.dest('dist/css'));
	
	$queue.when(stream1,stream2).then(function(next,merge) {
		var stream1 = gulp.src('dist/js/*.js').pipe(concat()).pipe(rename('main.js')).pipe(gulp.dest('dist'));
		var stream2 = gulp.src('dist/css/*.css').pipe(concat()).pipe(rename('style.css')).pipe(gulp.dest('dist'));
		merge(stream1,stream2).on('end',next)
	}).end(function() {
		console.log('finished!');
	});

	return $queue.promise();
});