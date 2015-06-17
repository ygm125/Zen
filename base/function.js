var url = require('url');

global.parseRoute = function(app){

    var urlInfo = url.parse('//' + app.req.headers.host + app.req.url, true, true);       

    var paths = urlInfo.pathname.slice(1).split('/');

    var ctrolPath = paths.slice(0,-3);

    var execFile = paths.slice(-3);

    var ctrolName = (execFile[0] || 'index') + '.js';
    var action = execFile[1];
    var param = execFile[2];

    if(execFile.length < 2){
        param = action;
        action = 'index';
    }

    if(Config.groups.indexOf(ctrolPath[0]) == -1){
        ctrolPath.unshift(Config.def_group);
    }

    ctrolPath = [Config.controller,ctrolPath,ctrolName].join('/');

    return {
        ctrol : ctrolPath,
        action : action,
        param : param       
    }
}

//TODO 抽空重新整理
;(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  var Class = this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(base,prop) {
    if(arguments.length > 1){
        base = (this.prototype.basePath || '') + base;
        base = require(base);
        return base.extend(prop);
    }else{
        prop = base;
        base = null;
    }

    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
}).call(global);



