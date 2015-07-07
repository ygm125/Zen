class Base{

    constructor(app,render){

        app.render = render;

        app._data = { };

        app.assign = function(key,fun) {
            if(!arguments.length){
                return this._data;
            }
            this._data[key] = fun;
        }

        app.display = function* (view) {
            var data = yield this.assign();
            this.body = yield this.render(view,data);
        }

    }

}

export default Base;