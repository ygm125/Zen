var gulp = require('gulp');
var babel = require('gulp-babel');

var paths = {
	controller : {
		src : 'src/app/controller/**/*.js',
		build : 'app/controller'
	}
}

gulp.task('buildController', function () {
    return gulp.src(paths.controller.src)
        .pipe(babel({
        	"blacklist": ["regenerator"]
        }))
        .pipe(gulp.dest(paths.controller.build));
});

gulp.task('watch', function() {
  	gulp.watch(paths.controller.src, ['buildController']);
});

gulp.task('default', ['watch']);