"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const usernames_1 = require("./usernames");
function activate(context) {
    let foundVariables = [];
    const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            const text = document.getText();
            const lines = text.split('\n');
            foundVariables = [];
            lines.forEach(line => {
                if (line.trim().startsWith('variable') && line.includes('load')) {
                    const variableName = line.split(' ')[line.split(' ').length - 1];
                    foundVariables.push(new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable));
                }
            });
            return [
                new vscode.CompletionItem('chat', vscode.CompletionItemKind.Function),
                new vscode.CompletionItem('variable', vscode.CompletionItemKind.Function),
            ];
        }
    });
    const provider2 = vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position) {
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            switch (linePrefix.trim()) {
                case 'chat':
                    const chatSend = new vscode.CompletionItem('send');
                    chatSend.insertText = new vscode.SnippetString('send "${1|message|}"');
                    const chatWhisper = new vscode.CompletionItem('whisper');
                    chatWhisper.insertText = new vscode.SnippetString('whisper ${1|' + usernames_1.default + '|} "${2|message|}"');
                    return [chatSend, chatWhisper];
                case 'variable':
                    return [
                        new vscode.CompletionItem('load'),
                        new vscode.CompletionItem('remove'),
                        new vscode.CompletionItem('set'),
                        new vscode.CompletionItem('global'),
                    ];
                case 'variable global':
                    return [
                        new vscode.CompletionItem('load'),
                        new vscode.CompletionItem('remove'),
                        new vscode.CompletionItem('set'),
                        new vscode.CompletionItem('clear'),
                    ];
                case 'variable load':
                case 'variable remove':
                case 'variable set':
                case 'variable global load':
                case 'variable global remove':
                case 'variable global set':
                    return foundVariables;
                default:
                    return [];
            }
        }
    }, ' ' // triggered whenever a '.' is being typed
    );
    context.subscriptions.push(provider1, provider2);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map