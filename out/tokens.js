"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const Token_1 = require("./Token");
const Rule_1 = require("./Rule");
function next(tokenIds) {
    return new Rule_1.default(1, tokenIds);
}
function after(wordsOffset, tokenIds) {
    return new Rule_1.default(wordsOffset, tokenIds);
}
exports.default = [
    new Token_1.default('comment', /^#.+/, 'comment', vscode.CompletionItemKind.Text, '# ${1:comment...}').topLevel(),
    new Token_1.default('variable', /^{[a-zA-Z0-9]+}$/, 'other variable...', vscode.CompletionItemKind.Variable, '{$1}$0'),
    new Token_1.default('variable.loaded', /(?<=[Vv]ariable ([Gg]lobal )?[Ll]oad )[a-zA-Z0-9]+$/),
    new Token_1.default('comparator', /^==|>|<|>=|<=|!=$/, 'comparator', vscode.CompletionItemKind.Operator, '${1|==,>,<,>=,<=,!=|}'),
    new Token_1.default('literal.color', /^"#[0-9a-fA-F]{6}"$/, 'color', vscode.CompletionItemKind.Color, '"#${1:FFFFFF}"'),
    new Token_1.default('literal.string', /^".*"$/, 'string', vscode.CompletionItemKind.Text, '"$1"$0'),
    new Token_1.default('literal.number', /^[0-9]+$/),
    new Token_1.default('literal.twitchCommand', /^![a-zA-Z0-9]+$/, 'Twitch command', vscode.CompletionItemKind.Method, '!${1:command}'),
    new Token_1.default('literal.permission', /^[bsfvmne]+$|^u$/),
    new Token_1.default('keyword.if', /^[Ii]f$/, 'if', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([
        next(['literal.number', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['comparator']),
        after(4, ['literal.number', 'variable']),
    ]),
    new Token_1.default('event.onChannelPoint', /^[Oo]n[Cc]hannel[Pp]oint$/, 'onChannelPoint', vscode.CompletionItemKind.Event, 'onChannelPoint ${1:rewardName}').topLevel()
        .setRules([
        next(['literal.string', 'variable'])
    ]),
    new Token_1.default('event.onCommand', /^[Oo]n[Cc]ommand$/, 'onCommand', vscode.CompletionItemKind.Event, 'onCommand ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
        next(['permission', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['literal.twitchCommand']),
    ]),
    new Token_1.default('event.onKeyword', /^[Oo]n[Cc]ommand$/, 'onKeyword', vscode.CompletionItemKind.Event, 'onKeyword ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
        next(['permission', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['literal.string', 'variable']),
    ]),
    new Token_1.default('action.chat', /^[Cc]hat$/, 'chat', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([next(['action.chat.send', 'action.chat.whisper'])]),
    new Token_1.default('action.chat.send', /^[Ss]end$/, 'send', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.chat.whisper', /^[Ww]hisper$/, 'whisper', vscode.CompletionItemKind.Function)
        .setRules([after(2, ['literal.string', 'variable'])]),
    new Token_1.default('action.variable', /^[Vv]ariable$/, 'variable', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([
        next(['action.variable.load', 'action.variable.remove', 'action.variable.set', 'action.variable.global']),
    ]),
    new Token_1.default('action.variable.load', /^[Ll]oad$/, 'load', vscode.CompletionItemKind.Function, 'load ${1:variableName}'),
    new Token_1.default('action.variable.remove', /^[Rr]emove$/, 'remove', vscode.CompletionItemKind.Function, 'remove ${1:variableName}'),
    new Token_1.default('action.variable.set', /^[Ss]et$/, 'set', vscode.CompletionItemKind.Function, 'set ${1:variableName} ${2:value}'),
    new Token_1.default('action.variable.global', /^[Gg]lobal$/, 'global', vscode.CompletionItemKind.Keyword)
        .setRules([
        next(['action.variable.load', 'action.variable.remove', 'action.variable.set']),
    ]),
    new Token_1.default('action.variable.clear', /^[Cc]lear$/, 'clear', vscode.CompletionItemKind.Function),
];
//# sourceMappingURL=tokens.js.map