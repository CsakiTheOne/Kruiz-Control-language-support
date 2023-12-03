"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const DocumantationReader_1 = require("./DocumantationReader");
const Database_1 = require("./Database");
const completion_1 = require("./providers/completion");
const definition_1 = require("./providers/definition");
const hover_1 = require("./providers/hover");
const diagnostics_1 = require("./providers/diagnostics");
const codeActions_1 = require("./providers/codeActions");
const decorations_1 = require("./providers/decorations");
const simulateCommand_1 = require("./simulator/simulateCommand");
const symbol_1 = require("./providers/symbol");
function activate(context) {
    Database_1.default.initBaseTokens();
    (0, DocumantationReader_1.loadDoc)();
    (0, decorations_1.startShowingDecorations)(context);
    (0, diagnostics_1.startDiagnostics)(context);
    context.subscriptions.push((0, codeActions_1.getCodeActionsProvider)(), (0, completion_1.getCompletionItemProvider)(), (0, definition_1.getDefinitionProvider)(), (0, symbol_1.getDocumentSymbolProvider)(), (0, hover_1.getHoverProvider)());
    (0, simulateCommand_1.registerSimulateCommand)(context);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map