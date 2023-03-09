import * as vscode from 'vscode';
import Token from './Token';

export default [
    new Token('comment', /^#.+/, 'Block comment', vscode.CompletionItemKind.Text, '# ${1|comment...|}'),
    new Token('variable', /^{[a-zA-Z0-9]+}$/),
    new Token('comparator', /^==|>|<|>=|<=|!=$/, 'Comparator', vscode.CompletionItemKind.Operator, '${1|==,>,<,>=,<=,!=|}'),

    new Token('literal.color', /^"#[0-9a-fA-F]{6}"$/, 'Color', vscode.CompletionItemKind.Color, '"#${1|FFFFFF|}"'),
    new Token('literal.string', /^".*"$/),
    new Token('literal.number', /^[0-9]+$/),
    new Token('literal.twitchCommand', /^![a-zA-Z0-9]+$/, 'Twitch command', vscode.CompletionItemKind.Method, '!${1|command|}'),
    new Token('literal.permission', /^[bsfvmne]|u$/),

    new Token('keyword.if', /^if$/, 'if', vscode.CompletionItemKind.Keyword),

    new Token('event.onCommand', /^[Oo]n[Cc]ommand$/, 'onCommand', vscode.CompletionItemKind.Event),

    new Token('action.chat', /^chat$/, 'chat', vscode.CompletionItemKind.Function),
    new Token('action.chat.send', /^send$/, 'send', vscode.CompletionItemKind.Function),
    new Token('action.chat.whisper', /^whisper$/, 'whisper', vscode.CompletionItemKind.Function),
];
