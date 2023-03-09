"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const keywords_1 = require("./keywords");
function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            const docText = document.getText();
            const lines = docText.split('\n');
            const currentLine = document.lineAt(position.line);
            const currentAction = keywords_1.default.find(keyword => currentLine.text.trimStart().startsWith(keyword.name));
            if (currentAction) {
                return currentAction.getSubcompletitions(currentLine.text);
            }
            return keywords_1.default.map(keyword => keyword.toCompletitionItem());
        }
    });
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map