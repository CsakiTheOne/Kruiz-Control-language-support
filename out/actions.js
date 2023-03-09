"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class Action {
    constructor(name) {
        this.subactions = [];
        this.params = [];
        this.name = name;
    }
    addSubaction(action) {
        this.subactions.push(action);
        return this;
    }
    addParam(param) {
        this.params.push(param);
        return this;
    }
    toCompletitionItem() {
        const item = new vscode.CompletionItem(this.name, vscode.CompletionItemKind.Function);
        return item;
    }
    getSubcompletitions(lineContent, lastAction = undefined) {
        const words = lineContent.trimStart().split(' ');
        let completitions = [];
        // if last word is this action
        if (words.length > 1 && words[words.length - 2] == this.name) {
            completitions = completitions.concat(this.subactions.map(action => action.toCompletitionItem()));
            completitions = completitions.concat(this.params.map(param => param.toCompletitionItem()));
        }
        else if (lastAction) {
            completitions = completitions.concat(lastAction.subactions.map(action => action.toCompletitionItem()));
            completitions = completitions.concat(lastAction.params.map(param => param.toCompletitionItem()));
        }
        else {
            completitions = completitions.concat(this.subactions.flatMap(action => action.getSubcompletitions(lineContent, this)));
        }
        return completitions;
    }
}
class Param {
    constructor(name, type = 'string') {
        this.name = name;
        this.type = type;
        this.snippet = '${1|' + this.name + '|}';
    }
    setSnippet(snippet) {
        this.snippet = snippet;
        return this;
    }
    toCompletitionItem() {
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
        item.insertText = new vscode.SnippetString('${1|<' + this.name + '>|}');
        return item;
    }
}
exports.default = [
    new Action('chat')
        .addSubaction(new Action('send').addParam(new Param('message').setSnippet('"${1|hello|}"')))
        .addSubaction(new Action('whisper')
        .addParam(new Param('user', 'username'))
        .addParam(new Param('message').setSnippet('"${1|hello|}"'))),
    new Action('variable')
        .addSubaction(new Action('load').addParam(new Param('name', 'variable')))
        .addSubaction(new Action('remove').addParam(new Param('name', 'variable')))
        .addSubaction(new Action('set').addParam(new Param('name', 'variable')).addParam(new Param('value')))
        .addSubaction(new Action('global')
        .addSubaction(new Action('load').addParam(new Param('name', 'variable')))
        .addSubaction(new Action('remove').addParam(new Param('name', 'variable')))
        .addSubaction(new Action('set').addParam(new Param('name', 'variable')).addParam(new Param('value')))
        .addSubaction(new Action('clear'))),
];
//# sourceMappingURL=actions.js.map