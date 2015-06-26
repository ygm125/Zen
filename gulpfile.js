var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var transpile  = require('gulp-es6-module-transpiler');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var less = require('gulp-less');
var lazypipe = require('lazypipe');
var rename = require("gulp-rename");
var del = require('del');

var paths = {
    app : {
        src : 'src/app/**',
        build : 'app'
    },
    view : {
        src : 'src/app/view/**',
        build : 'app/view'
    },
    res : {
        src : 'src/res/**',
        build : 'res'
    },
    js : {
        src : 'src/res/js/**',
        build : 'res/js'
    },
    less : {
        src : 'src/res/less/**',
        build : 'res/css'
    },
    revManifest : './'
}

var ifJs = function(file){
    if(/\/js\/page\//.test(file.path)){
        return false;
    }
    if(/\/js\//.test(file.path)){
        return true;
    }
}
var ifJsBundle = function(file){
    if(/\/js\/page\//.test(file.path)){
        return true;
    }
}
var ifLess = function(file){
    if(/\/less\//.test(file.path)){
        return true;
    }
}

var jsTask = lazypipe().pipe(uglify);

var jsBundleTask= lazypipe().pipe(transpile,{
    formatter: 'bundle',
    basePath : __dirname + '/src/res/'
});//.pipe(jsTask);

var lessTask = lazypipe().pipe(less);

gulp.task('clean', function(cb) {
  del([paths.res.build], cb);
});

gulp.task('res', function () {
    return gulp.src(paths.res.src)
        .pipe(gulpif(ifJsBundle,jsBundleTask()))
        // .pipe(gulpif(ifJs,jsTask()))
        .pipe(gulpif(ifLess,lessTask()))
        .pipe(rename(function(path){
            path.dirname = path.dirname.replace('less','css');
        }))
        .pipe(rev())
        .pipe(gulp.dest(paths.res.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revManifest))
});

gulp.task("revRes", ["res"], function(){
    gulp.run('view');
});

gulp.task('app', function () {
    return gulp.src([paths.app.src,'!'+paths.view.src])
        .pipe(babel({
            "blacklist": ["regenerator"]
        }))
        .pipe(gulp.dest(paths.app.build));
});

gulp.task('view', function () {
    var manifest = gulp.src(paths.revManifest + "rev-manifest.json");

    return gulp.src(paths.view.src)
    .pipe(revReplace({
        manifest: manifest
    }))
    .pipe(gulp.dest(paths.view.build));
});

gulp.task('watch', function() {
    gulp.watch(paths.app.src, ['app']);
    gulp.watch(paths.view.src, ['view']);
    gulp.watch(paths.res.src, ['revRes']);
});

gulp.task('default', ['watch']);

