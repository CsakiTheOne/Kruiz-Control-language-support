import * as vscode from 'vscode';
import { getDefaultParams, getLoadedVariables, getUsers, joinToString } from './declared';

type Part = 'defaultParam' | 'action' | 'subaction' | 'paramAny' |
    'paramString' | 'paramUser' | 'paramVar';

class Keyword {
    part: Part;
    name: string;
    children: Keyword[] = [];
    depth: number = 0;

    constructor(part: Part, name: string) {
        this.part = part;
        this.name = name;
    }

    setChildren(keywords: Keyword[]): Keyword {
        keywords.forEach(keyword => {
            keyword.depth = this.depth + 1;
            keyword.setChildren(keyword.children);
        });
        this.children = keywords;
        return this;
    }

    toCompletitionItem(): vscode.CompletionItem {
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
                item.insertText = new vscode.SnippetString('${1|' + joinToString(getDefaultParams(), ',') + '|}');
                break;
            case 'paramUser':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>,' + joinToString(getUsers(), ',') + '|}');
                break;
            case 'paramVar':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>,' + joinToString(getLoadedVariables(), ',') + '|}');
                break;
            case 'paramAny':
                item.insertText = new vscode.SnippetString('${1|<' + this.name + '>|}');
                break;
            case 'paramString':
                item.insertText = new vscode.SnippetString('"${1|' + this.name + '|}"');
                break;
        }
        return item;
    }

    getSubcompletitions(lineContent: string): vscode.CompletionItem[] {
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

export default [
    new Keyword('action', 'chat')
        .setChildren([
            new Keyword('subaction', 'send').setChildren([new Keyword('paramString', 'message')]),
            new Keyword(
                'subaction',
                'whisper'
            ).setChildren([
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