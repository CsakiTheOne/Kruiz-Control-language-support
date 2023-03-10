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
    // default parameters
    new Token_1.default('defaultparam.succesful', /^_successful_$/, '_succesful_', vscode.CompletionItemKind.Constant).topLevel()
        .setDescription('A comma delimited list of handlers that initialized correctly.'),
    new Token_1.default('defaultparam.unsuccesful', /^_unsuccessful_$/, '_unsuccesful_', vscode.CompletionItemKind.Constant).topLevel()
        .setDescription('A comma delimited list of handlers that did not initialize correctly.'),
    new Token_1.default('defaultparam.kcEventId', /^_kc_event_id_$/, '_kc_event_id_', vscode.CompletionItemKind.Constant).topLevel()
        .setDescription('A unique id for each event occurrence in Kruiz Control. If you need a unique identifier, use this. The id resets to 0 after 1,000,000,000.'),
    new Token_1.default('comment', /^#.+/, 'comment', vscode.CompletionItemKind.Text, '# ${1:comment...}').topLevel(),
    new Token_1.default('variable', /^{[a-zA-Z0-9]+}$/, 'other variable...', vscode.CompletionItemKind.Variable, '{$1}$0')
        .setDefinitionRegex(/(?<=[Vv]ariable ([Gg]lobal )?[Ll]oad )[a-zA-Z0-9]+$/),
    new Token_1.default('comparator', /^==|>|<|>=|<=|!=$/, 'comparator', vscode.CompletionItemKind.Operator, '${1|==,>,<,>=,<=,!=|}'),
    new Token_1.default('literal.color', /^"#[0-9a-fA-F]{6}"$/, 'color', vscode.CompletionItemKind.Color, '"#${1:FFFFFF}"'),
    new Token_1.default('literal.string', /^".*"$/, 'string', vscode.CompletionItemKind.Text, '"$1"$0'),
    new Token_1.default('literal.number', /^[0-9]+$/, 'number', vscode.CompletionItemKind.Operator, '${1:0}'),
    new Token_1.default('literal.twitchCommand', /^![a-zA-Z0-9]+$/, 'Twitch command', vscode.CompletionItemKind.Method, '!${1:command}'),
    new Token_1.default('literal.permission', /^[bsfvmne]+$|^u$/),
    // keywords
    new Token_1.default('keyword.if', /^[Ii]f$/, 'if', vscode.CompletionItemKind.Keyword).topLevel()
        .setRules([
        next(['literal.number', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['comparator']),
        after(4, ['literal.number', 'variable']),
    ]),
    // triggers
    new Token_1.default('event.onChannelPoint', /^[Oo]n[Cc]hannel[Pp]oint$/, 'onChannelPoint', vscode.CompletionItemKind.Event, 'onChannelPoint ${1:rewardName}').topLevel()
        .setRules([
        next(['literal.string', 'variable'])
    ])
        .setParameters(['reward', 'user', 'message', 'data']),
    new Token_1.default('event.onCommand', /^[Oo]n[Cc]ommand$/, 'onCommand', vscode.CompletionItemKind.Event, 'onCommand ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
        next(['literal.permission', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['literal.twitchCommand']),
    ])
        .setParameters(['command', 'user', 'after', 'message', 'data', 'arg1', 'arg2', 'arg3']),
    new Token_1.default('event.onKeyword', /^[Oo]n[Cc]ommand$/, 'onKeyword', vscode.CompletionItemKind.Event, 'onKeyword ${1:permission} ${2:cooldown}').topLevel()
        .setRules([
        next(['literal.permission', 'variable']),
        after(2, ['literal.number', 'variable']),
        after(3, ['literal.string', 'variable']),
    ])
        .setParameters(['keyword', 'user', 'message', 'data', 'arg1', 'arg2', 'arg3']),
    // action chat
    new Token_1.default('action.chat', /^[Cc]hat$/, 'chat', vscode.CompletionItemKind.Class).topLevel()
        .setRules([next(['action.chat.send', 'action.chat.whisper'])]),
    new Token_1.default('action.chat.send', /^[Ss]end$/, 'send', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.chat.whisper', /^[Ww]hisper$/, 'whisper', vscode.CompletionItemKind.Function)
        .setRules([
        next(['literal.user']),
        after(2, ['literal.string', 'variable']),
    ]),
    // action discord
    new Token_1.default('action.discord', /^[Dd]iscord$/, 'discord', vscode.CompletionItemKind.Class).topLevel()
        .setRules([
        next([
            'action.discord.clear', 'action.discord.color', 'action.discord.create',
            'action.discord.delete', 'action.discord.description', 'action.discord.field',
            'action.discord.file', 'action.discord.footericon', 'action.discord.footertext',
            'action.discord.image', 'action.discord.message', 'action.discord.send',
            'action.discord.thumbnail', 'action.discord.title', 'action.discord.update',
            'action.discord.url',
        ])
    ]),
    new Token_1.default('action.discord.clear', /^[Cc]lear$/, 'clear', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.color', /^[Cc]olor$/, 'color', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable']), after(2, ['literal.color', 'variable'])]),
    new Token_1.default('action.discord.create', /^[Cc]reate$/, 'create', vscode.CompletionItemKind.Function, 'create "${1:webhookId}" ${2:webhookUrl}')
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.delete', /^[Dd]elete$/, 'delete', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.description', /^[Dd]escription$/, 'description', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.field', /^[Ff]ield$/, 'field', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.file', /^[Ff]ile$/, 'file', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.footericon', /^[Ff]ooter[Ii]con$/, 'footerIcon', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.footertext', /^[Ff]ooter[Tt]ext$/, 'footerText', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.image', /^[Ii]mage$/, 'image', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.message', /^[Mm]essage$/, 'message', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.send', /^[Ss]end$/, 'send', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.thumbnail', /^[Tt]humbnail$/, 'thumbnail', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.title', /^[Tt]itle$/, 'title', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.update', /^[Uu]pdate$/, 'update', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    new Token_1.default('action.discord.url', /^[Uu][Rr][Ll]$/, 'url', vscode.CompletionItemKind.Function)
        .setRules([next(['literal.string', 'variable'])]),
    // action random
    new Token_1.default('action.random', /^[Rr]andom$/, 'random', vscode.CompletionItemKind.Class).topLevel()
        .setRules([next(['action.random.number'])]),
    new Token_1.default('action.random.number', /^[Nn]umber$/, 'number', vscode.CompletionItemKind.Function, 'number ${1:min} ${2:max}')
        .setRules([
        next(['literal.number', 'variable']),
        after(2, ['literal.number', 'variable']),
    ])
        .setParameters(['number']),
    // action variable
    new Token_1.default('action.variable', /^[Vv]ariable$/, 'variable', vscode.CompletionItemKind.Class).topLevel()
        .setRules([
        next(['action.variable.load', 'action.variable.remove', 'action.variable.set', 'action.variable.global']),
    ]),
    new Token_1.default('action.variable.load', /^[Ll]oad$/, 'load', vscode.CompletionItemKind.Function, 'load ${1:variableName}'),
    new Token_1.default('action.variable.remove', /^[Rr]emove$/, 'remove', vscode.CompletionItemKind.Function, 'remove ${1:variableName}'),
    new Token_1.default('action.variable.set', /^[Ss]et$/, 'set', vscode.CompletionItemKind.Function, 'set ${1:variableName} ${2:value}'),
    new Token_1.default('action.variable.global', /^[Gg]lobal$/, 'global', vscode.CompletionItemKind.Class)
        .setRules([
        next(['action.variable.load', 'action.variable.remove', 'action.variable.set']),
    ]),
    new Token_1.default('action.variable.clear', /^[Cc]lear$/, 'clear', vscode.CompletionItemKind.Function),
];
//# sourceMappingURL=tokens.js.map