//tslint:disable
import fs from 'fs';
import path from 'path';
import genetic from './../src/genetic';
import MaxRectBinPack, { FindPosition } from './../src/max-rect-bin-pack';
import Rect from './../src/rect';

const rects: Rect[] = [];


const r = [{"x":0,"y":0,"width":387,"height":122,"isRotated":false,"info":{"name":"tileset-ornaments-001"}},{"x":0,"y":0,"width":356,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-002"}},{"x":0,"y":0,"width":379,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-003"}},{"x":0,"y":0,"width":375,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-004"}},{"x":0,"y":0,"width":342,"height":128,"isRotated":false,"info":{"name":"tileset-ornaments-005"}},{"x":0,"y":0,"width":130,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-006"}},{"x":0,"y":0,"width":339,"height":122,"isRotated":false,"info":{"name":"tileset-ornaments-007"}},{"x":0,"y":0,"width":327,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-008"}},{"x":0,"y":0,"width":385,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-009"}},{"x":0,"y":0,"width":382,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-010"}},{"x":0,"y":0,"width":422,"height":123,"isRotated":false,"info":{"name":"tileset-ornaments-011"}},{"x":0,"y":0,"width":428,"height":124,"isRotated":false,"info":{"name":"tileset-ornaments-012"}},{"x":0,"y":0,"width":190,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-013"}},{"x":0,"y":0,"width":224,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-014"}},{"x":0,"y":0,"width":206,"height":121,"isRotated":false,"info":{"name":"tileset-ornaments-015"}}]

r.forEach($=>{
  var rect = new Rect();
  rect.width = $.width;
  rect.height = $.height;
  rect.info = $.info;
  rect.info.width = $.width;
  rect.info.height = $.height;
  rects.push(rect);
})
const bestNode = genetic(rects, {
  findPosition: FindPosition.AreaFit,
  lifeTimes: 50,
  liveRate: 0.5,
  size: 50,
});
console.log(JSON.stringify(bestNode));
console.log(bestNode.x * bestNode.y);
const width = bestNode.x; //Math.sqrt(size);
const height = bestNode.y; //size / width;

const packer = new MaxRectBinPack(width, height, true);
// const result: any[] = [];
// for (const rect of rects) {
//   result.push(packer.insert(rect.width, rect.height, FindPosition.AreaFit));
// }
let rectslength = rects.length;
console.log(rectslength);
const result = packer.insertRects(rects, FindPosition.AreaFit);
console.log(result.length === rectslength);
fs.writeFileSync(
  path.join(__dirname, 'data.js'),
  `var data = ${JSON.stringify(result)}`,
  {
    flag: 'w+',
  },
);
