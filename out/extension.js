"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const keywords_1 = require("./keywords");
const declared_1 = require("./declared");
function activate(context) {
    const provider = {
        provideCompletionItems(document, position, token, context) {
            const docText = document.getText();
            const lines = docText.split('\n');
            const currentLine = document.lineAt(position.line);
            // look for declared elements
            const variables = [];
            const webhooks = [];
            lines.forEach(line => {
                if (line.trimStart().startsWith('variable') && line.includes('load'))
                    variables.push(line.split('load ')[1]);
                if (line.trimStart().startsWith('discord create '))
                    webhooks.push(line.split('discord create "')[1].split('"')[0]);
            });
            (0, declared_1.setFoundVariables)(variables);
            (0, declared_1.setFoundWebhooks)(webhooks);
            // if keyword found in line, return subkeywords
            const currentAction = keywords_1.default.find(keyword => currentLine.text.trimStart().startsWith(keyword.name));
            if (currentAction) {
                return currentAction.getSubcompletitions(currentLine.text);
            }
            // return top-level keywords
            return keywords_1.default.map(keyword => keyword.toCompletitionItem());
        }
    };
    const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map