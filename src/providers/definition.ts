import * as vscode from 'vscode';
import Database from '../Database';

export function getDefinitionProvider() {
    return vscode.languages.registerDefinitionProvider('kruizcontrol', {
        provideDefinition(document, position, token) {
            Database.updateSymbols(document);

            // find the symbol
            const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line)
                .sort((a, b) => a.position.character - b.position.character);
            const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);

            // look for definition
            if (symbol?.token.definition?.regex != undefined) {
                const definition = Database.symbols.find(definitionSymbol =>
                    definitionSymbol.token.id == symbol.token.definition!.id &&
                    (
                        symbol.content == definitionSymbol.content ||
                        symbol.content == `{${definitionSymbol.content}}`
                    )
                );
                if (definition) {
                    const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
                    return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
                }
            }

            return null;
        },
    });
}