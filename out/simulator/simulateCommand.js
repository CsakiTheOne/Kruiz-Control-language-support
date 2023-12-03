"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSimulateCommand = void 0;
const vscode = require("vscode");
const simulator_1 = require("./simulator");
function registerSimulateCommand(context) {
    context.subscriptions.push(vscode.commands.registerCommand('kruizcontrol.simulate', async () => {
        const input = await vscode.window.showInputBox({
            prompt: `Enter a Twitch command or message to simulate!\nKeep in mind that the simulator can't run most of the actions.`,
            placeHolder: 'e.g. !ping or My name is Neshy'
        });
        if (!input) {
            return;
        }
        const document = vscode.window.activeTextEditor?.document;
        if (!document) {
            vscode.window.showErrorMessage('No document is open');
            return;
        }
        (0, simulator_1.startSimulator)(document, input);
    }));
}
exports.registerSimulateCommand = registerSimulateCommand;
//# sourceMappingURL=simulateCommand.js.map