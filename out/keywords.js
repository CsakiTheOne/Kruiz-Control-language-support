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
            'paramString': vscode.CompletionItemKind.Text,
            'paramUser': vscode.CompletionItemKind.User,
            'paramVar': vscode.CompletionItemKind.Variable,
        };
        const item = new vscode.CompletionItem(this.name, partKind[this.part]);
        switch (this.part) {
            case 'defaultParam':
                item.insertText = new vscode.SnippetString('{1|' + (0, declared_1.joinToString)((0, declared_1.getDefaultParams)()) + '|}');
                break;
            case 'paramUser':
                item.insertText = new vscode.SnippetString('{1|<' + this.name + '>,' + (0, declared_1.joinToString)((0, declared_1.getUsers)()) + '|}');
                break;
            case 'paramVar':
            case 'paramAny':
                item.insertText = new vscode.SnippetString('{1|<' + this.name + '>|}');
                break;
            case 'paramString':
                item.insertText = new vscode.SnippetString('"${1|' + this.name + '|}"');
                break;
        }
        return item;
    }
    getSubcompletitions(lineContent) {
        // chat whisper <user> "message"
        // chat whisper |
        const depth = lineContent.trimStart().split(' ').length - 1;
        if (this.depth == depth) {
            return [this.toCompletitionItem()];
        }
        else {
            return this.children.flatMap(keyword => keyword.getSubcompletitions(lineContent));
        }
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
    new Keyword('action', 'variable')
        .setChildren([
        new Keyword('subaction', 'load').setChildren([new Keyword('paramVar', 'varName')]),
        new Keyword('subaction', 'remove').setChildren([new Keyword('paramVar', 'varName')]),
        new Keyword('subaction', 'set').setChildren([new Keyword('paramVar', 'varName').setChildren([new Keyword('paramAny', 'value')])]),
        new Keyword('subaction', 'global')
            .setChildren([
            new Keyword('subaction', 'load').setChildren([new Keyword('paramVar', 'varName')]),
            new Keyword('subaction', 'remove').setChildren([new Keyword('paramVar', 'varName')]),
            new Keyword('subaction', 'set').setChildren([new Keyword('paramVar', 'varName').setChildren([new Keyword('paramAny', 'value')])]),
            new Keyword('subaction', 'clear'),
        ]),
    ]),
];
//# sourceMappingURL=keywords.js.map