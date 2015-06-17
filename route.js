var fs = require('fs');
var views = require('co-views');

var render = views(Config.view, {
    map: { html: 'swig' }
});

function route (app) {
	app.use(function* pageRoute(next){
		var pathInfo = parseRoute(this);
		if(!fs.existsSync(pathInfo.ctrol)){
			if(APP_DEBUG){
				this.throw(pathInfo.ctrol + ' not exits');
			}
			return yield* next;
		}

		var ctrol = require(pathInfo.ctrol);

		if(isFunction(ctrol)){
			ctrol = new ctrol(this,render);
		}

		var action = ctrol[pathInfo.action];

		if(!isFunction(action)){
			if(APP_DEBUG){
				this.throw(pathInfo.ctrol + ' ==> ' + action + ' is not a Function');
			}
			return yield* next;
		}
		
		try {
			if(isFunction(ctrol.beforeAction)){
				var beforeState = yield ctrol.beforeAction.call(ctrol,pathInfo.param);
				if(!beforeState){
					return;
				}
			}

			yield* action.call(ctrol,pathInfo.param);

			if(isFunction(ctrol.afterAction)){
				yield ctrol.afterAction.call(ctrol,pathInfo.param);
			}

		} catch (err) {
			console.log(err);
			this.status = 500;
		}
	});

	app.use(function* pageNotFound(next){
		yield* next;
		if (404 != this.status) return;
		this.status = 404;
	  	this.body = '404';
	});
}

module.exports = route;
