import * as vscode from 'vscode';
import { setFoundVariables, setFoundWebhooks } from './declared';
import commands from './commands';

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
				const caseInsensitiveLine = line.toLowerCase();
				if (caseInsensitiveLine.trimStart().startsWith('variable') && caseInsensitiveLine.includes('load')) variables.push(line.split('oad ')[1].trim());
				if (caseInsensitiveLine.trimStart().startsWith('discord create')) webhooks.push(line.split('reate "')[1].split('"')[0].trim());
			});
			setFoundVariables(variables);
			setFoundWebhooks(webhooks);

			// params
			const currentCommand = commands.find(command => currentLine.text.trimStart().startsWith(command.name));
			if (currentCommand) {
				return currentCommand.getCurrentParam(currentLine.text);
			}

			// return top-level commands
			return commands.map(command => command.toCompletionItem());
		}
	}

	const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');

	context.subscriptions.push(provider1);
}