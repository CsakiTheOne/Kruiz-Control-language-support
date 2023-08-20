import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';
import Database from './Database';
import Symbol from './Symbol';

function getWordIndex(text: string, charIndex: number): number {
	// Trim the text to remove any leading or trailing whitespace
	const trimmedText = text.trimStart();

	// Initialize the word index and the current index to 0
	let wordIndex = 0;
	let currentIndex = 0;

	// Loop through each word in the text
	for (const word of trimmedText.split(/\s+/)) {
		// Get the start and end indices of the current word
		const startIndex = currentIndex;
		const endIndex = startIndex + word.length;

		// If the character index is within the current word, return the word index
		if (startIndex <= charIndex && charIndex < endIndex) {
			return wordIndex;
		}

		// Increment the word index and the current index for the next word
		wordIndex++;
		currentIndex = endIndex + 1; // Add 1 for the space after the word
	}

	// If the character index is beyond the end of the text, return the last word index
	return wordIndex - 1;
}

export function activate(context: vscode.ExtensionContext) {

	Database.initBaseTokens();
	loadDoc();

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', {
			provideCompletionItems(document, position, token, context) {
				Database.updateSymbols(document);

				const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line);

				// If line has symbols, check the rules
				if (lineSymbols.length > 0) {
					const currentLine = document.lineAt(position.line).text;
					const currentWordIndex = getWordIndex(currentLine, position.character);
					// Look for relevant rules
					const relevantRules = lineSymbols.map(symbol => {
						const wordIndex = getWordIndex(currentLine, symbol.position.character);
						return symbol.token.rules.filter(rule => wordIndex + rule.offset == currentWordIndex);
					}).flat();

					let completions: vscode.CompletionItem[] = [];
					// Return the relevant contextual completions
					const map1 = Database.contextualCompletionsBase;
					const map2 = Database.contextualCompletions;
					const allContextualCompletion = new Map([...map1, ...map2]);
					for (const [key, value] of allContextualCompletion) {
						if (map1.has(key) && map2.has(key)) {
							allContextualCompletion.set(key, map1.get(key)!.concat(map2.get(key)!));
						}
					  }
					completions = completions.concat(
						relevantRules.flatMap(rule =>
							rule.tokens.filter(token => allContextualCompletion.has(token.id)).flatMap(token =>
								allContextualCompletion.get(token.id)!
							)
						)
					);
					// Return the tokens in the rules
					completions = completions.concat(relevantRules.flatMap(rule => rule.tokens.map(token => token.completion)));
					// Return completions
					return [... new Set(completions)];
				}

				// Return top-level tokens if the line has no symbols
				return Database.getTokens().filter(token => token.isTopLevel).map(token => token.completion);
			},
		}, '', ' '),
		vscode.languages.registerDefinitionProvider('kruizcontrol', {
			provideDefinition(document, position, token) {
				Database.updateSymbols(document);

				// find the symbol
				const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line)
					.sort((a, b) => a.position.character - b.position.character);
				const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);

				// look for definition
				if (symbol?.token.definition?.regex != undefined) {
					const definition = Database.symbols.find(definitionSymbol =>
						definitionSymbol.token.id == symbol.token.definition!.id &&
						(
							symbol.content == definitionSymbol.content ||
							symbol.content == `{${definitionSymbol.content}}`
						)
					);
					if (definition) {
						const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
						return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
					}
				}

				return null;
			},
		}),
		vscode.languages.registerHoverProvider('kruizcontrol', {
			provideHover(document, position, token) {
				Database.updateSymbols(document);

				// find the symbol
				const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line)
					.sort((a, b) => a.position.character - b.position.character);
				const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);
				const symbols = Database.symbols.filter(s => symbol?.position.compareTo(s.position) == 0);

				const contents: string[] = [];

				symbols.forEach(s => {
					const format = s.token.completion.detail;
					const description = s.token.completion.documentation;

					// look for definition
					if (s.token.definition?.regex != undefined) {
						const definition = Database.symbols.find(definitionSymbol =>
							definitionSymbol.token.id == s.token.definition!.id &&
							(
								s.content == definitionSymbol.content ||
								s.content == `{${definitionSymbol.content}}`
							)
						);
						if (definition) {
							const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
							//return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
							contents.push(`Defined on line ${definitionPos.line + 1}.`);
						}
					}
					if (format) contents.push(`Format: ${format}`);
					if (description) contents.push(description.toString());
					contents.push(s.token.id);
				});

				if (symbol && contents.length < 1) contents.push(`No info found about ${symbol.content} (${symbol.token.id})`);

				return { contents: contents };
			},
		}),
	);
}