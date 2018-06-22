import MaxRectBinPack, { FindPosition } from './max-rect-bin-pack';
import Rect from './rect';

interface IPoint {
  x: number;
  y: number;
}

export class Search {
  private rects: Rect[] = [];
  private findPosition: FindPosition;
  private allowRotate: boolean;
  private step: number;
  private rate: number;

  private totalSquares: number = 0;
  private maxHeight: number = -1;
  private maxWidth: number = -1;

  get minHeight() {
    return this.totalSquares / this.maxWidth;
  }
  get minWidth() {
    return this.totalSquares / this.maxHeight;
  }
  /**
   * 初始化
   * @param rects 要插入的矩形数组
   * @param allowRotate 是否旋转
   * @param step 搜索步长 建议10
   * @param findPosition FindPostion 策略
   * @param rate 大于一的比率 等于1不可以的
   */
  constructor(
    rects: Rect[],
    allowRotate: boolean,
    step: number,
    findPosition: FindPosition,
    rate: number,
  ) {
    this.rects = rects;
    this.allowRotate = allowRotate === true;
    this.step = step ? step : 1;
    this.findPosition = findPosition;
    if (rate <= 1) {
      throw new Error('rate should be grater than 1, but get ' + rate);
    }
    this.rate = rate;
    this.totalSquares = this.rects.reduce((i, v) => {
      return i + v.height * v.width;
    }, 0);
    this.maxWidth = this.rects.reduce((i, v) => {
      return i + v.width;
    }, 0);
    this.maxHeight = this.rects.reduce((i, v) => {
      return i + v.height;
    }, 0);
  }
  public search(): IPoint {
    const bestResult = {
      height: 0,
      op: 0,
      width: 0,
    };
    for (
      let searchWidth = this.minWidth;
      searchWidth < this.maxWidth;
      searchWidth += this.step
    ) {
      const [height, op] = this.bestHeight(searchWidth);
      if (op > bestResult.op) {
        bestResult.width = searchWidth;
        bestResult.height = height;
        bestResult.op = op;
      }
    }
    return { x: bestResult.width, y: bestResult.height };
  }
  public bestHeight(width: number): [number, number] {
    let left = Math.max(this.minHeight, width / this.rate);
    let right = Math.min(this.maxHeight, width * this.rate);
    let bestResult = 0;
    let mid = 0;
    let bestHeight = 0;
    while (right - left >= this.step) {
      mid = (right + left) / 2;
      const [result, op] = this.getInsertResult(width, mid);
      const isSuccess = result.length === this.rects.length;
      if (isSuccess) {
        if (op > bestResult) {
          bestResult = op;
          bestHeight = mid;
        }
        right = mid;
      } else {
        left = mid;
      }
    }
    return [bestHeight, bestResult];
  }
  private getInsertResult(width: number, height: number): [Rect[], number] {
    const binpacker = new MaxRectBinPack(width, height, this.allowRotate);
    const result = binpacker.insertRects(this.getRects(), this.findPosition);
    return [result, binpacker.occupancy()];
  }
  private getRects() {
    return this.rects.map($ => {
      return $.clone();
    });
  }
}
