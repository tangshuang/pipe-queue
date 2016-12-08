var gulp = require('gulp')
var PipeQueue = require('../dist/pipe-queue')
var sass = require('gulp-sass')
var babel = require('gulp-babel')
var concat = require('gulp-concat')
var clean = require("gulp-clean")

gulp.task('default',() => {
	var $queue = new PipeQueue()
	
	$queue.when(function(next) {
		gulp.src("dist", {read: false}).pipe(clean()).pipe(gulp.dest(".")).on("end", next)
	}).then(function(next, merge) {
		// transform ES6 code to ES5 code
		var stream1 = gulp.src('src/**/*.js')
					  .pipe(babel({presets:['latest']}))
					  .pipe(gulp.dest('dist/js'))
		// transform scss to css
		var stream2 = gulp.src('src/**/*.scss')
					  .pipe(sass())
					  .pipe(gulp.dest('dist/css'))

		merge(stream1,stream2).on('end',next)
	}).then(function(next, merge) {
		// concat js together
		var stream1 = gulp.src('dist/js/*.js')
						  .pipe(concat('main.js'))
						  .pipe(gulp.dest('dist'))
		// concat css togethor
		var stream2 = gulp.src('dist/css/*.css')
						  .pipe(concat('style.css'))
						  .pipe(gulp.dest('dist'))

		merge(stream1,stream2).on('end',next)
	}).end(function() {
		console.log('finished!')
	})

	return $queue.promise()
})