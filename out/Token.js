"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(id, completion) {
        this.id = id;
        this.completion = completion;
    }
    setInsertText(insertText) {
        this.completion.insertText = insertText;
        return this;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map