"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const declared_1 = require("./declared");
class Keyword {
    constructor(part, name) {
        this.children = [];
        this.depth = 0;
        this.part = part;
        this.name = name;
    }
    setChildren(keywords) {
        keywords.forEach(keyword => {
            keyword.depth = this.depth + 1;
            keyword.setChildren(keyword.children);
        });
        this.children = keywords;
        return this;
    }
    toCompletitionItem() {
        const partKind = {
            'defaultParam': vscode.CompletionItemKind.Property,
            'action': vscode.CompletionItemKind.Function,
            'subaction': vscode.CompletionItemKind.Function,
            'paramAny': vscode.CompletionItemKind.Value,
            'paramColor': vscode.CompletionItemKind.Color,
            'paramString': vscode.CompletionItemKind.Text,
            'paramUser': vscode.CompletionItemKind.User,
            'paramVar': vscode.CompletionItemKind.Variable,
            'paramWebhook': vscode.CompletionItemKind.Interface,
        };
        const item = new vscode.CompletionItem(this.name, partKind[this.part]);
        switch (this.part) {
            case 'defaultParam':
                item.insertText = new vscode.SnippetString('${1|' + (0, declared_1.joinToString)((0, declared_1.getDefaultParams)(), ',', ',') + '|}');
                break;
            case 'paramAny':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>|}');
                break;
            case 'paramColor':
                item.insertText = new vscode.SnippetString('"#${1|' + this.name + '|}"');
                break;
            case 'paramString':
                item.insertText = new vscode.SnippetString('"${1|' + this.name + '|}"');
                break;
            case 'paramUser':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>' + (0, declared_1.joinToString)((0, declared_1.getFoundUsers)(), ',', ',') + '|}');
                break;
            case 'paramVar':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>' + (0, declared_1.joinToString)((0, declared_1.getFoundVariables)(), ',', ',') + '|}');
                break;
            case 'paramWebhook':
                item.insertText = new vscode.SnippetString('"${1|' + this.name + (0, declared_1.joinToString)((0, declared_1.getFoundWebhooks)(), ',', ',') + '|}"');
                break;
        }
        return item;
    }
    matches(word) {
        console.log('match tester: ' + word);
        if (['action', 'subaction'].includes(this.part))
            return word == this.name;
        else if (this.part === 'paramString' || this.part === 'paramWebhook')
            return word.startsWith('"');
        else if (this.part === 'paramColor')
            return word.startsWith('"#');
        else
            return true;
    }
    getSubcompletitions(lineContent) {
        // chat whisper <user> "message"
        // chat whisper |
        const words = lineContent.trimStart().split(' ');
        const depth = words.length - 1;
        if (this.depth == depth) {
            console.log('depth matches: ' + this.name + ' ' + depth);
            return [this.toCompletitionItem()];
        }
        else if (this.matches(words[this.depth])) {
            return this.children.flatMap(keyword => keyword.getSubcompletitions(lineContent));
        }
        else
            return [];
    }
}
exports.default = [
    new Keyword('action', 'chat')
        .setChildren([
        new Keyword('subaction', 'send').setChildren([new Keyword('paramString', 'message')]),
        new Keyword('subaction', 'whisper').setChildren([
            new Keyword('paramUser', 'user').setChildren([new Keyword('paramString', 'message')])
        ]),
    ]),
    new Keyword('action', 'discord')
        .setChildren([
        new Keyword('subaction', 'clear').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'color').setChildren([new Keyword('paramWebhook', 'webhook')]).setChildren([new Keyword('paramColor', 'color')]),
        new Keyword('subaction', 'create').setChildren([new Keyword('paramString', 'webhook')]).setChildren([new Keyword('paramString', 'webhookUrl')]),
        new Keyword('subaction', 'delete').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'description').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'field').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'file').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'footericon').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'footertext').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'image').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'message').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'send').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'thumbnail').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'title').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'update').setChildren([new Keyword('paramWebhook', 'webhook')]),
        new Keyword('subaction', 'url').setChildren([new Keyword('paramWebhook', 'webhook')]),
    ]),
    new Keyword('action', 'variable')
        .setChildren([
        new Keyword('subaction', 'load').setChildren([new Keyword('paramAny', 'varName')]),
        new Keyword('subaction', 'remove').setChildren([new Keyword('paramVar', 'varName')]),
        new Keyword('subaction', 'set').setChildren([new Keyword('paramVar', 'varName').setChildren([new Keyword('paramAny', 'value')])]),
        new Keyword('subaction', 'global')
            .setChildren([
            new Keyword('subaction', 'load').setChildren([new Keyword('paramAny', 'varName')]),
            new Keyword('subaction', 'remove').setChildren([new Keyword('paramVar', 'varName')]),
            new Keyword('subaction', 'set').setChildren([new Keyword('paramVar', 'varName').setChildren([new Keyword('paramAny', 'value')])]),
            new Keyword('subaction', 'clear'),
        ]),
    ]),
];
//# sourceMappingURL=keywords.js.map