import * as vscode from 'vscode';

export default class Token {
    id: string;
    completion: vscode.CompletionItem;

    constructor(id: string, completion: vscode.CompletionItem) {
        this.id = id;
        this.completion = completion;
    }

    setInsertText(insertText: string | vscode.SnippetString | undefined): Token {
        this.completion.insertText = insertText;
        return this;
    }
}