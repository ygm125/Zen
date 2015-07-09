var gulp = require('gulp');
var babel = require('gulp-babel');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var transpile = require('gulp-es6-module-transpiler');
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

var exec = require('child_process').exec;

const PROXYURI = 'http://localhost:8380/';
const BUILDPATH = './.build/www/';

var paths = {
    app: {
        src: 'src/app/**',
        build: 'app'
    },
    view: {
        src: 'src/app/view/**',
        buildSrc: 'app/view/**',
        build: 'app/view'
    },
    res: {
        src: 'src/res/**',
        build: 'res'
    },
    img : {
        src: 'src/res/img/**',
        build: 'res/img'
    },
    js: {
        src: 'src/res/js/**',
        build: 'res/js'
    },
    less: {
        src: 'src/res/less/**',
        buildSrc: 'res/css/**',
        build: 'res/css'
    },
    watchReload: ['app/**/*.html', 'res/js/**', 'res/css/**'],
}

var rpath = {
    less : /\/less\//,
    js : /\/js\//,
    img : /\/img\//,
    jsbundle : /\/js\/page\//,
    view : /\/view\//
}

var getBuildPath = function(path){
    return BUILDPATH + (path || '');
}

var notViewPipe = function() {
    return gulpif(function(file) {
        if (!rpath.view.test(file.path)) {
            return true;
        }
    }, babel({
        "blacklist": ["regenerator"],
        "optional": ["runtime"]
    }));
}

var isPath = function(path) {
    return function(file){
        // js目录下排除jsbundle目录
        if(path == 'js' && rpath['jsbundle'].test(file.path)){
            return false;
        }
        if (rpath[path].test(file.path)) {
            return true;
        }
    }
}

// ========================================
// 开发环境相关==============================

var jsBundleTask = lazypipe().pipe(transpile,{
    formatter: 'bundle',
    basePath: __dirname + '/src/res/js'
}).pipe(babel,{
    "blacklist": ["regenerator"]
});

gulp.task('app', function() {
    return gulp.src(paths.app.src)
        .pipe(notViewPipe())
        .pipe(gulp.dest(paths.app.build));
});

gulp.task('js', function() {
    return gulp.src(paths.js.src)
        .pipe(gulpif(isPath('jsbundle'),jsBundleTask()))
        .pipe(gulp.dest(paths.js.build));
});

gulp.task('less', function() {
    return gulp.src(paths.less.src)
        .pipe(less())
        .pipe(gulp.dest(paths.less.build));
});

gulp.task('img', function() {
    return gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.build));
});

gulp.task('res', ['js', 'less','img']);

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: PROXYURI
    });

    gulp.watch(paths.watchReload).on('change', function() {
        browserSync.reload();
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.app.src, ['app']);
    gulp.watch(paths.res.src, ['res']);
});

gulp.task('dev', ['watch', 'browser-sync']);

gulp.task('server', ['app', 'res'], function(cb) {
    var handle = exec('npm start', function(err) {
        if (err) console.log(err)
    });

    handle.stdout.on('data', function(data) {
        console.log(data);
    });
});

// ============================================
// 部署环境相关==================================

var buildJsTask = lazypipe().pipe(sourcemaps.init).pipe(uglify).pipe(sourcemaps.write,'./');

var buildJsBundleTask = lazypipe().pipe(transpile,{
    formatter: 'bundle',
    basePath: __dirname + '/src/res'
}).pipe(babel,{
    "blacklist": ["regenerator"]
}).pipe(buildJsTask);

var buildLessTask = lazypipe().pipe(less).pipe(minifyCss);

function replaceManifest(src,dest){
    var manifest = gulp.src(getBuildPath("rev-manifest.json"));

    return gulp.src(src)
    .pipe(revReplace({
        manifest: manifest,
        replaceInExtensions : ['.js', '.css', '.html']
    }))
    .pipe(gulp.dest(dest));
}

gulp.task('revView', function () {
    var src = getBuildPath(paths.view.buildSrc);
    var dest = getBuildPath(paths.view.build);
    return replaceManifest(src, dest);
});

gulp.task('revCss', function () {
    var src = getBuildPath(paths.less.buildSrc);
    var dest = getBuildPath(paths.less.build);
    return replaceManifest(src, dest);
});

gulp.task('buildApp',['clean'], function () {
    return gulp.src(paths.app.src)
        .pipe(notViewPipe())
        .pipe(gulp.dest(getBuildPath(paths.app.build)));
});

gulp.task('buildRes',['clean'], function () {
    return gulp.src(paths.res.src)
        .pipe(gulpif(isPath('jsbundle'),buildJsBundleTask()))
        .pipe(gulpif(isPath('js'),buildJsTask()))
        .pipe(gulpif(isPath('img'),imagemin({optimizationLevel: 5})))
        .pipe(gulpif(isPath('less'),buildLessTask()))
        .pipe(rename(function(path){
            path.dirname = path.dirname.replace('less','css');
        }))
        .pipe(rev())
        .pipe(gulp.dest(getBuildPath(paths.res.build)))
        .pipe(rev.manifest())
        .pipe(gulp.dest(getBuildPath()));
});

gulp.task('clean', function(cb) {
    del([BUILDPATH], cb);
});

gulp.task('build',['buildRes','buildApp'], function() {
    gulp.run('revView');
    gulp.run('revCss');
});

gulp.task('deploy', ['build'],function(){
    var handle = exec('sh release.sh', function(err) {
        if (err) console.log(err)
    });

    handle.stdout.on('data', function(data) {
        console.log(data);
    });
});



