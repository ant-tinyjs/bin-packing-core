import { FindPosition } from './max-rect-bin-pack';
import Rect from './rect';
interface IPoint {
    x: number;
    y: number;
}
export declare class Search {
    private rects;
    private findPosition;
    private allowRotate;
    private step;
    private rate;
    private totalSquares;
    private maxHeight;
    private maxWidth;
    readonly minHeight: number;
    readonly minWidth: number;
    /**
     * 初始化
     * @param rects 要插入的矩形数组
     * @param allowRotate 是否旋转
     * @param step 搜索步长 建议10
     * @param findPosition FindPostion 策略
     * @param rate 大于一的比率 等于1不可以的
     */
    constructor(rects: Rect[], allowRotate: boolean, step: number, findPosition: FindPosition, rate: number);
    search(): IPoint;
    bestHeight(width: number): [number, number];
    private getInsertResult;
    private getRects;
}
export {};
