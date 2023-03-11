"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Token_1 = require("./Token");
class Database {
    static getTokens() {
        return this.baseTokens.concat(this.docTokens);
    }
}
exports.default = Database;
_a = Database;
Database.tokenLiteralColor = new Token_1.default('literal.color', new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
    .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0'));
Database.tokenLiteralString = new Token_1.default('literal.string', new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
    .setInsertText(new vscode.SnippetString('"$0"'));
Database.tokenLiteralNumber = new Token_1.default('literal.number', new vscode.CompletionItem('number', vscode.CompletionItemKind.Operator))
    .setInsertText(new vscode.SnippetString('${1:0}$0'));
Database.tokenLiteralComperator = new Token_1.default('literal.comperator', new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
    .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0'));
Database.tokenVariableEmpty = new Token_1.default('variable', new vscode.CompletionItem('variable', vscode.CompletionItemKind.Operator))
    .setInsertText(new vscode.SnippetString('{$0}'));
Database.baseTokens = [
    _a.tokenLiteralColor,
    _a.tokenLiteralString,
    _a.tokenLiteralNumber,
    _a.tokenLiteralComperator,
    _a.tokenVariableEmpty,
];
Database.docTokens = [];
//# sourceMappingURL=Database.js.map