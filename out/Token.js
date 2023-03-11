"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rule_1 = require("./Rule");
const Database_1 = require("./Database");
class Token {
    constructor(id, regex, completion) {
        this.rules = [];
        this.parameters = [];
        this.id = id;
        this.regex = regex;
        this.completion = completion;
    }
    setInsertText(insertText) {
        this.completion.insertText = insertText;
        return this;
    }
    setRulesByFormat(format) {
        this.rules = [];
        const params = format.replace(this.id, '').trim().split(' ');
        for (let i = 0; i < params.length; i++) {
            const param = params[i].replace(/<|>/, '');
            const token = Database_1.default.baseTokens.find(baseToken => baseToken.id == param);
            if (token != undefined)
                this.rules.push(new Rule_1.default(i, [token, Database_1.default.tokenVariableEmpty]));
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