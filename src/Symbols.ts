import * as vscode from 'vscode';
import Symbol from "./Symbol";
import tokens from "./tokens";

export default class Symbols {
    static list: Symbol[] = [];

    static permissionCompletions: vscode.CompletionItem[] = [
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
        // update parameters
        this.list.filter(symbol => symbol.token.parameters.length > 0)
            .forEach(symbol => {
                symbol.token.parameters.forEach(param => {
                    const item = new vscode.CompletionItem(param, vscode.CompletionItemKind.Variable);
                    item.insertText = `{${param}}`;
                    item.documentation = new vscode.MarkdownString(`Parameter of ${symbol.content}. Defined on line ${symbol.line}.`);
                    this.variableCompletions.push(item);
                });
            });
        // distinct variables
        this.variableCompletions = [... new Set(this.variableCompletions)];

    }
}