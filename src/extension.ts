import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';

export function activate(context: vscode.ExtensionContext) {

	loadDoc();

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider('kruizcontrol', {
			provideCompletionItems(document, position, token, context) {
				
				return [];
			},
		}, '', ' '),
		//vscode.languages.registerDefinitionProvider('kruizcontrol', definitionProvider),
		//vscode.languages.registerHoverProvider('kruizcontrol', hoverProvider),
	);
}