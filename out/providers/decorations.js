"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startShowingDecorations = void 0;
const vscode = require("vscode");
const Database_1 = require("../Database");
const config_1 = require("../config");
const decorationBlockTop = vscode.window.createTextEditorDecorationType({
    borderWidth: '2px 0 0 0',
    borderStyle: 'solid',
    borderColor: 'rgba(128, 128, 128, 0.3)'
});
const decorationBlock = vscode.window.createTextEditorDecorationType({
    borderWidth: '0 0 0 3px',
    borderStyle: 'solid',
    borderColor: 'rgba(128, 128, 128, 0.3)'
});
const decorationBlockBottom = vscode.window.createTextEditorDecorationType({
    borderWidth: '0 0 2px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(128, 128, 128, 0.3)'
});
function updateDecorations() {
    vscode.window.activeTextEditor?.setDecorations(decorationBlockTop, []);
    vscode.window.activeTextEditor?.setDecorations(decorationBlock, []);
    vscode.window.activeTextEditor?.setDecorations(decorationBlockBottom, []);
    if (vscode.window.activeTextEditor?.document.languageId !== 'kruizcontrol')
        return;
    const rangesBlockTop = [];
    const rangesBlock = [];
    const rangesBlockBottom = [];
    Database_1.default.updateSymbols(vscode.window.activeTextEditor?.document);
    // If blocks
    if (config_1.default.get('showCodeBlockBoundariesIf')) {
        Database_1.default.symbols.filter(s => s.token.id.toLowerCase() === 'if').forEach(s => {
            const nextSymbol = Database_1.default.symbols.find(s2 => s2.position.line === s.position.line && s2.position.character === s.position.character + 3);
            const linesCount = nextSymbol?.content ? Number.parseInt(nextSymbol.content) : undefined;
            if (!linesCount)
                return;
            const start = new vscode.Position(s.position.line, 0);
            const startLineLength = vscode.window.activeTextEditor?.document.lineAt(s.position.line).text.length || 4;
            const end = new vscode.Position(s.position.line + linesCount, 0);
            const endLineLength = vscode.window.activeTextEditor?.document.lineAt(s.position.line + linesCount).text.length || 4;
            const range = new vscode.Range(start, end);
            rangesBlockTop.push(new vscode.Range(start, new vscode.Position(start.line, startLineLength)));
            rangesBlock.push(range);
            rangesBlockBottom.push(new vscode.Range(end, new vscode.Position(end.line, endLineLength)));
        });
    }
    // Trigger blocks
    if (config_1.default.get('showCodeBlockBoundariesTrigger')) {
        Database_1.default.symbols.filter(s => s.content.toLowerCase().startsWith('on') && s.position.character === 0).forEach(s => {
            // Block goes from the trigger to the next empty line
            const start = new vscode.Position(s.position.line, 0);
            const startLineLength = vscode.window.activeTextEditor?.document.lineAt(s.position.line).text.length || 2;
            const fisrtEmptyLineIndex = vscode.window.activeTextEditor?.document.getText().split('\n').findIndex((l, i) => i > s.position.line && l.trim() === '') || s.position.line;
            const end = new vscode.Position(fisrtEmptyLineIndex - 1, 0);
            const endLineLength = vscode.window.activeTextEditor?.document.lineAt(end.line).text.length || 0;
            const range = new vscode.Range(start, end);
            rangesBlockTop.push(new vscode.Range(start, new vscode.Position(start.line, startLineLength)));
            rangesBlock.push(range);
            rangesBlockBottom.push(new vscode.Range(end, new vscode.Position(end.line, endLineLength)));
        });
    }
    vscode.window.activeTextEditor?.setDecorations(decorationBlockTop, rangesBlockTop);
    vscode.window.activeTextEditor?.setDecorations(decorationBlock, rangesBlock);
    vscode.window.activeTextEditor?.setDecorations(decorationBlockBottom, rangesBlockBottom);
}
function startShowingDecorations(context) {
    updateDecorations();
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor)
            updateDecorations();
    }), vscode.workspace.onDidChangeTextDocument(e => updateDecorations()), vscode.workspace.onDidSaveTextDocument(doc => updateDecorations()));
}
exports.startShowingDecorations = startShowingDecorations;
//# sourceMappingURL=decorations.js.map