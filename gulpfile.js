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
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var minifyCss = require('gulp-minify-css');
var argv = require('yargs').argv;
var exec = require( 'child_process' ).exec;

const PRODUCTION = argv.production;
const PROXYURI = 'http://localhost:8380/';

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
        buildSrc : 'res/css/**',
        build : 'res/css'
    },
    watchReload : ['app/**/*.html','res/js/**','res/css/**'],
    revManifest : './'
}

var ifJs = function(file){
    if(ifJsBundle(file)){
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
var ifImg = function(file){
    if(/\/img\//.test(file.path)){
        return true;
    }
}

var jsTask = lazypipe().pipe(babel,{
    compact : false
});

var jsBundleTask= lazypipe().pipe(transpile,{
    formatter: 'bundle',
    basePath : __dirname + '/src/res/'
});

var lessTask = lazypipe().pipe(less);

//生产环境处理js、css
if(PRODUCTION){
    jsTask = jsTask.pipe(sourcemaps.init)
                       .pipe(uglify)
                       .pipe(sourcemaps.write,'./');
    lessTask = lessTask.pipe(minifyCss);
}

jsBundleTask = jsBundleTask.pipe(jsTask);

function replaceManifest(src,dest){
    var manifest = gulp.src(paths.revManifest + "rev-manifest.json");

    return gulp.src(src)
    .pipe(revReplace({
        manifest: manifest,
        replaceInExtensions : ['.js', '.css', '.html','.less']
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('clean', function(cb) {
  del([paths.res.build], cb);
});

gulp.task('app', function () {
    return gulp.src([paths.app.src,'!'+paths.view.src])
        .pipe(babel({
            "blacklist": ["regenerator"]
        }))
        .pipe(gulp.dest(paths.app.build));
});

gulp.task('res', function () {
    return gulp.src(paths.res.src)
        .pipe(gulpif(ifJsBundle,jsBundleTask()))
        .pipe(gulpif(ifJs,jsTask()))
        .pipe(gulpif(ifLess,lessTask()))
        .pipe(gulpif(ifImg,imagemin({optimizationLevel: 5})))
        .pipe(rename(function(path){
            path.dirname = path.dirname.replace('less','css');
        }))
        .pipe(rev())
        .pipe(gulp.dest(paths.res.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.revManifest))
});

gulp.task('view', function () {
    return replaceManifest(paths.view.src,paths.view.build);
});

gulp.task('image', function () {
    return replaceManifest(paths.less.buildSrc, paths.less.build);
});

gulp.task("revRes", ["res"], function(){
    gulp.run('view');
    gulp.run('image');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: PROXYURI
    });

    gulp.watch(paths.watchReload).on('change', function(){
        browserSync.reload();
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.app.src, ['app']);
    gulp.watch(paths.view.src, ['view']);
    gulp.watch(paths.res.src, ['revRes']);
});

gulp.task('init', ['app','view','revRes']);

gulp.task('server',['init'] ,function(){
    var handle = exec('npm start', function(err) {
        if(err) console.log(err)
    });

    handle.stdout.on('data',function(data){
        console.log(data);
    });
});

gulp.task('start', ['watch','browser-sync']);

// gulp.task('default', ['app','view','revRes','watch','browser-sync']);

