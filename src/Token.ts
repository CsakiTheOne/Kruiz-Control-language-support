import * as vscode from 'vscode';

export default class Token {
    id: string;
    regex: RegExp;
    label: string | undefined;
    kind: vscode.CompletionItemKind | undefined;
    snippet: string | undefined;

    constructor(
        id: string,
        regex: RegExp,
        label: string | undefined = undefined,
        kind: vscode.CompletionItemKind | undefined = undefined,
        snippet: string | undefined = undefined,
    ) {
        this.id = id;
        this.regex = regex;
        this.label = label;
        this.kind = kind;
        this.snippet = snippet;
    }

    toString(): string {
        return this.id;
    }
}