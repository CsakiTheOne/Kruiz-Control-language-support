import * as vscode from 'vscode';
import tokens from './tokens';
import Symbol from './Symbol';
import Token from './Token';
import Symbols from './Symbols';

function updateSymbols(document: vscode.TextDocument) {
	const docText = document.getText();
	const lines = docText.split('\n');

	// collect symbols in document
	const symbols: Symbol[] = [];
	for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const line = lines[lineIndex].trim();
		// Check full line tokens
		let lineResult = null;
		//tokens.forEach(token => {
		//	lineResult = line.match(token.regex);
		//	if (lineResult) symbols.push(new Symbol(token, lineResult[0], lineIndex, 0));
		//	//console.log(`Line: ${lineIndex} Token: ${token.id} Result: ${lineResult}`);
		//});
		// Check word by word tokens
		if (!lineResult) {
			const words = line.split(' ');
			for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
				const word = words[wordIndex];
				tokens.forEach(token => {
					const wordResult = word.match(token.regex);
					const column = line.indexOf(word);
					if (wordResult) symbols.push(new Symbol(token, wordResult[0], lineIndex, column, wordIndex));
				});
			}
		}
	}

	Symbols.update(symbols);
}

export function activate(context: vscode.ExtensionContext) {

	const completionProvider = {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext,
		) {
			updateSymbols(document);

			const currentLineSymbols: Symbol[] = Symbols.list.filter(symbol => symbol.line == position.line);

			const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;

			// look for available tokens to suggest based on the collected symbols
			let availableCompletions: vscode.CompletionItem[] = [];
			currentLineSymbols.forEach(symbol => {
				symbol.token.rules.forEach(rule => {
					const isRelevant = symbol.word != undefined && currentWordIndex == symbol.word + rule.offset;
					if (!isRelevant) return;
					const ruleTokens: vscode.CompletionItem[] = rule.tokenIds
						.map(id => tokens.find(token => token.id == id))
						.filter(token => token != undefined)
						.map(token => token!.toCompletionItem());
					// contextual suggestions
					if (rule.tokenIds.includes('literal.permission')) availableCompletions = availableCompletions.concat(Symbols.permissionCompletions);
					if (rule.tokenIds.includes('literal.user')) availableCompletions = availableCompletions.concat(Symbols.userCompletions);
					if (rule.tokenIds.includes('variable')) availableCompletions = availableCompletions.concat(Symbols.variableCompletions);
					availableCompletions = availableCompletions.concat(ruleTokens);
				});
			});

			// debug line
			console.table(Symbols.list.map(s => s.tabularData()));

			// suggest the found tokens
			if (availableCompletions.length > 0) {
				return [... new Set(availableCompletions)];
			}

			// if no token found and line is empty, suggest top-level tokens
			if (currentLineSymbols.length < 1) {
				return tokens.filter(token => token.isTopLevel).map(token => token.toCompletionItem());
			}

			return [];
		}
	};

	const definitionProvider = {
		provideDefinition(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
		) {
			updateSymbols(document);

			// find the symbol
			const lineSymbols = Symbols.list.filter(symbol => symbol.line == position.line);
			const symbol = lineSymbols.reverse().find(symbol => symbol.column < position.character);

			// if variable, find loading place
			if (symbol?.token.id == 'variable') {
				const loader = Symbols.list.find(loader =>
					loader.token.id == 'variable.loaded' &&
					symbol.content == `{${loader.content}}`
				);
				if (loader == undefined) return;
				const loaderPos = new vscode.Position(loader?.line, loader.column);
				return new vscode.Location(vscode.Uri.file(document.fileName), loaderPos);
			}

			return;
		}
	};

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', completionProvider, '', ' '),
		vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider),
	);
}