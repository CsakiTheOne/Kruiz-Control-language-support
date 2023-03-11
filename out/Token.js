"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Rule_1 = require("./Rule");
const Database_1 = require("./Database");
class Token {
    constructor(id, regex, completion, isTopLevel = false) {
        this.rules = [];
        this.parameters = [];
        this.id = id;
        this.regex = regex;
        this.completion = completion;
        this.isTopLevel = isTopLevel;
    }
    setInsertText(insertText) {
        this.completion.insertText = insertText;
        return this;
    }
    setRulesByFormat(format) {
        this.rules = [];
        const params = format.trim().split(' ');
        for (let i = 0; i < params.length; i++) {
            const param = params[i].replace(/<|>/g, '');
            const token = Database_1.default.baseTokens.find(baseToken => baseToken.id == param);
            const fallbackToken = new Token(param, /^fallback$/, new vscode.CompletionItem(param));
            this.rules.push(new Rule_1.default(i, [token ? token : fallbackToken, Database_1.default.baseTokens.find(baseToken => baseToken.id == 'variable')]));
        }
        return this;
    }
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map