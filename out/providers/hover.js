"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHoverProvider = void 0;
const vscode = require("vscode");
const Database_1 = require("../Database");
function getHoverProvider() {
    return vscode.languages.registerHoverProvider('kruizcontrol', {
        provideHover(document, position, token) {
            Database_1.default.updateSymbols(document);
            // find the symbol
            const lineSymbols = Database_1.default.symbols.filter(symbol => symbol.position.line == position.line)
                .sort((a, b) => a.position.character - b.position.character);
            const symbol = lineSymbols.reverse().find(symbol => symbol.position.character <= position.character);
            const symbols = Database_1.default.symbols.filter(s => symbol?.position.compareTo(s.position) == 0);
            const contents = [];
            symbols.forEach(s => {
                const format = s.token.completion.detail;
                const description = s.token.completion.documentation;
                // look for definition
                if (s.token.definition?.regex != undefined) {
                    const definition = Database_1.default.symbols.find(definitionSymbol => definitionSymbol.token.id == s.token.definition.id &&
                        (s.content == definitionSymbol.content ||
                            s.content == `{${definitionSymbol.content}}`));
                    if (definition) {
                        const definitionPos = new vscode.Position(definition?.position.line, definition.position.character);
                        //return new vscode.Location(vscode.Uri.file(document.fileName), definitionPos);
                        contents.push(`Defined on line ${definitionPos.line + 1}.`);
                    }
                }
                if (format)
                    contents.push(`Format: ${format}`);
                if (description)
                    contents.push(description.toString());
                contents.push(`Token: ${s.token.id} Regex: ${s.token.regex}`);
            });
            if (symbol && contents.length < 1)
                contents.push(`No info found about ${symbol?.content} (${symbol?.token.id})`);
            return { contents: contents };
        },
    });
}
exports.getHoverProvider = getHoverProvider;
//# sourceMappingURL=hover.js.map