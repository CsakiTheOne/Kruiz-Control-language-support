import * as vscode from 'vscode';
import keywords from './keywords';
import { setFoundVariables, setFoundWebhooks } from './declared';

export function activate(context: vscode.ExtensionContext) {

	const provider = {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		) {
			const docText = document.getText();
			const lines = docText.split('\n');
			const currentLine = document.lineAt(position.line);

			// look for declared elements
			const variables: string[] = [];
			const webhooks: string[] = [];
			lines.forEach(line => {
				if (line.trimStart().startsWith('variable') && line.includes('load')) variables.push(line.split('load ')[1]);
				if (line.trimStart().startsWith('discord create ')) webhooks.push(line.split('discord create "')[1].split('"')[0]);
			});
			setFoundVariables(variables);
			setFoundWebhooks(webhooks);

			// if keyword found in line, return subkeywords
			const currentAction = keywords.find(keyword => currentLine.text.trimStart().startsWith(keyword.name));
			if (currentAction) {
				return currentAction.getSubcompletitions(currentLine.text);
			}

			// return top-level keywords
			return keywords.map(keyword => keyword.toCompletitionItem());
		}
	}

	const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');

	context.subscriptions.push(provider1);
}