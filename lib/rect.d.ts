declare class Rect {
    /**
     * 起点 x 坐标
     */
    x: number;
    /**
     * 起点 y 坐标
     */
    y: number;
    /**
     * 宽度
     */
    width: number;
    /**
     * 高度
     */
    height: number;
    /**
     * 当前是否被旋转了
     */
    isRotated: boolean;
    /**
     * 自定义信息
     */
    info: any;
    /**
     * 克隆
     */
    clone(): Rect;
    /**
     * 矩形是否在另一个矩形内部
     * @param otherRect {Rect}
     */
    isIn(otherRect: Rect): boolean;
}
export default Rect;
