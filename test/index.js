var FindPosition = require('./../lib/index').FindPosition;
var Genetic = require('./../lib/index').Genetic;
var genetic = require('./../lib/index').genetic;
var MaxRectBinPack = require('./../lib/index').MaxRectBinPack;
var Rect = require('./../lib/index').Rect;



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
