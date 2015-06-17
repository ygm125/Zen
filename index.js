//基础初始化
global.ROOT_PATH = __dirname;
global.APP_DEBUG = true;
if ( process.argv.indexOf( '--online' ) > -1 ) {
    global.APP_DEBUG = false;
}
require( './config' );
require( './base' );

//应用初始化
var cluster = require( 'cluster' );
var koa = require( 'koa' );
var favicon = require( 'koa-favicon' );
var staticCache = require( 'koa-static-cache' );
var bodyParser = require( 'koa-bodyparser' );
var fs = require( 'fs' );

var app = koa();
var route = require( './route' );

app.use( staticCache( Config.res, {
    maxAge: Config.maxAge,
    prefix: Config.res_prefix,
    dynamic : true
} ) );

app.use( favicon( Config.img + '/favicon.ico' ) );

app.use( require( 'koa-response-time' )() );

app.use( bodyParser() );

route( app );

app.on( 'error', function( err ) {
    console.log( 'server error' + err ,'\ntime at ' +  getTime());
} );

if ( cluster.isMaster ) {
    for ( var i = 0, len = require( 'os' ).cpus().length; i < len; i++ ) {
        cluster.fork();
    }
    cluster.on( 'death', function( worker ) {
        console.log( 'worker ' + worker.pid + ' died' );
        cluster.fork();
    } );
    cluster.on( 'exit', function( worker ) {
        console.log( 'worker ' + worker.process.pid + ' died at:', getTime() );
        cluster.fork();
    } );

    var pidFile = './app.pid';
    fs.writeFileSync(pidFile, process.pid);

} else {
    app.listen( Config.port );
    console.log( 'listening on port ' + Config.port );
}



