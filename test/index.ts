//tslint:disable
import fs from 'fs';
import path from 'path';
import genetic from './../src/genetic';
import MaxRectBinPack, { FindPosition } from './../src/max-rect-bin-pack';
import Rect from './../src/rect';
import { Search } from './../src/search';

const rects: Rect[] = [];

const r = require('./rects.json');

r.forEach(($: any) => {
  var rect = new Rect();
  rect.width = $.width;
  rect.height = $.height;
  rect.info = $.info;
  rect.info.width = $.width;
  rect.info.height = $.height;
  rects.push(rect);
});
// const bestNode = genetic(rects, {
//   findPosition: FindPosition.AreaFit,
//   lifeTimes: 50,
//   liveRate: 0.5,
//   size: 50,
//   allowRotate: false,
// });
// console.log(JSON.stringify(bestNode));
// console.log(bestNode.x * bestNode.y);
// const width = bestNode.x; // Math.sqrt(size);
// const height = bestNode.y; // size / width;

// const packer = new MaxRectBinPack(width, height, false);
// // const result: any[] = [];
// // for (const rect of rects) {
// //   result.push(packer.insert(rect.width, rect.height, FindPosition.AreaFit));
// // }
// let rectslength = rects.length;
// console.log(rectslength);
// const result = packer.insertRects(rects, FindPosition.AreaFit);
// console.log(result.length);
// console.log(result.length === rectslength);

// function getRects() {
//   return rects.map($ => $.clone());
// }

// const maxWidth = rects.reduce(($, $$) => $ + $$.width, 0);
// const maxHeight = rects.reduce(($, $$) => $ + $$.height, 0);

// const step = 10;
// const result = [];
// for (let currentWidth = 0; currentWidth < maxWidth; currentWidth += step) {
//   for (
//     let currentHeight = 0;
//     currentHeight < maxHeight;
//     currentHeight += step
//   ) {
//     const packer = new MaxRectBinPack(currentWidth, currentHeight, true);
//     const inserts = packer.insertRects(getRects(), 0);
//     if (inserts.length === r.length) {
//       result.push({
//         width: currentWidth,
//         height: currentHeight,
//         op: packer.occupancy(),
//       });
//     }
//   }
// }
// fs.writeFileSync(
//   path.join(__dirname, 'data.js'),
//   `var data = ${JSON.stringify(result)}`,
//   {
//     flag: 'w+',
//   },
// );

const serach = new Search(rects, false, 10, 0, 1.1);
const bestNode = serach.search();

console.log(bestNode);
const packer = new MaxRectBinPack(bestNode.x, bestNode.y, false);

let rectslength = rects.length;
console.log(rectslength);
const result = packer.insertRects(rects, FindPosition.AreaFit);
console.log(packer.occupancy());
console.log(result.length);
console.log(bestNode.x * bestNode.y);
console.log(result.length === rectslength);
fs.writeFileSync(
  path.join(__dirname, 'data.js'),
  `var data = ${JSON.stringify(result)}`,
  {
    flag: 'w+',
  },
);
