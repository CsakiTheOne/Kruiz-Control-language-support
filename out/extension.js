"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const DocumantationReader_1 = require("./DocumantationReader");
const Database_1 = require("./Database");
function activate(context) {
    (0, DocumantationReader_1.loadDoc)();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            return Database_1.default.getTokens().map(token => token.completion);
        },
    }, '', ' '));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map