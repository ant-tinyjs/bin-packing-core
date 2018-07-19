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
    var Search = /** @class */ (function () {
        /**
         * 初始化
         * @param rects 要插入的矩形数组
         * @param allowRotate 是否旋转
         * @param step 搜索步长 建议10
         * @param findPosition FindPostion 策略
         * @param rate 大于一的比率 等于1不可以的
         */
        function Search(rects, allowRotate, step, findPosition, rate) {
            this.rects = [];
            this.totalSquares = 0;
            this.maxHeight = -1;
            this.maxWidth = -1;
            this.rects = rects;
            this.allowRotate = allowRotate === true;
            this.step = step ? step : 1;
            this.findPosition = findPosition;
            if (rate <= 1) {
                throw new Error('rate should be grater than 1, but get ' + rate);
            }
            this.rate = rate;
            this.totalSquares = this.rects.reduce(function (i, v) {
                return i + v.height * v.width;
            }, 0);
            this.maxWidth = this.rects.reduce(function (i, v) {
                return i + v.width;
            }, 1); // 防止刚好踩到临界点情况
            this.maxHeight = this.rects.reduce(function (i, v) {
                return i + v.height;
            }, 1); // 防止刚好踩到临界点情况
        }
        Object.defineProperty(Search.prototype, "minHeight", {
            get: function () {
                return this.totalSquares / this.maxWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Search.prototype, "minWidth", {
            get: function () {
                return this.totalSquares / this.maxHeight;
            },
            enumerable: true,
            configurable: true
        });
        Search.prototype.search = function () {
            var bestResult = {
                height: 0,
                op: 0,
                width: 0,
            };
            for (var searchWidth = this.minWidth; searchWidth <= this.maxWidth; searchWidth += this.step) {
                var _a = this.bestHeight(searchWidth), height = _a[0], op = _a[1];
                if (op > bestResult.op) {
                    bestResult.width = searchWidth;
                    bestResult.height = height;
                    bestResult.op = op;
                }
            }
            return { x: bestResult.width, y: bestResult.height };
        };
        Search.prototype.bestHeight = function (width) {
            var left = Math.max(this.minHeight, width / this.rate);
            var right = Math.min(this.maxHeight, width * this.rate);
            var bestResult = 0;
            var mid = 0;
            var bestHeight = 0;
            while (right - left >= this.step) {
                mid = (right + left) / 2;
                var _a = this.getInsertResult(width, mid), result = _a[0], op = _a[1];
                var isSuccess = result.length === this.rects.length;
                if (isSuccess) {
                    if (op > bestResult) {
                        bestResult = op;
                        bestHeight = mid;
                    }
                    right = mid;
                }
                else {
                    left = mid;
                }
            }
            return [bestHeight, bestResult];
        };
        Search.prototype.getInsertResult = function (width, height) {
            var binpacker = new max_rect_bin_pack_1.default(width, height, this.allowRotate);
            var result = binpacker.insertRects(this.getRects(), this.findPosition);
            return [result, binpacker.occupancy()];
        };
        Search.prototype.getRects = function () {
            return this.rects.map(function ($) {
                return $.clone();
            });
        };
        return Search;
    }());
    exports.Search = Search;
});
//# sourceMappingURL=search.js.map