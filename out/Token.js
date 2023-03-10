"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Token {
    constructor(id, regex, label = '', kind = undefined, snippet = undefined) {
        this.label = '';
        this.isTopLevel = false;
        this.rules = [];
        this.parameters = [];
        this.id = id;
        this.regex = regex;
        this.label = label;
        this.kind = kind;
        this.snippet = snippet;
    }
    toCompletionItem() {
        const item = new vscode.CompletionItem(this.label, this.kind);
        if (this.description != undefined) {
            item.documentation = this.description;
        }
        if (this.snippet != undefined) {
            item.insertText = new vscode.SnippetString(this.snippet);
        }
        return item;
    }
    topLevel() {
        this.isTopLevel = true;
        return this;
    }
    setDescription(text) {
        this.description = text;
        return this;
    }
    setRules(rules) {
        this.rules = rules;
        return this;
    }
    setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
}
exports.default = Token;
//# sourceMappingURL=Token.js.map