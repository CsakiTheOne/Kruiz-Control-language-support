import * as vscode from 'vscode';

export function getCodeActionsProvider() {
    return vscode.languages.registerCodeActionsProvider('kruizcontrol', {
        provideCodeActions(document, range, context, token) {
            const actions: (vscode.CodeAction | vscode.Command)[] = [];

            const diagnostics = context.diagnostics.filter(d => d.source === 'kruizcontrol');
            diagnostics.forEach(d => {
                if (d.message.includes('To hide this warning add this comment somewhere in the file: #define user')) {
                    const action = new vscode.CodeAction('Hide this warning', vscode.CodeActionKind.QuickFix);
                    action.diagnostics = [d];
                    action.kind = vscode.CodeActionKind.QuickFix;
                    action.edit = new vscode.WorkspaceEdit();
                    action.edit.insert(document.uri, new vscode.Position(0, 0), '#' + d.message.split('#')[1] + '\n');
                    actions.push(action);
                }
                if (d.message.includes('If statement should have a number of lines to skip')) {
                    const action = new vscode.CodeAction('Add number of lines to skip', vscode.CodeActionKind.QuickFix);
                    action.diagnostics = [d];
                    action.kind = vscode.CodeActionKind.QuickFix;
                    action.edit = new vscode.WorkspaceEdit();
                    action.edit.replace(document.uri, new vscode.Range(d.range.start, d.range.end), 'If 1');
                    actions.push(action);
                }
            });

            return actions;
        }
    });
}