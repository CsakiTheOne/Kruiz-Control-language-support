import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';
import Database from './Database';
import Symbol from './Symbol';

export function activate(context: vscode.ExtensionContext) {

	loadDoc();

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', {
			provideCompletionItems(document, position, token, context) {
			Database.updateSymbols(document);

			const currentLineSymbols: Symbol[] = Database.symbols.filter(symbol => symbol.position.line == position.line);

			const currentWordIndex = document.lineAt(position.line).text.trimStart().split(' ').length - 1;

			// look for available tokens to suggest based on the collected symbols
			let availableCompletions: vscode.CompletionItem[] = [];
			currentLineSymbols.forEach(symbol => {
				symbol.token.rules.forEach(rule => {
					const isRelevant = symbol.wordPosition != undefined && currentWordIndex == symbol.wordPosition + rule.offset;
					if (!isRelevant) return;
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
			console.table(Database.symbols/*.map(s => s.tabularData())*/);

			// suggest the found tokens
			if (availableCompletions.length > 0) {
				return [... new Set(availableCompletions)];
			}

			// if no token found and line is empty, suggest top-level tokens
			if (currentLineSymbols.length < 1) {
				return Database.getTokens()/*.filter(token => token.isTopLevel)*/.map(token => token.completion);
			}

			return [];
			},
		}, '', ' '),
		//vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider),
		//vscode.languages.registerHoverProvider('kruizcontrol', hoverProvider),
	);
}