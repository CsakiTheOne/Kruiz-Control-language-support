import * as vscode from 'vscode';
import tokens from './tokens';
import Symbol from './Symbol';
import Token from './Token';
import Symbols from './Symbols';

/*
if 2 {number} == 10
OnCommand e 0 !lol
chat send "pong"
*/

function updateSymbols(document: vscode.TextDocument) {
	const docText = document.getText();
	const lines = docText.split('\n');

	// collect symbols in document
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

	Symbols.update(symbols);
}

export function activate(context: vscode.ExtensionContext) {

	const baseProvider = {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		) {
			updateSymbols(document);

			const currentLineSymbols: Symbol[] = Symbols.list.filter(symbol => symbol.line == position.line);

			const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;

			// look for available tokens to suggest based on the collected symbols
			let availableTokens: Token[] = [];
			currentLineSymbols.forEach(symbol => {
				symbol.token.rules.forEach(rule => {
					const isRelevant = symbol.word != undefined && currentWordIndex == symbol.word + rule.offset;
					if (!isRelevant) return;
					const ruleTokens: Token[] = rule.tokenIds
						.map(id => tokens.find(token => token.id == id))
						.filter(token => token != undefined)
						.map(token => token!);
					availableTokens = availableTokens.concat(ruleTokens);
				});
			});

			// debug line
			console.table(Symbols.list.map(s => s.tabularData()));

			// suggest the found tokens
			if (availableTokens.length > 0) {
				return availableTokens.map(token => token.toCompletionItem());
			}

			// if no token found and line is empty, suggest top-level tokens
			if (currentLineSymbols.length < 1) {
				return tokens.filter(token => token.isTopLevel).map(token => token.toCompletionItem());
			}

			return [];
		}
	}

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', baseProvider, '', ' '),
	);
}