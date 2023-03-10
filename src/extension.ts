import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';
import Database from './Database';

export function activate(context: vscode.ExtensionContext) {

	loadDoc();

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', {
			provideCompletionItems(document, position, token, context) {
				return Database.getTokens().map(token => token.completion);
			},
		}, '', ' '),
		//vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider),
		//vscode.languages.registerHoverProvider('kruizcontrol', hoverProvider),
	);
}