import * as vscode from 'vscode';
import Token from "./Token";
import Symbol from './Symbol';

export default class Database {

    static baseTokens: Token[] = [];
    static docTokens: Token[] = [];
    static symbols: Symbol[] = [];

    static initBaseTokens() {
        this.baseTokens.push(
            new Token('color', /^"#[0-9a-f]{6}"$/i, new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
                .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0')),
            new Token('message', /^".+"$/, new vscode.CompletionItem('message', vscode.CompletionItemKind.Text))
                .setInsertText(new vscode.SnippetString('"$0"')),
            new Token('comperator', /^(==|<|>|<=|>=|!=)$/, new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0')),
            new Token('variable', /^{[a-z0-9]+}$/i, new vscode.CompletionItem('variable', vscode.CompletionItemKind.Variable))
                .setInsertText(new vscode.SnippetString('{$0}')),
            new Token('permission', /^[bsfvmne]$/i, new vscode.CompletionItem('permission', vscode.CompletionItemKind.Constant))
                .setInsertText('bsfvmne'),
        );
    }

    static getTokens(): Token[] {
        return this.baseTokens.concat(this.docTokens);
    }

    static permissionCompletions: vscode.CompletionItem[] = [
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

    static userCompletions: vscode.CompletionItem[] = [
        new vscode.CompletionItem('CsakiTheOne', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('LenaTheNPC', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('Lightfall_23', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('NeshyLegacy', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('PrincezzRosalina', vscode.CompletionItemKind.User),
        new vscode.CompletionItem('Xx_Nniko_xX', vscode.CompletionItemKind.User),
    ];

    static variableCompletions: vscode.CompletionItem[] = [];

    static updateSymbols(document: vscode.TextDocument) {
        const docText = document.getText();
        const lines = docText.split('\n');

        // collect symbols in document
        const symbols: Symbol[] = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex].trim();
            // Check full line tokens
            let lineResult = null;
            this.getTokens().forEach(token => {
                lineResult = line.match(token.regex);
                if (lineResult) symbols.push(new Symbol(token, lineResult[0], new vscode.Position(lineIndex, 0), 0));
            });
            // Check full line definitions
            this.getTokens().filter(token => token.definition != undefined)
                .forEach(token => {
                    lineResult = line.match(token.definition?.regex!);
                    if (lineResult) symbols.push(new Symbol(token.definition!, lineResult[0], new vscode.Position(lineIndex, 0), 0));
                });
            // Check word by word tokens
            if (!lineResult) {
                const words = line.split(' ');
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                    const word = words[wordIndex];
                    this.getTokens().forEach(token => {
                        const wordResult = word.match(token.regex);
                        const character = line.indexOf(word);
                        if (wordResult) symbols.push(new Symbol(token, wordResult[0], new vscode.Position(lineIndex, character), wordIndex));
                    });
                    // Check word by word definitions
                    this.getTokens().filter(token => token.definition?.regex != undefined)
                        .forEach(token => {
                            const wordResult = line.match(token.definition?.regex!);
                            const character = line.indexOf(word);
                            if (wordResult) symbols.push(new Symbol(token.definition!, wordResult[0], new vscode.Position(lineIndex, character), wordIndex));
                        });
                }
            }
        }

        this.symbols = symbols;

        // update variables
        this.variableCompletions = [];
        symbols.filter(symbol => symbol.token.id == 'variable.definition')
            .forEach(variable => {
                const item = new vscode.CompletionItem(variable.content, vscode.CompletionItemKind.Variable);
                item.insertText = `{${variable.content}}`;
                item.documentation = new vscode.MarkdownString(`Variable loaded on line ${variable.position.line + 1}.`);
                this.variableCompletions.push(item);
            });
        // update parameters
        symbols.filter(symbol => symbol.token.parameters.length > 0)
            .forEach(symbol => {
                symbol.token.parameters.forEach(param => {
                    const item = new vscode.CompletionItem(param, vscode.CompletionItemKind.Variable);
                    item.insertText = `{${param}}`;
                    item.documentation = new vscode.MarkdownString(`Parameter of ${symbol.content}. Defined on line ${symbol.position.line}.`);
                    this.variableCompletions.push(item);
                });
            });
        // distinct variables
        this.variableCompletions = [... new Set(this.variableCompletions)];

    }

}