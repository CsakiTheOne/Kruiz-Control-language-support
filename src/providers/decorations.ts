import * as vscode from 'vscode';
import Database from '../Database';

const decorationIfTop = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px 0 0 0',
    borderStyle: 'dotted',
    light: {
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    dark: {
        borderColor: 'rgba(255, 255, 255, 0.3)'
    }
});
const decorationIf = vscode.window.createTextEditorDecorationType({
    borderWidth: '0 0 0 1px',
    borderStyle: 'dotted',
    light: {
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    dark: {
        borderColor: 'rgba(255, 255, 255, 0.3)'
    }
});

function updateDecorations() {
    vscode.window.activeTextEditor?.setDecorations(decorationIfTop, []);
    vscode.window.activeTextEditor?.setDecorations(decorationIf, []);
    const rangesIfTop: vscode.Range[] = [];
    const rangesIf: vscode.Range[] = [];
    Database.symbols.filter(s => s.token.id.toLowerCase() === 'if').forEach(s => {
        const nextSymbol = Database.symbols.find(s2 => s2.position.line === s.position.line && s2.position.character === s.position.character + 3);
        const linesCount = nextSymbol?.content ? Number.parseInt(nextSymbol.content) : undefined;
        if (!linesCount) return;
        const start = new vscode.Position(s.position.line, 0);
        const end = new vscode.Position(s.position.line + linesCount, 0);
        const range = new vscode.Range(start, end);
        rangesIfTop.push(new vscode.Range(start, new vscode.Position(start.line, s.position.character + 4)));
        rangesIf.push(range);
    });
    vscode.window.activeTextEditor?.setDecorations(decorationIfTop, rangesIfTop);
    vscode.window.activeTextEditor?.setDecorations(decorationIf, rangesIf);
}

export function startShowingDecorations(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) updateDecorations();
        }),
        vscode.workspace.onDidChangeTextDocument(e => updateDecorations()),
        vscode.workspace.onDidSaveTextDocument(doc => updateDecorations())
    );
}