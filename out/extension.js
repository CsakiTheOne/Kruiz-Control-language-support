"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const declared_1 = require("./declared");
const commands_1 = require("./commands");
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
                const caseInsensitiveLine = line.toLowerCase();
                if (caseInsensitiveLine.trimStart().startsWith('variable') && caseInsensitiveLine.includes('load'))
                    variables.push(line.split('oad ')[1].trim());
                if (caseInsensitiveLine.trimStart().startsWith('discord create'))
                    webhooks.push(line.split('reate "')[1].split('"')[0].trim());
            });
            (0, declared_1.setFoundVariables)(variables);
            (0, declared_1.setFoundWebhooks)(webhooks);
            // params
            const currentCommand = commands_1.default.find(command => currentLine.text.trimStart().startsWith(command.name));
            if (currentCommand) {
                return currentCommand.getCurrentParam(currentLine.text);
            }
            // return top-level commands
            return commands_1.default.map(command => command.toCompletionItem());
        }
    };
    const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map