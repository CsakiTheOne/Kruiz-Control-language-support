import Token from "./Token";

export default class Rule {
    offset: number;
    token: Token;

    constructor(offset: number, token: Token) {
        this.offset = offset;
        this.token = token;
    }
}