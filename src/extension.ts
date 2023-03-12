import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';
import Database from './Database';
import Symbol from './Symbol';

export function activate(context: vscode.ExtensionContext) {

	Database.initBaseTokens();
	loadDoc();

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', {
			provideCompletionItems(document, position, token, context) {
				Database.updateSymbols(document);

				const currentLineSymbols: Symbol[] = Database.symbols.filter(symbol => symbol.position.line == position.line);

				const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;

				let relevantRuleTokens: string[] = [];

				// look for available tokens to suggest based on the collected symbols
				let availableCompletions: vscode.CompletionItem[] = [];
				currentLineSymbols.forEach(symbol => {
					symbol.token.rules.forEach(rule => {
						//const isRelevant = symbol.wordPosition != undefined && currentWordIndex == symbol.wordPosition + rule.offset;
						if (/*!isRelevant*/ true) return;
						relevantRuleTokens = rule.tokens.map(token => token.id);
						const ruleTokens: vscode.CompletionItem[] = rule.tokens
							.map(ruleToken => Database.getTokens().find(token => token == ruleToken))
							.filter(token => token != undefined)
							.map(token => token!.completion);
						// contextual suggestions
						if (rule.tokens.find(token => token.id == 'permission')) availableCompletions = availableCompletions.concat(Database.permissionCompletions);
						if (rule.tokens.find(token => token.id == 'user')) availableCompletions = availableCompletions.concat(Database.userCompletions);
						if (rule.tokens.find(token => token.id == 'variable')) availableCompletions = availableCompletions.concat(Database.variableCompletions);
						availableCompletions = availableCompletions.concat(ruleTokens);
					});
				});

				// debug line
				console.table(Database.symbols.map(s => s.toSimpleObject()));

				// suggest the found tokens
				if (availableCompletions.length > 0) {
					availableCompletions.push(new vscode.CompletionItem(`Debug - relevant tokens: ${relevantRuleTokens}`));
					return [... new Set(availableCompletions)];
				}

				// if no token found and line is empty, suggest top-level tokens
				if (currentLineSymbols.length < 1) {
					return Database.getTokens().filter(token => token.isTopLevel).map(token => token.completion);
				}

				return [];
			},
		}, '', ' '),
		vscode.languages.registerDefinitionProvider('kruizcontrol', {
			provideDefinition(document, position, token) {
				Database.updateSymbols(document);

				// find the symbol
				const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line);
				const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);

				const format = symbol?.token.completion.detail;
				const description = symbol?.token.completion.documentation;

				const contents: string[] = [];

				// look for definition
				if (symbol?.token.definition?.regex != undefined) {
					console.log(`Symbol has definition regex.`);
					const definition = Database.symbols.find(definitionSymbol =>
						symbol.token.definition &&
						definitionSymbol.token.id == symbol.token.definition.id &&
						(
							symbol.content == definitionSymbol.content ||
							symbol.content == `{${definitionSymbol.content}}`
						)
					);
					if (definition == undefined) return;
					const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
					return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
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

				const format = symbol?.token.completion.detail;
				const description = symbol?.token.completion.documentation;

				const contents: string[] = [];

				// look for definition
				if (symbol?.token.definition?.regex != undefined) {
					console.log(`Symbol has definition regex.`);
					const definition = Database.symbols.find(definitionSymbol =>
						symbol.token.definition &&
						definitionSymbol.token.id == symbol.token.definition.id &&
						(
							symbol.content == definitionSymbol.content ||
							symbol.content == `{${definitionSymbol.content}}`
						)
					);
					if (definition == undefined) return;
					const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
					//return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
					contents.push(`Defined on line ${definitionPos.line + 1}.`);
				}

				if (format) contents.push(`Format: ${format}`);
				if (description) contents.push(description.toString());
				if (symbol) contents.push(`Token: ${symbol.token.id}`);
				if (symbol) {
					let rules = 'Rules: ';
					symbol.token.rules.forEach(rule => rules += `${rule.offset}: ${rule.tokens.map(t => t.id)}\n`);
					contents.push(rules);
				}

				if (symbol && contents.length < 1) contents.push(`No info found about ${symbol.content} (${symbol.token.id})`);

				return { contents: contents };
			},
		}),
	);
}