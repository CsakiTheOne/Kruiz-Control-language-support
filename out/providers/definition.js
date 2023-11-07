"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefinitionProvider = void 0;
const vscode = require("vscode");
const Database_1 = require("../Database");
function getDefinitionProvider() {
    return vscode.languages.registerDefinitionProvider('kruizcontrol', {
        provideDefinition(document, position, token) {
            Database_1.default.updateSymbols(document);
            // find the symbol
            const lineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line)
                .sort((a, b) => a.position.character - b.position.character);
            const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);
            // look for definition
            if (symbol?.token.definition?.regex != undefined) {
                const definition = Database_1.default.symbols.find(definitionSymbol => definitionSymbol.token.id == symbol.token.definition.id &&
                    (symbol.content == definitionSymbol.content ||
                        symbol.content == `{${definitionSymbol.content}}`));
                if (definition) {
                    const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
                    return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
                }
            }
            return null;
        },
    });
}
exports.getDefinitionProvider = getDefinitionProvider;
//# sourceMappingURL=definition.js.map