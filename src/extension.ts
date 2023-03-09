import * as vscode from 'vscode';
import actions from './actions';

export function activate(context: vscode.ExtensionContext) {

	const provider = vscode.languages.registerCompletionItemProvider('kruizcontrol', {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		) {
			const docText = document.getText();
			const lines = docText.split('\n');
			const currentLine = document.lineAt(position.line);

			const currentAction = actions.find(action => currentLine.text.trimStart().startsWith(action.name));
			if (currentAction) {
				return currentAction.getSubcompletitions(currentLine.text);
			}
			
			return actions.map(action => action.toCompletitionItem());
		}
	});

	context.subscriptions.push(provider);
}