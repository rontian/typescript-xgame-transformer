window.xgame = {};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

(function (xgame) {
    var Demo = /** @class */ (function () {
        function Demo() {
            this.hashCode = 100;
        }
        Demo.prototype.echo = function () {
        };
        Demo = __decorate([
            xgame.clazz("xgame.Demo", "xgame.IXObject"),
            __metadata("design:paramtypes", [])
        ], Demo);
        return Demo;
    }());
    xgame.Demo = Demo;
})(xgame || (xgame = {}));

(function (xgame) {
    var Panel = /** @class */ (function () {
        function Panel(title, body) {
            this.title = title;
            this.body = body;
        }
        Panel.prototype.start = function () {
        };
        Panel = __decorate([
            xgame.clazz("xgame.Panel"),
            __metadata("design:paramtypes", [String, String])
        ], Panel);
        return Panel;
    }());
    xgame.Panel = Panel;
})(xgame || (xgame = {}));

(function (xgame) {
    function clazz(className) {
        var interfaceNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            interfaceNames[_i - 1] = arguments[_i];
        }
        return function (target) {
            var _a;
            target.__class__ = className;
            if (interfaceNames.length) {
                if (target.__implements__) {
                    (_a = target.__implements__).push.apply(_a, interfaceNames);
                }
                else {
                    target.__implements__ = interfaceNames;
                }
            }
        };
    }
    xgame.clazz = clazz;
})(xgame || (xgame = {}));
