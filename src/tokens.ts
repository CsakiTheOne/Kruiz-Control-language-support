import * as vscode from 'vscode';
import Token from './Token';
import Rule from './Rule';
import Symbols from './Symbols';

function next(tokenIds: string[]): Rule {
    return new Rule(1, tokenIds);
}

function after(wordsOffset: number, tokenIds: string[]) {
    return new Rule(wordsOffset, tokenIds);
}

export default [
    new Token('comment', /^#.+/, 'comment', vscode.CompletionItemKind.Text, '# ${1:comment...}').topLevel(),
    new Token('variable', /^{[a-zA-Z0-9]+}$/, 'other variable...', vscode.CompletionItemKind.Variable, '{$1}$0'),
    new Token('variable.loaded', /(?<=[Vv]ariable ([Gg]lobal )?[Ll]oad )[a-zA-Z0-9]+$/),
    new Token('comparator', /^==|>|<|>=|<=|!=$/, 'comparator', vscode.CompletionItemKind.Operator, '${1|==,>,<,>=,<=,!=|}'),

    new Token('literal.color', /^"#[0-9a-fA-F]{6}"$/, 'color', vscode.CompletionItemKind.Color, '"#${1:FFFFFF}"'),
    new Token('literal.string', /^".*"$/, 'string', vscode.CompletionItemKind.Text, '"$1"$0'),
    new Token('literal.number', /^[0-9]+$/),
    new Token('literal.twitchCommand', /^![a-zA-Z0-9]+$/, 'Twitch command', vscode.CompletionItemKind.Method, '!${1:command}'),
    new Token('literal.permission', /^[bsfvmne]+$|^u$/),

    // keywords
    new Token('keyword.if', /^[Ii]f$/, 'if', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([
            next(['literal.number', 'variable']),
            after(2, ['literal.number', 'variable']),
            after(3, ['comparator']),
            after(4, ['literal.number', 'variable']),
        ]),

    // triggers
    new Token('event.onChannelPoint', /^[Oo]n[Cc]hannel[Pp]oint$/, 'onChannelPoint', vscode.CompletionItemKind.Event, 'onChannelPoint ${1:rewardName}').topLevel()
        .setRules([
            next(['literal.string', 'variable'])
        ]),
    new Token('event.onCommand', /^[Oo]n[Cc]ommand$/, 'onCommand', vscode.CompletionItemKind.Event, 'onCommand ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
            next(['permission', 'variable']),
            after(2, ['literal.number', 'variable']),
            after(3, ['literal.twitchCommand']),
        ]),
    new Token('event.onKeyword', /^[Oo]n[Cc]ommand$/, 'onKeyword', vscode.CompletionItemKind.Event, 'onKeyword ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
            next(['permission', 'variable']),
            after(2, ['literal.number', 'variable']),
            after(3, ['literal.string', 'variable']),
        ]),

    // action chat
    new Token('action.chat', /^[Cc]hat$/, 'chat', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([next(['action.chat.send', 'action.chat.whisper'])]),
    new Token('action.chat.send', /^[Ss]end$/, 'send', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token('action.chat.whisper', /^[Ww]hisper$/, 'whisper', vscode.CompletionItemKind.Function)
        .setRules([
            next(['literal.user']),
            after(2, ['literal.string', 'variable']),
        ]),

    // action variable
    new Token('action.variable', /^[Vv]ariable$/, 'variable', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([
            next(['action.variable.load', 'action.variable.remove', 'action.variable.set', 'action.variable.global']),
        ]),
    new Token('action.variable.load', /^[Ll]oad$/, 'load', vscode.CompletionItemKind.Function, 'load ${1:variableName}'),
    new Token('action.variable.remove', /^[Rr]emove$/, 'remove', vscode.CompletionItemKind.Function, 'remove ${1:variableName}'),
    new Token('action.variable.set', /^[Ss]et$/, 'set', vscode.CompletionItemKind.Function, 'set ${1:variableName} ${2:value}'),
    new Token('action.variable.global', /^[Gg]lobal$/, 'global', vscode.CompletionItemKind.Keyword)
        .setRules([
            next(['action.variable.load', 'action.variable.remove', 'action.variable.set']),
        ]),
    new Token('action.variable.clear', /^[Cc]lear$/, 'clear', vscode.CompletionItemKind.Function),
];
