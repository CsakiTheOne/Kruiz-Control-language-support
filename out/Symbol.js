"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Symbol {
    constructor(token, content, position, wordPosition) {
        this.token = token;
        this.content = content;
        this.position = position;
        this.wordPosition = wordPosition;
    }
    toSimpleObject() {
        return {
            tokenId: this.token.id,
            content: this.content,
            position: `l:${this.position.line},c:${this.position.character},w:${this.wordPosition})`,
            rules: this.token.rules.map(rule => `${rule.offset}: ${rule.tokens.map(token => token.id)}`),
        };
    }
}
exports.default = Symbol;
//# sourceMappingURL=Symbol.js.map