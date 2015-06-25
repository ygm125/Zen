var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var transpile  = require('gulp-es6-module-transpiler');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");

var paths = {
	app : {
		src : 'src/app/**',
		build : 'app/'
	},
    view : {
        src : 'src/app/view/**',
        build : 'app/view'
    },
    scripts : {
        src : 'src/res/js/**',
        build : 'res/js'
    },
    revManifest : './'
}

gulp.task('buildApp', function () {
    return gulp.src(paths.app.src)
        .pipe(gulpif(function(file){
            if(/\.js$/.test(file.path)){
                return true;
            }
        },babel({
            "blacklist": ["regenerator"]
        })))
        .pipe(gulp.dest(paths.app.build));
});


gulp.task('buildScripts', function (a,b,c) {
    return gulp.src(paths.scripts.src)
        // .pipe(sourcemaps.init())
        .pipe(gulpif(function(file){
            if(/\/page\//.test(file.path)){
                return true;
            }
        },transpile({
            formatter: 'bundle',
            basePath : __dirname + '/src/res/js'
        })))
        // .pipe(uglify())
        // .pipe(sourcemaps.write('./'))
        .pipe(rev())
        .pipe(gulp.dest(paths.scripts.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revManifest))
});

gulp.task("revReplaceScripts", ["buildScripts"], function(){
  var manifest = gulp.src(paths.revManifest + "rev-manifest.json");

  return gulp.src(paths.view.src)
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(paths.view.build));
});


gulp.task('watch', function() {
  	gulp.watch(paths.app.src, ['buildApp']);
    gulp.watch(paths.scripts.src, ['revReplaceScripts']);
});

gulp.task('default', ['watch']);

