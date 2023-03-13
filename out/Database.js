"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Token_1 = require("./Token");
const Symbol_1 = require("./Symbol");
class Database {
    static getVariableToken() {
        return new Token_1.default('variable', /{[a-z0-9]+}/gi, new vscode.CompletionItem('variable', vscode.CompletionItemKind.Variable))
            .setInsertText(new vscode.SnippetString('{$0}'))
            .setDefinition(/(?<=variable (global )?load )[a-z0-9]+/gi);
    }
    static initBaseTokens() {
        this.baseTokens.push(new Token_1.default('color', /"#[0-9a-f]{6}"/gi, new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
            .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0'))
            .setDefinition(/"#[0-9a-f]{6}"/gi), new Token_1.default('string', /"(?:\\.|[^\\"])*"/g, new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
            .setInsertText(new vscode.SnippetString('"$0"')), new Token_1.default('comperator', /(==|<|>|<=|>=|!=)/g, new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
            .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0')), this.getVariableToken(), new Token_1.default('permission', /\b[bsfvmne]+\b/gi, new vscode.CompletionItem('permission', vscode.CompletionItemKind.Constant))
            .setInsertText('bsfvmne')
            .setDefinition(/\b[bsfvmne]+\b/gi), new Token_1.default('number', /[0-9]+/gi, new vscode.CompletionItem('number', vscode.CompletionItemKind.Operator))
            .setInsertText(new vscode.SnippetString('${1:0}$0')), new Token_1.default('command', /![a-z0-9]+\b/gi, new vscode.CompletionItem('Twitch command', vscode.CompletionItemKind.Method))
            .setInsertText(new vscode.SnippetString('!${1:command}$0'))
            .setDefinition(/![a-z0-9]+\b/gi), new Token_1.default('user', /(?<=Chat Whisper )\S+/gi, new vscode.CompletionItem('user', vscode.CompletionItemKind.User))
            .setDefinition(/(?<=Chat Whisper )\S+/gi));
    }
    static getTokens() {
        return this.baseTokens.concat(this.docTokens).concat(this.baseTokens.filter(t => t.definition).map(t => t.definition));
    }
    static findLineColForByte(document, index) {
        const lines = document.split('\n');
        let totalLength = 0;
        let lineStartPos = 0;
        for (let lineNo = 0; lineNo < lines.length; lineNo++) {
            totalLength += lines[lineNo].length + 1; // Because we removed the '\n' during split.
            if (index < totalLength) {
                const colNo = index - lineStartPos;
                return new vscode.Position(lineNo, colNo);
            }
            lineStartPos = totalLength;
        }
        return new vscode.Position(0, 0);
    }
    static findSymbols(document) {
        const symbols = [];
        for (const token of this.getTokens()) {
            let match;
            token.regex.lastIndex = 0;
            while ((match = token.regex.exec(document)) != null) {
                const symbol = new Symbol_1.default(token, match[0], this.findLineColForByte(document, match.index));
                if (!symbols.includes(symbol)) {
                    symbols.push(symbol);
                }
                token.regex.lastIndex++;
            }
        }
        return symbols;
    }
    static updateSymbols(document) {
        const docText = document.getText();
        const lines = docText.split('\n');
        // collect symbols in document
        this.symbols = this.findSymbols(docText);
        // contextual completition
        this.contextualCompletions = new Map();
        this.baseTokens.forEach(token => {
            this.symbols.filter(symbol => symbol.token.id == `${token.id}.definition`)
                .forEach(def => {
                const item = new vscode.CompletionItem(def.content, token.completion.kind);
                item.insertText = token.id == 'variable' ? `{${def.content}}` : def.content;
                item.documentation = new vscode.MarkdownString(`Defined on line ${def.position.line + 1}.`);
                if (!this.contextualCompletions.has(token.id)) {
                    this.contextualCompletions.set(token.id, []);
                }
                this.contextualCompletions.get(token.id)?.push(item);
            });
        });
        // update variables
        /*this.symbols.filter(symbol => symbol.token.id == 'variable.definition')
            .forEach(variable => {
                const item = new vscode.CompletionItem(variable.content, vscode.CompletionItemKind.Variable);
                item.insertText = `{${variable.content}}`;
                item.documentation = new vscode.MarkdownString(`Variable loaded on line ${variable.position.line + 1}.`);
            });
        // update parameters
        this.symbols.filter(symbol => symbol.token.parameters.length > 0)
            .forEach(symbol => {
                symbol.token.parameters.forEach(param => {
                    const item = new vscode.CompletionItem(param, vscode.CompletionItemKind.Variable);
                    item.insertText = `{${param}}`;
                    item.documentation = new vscode.MarkdownString(`Parameter of ${symbol.content}. Defined on line ${symbol.position.line}.`);
                });
            });*/
    }
}
exports.default = Database;
Database.baseTokens = [];
Database.docTokens = [];
Database.symbols = [];
Database.contextualCompletions = new Map();
Database.contextualCompletionsBase = new Map([
    [
        'permission',
        [
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
        ]
    ],
    [
        'user',
        [
            new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
            new vscode.CompletionItem('LenaTheNPC', vscode.CompletionItemKind.User),
            new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
            new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
            new vscode.CompletionItem('PrincezzRosalina', vscode.CompletionItemKind.User),
            new vscode.CompletionItem('Xx_Nniko_xX', vscode.CompletionItemKind.User),
        ]
    ]
]);
//# sourceMappingURL=Database.js.map