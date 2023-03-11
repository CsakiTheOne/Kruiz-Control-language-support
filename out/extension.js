"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const DocumantationReader_1 = require("./DocumantationReader");
const Database_1 = require("./Database");
function activate(context) {
    (0, DocumantationReader_1.loadDoc)();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            Database_1.default.updateSymbols(document);
            const currentLineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line);
            const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;
            // look for available tokens to suggest based on the collected symbols
            let availableCompletions = [];
            currentLineSymbols.forEach(symbol => {
                symbol.token.rules.forEach(rule => {
                    const isRelevant = symbol.wordPosition != undefined && currentWordIndex == symbol.wordPosition + rule.offset;
                    if (!isRelevant)
                        return;
                    const ruleTokens = rule.tokens
                        .map(ruleToken => Database_1.default.getTokens().find(token => token == ruleToken))
                        .filter(token => token != undefined)
                        .map(token => token.completion);
                    // contextual suggestions
                    if (rule.tokens.find(token => token.id == 'permission'))
                        availableCompletions = availableCompletions.concat(Database_1.default.permissionCompletions);
                    if (rule.tokens.find(token => token.id == 'user'))
                        availableCompletions = availableCompletions.concat(Database_1.default.userCompletions);
                    if (rule.tokens.find(token => token.id == 'variable'))
                        availableCompletions = availableCompletions.concat(Database_1.default.variableCompletions);
                    availableCompletions = availableCompletions.concat(ruleTokens);
                });
            });
            // debug line
            console.table(Database_1.default.symbols /*.map(s => s.tabularData())*/);
            // suggest the found tokens
            if (availableCompletions.length > 0) {
                return [...new Set(availableCompletions)];
            }
            // if no token found and line is empty, suggest top-level tokens
            if (currentLineSymbols.length < 1) {
                return Database_1.default.getTokens() /*.filter(token => token.isTopLevel)*/.map(token => token.completion);
            }
            return [];
        },
    }, '', ' '));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map