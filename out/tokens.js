"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
exports.default = [
    new Token_1.default('comment', /^#.+/),
    new Token_1.default('variable', /^{[a-zA-Z0-9]+}$/),
    new Token_1.default('comparator', /^==|>|<|>=|<=|!=$/),
    new Token_1.default('literal.color', /^"#[0-9a-fA-F]{6}"$/),
    new Token_1.default('literal.string', /^".*"$/),
    new Token_1.default('literal.number', /^[0-9]+$/),
    new Token_1.default('literal.twitchCommand', /^![a-zA-Z0-9]+$/),
    new Token_1.default('literal.permission', /^[bsfvmne]|u$/),
    new Token_1.default('keyword.if', /^if$/),
    new Token_1.default('event.onCommand', /^[Oo]n[Cc]ommand$/),
    new Token_1.default('action.chat', /^chat$/),
    new Token_1.default('action.chat.send', /^send$/),
    new Token_1.default('action.chat.whisper', /^whisper$/),
];
//# sourceMappingURL=tokens.js.map