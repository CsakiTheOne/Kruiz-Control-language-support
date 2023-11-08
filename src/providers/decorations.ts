import * as vscode from 'vscode';
import Database from '../Database';

const decorationIfTop = vscode.window.createTextEditorDecorationType({
    borderWidth: '2px 0 0 0',
    borderStyle: 'dotted',
    light: {
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    dark: {
        borderColor: 'rgba(255, 255, 255, 0.3)'
    }
});
const decorationIf = vscode.window.createTextEditorDecorationType({
    borderWidth: '0 0 0 2px',
    borderStyle: 'dotted',
    light: {
        borderColor: 'rgba(0, 0, 0, 0.3)'
    },
    dark: {
        borderColor: 'rgba(255, 255, 255, 0.3)'
    }
});
const decorationIfBottom = vscode.window.createTextEditorDecorationType({
    borderWidth: '0 0 2px 0',
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
    vscode.window.activeTextEditor?.setDecorations(decorationIfBottom, []);
    const rangesIfTop: vscode.Range[] = [];
    const rangesIf: vscode.Range[] = [];
    const rangesIfBottom: vscode.Range[] = [];
    Database.symbols.filter(s => s.token.id.toLowerCase() === 'if').forEach(s => {
        const nextSymbol = Database.symbols.find(s2 => s2.position.line === s.position.line && s2.position.character === s.position.character + 3);
        const linesCount = nextSymbol?.content ? Number.parseInt(nextSymbol.content) : undefined;
        if (!linesCount) return;
        const start = new vscode.Position(s.position.line, 0);
        const startLineLength = vscode.window.activeTextEditor?.document.lineAt(s.position.line).text.length || 4;
        const end = new vscode.Position(s.position.line + linesCount, 0);
        const endLineLength = vscode.window.activeTextEditor?.document.lineAt(s.position.line + linesCount).text.length || 4;
        const range = new vscode.Range(start, end);
        rangesIfTop.push(new vscode.Range(start, new vscode.Position(start.line, startLineLength)));
        rangesIf.push(range);
        rangesIfBottom.push(new vscode.Range(end, new vscode.Position(end.line, endLineLength)));
    });
    vscode.window.activeTextEditor?.setDecorations(decorationIfTop, rangesIfTop);
    vscode.window.activeTextEditor?.setDecorations(decorationIf, rangesIf);
    vscode.window.activeTextEditor?.setDecorations(decorationIfBottom, rangesIfBottom);
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