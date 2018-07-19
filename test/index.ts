//tslint:disable
import fs from 'fs';
import path from 'path';
import genetic from './../src/genetic';
import MaxRectBinPack, { FindPosition } from './../src/max-rect-bin-pack';
import Rect from './../src/rect';
import { Search } from './../src/search';

const rects: Rect[] = [];

// const r = require('./rects.json');

// r.forEach(($: any) => {
//   var rect = new Rect();
//   rect.width = $.width;
//   rect.height = $.height;
//   rect.info = {};
//   rect.info.width = $.width;
//   rect.info.height = $.height;
//   rects.push(rect);
// });

var rect1 = new Rect();
rect1.width = 485;
rect1.height = 869;
rects.push(rect1);

var rect2 = new Rect();
rect2.width = 96;
rect2.height = 104;
rects.push(rect2);

// function getRects() {
//   return rects.map($ => $.clone());
// }

// let maxWidth = rects.reduce(($, $$) => $ + $$.width, 0);
// let maxHeight = rects.reduce(($, $$) => $ + $$.height, 0);
// debugger;
// const step = 1;
// const result = [];
// for (let currentWidth = 0; currentWidth <= maxWidth; currentWidth += step) {
//   for (
//     let currentHeight = 0;
//     currentHeight <= maxHeight;
//     currentHeight += step
//   ) {
//     const packer = new MaxRectBinPack(currentWidth, currentHeight, false);
//     const inserts = packer.insertRects(getRects(), 0);
//     if (inserts.length === 2) {
//       console.log(currentWidth, currentHeight);
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
// debugger;
const serach = new Search(rects, false, 10, 0, Infinity);
const bestNode = serach.search();

console.log(bestNode);
const packer = new MaxRectBinPack(bestNode.x, bestNode.y, false);

let rectslength = rects.length;
console.log(rectslength);
const result = packer.insertRects(rects, FindPosition.AreaFit);
console.log(JSON.stringify(result));
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
