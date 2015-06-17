global.Controller = Class.extend({
	basePath : Config.controller,
    init: function(app,render){
        this.app = app;
        this.render = render;

        this._data = {};
    },
    assign : function(key,fun){
        if(!arguments.length){
            return this._data;
        }
        this._data[key] = fun;
    },
    display : function* (view){
        var data = yield this.assign();
        this.app.body = yield this.render(view,data);
    }
});
