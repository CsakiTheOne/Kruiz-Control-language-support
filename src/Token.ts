import * as vscode from 'vscode';
import Rule from './Rule';

export default class Token {
    id: string;
    regex: RegExp;
    label: string = '';
    kind: vscode.CompletionItemKind | undefined;
    snippet: string | undefined;

    isTopLevel: boolean = false;
    description: string | undefined;
    rules: Rule[] = [];
    parameters: string[] = [];

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
        if (this.description != undefined) {
            item.documentation = this.description;
        }
        if (this.snippet != undefined) {
            item.insertText = new vscode.SnippetString(this.snippet);
        }
        return item;
    }

    topLevel(): Token {
        this.isTopLevel = true;
        return this;
    }

    setDescription(text: string): Token {
        this.description = text;
        return this;
    }

    setRules(rules: Rule[]): Token {
        this.rules = rules;
        return this;
    }

    setParameters(parameters: string[]): Token {
        this.parameters = parameters;
        return this;
    }
}