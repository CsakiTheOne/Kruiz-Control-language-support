import * as vscode from 'vscode';
import tokens from './tokens';
import Symbol from './Symbol';

/*
if 2 {number} == 10
OnCommand e 0 !lol
chat send "pong"
*/

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

			const symbols: Symbol[] = [];
			
			for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
				const line = lines[lineIndex].trim();
				// Check full line tokens
				let lineResult = null;
				tokens.forEach(token => {
					lineResult = line.match(token.regex);
					if (lineResult) symbols.push(new Symbol(token, lineResult[0], lineIndex));
					//console.log(`Line: ${lineIndex} Token: ${token.id} Result: ${lineResult}`);
				});
				// Check word by word tokens
				if (!lineResult) {
					const words = line.split(' ');
					for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
						const word = words[wordIndex];
						tokens.forEach(token => {
							const wordResult = word.match(token.regex);
							if (wordResult) symbols.push(new Symbol(token, wordResult[0], lineIndex, wordIndex));
						});
					}
				}
			}

			//console.table(symbols);

			return [];
		}
	}

	const provider1 = vscode.languages.registerCompletionItemProvider('kruizcontrol', provider, '', ' ');

	context.subscriptions.push(provider1);
}