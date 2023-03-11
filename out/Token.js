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
    merge(other) {
        this.rules = [...new Set(this.rules.concat(other.rules))];
        return this;
    }
    setInsertText(insertText) {
        this.completion.insertText = insertText;
        return this;
    }
    setRulesByFormat(format) {
        this.rules = [];
        const params = format.trim().split(' ');
        for (let i = 0; i < params.length; i++) {
            const paramName = params[i].replace(/<|>/g, '');
            const parameterMap = new Map([
                ['message', 'string'],
                ['command', 'Twitch command'],
            ]);
            const token = Database_1.default.baseTokens.find(baseToken => baseToken.id == parameterMap.get(paramName) || baseToken.id == paramName);
            const fallbackToken = new Token(paramName, /^fallback$/, new vscode.CompletionItem(paramName));
            this.rules.push(new Rule_1.default(i, [token ? token : fallbackToken, Database_1.default.baseTokens.find(baseToken => baseToken.id == 'variable')]));
        }
        return this;
    }
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    setDefinition(regex) {
        this.definition = new Token(`${this.id}.definition`, regex, new vscode.CompletionItem(`${this.completion.label} definition`));
        return this;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map