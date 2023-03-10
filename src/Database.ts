import * as vscode from 'vscode';
import Token from "./Token";

export default class Database {

    static tokenLiteralColor = new Token('literal.color', new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
        .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0'));
    static tokenLiteralString = new Token('literal.string', new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
        .setInsertText(new vscode.SnippetString('"$0"'));
    static tokenLiteralNumber = new Token('literal.number', new vscode.CompletionItem('number', vscode.CompletionItemKind.Operator))
        .setInsertText('0');
    static tokenLiteralComperator = new Token('literal.comperator', new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
        .setInsertText('${1|==,<,>,<=,>=,!=|}$0');
    static tokenVariableEmpty = new Token('variable', new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
        .setInsertText('${1|==,<,>,<=,>=,!=|}$0');

    static baseTokens: Token[] = [
        this.tokenLiteralColor,
        this.tokenLiteralString,
        this.tokenLiteralNumber,
        this.tokenLiteralComperator,
    ];
    static docTokens: Token[] = [];

    static getTokens(): Token[] {
        return this.baseTokens.concat(this.docTokens);
    }

}