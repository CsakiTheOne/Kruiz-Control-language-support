export default class Rule {
    offset: number;
    tokenIds: string[];

    constructor(offset: number, tokenIds: string[]) {
        this.offset = offset;
        this.tokenIds = tokenIds;
    }
}