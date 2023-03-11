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

    toSimpleObject(): {} {
        return {
            tokenId: this.token.id,
            content: this.content,
            position: `l:${this.position.line},c:${this.position.character},w:${this.wordPosition})`,
            rules: this.token.rules.map(rule => `${rule.offset}: ${rule.tokens.map(token => token.id)}`),
        }
    }
}