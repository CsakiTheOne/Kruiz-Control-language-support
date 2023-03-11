import * as vscode from 'vscode';
import Token from "./Token";

export default class Database {

    static tokenLiteralColor = new Token('color', new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
        .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0'));
    static tokenLiteralMessage = new Token('message', new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
        .setInsertText(new vscode.SnippetString('"$0"'));
    static tokenLiteralComperator = new Token('.comperator', new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
        .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0'));
    static tokenVariableEmpty = new Token('variable', new vscode.CompletionItem('variable', vscode.CompletionItemKind.Operator))
        .setInsertText(new vscode.SnippetString('{$0}'));

    static baseTokens: Token[] = [
        this.tokenLiteralColor,
        this.tokenLiteralMessage,
        this.tokenLiteralComperator,
        this.tokenVariableEmpty,
    ];
    static docTokens: Token[] = [];

    static getTokens(): Token[] {
        return this.baseTokens.concat(this.docTokens);
    }

}