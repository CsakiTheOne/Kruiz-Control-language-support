"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("./tokens");
class Symbols {
    static update(symbols) {
        this.list = symbols;
        // update variables
        const loadedVariables = this.list.filter(symbol => symbol.token.id == 'variable.loaded');
        const suggestionsList = loadedVariables.map(variable => variable.content);
        let suggestionsString = '';
        suggestionsList.forEach(suggestion => suggestionsString += `${suggestion},`);
        if (suggestionsString.length > 1)
            tokens_1.default.find(token => token.id == 'variable').snippet = `{\${1|${suggestionsString}|}}`.replace(',|', '|');
        else
            tokens_1.default.find(token => token.id == 'variable').snippet = '{$0}';
    }
}
exports.default = Symbols;
Symbols.list = [];
//# sourceMappingURL=Symbols.js.map