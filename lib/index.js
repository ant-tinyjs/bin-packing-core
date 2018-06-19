"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var genetic_1 = __importStar(require("./genetic"));
var max_rect_bin_pack_1 = __importStar(require("./max-rect-bin-pack"));
var rect_1 = __importDefault(require("./rect"));
exports.default = {
    FindPosition: max_rect_bin_pack_1.FindPosition,
    Genetic: genetic_1.Genetic,
    MaxRectBinPack: max_rect_bin_pack_1.default,
    Rect: rect_1.default,
    genetic: genetic_1.default,
};
//# sourceMappingURL=index.js.map