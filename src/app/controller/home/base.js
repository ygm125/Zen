class Base{

    constructor(app,render){
        this.app = app;
        this.render = render;
        
        this._data = {};
    }

    assign(key,fun){
        if(!arguments.length){
            return this._data;
        }
        this._data[key] = fun;
    }

    *display(view){
        var data = yield this.assign();
        this.app.body = yield this.render(view,data);
    }

}

export default Base;