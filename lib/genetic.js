var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./max-rect-bin-pack"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var max_rect_bin_pack_1 = __importDefault(require("./max-rect-bin-pack"));
    var Genetic = /** @class */ (function () {
        function Genetic(rects, options) {
            this.rects = [];
            this.totalSquares = 0;
            this.maxHeight = -1;
            this.maxWidth = -1;
            this.randomDots = [];
            if (!options) {
                options = {};
            }
            this.rects = rects;
            this.size = options.size < 20 ? 20 : options.size;
            this.lifeTimes = options.lifeTimes || 8;
            this.liveRate = options.liveRate || 0.5;
            if (this.liveRate < 0 || this.liveRate > 1) {
                this.liveRate = 0.5;
            }
            this.findPosition = options.findPosition;
        }
        Object.defineProperty(Genetic.prototype, "minHeight", {
            get: function () {
                return this.totalSquares / this.maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Genetic.prototype, "minWidth", {
            get: function () {
                return this.totalSquares / this.maxHeight;
            },
            enumerable: true,
            configurable: true
        });
        Genetic.prototype.calc = function () {
            this.open();
            this.work();
            return this.close();
        };
        Genetic.prototype.open = function () {
            // 二维空间内寻找边界
            for (var _i = 0, _a = this.rects; _i < _a.length; _i++) {
                var rect = _a[_i];
                this.totalSquares = rect.height * rect.width + this.totalSquares;
                this.maxHeight = rect.height + this.maxHeight;
                this.maxWidth = rect.width + this.maxWidth;
            }
            // 二维空间内生成随机点 虽然无法保证分布是随机分布，但是对遗传算法来说无所谓了。
            for (var i = 0; i < this.size; i++) {
                var randomHeight = this.maxHeight * Math.random() + this.minHeight;
                var randomWidth = this.maxWidth * Math.random() + this.minWidth;
                this.randomDots.push({
                    x: randomWidth,
                    y: randomHeight,
                });
            }
        };
        Genetic.prototype.work = function () {
            while (this.lifeTimes--) {
                var generation = [];
                for (var _i = 0, _a = this.randomDots; _i < _a.length; _i++) {
                    var dot = _a[_i];
                    // 生活
                    var binPack = new max_rect_bin_pack_1.default(dot.x, dot.y, true);
                    var clonedRects = this.getRects();
                    var result = binPack.insertRects(clonedRects, this.findPosition);
                    generation.push({
                        dot: dot,
                        fitAll: result.length === this.rects.length,
                        occupancy: binPack.occupancy(),
                    });
                }
                // 淘汰
                generation.sort(function (geneticA, geneticB) {
                    if (geneticB.fitAll && geneticA.fitAll) {
                        return geneticB.occupancy - geneticA.occupancy;
                    }
                    else if (geneticB.fitAll) {
                        return 1;
                    }
                    else if (geneticA.fitAll) {
                        return -1;
                    }
                    else {
                        return geneticB.occupancy - geneticA.occupancy;
                    }
                });
                this.bestDot = generation[0].dot;
                // 后置位淘汰有利于数据优化
                if (generation.length > this.size) {
                    generation.splice(this.size, generation.length - this.size);
                }
                var killerStart = Math.ceil(this.liveRate * generation.length);
                generation.splice(killerStart, generation.length - killerStart);
                for (var i = generation.length - 1; i > 0; i--) {
                    if (!generation[i].fitAll) {
                        generation.splice(i, 1);
                    }
                }
                this.randomDots = [];
                // 新生
                if (generation.length === 0 || generation.length === 1) {
                    // 如果团灭了 或者 无法继续交配
                    for (var i = 0; i < this.size; i++) {
                        var randomHeight = this.maxHeight * Math.random() + this.minHeight;
                        var randomWidth = this.maxWidth * Math.random() + this.minWidth;
                        this.randomDots.push({
                            x: randomWidth,
                            y: randomHeight,
                        });
                    }
                }
                else {
                    // 非随机交配
                    for (var i = 0; i < generation.length; i++) {
                        this.randomDots.push(generation[i].dot);
                        for (var j = i + 1; j < generation.length; j++) {
                            var startPoint = generation[i].dot;
                            var endPoint = generation[j].dot;
                            var _b = this.cross(startPoint.x, endPoint.x), sonX = _b[0], daughterX = _b[1];
                            var _c = this.cross(startPoint.y, endPoint.y), sonY = _c[0], daughterY = _c[1];
                            this.randomDots.push({
                                x: sonX,
                                y: sonY,
                            });
                            this.randomDots.push({
                                x: daughterX,
                                y: daughterY,
                            });
                        }
                    }
                    // 基因突变
                    for (var i = 0; i < 20; i++) {
                        var randomHeight = this.maxHeight * Math.random() + this.minHeight;
                        var randomWidth = this.maxWidth * Math.random() + this.minWidth;
                        this.randomDots.push({
                            x: randomWidth,
                            y: randomHeight,
                        });
                    }
                }
            }
        };
        Genetic.prototype.close = function () {
            return this.bestDot;
        };
        Genetic.prototype.getRects = function () {
            return this.rects.map(function (i) { return i.clone(); }); // tslint:disable-line arrow-parens
        };
        Genetic.prototype.cross = function (x, y) {
            var lerp = function (a, b) {
                return a + (b - a);
            };
            var formX = parseInt(x * 100 + '', 10);
            var formY = parseInt(y * 100 + '', 10);
            var binX = formX
                .toString(2)
                .split('')
                .map(function ($) { return parseInt($, 10); }); // tslint:disable-line
            var binY = formY
                .toString(2)
                .split('')
                .map(function ($) { return parseInt($, 10); }); // tslint:disable-line
            var son = [].concat(binX);
            var daughter = [].concat(binY);
            var i = Math.floor(Math.random() * binY.length);
            son[i] = lerp(binX[i], binY[i]);
            daughter[i] = lerp(binY[i], binX[i]);
            var sonvalue = parseInt(son.join(''), 2) / 100;
            var daughtervalue = parseInt(daughter.join(''), 2) / 100;
            return [sonvalue, daughtervalue];
        };
        return Genetic;
    }());
    exports.Genetic = Genetic;
    function default_1(rect, options) {
        var g = new Genetic(rect, options);
        return g.calc();
    }
    exports.default = default_1;
});
//# sourceMappingURL=genetic.js.map