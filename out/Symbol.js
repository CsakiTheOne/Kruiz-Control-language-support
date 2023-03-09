"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Symbol {
    constructor(token, content, line, column, word = undefined) {
        this.token = token;
        this.content = content;
        this.line = line;
        this.column = column;
        this.word = word;
    }
    tabularData() {
        return {
            token: this.token.id,
            content: this.content,
            pos: `(${this.line},${this.word})`,
        };
    }
}
exports.default = Symbol;
//# sourceMappingURL=Symbol.js.map