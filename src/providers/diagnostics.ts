import * as vscode from 'vscode';
import Database from '../Database';

let diagnostics: vscode.DiagnosticCollection;

function updateDiagnostics(document: vscode.TextDocument) {
    Database.updateSymbols(document);
    const list: vscode.Diagnostic[] = [];

    //#region Check for username typos
    Database.symbols.filter(s => s.token.id === 'user').forEach(s => {
        const usernameCount = Database.symbols.filter(s2 => s2.token.id === 'user' && s2.content === s.content).length;
        if (usernameCount > 1) return;

        const range = new vscode.Range(s.position, s.position.translate(0, s.content.length));
        const message = `Check this username twice. Did you spell it right? To hide this warning add this comment somewhere in the file: #define user ${s.content}`;
        list.push(new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning));
    });
    //#endregion

    //#region Check "If" indentation
    Database.symbols.filter(s => s.token.id.toLowerCase() === 'if').forEach(s => {
        const nextSymbol = Database.symbols.find(s2 => s2.position.line === s.position.line && s2.position.character === s.position.character + 3);
        const linesCount = nextSymbol?.content ? Number.parseInt(nextSymbol.content) : undefined;
        if (!linesCount) {
            const range = new vscode.Range(s.position, s.position.translate(0, s.content.length));
            const message = 'If statement should have a number of lines to skip as a parameter for clarity.';
            list.push(new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning));
            return;
        }
        for (let i = 1; i <= linesCount; i++) {
            const line = document.lineAt(s.position.line + i);
            if (line.firstNonWhitespaceCharacterIndex < s.position.character + 1) {
                const range = new vscode.Range(line.range.start, line.range.end);
                const message = 'This line should be indented.';
                list.push(new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning));
            }
        }
    });
    //#endregion

    if (diagnostics) diagnostics.clear();
    else diagnostics = vscode.languages.createDiagnosticCollection('kruizcontrol');
    diagnostics.set(document.uri, list.map(d => { d.source = 'kruizcontrol'; return d; }));
}

export function startDiagnostics(context: vscode.ExtensionContext) {
    console.log('Starting diagnostics');
    if (vscode.window.activeTextEditor) {
        updateDiagnostics(vscode.window.activeTextEditor.document);
        context.subscriptions.push(diagnostics);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) updateDiagnostics(editor.document);
        }),
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document)),
        vscode.workspace.onDidSaveTextDocument(doc => updateDiagnostics(doc))
    );
}