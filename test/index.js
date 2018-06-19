var FindPosition = require('./../lib/index').default.FindPosition;
var Genetic = require('./../lib/index').default.Genetic;
var genetic = require('./../lib/index').default.genetic;
var MaxRectBinPack = require('./../lib/index').default.MaxRectBinPack;
var Rect = require('./../lib/index').default.Rect;
const rects = [];

for (var i = 0; i < 10; i++) {
  var r = new Rect();
  r.width = (i + 1) * 10;
  r.height = (i + 1) * 11;
  r.info = {
    width: r.width,
    height: r.height,
    id: i,
  };
  rects.push(r);
}

const findPosition = 0; // 参照第一条

const bestSize = genetic(rects, {
  // 遗传算法确定最优策略
  findPosition: findPosition,
  lifeTimes: 50, // 代数
  liveRate: 0.5, // 存活率
  size: 50, // 每一代孩子个数
});

const width = bestSize.x;
const height = bestSize.y;
const packer = new MaxRectBinPack(width, height, true);
const result = packer.insertRects(rects, findPosition);
console.log(result);
console.log(result.length === 10);
