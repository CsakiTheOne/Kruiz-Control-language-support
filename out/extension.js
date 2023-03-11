"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const DocumantationReader_1 = require("./DocumantationReader");
const Database_1 = require("./Database");
function activate(context) {
    Database_1.default.initBaseTokens();
    (0, DocumantationReader_1.loadDoc)();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            Database_1.default.updateSymbols(document);
            const currentLineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line);
            const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;
            let relevantRuleTokens = [];
            // look for available tokens to suggest based on the collected symbols
            let availableCompletions = [];
            currentLineSymbols.forEach(symbol => {
                symbol.token.rules.forEach(rule => {
                    const isRelevant = symbol.wordPosition != undefined && currentWordIndex == symbol.wordPosition + rule.offset;
                    if (!isRelevant)
                        return;
                    relevantRuleTokens = rule.tokens.map(token => token.id);
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
            console.table(Database_1.default.symbols.map(s => s.toSimpleObject()));
            // suggest the found tokens
            if (availableCompletions.length > 0) {
                availableCompletions.push(new vscode.CompletionItem(`Debug - relevant tokens: ${relevantRuleTokens}`));
                return [...new Set(availableCompletions)];
            }
            // if no token found and line is empty, suggest top-level tokens
            if (currentLineSymbols.length < 1) {
                return Database_1.default.getTokens().filter(token => token.isTopLevel).map(token => token.completion);
            }
            return [];
        },
    }, '', ' '), vscode.languages.registerDefinitionProvider('kruizcontrol', {
        provideDefinition(document, position, token) {
            Database_1.default.updateSymbols(document);
            // find the symbol
            const lineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line);
            const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);
            const format = symbol?.token.completion.detail;
            const description = symbol?.token.completion.documentation;
            const contents = [];
            // look for definition
            if (symbol?.token.definition?.regex != undefined) {
                console.log(`Symbol has definition regex.`);
                const definition = Database_1.default.symbols.find(definitionSymbol => symbol.token.definition &&
                    definitionSymbol.token.id == symbol.token.definition.id &&
                    (symbol.content == definitionSymbol.content ||
                        symbol.content == `{${definitionSymbol.content}}`));
                if (definition == undefined)
                    return;
                const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
                return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
            }
            return null;
        },
    }), vscode.languages.registerHoverProvider('kruizcontrol', {
        provideHover(document, position, token) {
            Database_1.default.updateSymbols(document);
            // find the symbol
            const lineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line);
            const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);
            const format = symbol?.token.completion.detail;
            const description = symbol?.token.completion.documentation;
            const contents = [];
            // look for definition
            if (symbol?.token.definition?.regex != undefined) {
                console.log(`Symbol has definition regex.`);
                const definition = Database_1.default.symbols.find(definitionSymbol => symbol.token.definition &&
                    definitionSymbol.token.id == symbol.token.definition.id &&
                    (symbol.content == definitionSymbol.content ||
                        symbol.content == `{${definitionSymbol.content}}`));
                if (definition == undefined)
                    return;
                const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
                //return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
                contents.push(`Defined on line ${definitionPos.line}.`);
            }
            if (format)
                contents.push(format);
            if (description)
                contents.push(description.toString());
            if (symbol && contents.length < 1)
                contents.push(`No info found about ${symbol.content} (${symbol.token.id})`);
            return { contents: contents };
        },
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map