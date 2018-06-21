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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./genetic", "./max-rect-bin-pack", "./rect", "./search"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var genetic_1 = __importStar(require("./genetic"));
    exports.genetic = genetic_1.default;
    exports.Genetic = genetic_1.Genetic;
    var max_rect_bin_pack_1 = __importStar(require("./max-rect-bin-pack"));
    exports.MaxRectBinPack = max_rect_bin_pack_1.default;
    exports.FindPosition = max_rect_bin_pack_1.FindPosition;
    var rect_1 = __importDefault(require("./rect"));
    exports.Rect = rect_1.default;
    var search_1 = require("./search");
    exports.Search = search_1.Search;
});
//# sourceMappingURL=index.js.map