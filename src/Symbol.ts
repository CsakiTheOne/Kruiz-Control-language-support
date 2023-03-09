import Token from "./Token";

export default class Symbol {
    token: Token;
    content: string;
    line: number;
    column: number;
    word: number | undefined;

    constructor(
        token: Token,
        content: string,
        line: number,
        column: number,
        word: number | undefined = undefined,
    ) {
        this.token = token;
        this.content = content;
        this.line = line;
        this.column = column;
        this.word = word;
    }

    tabularData(): object {
        return {
            token: this.token.id,
            content: this.content,
            pos: `(${this.line},${this.word})`,
        };
    }
}