"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Symbols {
    static update(symbols) {
        this.list = symbols;
        // update variables
        this.variableCompletions = [];
        this.list.filter(symbol => symbol.token.id == 'variable.loaded')
            .forEach(variable => {
            const item = new vscode.CompletionItem(variable.content, vscode.CompletionItemKind.Variable);
            item.insertText = `{${variable.content}}`;
            item.documentation = new vscode.MarkdownString(`Variable loaded on line ${variable.line + 1}.`);
            this.variableCompletions.push(item);
        });
    }
}
exports.default = Symbols;
Symbols.list = [];
Symbols.permissionCompletions = [
    (() => {
        const _ = new vscode.CompletionItem('everyone', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'e';
        _.documentation = 'Character: e';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('broadcaster', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'b';
        _.documentation = 'Character: b';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('founder', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'f';
        _.documentation = 'Character: f';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('VIP', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'v';
        _.documentation = 'Character: v';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('moderator', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'm';
        _.documentation = 'Character: m';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('negate permissions', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'n';
        _.documentation = 'Character: n';
        return _;
    })(),
];
Symbols.userCompletions = [
    new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
];
Symbols.variableCompletions = [];
//# sourceMappingURL=Symbols.js.map