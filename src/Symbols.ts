import Symbol from "./Symbol";
import tokens from "./tokens";

type suggestable = 'users' | 'variables';

export default class Symbols {
    static list: Symbol[] = [];

    static update(symbols: Symbol[]) {
        this.list = symbols;

        // update variables
        const loadedVariables = this.list.filter(symbol => symbol.token.id == 'variable.loaded');
        const suggestionsList = loadedVariables.map(variable => variable.content);
        let suggestionsString = '';
        suggestionsList.forEach(suggestion => suggestionsString += `${suggestion},`);
        if (suggestionsString.length > 1) tokens.find(token => token.id == 'variable')!.snippet = `{\${1|${suggestionsString}|}}`.replace(',|', '|');
        else tokens.find(token => token.id == 'variable')!.snippet = '{$0}';
    }
}