"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const tokens_1 = require("./tokens");
const Symbol_1 = require("./Symbol");
const Symbols_1 = require("./Symbols");
/*
if 2 {number} == 10
OnCommand e 0 !lol
chat send "pong"
*/
function updateSymbols(document) {
    const docText = document.getText();
    const lines = docText.split('\n');
    // collect symbols in document
    const symbols = [];
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex].trim();
        // Check full line tokens
        let lineResult = null;
        tokens_1.default.forEach(token => {
            lineResult = line.match(token.regex);
            if (lineResult)
                symbols.push(new Symbol_1.default(token, lineResult[0], lineIndex));
            //console.log(`Line: ${lineIndex} Token: ${token.id} Result: ${lineResult}`);
        });
        // Check word by word tokens
        if (!lineResult) {
            const words = line.split(' ');
            for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                const word = words[wordIndex];
                tokens_1.default.forEach(token => {
                    const wordResult = word.match(token.regex);
                    if (wordResult)
                        symbols.push(new Symbol_1.default(token, wordResult[0], lineIndex, wordIndex));
                });
            }
        }
    }
    Symbols_1.default.update(symbols);
}
function activate(context) {
    const baseProvider = {
        provideCompletionItems(document, position, token, context) {
            updateSymbols(document);
            const currentLineSymbols = Symbols_1.default.list.filter(symbol => symbol.line == position.line);
            const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;
            // look for available tokens to suggest based on the collected symbols
            let availableTokens = [];
            currentLineSymbols.forEach(symbol => {
                symbol.token.rules.forEach(rule => {
                    const isRelevant = symbol.word != undefined && currentWordIndex == symbol.word + rule.offset;
                    if (!isRelevant)
                        return;
                    const ruleTokens = rule.tokenIds
                        .map(id => tokens_1.default.find(token => token.id == id))
                        .filter(token => token != undefined)
                        .map(token => token);
                    availableTokens = availableTokens.concat(ruleTokens);
                });
            });
            // debug line
            console.table(Symbols_1.default.list.map(s => s.tabularData()));
            // suggest the found tokens
            if (availableTokens.length > 0) {
                return availableTokens.map(token => token.toCompletionItem());
            }
            // if no token found and line is empty, suggest top-level tokens
            if (currentLineSymbols.length < 1) {
                return tokens_1.default.filter(token => token.isTopLevel).map(token => token.toCompletionItem());
            }
            return [];
        }
    };
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('kruizcontrol', baseProvider, '', ' '));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map