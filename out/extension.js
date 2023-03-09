"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const actions_1 = require("./actions");
function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            const docText = document.getText();
            const lines = docText.split('\n');
            const currentLine = document.lineAt(position.line);
            const currentAction = actions_1.default.find(action => currentLine.text.trimStart().startsWith(action.name));
            if (currentAction) {
                return currentAction.getSubcompletitions(currentLine.text);
            }
            return actions_1.default.map(action => action.toCompletitionItem());
        }
    });
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map