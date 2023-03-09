"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(id, regex) {
        this.id = id;
        this.regex = regex;
    }
    toString() {
        return this.id;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map