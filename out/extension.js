"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const tokens_1 = require("./tokens");
const Symbols_1 = require("./Symbols");
function activate(context) {
    const completionProvider = {
        provideCompletionItems(document, position, token, context) {
            Symbols_1.default.update(document);
            const currentLineSymbols = Symbols_1.default.list.filter(symbol => symbol.line == position.line);
            const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;
            // look for available tokens to suggest based on the collected symbols
            let availableCompletions = [];
            currentLineSymbols.forEach(symbol => {
                symbol.token.rules.forEach(rule => {
                    const isRelevant = symbol.word != undefined && currentWordIndex == symbol.word + rule.offset;
                    if (!isRelevant)
                        return;
                    const ruleTokens = rule.tokenIds
                        .map(id => tokens_1.default.find(token => token.id == id))
                        .filter(token => token != undefined)
                        .map(token => token.toCompletionItem());
                    // contextual suggestions
                    if (rule.tokenIds.includes('literal.permission'))
                        availableCompletions = availableCompletions.concat(Symbols_1.default.permissionCompletions);
                    if (rule.tokenIds.includes('literal.user'))
                        availableCompletions = availableCompletions.concat(Symbols_1.default.userCompletions);
                    if (rule.tokenIds.includes('variable'))
                        availableCompletions = availableCompletions.concat(Symbols_1.default.variableCompletions);
                    availableCompletions = availableCompletions.concat(ruleTokens);
                });
            });
            // debug line
            console.table(Symbols_1.default.list.map(s => s.tabularData()));
            // suggest the found tokens
            if (availableCompletions.length > 0) {
                return [...new Set(availableCompletions)];
            }
            // if no token found and line is empty, suggest top-level tokens
            if (currentLineSymbols.length < 1) {
                return tokens_1.default.filter(token => token.isTopLevel).map(token => token.toCompletionItem());
            }
            return [];
        }
    };
    const definitionProvider = {
        provideDefinition(document, position, token) {
            Symbols_1.default.update(document);
            // find the symbol
            const lineSymbols = Symbols_1.default.list.filter(symbol => symbol.line == position.line);
            const symbol = lineSymbols.reverse().find(symbol => symbol.column < position.character);
            console.log(`Looking for definition of ${symbol?.content} (${symbol?.token})...`);
            if (symbol?.token.definitionRegex != undefined) {
                console.log(`Symbol has definition regex.`);
                const definition = Symbols_1.default.list.find(definitionSymbol => definitionSymbol.token.id == symbol.token.getDefinitionToken().id &&
                    (symbol.content == definitionSymbol.content ||
                        symbol.content == `{${definitionSymbol.content}}`));
                if (definition == undefined)
                    return;
                const definitionPos = new vscode.Position(definition?.line, definition.column);
                return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
            }
            return;
        }
    };
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('kruizcontrol', completionProvider, '', ' '), vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map