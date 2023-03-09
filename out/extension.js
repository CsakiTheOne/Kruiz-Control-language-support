"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const tokens_1 = require("./tokens");
const Symbol_1 = require("./Symbol");
function activate(context) {
    const provider = {
        provideCompletionItems(document, position, token, context) {
            const docText = document.getText();
            const lines = docText.split('\n');
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
                            //console.log(`Word: ${wordIndex} Token: ${token.id} Result: ${wordResult}`);
                        });
                    }
                }
            }
            console.table(symbols);
            return [];
        }
    };
    const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map