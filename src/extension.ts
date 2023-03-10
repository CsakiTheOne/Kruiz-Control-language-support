import * as vscode from 'vscode';
import tokens from './tokens';
import Symbol from './Symbol';
import Token from './Token';
import Symbols from './Symbols';

export function activate(context: vscode.ExtensionContext) {

	const completionProvider = {
		provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext,
		) {
			Symbols.update(document);

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
			Symbols.update(document);

			// find the symbol
			const lineSymbols = Symbols.list.filter(symbol => symbol.line == position.line);
			const symbol = lineSymbols.reverse().find(symbol => symbol.column < position.character);

			console.log(`Looking for definition of ${symbol?.content} (${symbol?.token})...`);

			if (symbol?.token.definitionRegex != undefined) {
				console.log(`Symbol has definition regex.`);
				const definition = Symbols.list.find(definitionSymbol =>
					definitionSymbol.token.id == symbol.token.getDefinitionToken().id &&
					(
						symbol.content == definitionSymbol.content ||
						symbol.content == `{${definitionSymbol.content}}`
					)
				);
				if (definition == undefined) return;
				const definitionPos = new vscode.Position(definition?.line, definition.column);
				return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
			}

			return;
		}
	};

	const hoverProvider = {
		provideHover(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
		) {
			// find the symbol
			const lineSymbols = Symbols.list.filter(symbol => symbol.line == position.line);
			const symbol = lineSymbols.reverse().find(symbol => symbol.column < position.character);

			return {contents: [symbol?.token.id!]};
		}
	};

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', completionProvider, '', ' '),
		vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider),
		vscode.languages.registerHoverProvider('kruizcontrol', hoverProvider),
	);
}