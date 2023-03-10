"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Symbol_1 = require("./Symbol");
const tokens_1 = require("./tokens");
class Symbols {
    static update(document) {
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
                    symbols.push(new Symbol_1.default(token, lineResult[0], lineIndex, 0));
            });
            // Check full line definitions
            tokens_1.default.filter(token => token.definitionRegex != undefined)
                .forEach(token => {
                lineResult = line.match(token.definitionRegex);
                if (lineResult)
                    symbols.push(new Symbol_1.default(token.getDefinitionToken(), lineResult[0], lineIndex, 0));
            });
            // Check word by word tokens
            if (!lineResult) {
                const words = line.split(' ');
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                    const word = words[wordIndex];
                    tokens_1.default.forEach(token => {
                        const wordResult = word.match(token.regex);
                        const column = line.indexOf(word);
                        if (wordResult)
                            symbols.push(new Symbol_1.default(token, wordResult[0], lineIndex, column, wordIndex));
                    });
                    // Check word by word definitions
                    tokens_1.default.filter(token => token.definitionRegex != undefined)
                        .forEach(token => {
                        const wordResult = line.match(token.definitionRegex);
                        const column = line.indexOf(word);
                        if (wordResult)
                            symbols.push(new Symbol_1.default(token.getDefinitionToken(), wordResult[0], lineIndex, column, wordIndex));
                    });
                }
            }
        }
        this.list = symbols;
        // update variables
        this.variableCompletions = [];
        symbols.filter(symbol => symbol.token.id == 'variable.definition')
            .forEach(variable => {
            const item = new vscode.CompletionItem(variable.content, vscode.CompletionItemKind.Variable);
            item.insertText = `{${variable.content}}`;
            item.documentation = new vscode.MarkdownString(`Variable loaded on line ${variable.line + 1}.`);
            this.variableCompletions.push(item);
        });
        // update parameters
        symbols.filter(symbol => symbol.token.parameters.length > 0)
            .forEach(symbol => {
            symbol.token.parameters.forEach(param => {
                const item = new vscode.CompletionItem(param, vscode.CompletionItemKind.Variable);
                item.insertText = `{${param}}`;
                item.documentation = new vscode.MarkdownString(`Parameter of ${symbol.content}. Defined on line ${symbol.line}.`);
                this.variableCompletions.push(item);
            });
        });
        // distinct variables
        this.variableCompletions = [...new Set(this.variableCompletions)];
    }
}
exports.default = Symbols;
Symbols.list = [];
Symbols.permissionCompletions = [
    (() => {
        const _ = new vscode.CompletionItem('everyone', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'e';
        _.documentation = 'Character: e';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('broadcaster', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'b';
        _.documentation = 'Character: b';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('founder', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'f';
        _.documentation = 'Character: f';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('VIP', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'v';
        _.documentation = 'Character: v';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('moderator', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'm';
        _.documentation = 'Character: m';
        return _;
    })(),
    (() => {
        const _ = new vscode.CompletionItem('negate permissions', vscode.CompletionItemKind.EnumMember);
        _.insertText = 'n';
        _.documentation = 'Character: n';
        return _;
    })(),
];
Symbols.userCompletions = [
    new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('LenaTheNPC', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('PrincezzRosalina', vscode.CompletionItemKind.User),
    new vscode.CompletionItem('Xx_Nniko_xX', vscode.CompletionItemKind.User),
];
Symbols.variableCompletions = [];
//# sourceMappingURL=Symbols.js.map