var crypto = require('crypto');
var fs = require('fs');

global.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}

var toString = Object.prototype.toString;

global.isNumber = function(obj){
  return toString.call(obj) === '[object Number]';
};

global.isBoolean = function(obj){
  return toString.call(obj) === '[object Boolean]';
};

global.isObject = function(obj){
  return toString.call(obj) === '[object Object]';
};

global.isString = function(obj){
  return toString.call(obj) === '[object String]';
};

global.isFunction = function(obj){
  return typeof obj === 'function';
};

global.isGeneratorFunction = function(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

global.isArray = Array.isArray;

global.obj2param = function(obj){
    var str = '';
    if(isObject(obj)){
        Object.keys(obj).forEach(function(key){
            str += key + '=' + obj[key] + '&';
        });
        str = str.replace(/&$/,'');
    }
    return str;
}

global.mkdir = function(dir){
    dir = dir.split('/');
    var pathnow = '';
    dir.forEach(function(curDir){
        pathnow += curDir + '/';
        if (!fs.existsSync(pathnow) ) {
            fs.mkdirSync(pathnow);
        }
    });
}

global.getTime = function(){
    var d = new Date;
    d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.toLocaleTimeString();
    return d;
}

global.random = function(len){
    if(isNumber(len)){
        return parseInt(Math.random() * len);
    }
    return len;
}
