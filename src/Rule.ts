import Token from "./Token";

export default class Rule {
    offset: number;
    tokens: Token[];

    constructor(offset: number, tokens: Token[]) {
        this.offset = offset;
        this.tokens = tokens;
    }
}