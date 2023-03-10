import * as vscode from "vscode";
import Token from "./Token";

export default class Symbol {
    token: Token;
    content: string;
    position: vscode.Position;

    constructor(token: Token, content: string, position: vscode.Position) {
        this.token = token;
        this.content = content;
        this.position = position;
    }
}