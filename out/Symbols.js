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
Symbols.userCompletions = [
    new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
];
Symbols.variableCompletions = [];
//# sourceMappingURL=Symbols.js.map