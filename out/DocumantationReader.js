"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDoc = void 0;
const vscode = require("vscode");
const node_fetch_1 = require("node-fetch");
const Token_1 = require("./Token");
const Database_1 = require("./Database");
const Rule_1 = require("./Rule");
async function loadDoc() {
    let tokens = [];
    (0, node_fetch_1.default)('https://raw.githubusercontent.com/Kruiser8/Kruiz-Control/master/js/Documentation.md')
        .then(response => response.text())
        .then(documentation => {
        const sections = documentation.split('## Default Parameters')[1].split(/\n## /g);
        sections.forEach(section => {
            const actionOrTriggerSection = section.split(/\n#### /g);
            actionOrTriggerSection.forEach(sub => {
                const name = sub.match(/.+/)?.at(0);
                let description = [`Info: ${sub.match(/(?<=\*{2}Info\*{2} \| ).+/)}`];
                if (sub.includes('**Example**')) {
                    description.push(`Example: ${sub.match(/(?<=\*{2}Example\*{2} \| ).+/)}`);
                }
                if (sub.includes('##### Parameters')) {
                    let parametersDescription = `Parameters:`;
                    const parameterLines = sub.split('##### Parameters')[1].split('\n').filter(line => line.startsWith('**'));
                    parameterLines.forEach(paramLine => {
                        const paramName = paramLine.match(/(?<=\*{2}).+(?=\*{2})/)?.at(0);
                        const paramDescription = paramLine.replace(/\*{2}.+\*{2} \| /, '');
                        parametersDescription += `\n\n- \`${paramName}\` - ${paramDescription}`;
                    });
                    description.push(parametersDescription);
                }
                const format = sub.match(/(?<=\*{2}Format\*{2} \| `).+(?=`)/);
                const type = name?.startsWith('On') ? 'trigger' : 'action';
                if (name && description && format) {
                    const formatSegments = format[0].split(' ');
                    const keywords = [];
                    const params = [];
                    let formatTillThis = '';
                    formatSegments.forEach(segment => {
                        const tokenId = `${formatTillThis}${segment}`;
                        let regex = /^$/;
                        // Parameter
                        if (segment.includes('<')) {
                            const param = segment.replace(/<|>/g, '');
                            const token = new Token_1.default(tokenId, regex, getCompletionFromParam(format[0], param));
                            params.push(token);
                        }
                        // Not parameter
                        else {
                            regex = new RegExp(`\\b(?<=${formatTillThis})${segment}\\b`, 'gi');
                            let completion = new vscode.CompletionItem(segment);
                            completion.kind = type == 'trigger' ? vscode.CompletionItemKind.Event : vscode.CompletionItemKind.Class;
                            const token = new Token_1.default(tokenId, regex, completion);
                            keywords.push(token);
                        }
                        formatTillThis += segment + ' ';
                    });
                    keywords[0].isTopLevel = true;
                    if (keywords.length > 1) {
                        for (let i = 0; i < keywords.length - 1; i++) {
                            keywords[i].rules.push(new Rule_1.default(1, [keywords[i + 1]]));
                        }
                    }
                    keywords[keywords.length - 1].completion.documentation = description.join('\n\n');
                    keywords[keywords.length - 1].completion.kind = type == 'action' ? vscode.CompletionItemKind.Function : vscode.CompletionItemKind.Event;
                    for (let i = 0; i < params.length; i++) {
                        const param = params[i];
                        const simpleParam = new Token_1.default(param.id.split(' ')[param.id.split(' ').length - 1].replace(/<|>/g, ''), param.regex, param.completion);
                        keywords[keywords.length - 1].rules.push(new Rule_1.default(i + 1, [param, simpleParam, Database_1.default.getVariableToken()]));
                    }
                    keywords.forEach(keyword => {
                        tokens = pushOrMergeToken(tokens, keyword);
                    });
                }
            });
        });
        Database_1.default.docTokens = tokens;
        console.log('READY');
    });
}
exports.loadDoc = loadDoc;
function getCompletionFromParam(format, name) {
    const item = new vscode.CompletionItem(name);
    // Simple name checking
    switch (name) {
        case 'color':
            item.kind = vscode.CompletionItemKind.Color;
            item.insertText = new vscode.SnippetString('"#{1:FFFFFF}"');
            break;
        case 'command':
            item.kind = vscode.CompletionItemKind.Method;
            item.insertText = new vscode.SnippetString('!${1:command}');
            break;
        case 'message':
            item.kind = vscode.CompletionItemKind.Text;
            item.insertText = new vscode.SnippetString('"$1"');
            break;
        default:
            item.kind = undefined;
            item.insertText = new vscode.SnippetString(`\${1:${name}}`);
            break;
    }
    return item;
}
function pushOrMergeToken(tokens, token) {
    const similarToken = tokens.find(t => t.id == token.id);
    if (similarToken) {
        const newRules = [];
        const allRules = similarToken.rules.concat(token.rules);
        allRules.forEach(rule => {
            const similarRule = newRules.find(r => r.offset == rule.offset);
            if (similarRule) {
                let newTokens = [];
                const allTokens = similarRule.tokens.concat(rule.tokens);
                allTokens.forEach(subToken => {
                    newTokens = pushOrMergeToken(newTokens, subToken);
                });
                similarRule.tokens = newTokens;
            }
            else {
                newRules.push(rule);
            }
        });
        similarToken.rules = newRules;
    }
    else {
        tokens.push(token);
    }
    return tokens;
}
//# sourceMappingURL=DocumantationReader.js.map