"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const declared_1 = require("./declared");
class Command {
    constructor(name, kind) {
        this.params = [];
        this.name = name;
        this.kind = kind;
    }
    addParam(name, type = 'any') {
        this.params.push(new Param(name, type));
        return this;
    }
    toCompletionItem() {
        return new vscode.CompletionItem(this.name, this.kind);
    }
    getCurrentParam(lineContent) {
        const params = lineContent.trimStart().replace(this.name + ' ', '');
        const paramIndex = params.split(' ').length - 1;
        return this.params[paramIndex].toCompletionItems();
    }
}
class Param {
    constructor(name, type = 'any') {
        this.name = name;
        this.type = type;
    }
    toCompletionItems() {
        const typeInfoMap = {
            'any': { kind: vscode.CompletionItemKind.Value, snippet: `\${1|<NAME>|}` },
            'color': { kind: vscode.CompletionItemKind.Color, snippet: `"#\${1|ffffff|}"` },
            'comparator': { kind: vscode.CompletionItemKind.Operator, snippet: '\${1|==,<,>,<=,>=,!=|}' },
            'string': { kind: vscode.CompletionItemKind.Text, snippet: `"\${1|text|}"` },
            'twitchCommand': { kind: vscode.CompletionItemKind.Method, snippet: `!\${1|<NAME>|}` },
            'user': { kind: vscode.CompletionItemKind.User, snippet: `\${1|username|}` },
            'variable': { kind: vscode.CompletionItemKind.Variable, snippet: `{<NAME>}` },
            'webhook': { kind: vscode.CompletionItemKind.Interface, snippet: `"\${1|webhookId|}"` },
        };
        const item = new vscode.CompletionItem(this.name, typeInfoMap[this.type].kind);
        item.insertText = new vscode.SnippetString(typeInfoMap[this.type].snippet.replace('<NAME>', this.name));
        const items = [item];
        if (this.type === 'user') {
            (0, declared_1.getFoundUsers)().forEach(user => {
                const item = new vscode.CompletionItem(user, vscode.CompletionItemKind.User);
                item.documentation = 'A Twitch user.';
                items.push(item);
            });
        }
        (0, declared_1.getFoundVariables)().forEach(variable => {
            const item = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
            item.documentation = 'A variable you loaded.';
            item.insertText = new vscode.SnippetString(typeInfoMap['variable'].snippet.replace('<NAME>', variable));
            items.push(item);
        });
        return items;
    }
}
exports.default = [
    // keyword - if
    new Command('if', vscode.CompletionItemKind.Keyword)
        .addParam('linesToSkip', 'any')
        .addParam('value1', 'any')
        .addParam('operator', 'comparator')
        .addParam('value2', 'any'),
    // trigger - onCommand
    new Command('onCommand', vscode.CompletionItemKind.Event)
        .addParam('permissions', 'any')
        .addParam('cooldownSeconds', 'any')
        .addParam('command', 'twitchCommand'),
    // trigger - onMessage
    new Command('onMessage', vscode.CompletionItemKind.Event)
        .addParam('message', 'any'),
    // action - chat
    new Command('chat send', vscode.CompletionItemKind.Function).addParam('message', 'string'),
    new Command('chat whisper', vscode.CompletionItemKind.Function).addParam('user', 'user').addParam('message', 'string'),
    // action - discord
    new Command('discord clear', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord color', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook').addParam('color', 'color'),
    new Command('discord create', vscode.CompletionItemKind.Function).addParam('webhook', 'string').addParam('webhookUrl', 'any'),
    new Command('discord delete', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook').addParam('messageId', 'any'),
    new Command('discord description', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook').addParam('description', 'string'),
    new Command('discord field', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord file', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord footericon', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord footertext', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord image', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord message', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord send', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord thumbnail', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord title', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord update', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    new Command('discord url', vscode.CompletionItemKind.Function).addParam('webhook', 'webhook'),
    // action - message
    new Command('message send', vscode.CompletionItemKind.Function).addParam('message', 'any').addParam('data', 'any'),
    // action - variable
    new Command('variable load', vscode.CompletionItemKind.Function).addParam('newVariable', 'any'),
    new Command('variable remove', vscode.CompletionItemKind.Function).addParam('variable', 'variable'),
    new Command('variable set', vscode.CompletionItemKind.Function).addParam('variable', 'variable').addParam('value', 'any'),
    new Command('variable global load', vscode.CompletionItemKind.Function).addParam('newVariable', 'any'),
    new Command('variable global remove', vscode.CompletionItemKind.Function).addParam('variable', 'variable'),
    new Command('variable global set', vscode.CompletionItemKind.Function).addParam('variable', 'variable').addParam('value', 'any'),
    new Command('variable global clear', vscode.CompletionItemKind.Function),
];
//# sourceMappingURL=commands.js.map