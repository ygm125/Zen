global.Config = getConfig();

function getConfig(){
    
	var app = ROOT_PATH + '/app';
	var controller = app + '/controller';
	var view = app + '/view';
	var model = app + '/model';

    var res_prefix = '/res';
	var res = ROOT_PATH + '/res';
	var js = res + '/js';
	var css = res + '/css';
	var img = res + '/img';


    if(APP_DEBUG){
        var maxAge = 0;
    }else{
        var maxAge = 365 * 24 * 60 * 60;
    }

    return {
        port : 8380,
        maxAge : maxAge,
        secret : 8888,

        db : {
            host : '',
            port : 27017,
            database : ''
        },

        groups : ['home','admin'],
        def_group : 'home',

    	root : ROOT_PATH,
    	app : app,
    	model : model,
    	view : view,
    	controller : controller,
    	res : res,
        res_prefix : res_prefix,
    	js : js,
    	css : css,
    	img : img
    }
}

