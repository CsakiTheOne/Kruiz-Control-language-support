import * as vscode from "vscode";
import Token from "./Token";

export default class Symbol {
    token: Token;
    content: string;
    position: vscode.Position;
    wordPosition: number;

    constructor(token: Token, content: string, position: vscode.Position, wordPosition: number) {
        this.token = token;
        this.content = content;
        this.position = position;
        this.wordPosition = wordPosition;
    }
}