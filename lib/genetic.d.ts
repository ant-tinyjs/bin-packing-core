import { FindPosition } from './max-rect-bin-pack';
import Rect from './rect';
export interface IGeneticOptions {
    lifeTimes: number;
    size: number;
    findPosition: FindPosition;
    liveRate: number;
    allowRotate: boolean;
}
interface IPoint {
    x: number;
    y: number;
}
export declare class Genetic {
    private rects;
    private lifeTimes;
    private size;
    private findPosition;
    private liveRate;
    private allowRotate;
    private totalSquares;
    private maxHeight;
    private maxWidth;
    private randomDots;
    private bestDot;
    readonly minHeight: number;
    readonly minWidth: number;
    constructor(rects: Rect[], options?: IGeneticOptions);
    calc(): IPoint;
    private open;
    private work;
    private close;
    private getRects;
    private cross;
}
export default function (rect: Rect[], options: IGeneticOptions): IPoint;
export {};
