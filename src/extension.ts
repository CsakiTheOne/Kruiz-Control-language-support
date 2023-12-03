import * as vscode from 'vscode';
import { loadDoc } from './DocumantationReader';
import Database from './Database';
import { getCompletionItemProvider } from './providers/completion';
import { getDefinitionProvider } from './providers/definition';
import { getHoverProvider } from './providers/hover';
import { startDiagnostics } from './providers/diagnostics';
import { getCodeActionsProvider } from './providers/codeActions';
import { startShowingDecorations } from './providers/decorations';
import { registerSimulateCommand } from './simulator/simulateCommand';
import { getDocumentSymbolProvider } from './providers/symbol';

export function activate(context: vscode.ExtensionContext) {
	Database.initBaseTokens();
	loadDoc();

	startShowingDecorations(context);
	startDiagnostics(context);

	context.subscriptions.push(
		getCodeActionsProvider(),
		getCompletionItemProvider(),
		getDefinitionProvider(),
		getDocumentSymbolProvider(),
		getHoverProvider(),
	);

	registerSimulateCommand(context);
}