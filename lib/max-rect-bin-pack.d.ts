import Rect from './rect';
export declare enum FindPosition {
    ShortSideFit = 0,
    BottomLeft = 1,
    ContactPoint = 2,
    LongSideFit = 3,
    AreaFit = 4
}
declare class MaxRectBinPack {
    private containerHeight;
    private containerWidth;
    private allowRotate;
    private freeRects;
    private usedRects;
    /**
     * 构建方程
     * @param width {number} 画板宽度
     * @param height {number} 画板高度
     * @param allowRotate {boolean} 允许旋转
     */
    constructor(width: number, height: number, allowRotate?: boolean);
    /**
     * 在线算法入口 插入矩形方法
     * @param width {number}
     * @param height {number}
     * @param method {FindPosition}
     */
    insert(width: number, height: number, method: FindPosition): Rect;
    /**
     * 算法离线入口 插入一组举行
     * @param rects {Rect[]} 矩形数组
     * @param method {FindPosition} 查找位置的方法
     */
    insertRects(rects: Rect[], method: FindPosition): Rect[];
    occupancy(): number;
    /**
     *
     * @param node
     */
    private placeRectangle;
    private scoreRectangle;
    private findPositionForNewNodeBottomLeft;
    private findPositionForNewNodeBestShortSideFit;
    private findPositionForNewNodeBestLongSideFit;
    private findPositionForNewNodeBestAreaFit;
    private commonIntervalLength;
    private contactPointScoreNode;
    private findPositionForNewNodeContactPoint;
    private splitFreeNode;
    private pruneFreeList;
}
export default MaxRectBinPack;
