import * as vscode from 'vscode';
import { startSimulator } from './simulator';

export function registerSimulateCommand(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('kruizcontrol.simulate', async () => {
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
            startSimulator(document, input);
        })
    );
}