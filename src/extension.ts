import * as vscode from 'vscode';
import keywords from './keywords';

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

			const currentAction = keywords.find(keyword => currentLine.text.trimStart().startsWith(keyword.name));
			if (currentAction) {
				return currentAction.getSubcompletitions(currentLine.text);
			}
			
			return keywords.map(keyword => keyword.toCompletitionItem());
		}
	});

	context.subscriptions.push(provider);
}