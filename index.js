var cluster = require('cluster');
var fs = require("fs");

var cpus = require( 'os' ).cpus().length;

cluster.setupMaster({
    exec : './server.js',
    args : [],
    silent : false
});

for(var i = cpus ; i--;){
    cluster.fork()
}

cluster.on( 'death', function( worker ) {
    console.log( 'worker ' + worker.pid + ' died' );
    cluster.fork();
} );

cluster.on( 'exit', function( worker ) {
    console.log( 'worker ' + worker.process.pid + ' died');
    cluster.fork();
} );

var pidFile = './app.pid';
fs.writeFileSync(pidFile, process.pid);
