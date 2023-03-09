import * as vscode from 'vscode';

class Action {
    name: string;
    subactions: Action[] = [];
    params: Param[] = [];

    constructor(name: string) {
        this.name = name;
    }

    addSubaction(action: Action) {
        this.subactions.push(action);
        return this;
    }

    addParam(param: Param) {
        this.params.push(param);
        return this;
    }

    toCompletitionItem(): vscode.CompletionItem {
        const item = new vscode.CompletionItem(
            this.name,
            vscode.CompletionItemKind.Function
        );
        return item;
    }

    getSubcompletitions(lineContent: string, lastAction: Action | undefined = undefined): vscode.CompletionItem[] {
        const words = lineContent.trimStart().split(' ');
        let completitions: vscode.CompletionItem[] = [];
        // if last word is this action
        if (words.length > 1 && words[words.length - 2] == this.name) {
            if (this.subactions.length > 0) {
                completitions = completitions.concat(this.subactions.map(action => action.toCompletitionItem()));
            }
            else {
                completitions = completitions.concat(this.params.map(param => param.toCompletitionItem()));
            }
        }
        else {
            completitions = completitions.concat(this.subactions.flatMap(action => action.getSubcompletitions(lineContent, this)));
        }
        return completitions;
    }
}

type ParamType = 'string' | 'username' | 'variable';

class Param {
    name: string;
    type: ParamType;
    snippet: string;

    constructor(name: string, type: ParamType = 'string') {
        this.name = name;
        this.type = type;
        this.snippet = '${1|' + this.name + '|}';
    }

    setSnippet(snippet: string): Param {
        this.snippet = snippet;
        return this;
    }

    toCompletitionItem(): vscode.CompletionItem {
        let kind = vscode.CompletionItemKind.Value;
        switch (this.type) {
            case 'username':
                kind = vscode.CompletionItemKind.User;
                break;
            case 'variable':
                kind = vscode.CompletionItemKind.Variable;
                break;
            default:
                break;
        }
        const item = new vscode.CompletionItem(this.name, kind);
        item.insertText = new vscode.SnippetString(this.snippet);
        return item;
    }
}

export default [
    new Action('chat')
        .addSubaction(
            new Action('send').addParam(new Param('message').setSnippet('"${1|hello|}"'))
        )
        .addSubaction(
            new Action('whisper')
                .addParam(new Param('user', 'username'))
                .addParam(new Param('message').setSnippet('"${1|hello|}"'))
        ),
    new Action('variable')
        .addSubaction(
            new Action('load').addParam(new Param('name', 'variable'))
        )
        .addSubaction(
            new Action('remove').addParam(new Param('name', 'variable'))
        )
        .addSubaction(
            new Action('set').addParam(new Param('name', 'variable')).addParam(new Param('value'))
        )
        .addSubaction(
            new Action('global')
                .addSubaction(
                    new Action('load').addParam(new Param('name', 'variable'))
                )
                .addSubaction(
                    new Action('remove').addParam(new Param('name', 'variable'))
                )
                .addSubaction(
                    new Action('set').addParam(new Param('name', 'variable')).addParam(new Param('value'))
                )
                .addSubaction(
                    new Action('clear')
                )
        ),
];