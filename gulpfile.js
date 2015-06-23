var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');

var paths = {
	controller : {
		src : 'src/app/**',
		build : 'app/'
	}
}

gulp.task('buildApp', function () {
    return gulp.src(paths.controller.src)
        .pipe(gulpif(function(file){
            if(/\.js$/.test(file.path)){
                return true;
            }
        },babel({
            "blacklist": ["regenerator"]
        })))
        .pipe(gulp.dest(paths.controller.build));
});

gulp.task('watch', function() {
  	gulp.watch(paths.controller.src, ['buildApp']);
});

gulp.task('default', ['watch']);