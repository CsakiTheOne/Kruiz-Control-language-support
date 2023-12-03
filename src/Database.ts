import * as vscode from 'vscode';
import Token from "./Token";
import Symbol from './Symbol';

export default class Database {

    static baseTokens: Token[] = [];
    static docTokens: Token[] = [];
    static symbols: Symbol[] = [];

    static getVariableToken(): Token {
        return new Token('variable', /{[a-z0-9]+}/gi, new vscode.CompletionItem('variable', vscode.CompletionItemKind.Variable))
            .setInsertText(new vscode.SnippetString('{$0}'))
            .setDefinition(/(?<=variable (global )?load )[a-z0-9]+/gi);
    }

    static initBaseTokens() {
        this.baseTokens.push(
            new Token('user', /((?<=Chat Whisper )\S+)|((?<=#define user )\S+)|((?<={user} == ")\S+(?="))/gi, new vscode.CompletionItem('user', vscode.CompletionItemKind.User))
                .setDefinition(/((?<=Chat Whisper )\S+)|(?<=#define user )\S+/gi),
            new Token('define user', /#define user/gi, new vscode.CompletionItem('Define user', vscode.CompletionItemKind.Reference), true)
                .setInsertText(new vscode.SnippetString('#define user ${1:username}$0')),
            new Token('comment', /#.*/gi, new vscode.CompletionItem('Comment', vscode.CompletionItemKind.Text), true)
                .setInsertText('# '),
            new Token('color', /"#[0-9a-f]{6}"/gi, new vscode.CompletionItem('color', vscode.CompletionItemKind.Color))
                .setInsertText(new vscode.SnippetString('"#${1:FFFFFF}"$0'))
                .setDefinition(/"#[0-9a-f]{6}"/gi),
            new Token('string', /"(?:\\.|[^\\"])*"/g, new vscode.CompletionItem('string', vscode.CompletionItemKind.Text))
                .setInsertText(new vscode.SnippetString('"$0"')),
            new Token('comperator', /(==|<|>|<=|>=|!=)/g, new vscode.CompletionItem('comperator', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('${1|==,<,>,<=,>=,!=|}$0')),
            this.getVariableToken(),
            new Token('permission', /\b[bsfvmne]+\b/gi, new vscode.CompletionItem('permission', vscode.CompletionItemKind.Constant))
                .setInsertText('bsfvmne'),
            new Token('number', /[0-9]+/gi, new vscode.CompletionItem('number', vscode.CompletionItemKind.Operator))
                .setInsertText(new vscode.SnippetString('${1:0}$0')),
            new Token('command', /![a-z0-9]+\b/gi, new vscode.CompletionItem('Twitch command', vscode.CompletionItemKind.Method))
                .setInsertText(new vscode.SnippetString('!${1:command}$0'))
                .setDefinition(/![a-z0-9]+\b/gi),
        );
    }

    static getTokens(): Token[] {
        return this.baseTokens.concat(this.docTokens.reverse()).concat(this.baseTokens.filter(t => t.definition).map(t => t.definition!));
    }

    static contextualCompletions = new Map<string, vscode.CompletionItem[]>();

    static contextualCompletionsBase = new Map<string, vscode.CompletionItem[]>([
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
                'CsakiTheOne',
                'kadelandthewizard',
                'LenaTheNPC',
                'Lightfall_23',
                'NeshyLegacy',
                'PrincezzRosalina',
                'SabrinaJadexx',
                'Teyaleen',
                'ueszka_',
            ].map(username => new vscode.CompletionItem(username, vscode.CompletionItemKind.User))
        ]
    ]);

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
        let cleanText = document;
        const symbols: Symbol[] = [];
        for (const token of this.getTokens()) {
            let match;
            token.regex.lastIndex = 0;
            while ((match = token.regex.exec(cleanText)) != null) {
                const symbol: Symbol = new Symbol(token, match[0], this.findLineColForByte(document, match.index));
                if (!symbols.includes(symbol)) {
                    symbols.push(symbol);
                    cleanText = cleanText.substring(0, match.index) + ' '.repeat(match[0].length) + cleanText.substring(match.index + match[0].length);
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
    }

}