import Token from "./Token";

export default class Symbol {
    token: Token;
    content: string;
    line: number;
    word: number | undefined;

    constructor(
        token: Token,
        content: string,
        line: number,
        word: number | undefined = undefined,
    ) {
        this.token = token;
        this.content = content;
        this.line = line;
        this.word = word;
    }
}