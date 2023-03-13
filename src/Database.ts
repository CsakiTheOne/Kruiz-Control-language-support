import * as vscode from 'vscode';
import Token from "./Token";
import Symbol from './Symbol';

export default class Database {

    static baseTokens: Token[] = [];
    static docTokens: Token[] = [];
    static symbols: Symbol[] = [];

    static initBaseTokens() {
        this.baseTokens.push(
            new Token('color', /"#[0-9a-f]{6}"/gi, new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
                .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0')),
            new Token('string', /"(?:\\.|[^\\"])*"/g, new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
                .setInsertText(new vscode.SnippetString('"$0"')),
            new Token('comperator', /(==|<|>|<=|>=|!=)/g, new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0')),
            new Token('variable', /{[a-z0-9]+}/gi, new vscode.CompletionItem('variable', vscode.CompletionItemKind.Variable))
                .setInsertText(new vscode.SnippetString('{$0}'))
                .setDefinition(/(?<=variable (global )?load )[a-z0-9]+$/i),
            new Token('permission', /\b[bsfvmne]+\b/gi, new vscode.CompletionItem('permission', vscode.CompletionItemKind.Constant))
                .setInsertText('bsfvmne'),
            new Token('number', /[0-9]+/gi, new vscode.CompletionItem('number', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('${1:0}$0')),
            new Token('Twitch command', /![a-z0-9]+\b/gi, new vscode.CompletionItem('Twitch command', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('!${1:command}$0')),
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

    static findLineColForByte(document: string, index: number): vscode.Position {
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

    static findSymbols(document: string): Symbol[] {
        const symbols: Symbol[] = [];
        for (const token of this.getTokens()) {
            let match;
            token.regex.lastIndex = 0;
            while ((match = token.regex.exec(document)) != null) {
                const symbol: Symbol = new Symbol(token, match[0], this.findLineColForByte(document, match.index));
                if (!symbols.includes(symbol)) {
                    symbols.push(symbol);
                }
                token.regex.lastIndex++;
            }
        }
        return symbols;
    }

    static updateSymbols(document: vscode.TextDocument) {
        const docText = document.getText();
        const lines = docText.split('\n');

        // collect symbols in document
        this.symbols = this.findSymbols(docText);

        // update variables
        this.variableCompletions = [];
        this.symbols.filter(symbol => symbol.token.id == 'variable.definition')
            .forEach(variable => {
                const item = new vscode.CompletionItem(variable.content, vscode.CompletionItemKind.Variable);
                item.insertText = `{${variable.content}}`;
                item.documentation = new vscode.MarkdownString(`Variable loaded on line ${variable.position.line + 1}.`);
                this.variableCompletions.push(item);
            });
        // update parameters
        this.symbols.filter(symbol => symbol.token.parameters.length > 0)
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