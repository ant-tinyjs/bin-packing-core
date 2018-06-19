"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rect_1 = __importDefault(require("./rect"));
var FindPosition;
(function (FindPosition) {
    FindPosition[FindPosition["ShortSideFit"] = 0] = "ShortSideFit";
    FindPosition[FindPosition["BottomLeft"] = 1] = "BottomLeft";
    FindPosition[FindPosition["ContactPoint"] = 2] = "ContactPoint";
    FindPosition[FindPosition["LongSideFit"] = 3] = "LongSideFit";
    FindPosition[FindPosition["AreaFit"] = 4] = "AreaFit";
})(FindPosition = exports.FindPosition || (exports.FindPosition = {}));
var MaxRectBinPack = /** @class */ (function () {
    /**
     * 构建方程
     * @param width {number} 画板宽度
     * @param height {number} 画板高度
     * @param allowRotate {boolean} 允许旋转
     */
    function MaxRectBinPack(width, height, allowRotate) {
        this.freeRects = [];
        this.usedRects = [];
        this.containerHeight = height;
        this.containerWidth = width;
        this.allowRotate = allowRotate === true;
        var rect = new rect_1.default();
        rect.x = 0;
        rect.y = 0;
        rect.width = width;
        rect.height = height;
        this.freeRects.push(rect);
    }
    /**
     * 在线算法入口 插入矩形方法
     * @param width {number}
     * @param height {number}
     * @param method {FindPosition}
     */
    MaxRectBinPack.prototype.insert = function (width, height, method) {
        // width height 参数合法性检查
        if (width <= 0 || height <= 0) {
            throw new Error("width & height should greater than 0, but got width as " + width + ", height as " + height);
        }
        // method 合法性检查
        if (method <= FindPosition.ShortSideFit || method >= FindPosition.AreaFit) {
            method = FindPosition.ShortSideFit;
        }
        var newRect = new rect_1.default();
        var score1 = {
            value: 0,
        };
        var score2 = {
            value: 0,
        };
        switch (method) {
            case FindPosition.ShortSideFit:
                newRect = this.findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case FindPosition.BottomLeft:
                newRect = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case FindPosition.ContactPoint:
                newRect = this.findPositionForNewNodeContactPoint(width, height, score1);
                break;
            case FindPosition.LongSideFit:
                newRect = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case FindPosition.AreaFit:
                newRect = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
        }
        if (newRect.height === 0) {
            return newRect;
        }
        this.placeRectangle(newRect);
        return newRect;
    };
    /**
     * 算法离线入口 插入一组举行
     * @param rects {Rect[]} 矩形数组
     * @param method {FindPosition} 查找位置的方法
     */
    MaxRectBinPack.prototype.insertRects = function (rects, method) {
        var result = [];
        while (rects.length > 0) {
            var bestScore1 = {
                value: Infinity,
            };
            var bestScore2 = {
                value: Infinity,
            };
            var bestRectIndex = -1;
            var bestNode = void 0;
            for (var i = 0; i < rects.length; ++i) {
                var score1 = {
                    value: 0,
                };
                var score2 = {
                    value: 0,
                };
                var newNode = this.scoreRectangle(rects[i].width, rects[i].height, method, score1, score2);
                if (score1.value < bestScore1.value ||
                    (score1.value === bestScore1.value && score2.value < bestScore2.value)) {
                    bestScore1.value = score1.value;
                    bestScore2.value = score2.value;
                    bestNode = newNode;
                    bestRectIndex = i;
                }
            }
            if (bestRectIndex === -1) {
                return result;
            }
            this.placeRectangle(bestNode);
            rects.splice(bestRectIndex, 1);
            result.push(bestNode);
        }
        return result;
    };
    MaxRectBinPack.prototype.occupancy = function () {
        var usedSurfaceArea = 0;
        for (var _i = 0, _a = this.usedRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            usedSurfaceArea += rect.width * rect.height;
        }
        return usedSurfaceArea / (this.containerWidth * this.containerHeight);
    };
    /**
     *
     * @param node
     */
    MaxRectBinPack.prototype.placeRectangle = function (node) {
        var numRectanglesToProcess = this.freeRects.length;
        for (var i = 0; i < numRectanglesToProcess; i++) {
            if (this.splitFreeNode(this.freeRects[i], node)) {
                this.freeRects.splice(i, 1);
                i--;
                numRectanglesToProcess--;
            }
        }
        this.pruneFreeList();
        this.usedRects.push(node);
    };
    MaxRectBinPack.prototype.scoreRectangle = function (width, height, method, score1, score2) {
        var newNode = new rect_1.default();
        score1.value = Infinity;
        score2.value = Infinity;
        switch (method) {
            case FindPosition.ShortSideFit:
                newNode = this.findPositionForNewNodeBestShortSideFit(width, height, score1, score2);
                break;
            case FindPosition.BottomLeft:
                newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2);
                break;
            case FindPosition.ContactPoint:
                newNode = this.findPositionForNewNodeContactPoint(width, height, score1);
                // todo: reverse
                score1.value = -score1.value; // Reverse since we are minimizing, but for contact point score bigger is better.
                break;
            case FindPosition.LongSideFit:
                newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1);
                break;
            case FindPosition.AreaFit:
                newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2);
                break;
        }
        // Cannot fit the current Rectangle.
        if (newNode.height === 0) {
            score1.value = Infinity;
            score2.value = Infinity;
        }
        return newNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX) {
        var freeRects = this.freeRects;
        var bestNode = new rect_1.default();
        bestY.value = Infinity;
        var topSideY;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                topSideY = rect.y + height;
                if (topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                topSideY = rect.y + width;
                if (topSideY < bestY.value ||
                    (topSideY === bestY.value && rect.x < bestX.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestY.value = topSideY;
                    bestX.value = rect.x;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestShortSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
        var bestNode = new rect_1.default();
        bestShortSideFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var longSideFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (shortSideFit < bestShortSideFit.value ||
                    (shortSideFit === bestShortSideFit.value &&
                        longSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            var flippedLeftoverHoriz = void 0;
            var flippedLeftoverVert = void 0;
            var flippedShortSideFit = void 0;
            var flippedLongSideFit = void 0;
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                flippedLeftoverHoriz = Math.abs(rect.width - height);
                flippedLeftoverVert = Math.abs(rect.height - width);
                flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                if (flippedShortSideFit < bestShortSideFit.value ||
                    (flippedShortSideFit === bestShortSideFit.value &&
                        flippedLongSideFit < bestLongSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = flippedShortSideFit;
                    bestLongSideFit.value = flippedLongSideFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit) {
        var bestNode = new rect_1.default();
        bestLongSideFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var longSideFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                longSideFit = Math.max(leftoverHoriz, leftoverVert);
                if (longSideFit < bestLongSideFit.value ||
                    (longSideFit === bestLongSideFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestLongSideFit.value = longSideFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit) {
        var bestNode = new rect_1.default();
        bestAreaFit.value = Infinity;
        var leftoverHoriz;
        var leftoverVert;
        var shortSideFit;
        var areaFit;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            areaFit = rect.width * rect.height - width * height;
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                leftoverHoriz = Math.abs(rect.width - width);
                leftoverVert = Math.abs(rect.height - height);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                if (areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                leftoverHoriz = Math.abs(rect.width - height);
                leftoverVert = Math.abs(rect.height - width);
                shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                if (areaFit < bestAreaFit.value ||
                    (areaFit === bestAreaFit.value &&
                        shortSideFit < bestShortSideFit.value)) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestShortSideFit.value = shortSideFit;
                    bestAreaFit.value = areaFit;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
        if (i1end < i2start || i2end < i1start) {
            return 0;
        }
        return Math.min(i1end, i2end) - Math.max(i1start, i2start);
    };
    MaxRectBinPack.prototype.contactPointScoreNode = function (x, y, width, height) {
        var score = 0;
        if (x === 0 || x + width === this.containerWidth) {
            score += height;
        }
        if (y === 0 || y + height === this.containerHeight) {
            score += width;
        }
        for (var _i = 0, _a = this.usedRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            if (rect.x === x + width || rect.x + rect.width === x) {
                score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
            }
            if (rect.y === y + height || rect.y + rect.height === y) {
                score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
            }
        }
        return score;
    };
    MaxRectBinPack.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore) {
        var bestNode = new rect_1.default();
        bestContactScore.value = -1;
        var score;
        for (var _i = 0, _a = this.freeRects; _i < _a.length; _i++) {
            var rect = _a[_i];
            // Try to place the Rectangle in upright (non-flipped) orientation.
            if (rect.width >= width && rect.height >= height) {
                score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = width;
                    bestNode.height = height;
                    bestContactScore.value = score;
                }
            }
            if (this.allowRotate && rect.width >= height && rect.height >= width) {
                score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                if (score > bestContactScore.value) {
                    bestNode.x = rect.x;
                    bestNode.y = rect.y;
                    bestNode.width = height;
                    bestNode.height = width;
                    bestContactScore.value = score;
                }
            }
        }
        return bestNode;
    };
    MaxRectBinPack.prototype.splitFreeNode = function (freeNode, usedNode) {
        var freeRectangles = this.freeRects;
        // Test with SAT if the Rectangles even intersect.
        if (usedNode.x >= freeNode.x + freeNode.width ||
            usedNode.x + usedNode.width <= freeNode.x ||
            usedNode.y >= freeNode.y + freeNode.height ||
            usedNode.y + usedNode.height <= freeNode.y) {
            return false;
        }
        var newNode;
        if (usedNode.x < freeNode.x + freeNode.width &&
            usedNode.x + usedNode.width > freeNode.x) {
            // New node at the top side of the used node.
            if (usedNode.y > freeNode.y &&
                usedNode.y < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.height = usedNode.y - newNode.y;
                freeRectangles.push(newNode);
            }
            // New node at the bottom side of the used node.
            if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                newNode = freeNode.clone();
                newNode.y = usedNode.y + usedNode.height;
                newNode.height =
                    freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                freeRectangles.push(newNode);
            }
        }
        if (usedNode.y < freeNode.y + freeNode.height &&
            usedNode.y + usedNode.height > freeNode.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.width = usedNode.x - newNode.x;
                freeRectangles.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                newNode = freeNode.clone();
                newNode.x = usedNode.x + usedNode.width;
                newNode.width =
                    freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                freeRectangles.push(newNode);
            }
        }
        return true;
    };
    MaxRectBinPack.prototype.pruneFreeList = function () {
        var freeRectangles = this.freeRects;
        for (var i = 0; i < freeRectangles.length; i++) {
            for (var j = i + 1; j < freeRectangles.length; j++) {
                if (freeRectangles[i].isIn(freeRectangles[j])) {
                    freeRectangles.splice(i, 1);
                    break;
                }
                if (freeRectangles[j].isIn(freeRectangles[i])) {
                    freeRectangles.splice(j, 1);
                }
            }
        }
    };
    return MaxRectBinPack;
}());
exports.default = MaxRectBinPack;
//# sourceMappingURL=max-rect-bin-pack.js.map