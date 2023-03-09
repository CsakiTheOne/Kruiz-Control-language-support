import * as vscode from 'vscode';
import Symbol from "./Symbol";
import tokens from "./tokens";

export default class Symbols {
    static list: Symbol[] = [];

    static userCompletions: vscode.CompletionItem[] = [
        new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
    ];

    static variableCompletions: vscode.CompletionItem[] = [];

    static update(symbols: Symbol[]) {
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