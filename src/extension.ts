import * as vscode from 'vscode';
import usernames from './usernames';

export function activate(context: vscode.ExtensionContext) {

	let foundVariables: vscode.CompletionItem[] = [];

	const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			const text = document.getText();
			const lines = text.split('\n');

			foundVariables = [];

			lines.forEach(line => {
				if (line.trim().startsWith('variable') && line.includes('load')) {
					const variableName = line.split(' ')[line.split(' ').length - 1];
					foundVariables.push(new vscode.CompletionItem(variableName, vscode.CompletionItemKind.Variable));
				}
			});
			
			return [
				new vscode.CompletionItem('chat', vscode.CompletionItemKind.Function),
				new vscode.CompletionItem('variable', vscode.CompletionItemKind.Function),
			];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'kruizcontrol',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);

				switch (linePrefix.trim()) {
					case 'chat':
						const chatSend = new vscode.CompletionItem('send');
						chatSend.insertText = new vscode.SnippetString('send "${1|message|}"');
						const chatWhisper = new vscode.CompletionItem('whisper');
						chatWhisper.insertText = new vscode.SnippetString('whisper ${1|' + usernames + '|} "${2|message|}"');
						return [chatSend, chatWhisper];
					case 'variable':
						return [
							new vscode.CompletionItem('load'),
							new vscode.CompletionItem('remove'),
							new vscode.CompletionItem('set'),
							new vscode.CompletionItem('global'),
						];
					case 'variable global':
						return [
							new vscode.CompletionItem('load'),
							new vscode.CompletionItem('remove'),
							new vscode.CompletionItem('set'),
							new vscode.CompletionItem('clear'),
						];
					case 'variable load':
					case 'variable remove':
					case 'variable set':
					case 'variable global load':
					case 'variable global remove':
					case 'variable global set':
						return foundVariables;
					default:
						return [];
				}
			}
		},
		' ' // triggered whenever a '.' is being typed
	);

	context.subscriptions.push(provider1, provider2);
}