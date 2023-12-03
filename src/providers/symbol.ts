import * as vscode from 'vscode';
import Database from '../Database';

// function which converts CompletionItemKind to SymbolKind
function toPublicDocumentSymbolKind(kind: vscode.CompletionItemKind | undefined): vscode.SymbolKind | null {
    switch (kind) {
        //case vscode.CompletionItemKind.Class: return vscode.SymbolKind.Class;
        case vscode.CompletionItemKind.Event: return vscode.SymbolKind.Event;
        //case vscode.CompletionItemKind.Function: return vscode.SymbolKind.Function;
        default: return null;
    }

}

export function getDocumentSymbolProvider() {
    return vscode.languages.registerDocumentSymbolProvider('kruizcontrol', {
        provideDocumentSymbols(document, token) {
            Database.updateSymbols(document);

            let lastEventName = '';

            return Database.symbols.map(symbol => {
                const range = new vscode.Range(symbol.position, symbol.position.translate(0, symbol.content.length));
                const selectionRange = new vscode.Range(symbol.position, symbol.position.translate(0, symbol.content.length));
                const kind = toPublicDocumentSymbolKind(symbol.token.completion.kind);
                const name = symbol.content;
                const containerName = kind == vscode.SymbolKind.Event ? '' : lastEventName;

                if (kind == null) {
                    return null;
                }

                const line = document.lineAt(symbol.position.line);

                return new vscode.SymbolInformation(line.text, kind, containerName, new vscode.Location(vscode.Uri.file(document.fileName), range));
            }).filter(symbol => symbol != null) as vscode.SymbolInformation[];
        },
    });
}