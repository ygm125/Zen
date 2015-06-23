"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var base = (function () {
    function base(app, render) {
        _classCallCheck(this, base);

        this.app = app;
        this.render = render;

        this._data = {};
    }

    _createClass(base, [{
        key: "assign",
        value: function assign(key, fun) {
            if (!arguments.length) {
                return this._data;
            }
            this._data[key] = fun;
        }
    }, {
        key: "display",
        value: function* display(view) {
            var data = yield this.assign();
            this.app.body = yield this.render(view, data);
        }
    }]);

    return base;
})();

exports["default"] = base;
module.exports = exports["default"];