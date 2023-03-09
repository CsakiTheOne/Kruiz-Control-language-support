import * as vscode from 'vscode';
import Rule from './Rule';

export default class Token {
    id: string;
    regex: RegExp;
    label: string = '';
    kind: vscode.CompletionItemKind | undefined;
    snippet: string | undefined;
    rules: Rule[] = [];
    isTopLevel: boolean = false;

    constructor(
        id: string,
        regex: RegExp,
        label: string = '',
        kind: vscode.CompletionItemKind | undefined = undefined,
        snippet: string | undefined = undefined,
    ) {
        this.id = id;
        this.regex = regex;
        this.label = label;
        this.kind = kind;
        this.snippet = snippet;
    }

    toCompletionItem(): vscode.CompletionItem {
        const item = new vscode.CompletionItem(this.label, this.kind);
        if (this.snippet != undefined) {
            item.insertText = new vscode.SnippetString(this.snippet);
        }
        return item;
    }

    setRules(rules: Rule[]): Token {
        this.rules = rules;
        return this;
    }

    topLevel(): Token {
        this.isTopLevel = true;
        return this;
    }
}