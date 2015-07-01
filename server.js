//基础初始化
global.ROOT_PATH = __dirname;
global.APP_DEBUG = true;
if ( process.argv.indexOf( '--online' ) > -1 ) {
    global.APP_DEBUG = false;
}
require( './config' );
require( './base' );

//应用初始化
var fs = require( 'fs' );
var koa = require( 'koa' );
var staticCache = require( 'koa-static-cache' );
var bodyParser = require( 'koa-bodyparser' );

var app = koa();
var route = require( './route' );

app.use( staticCache( Config.res, {
    maxAge: Config.maxAge,
    dynamic : true
} ) );

app.use( require( 'koa-response-time' )() );

app.use( bodyParser() );

route( app );

app.on( 'error', function( err ) {
    console.log( 'server error' + err ,'\ntime at ' +  getTime());
} );

app.listen( Config.port );

console.log('server running at http://127.0.0.1:' + Config.port);

if(Config.watchFiles){
    watchFiles([Config.model,Config.controller]);
}
