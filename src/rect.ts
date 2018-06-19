class Rect {
  /**
   * 起点 x 坐标
   */
  public x: number = 0;
  /**
   * 起点 y 坐标
   */
  public y: number = 0;
  /**
   * 宽度
   */
  public width: number = 0;
  /**
   * 高度
   */
  public height: number = 0;
  /**
   * 当前是否被旋转了
   */
  public isRotated: boolean = false;
  /**
   * 自定义信息
   */
  public info: any;
  /**
   * 克隆
   */
  public clone(): Rect {
    const cloned = new Rect();
    cloned.x = this.x;
    cloned.y = this.y;
    cloned.height = this.height;
    cloned.width = this.width;
    cloned.info = this.info;
    return cloned;
  }
  /**
   * 矩形是否在另一个矩形内部
   * @param otherRect {Rect}
   */
  public isIn(otherRect: Rect): boolean {
    return (
      this.x >= otherRect.x &&
      this.y >= otherRect.y &&
      this.x + this.width <= otherRect.x + otherRect.width &&
      this.y + this.height <= otherRect.y + otherRect.height
    );
  }
}

export default Rect;
