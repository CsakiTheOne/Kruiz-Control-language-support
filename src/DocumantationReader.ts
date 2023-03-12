import * as vscode from 'vscode';
import fetch from 'node-fetch';
import Token from './Token';
import Database from './Database';
import Rule from './Rule';

export function loadDoc() {
    let tokens: Token[] = [];

    fetch('https://raw.githubusercontent.com/Kruiser8/Kruiz-Control/master/js/Documentation.md')
        .then(response => response.text())
        .then(documentation => {
            const sections = documentation.split('## Default Parameters')[1].split(/\n## /g);
            sections.forEach(section => {
                //const sectionTitle = section.match(/.+/);
                //const hasTriggers = !section.match(/\n###.+Triggers\nNone at the moment\./);
                //const hasActions = !section.match(/\n###.+Actions\nNone at the moment\./);
                const subSections = section.split(/\n#### /g);
                subSections.forEach(sub => {
                    const name = sub.match(/.+/)?.at(0);
                    const description = sub.match(/(?<=\*{2}Info\*{2} \| ).+/);
                    const format = sub.match(/(?<=\*{2}Format\*{2} \| `).+(?=`)/);
                    const type = name?.startsWith('On') ? 'trigger' : 'action';
                    if (name && description && format) {
                        const formatSegments = format[0].split(' ');
                        const keywords: Token[] = [];
                        const params: Token[] = [];
                        let formatTillThis = '';
                        formatSegments.forEach(segment => {
                            const tokenId = `${formatTillThis}${segment}`;
                            let regex = /^$/;
                            let completion = new vscode.CompletionItem(segment);
                            if (segment.includes('<')) {
                                const param = segment.replace(/<|>/g, '');
                                completion.label = param;
                            }
                            else {
                                regex = new RegExp(`\\b(?<=${formatTillThis})${segment}\\b`, 'gi');
                                completion.kind = vscode.CompletionItemKind.Class;
                            }
                            const token = new Token(tokenId, regex, completion);
                            if (segment.includes('<')) {
                                params.push(token);
                            }
                            else {
                                keywords.push(token);
                            }
                            formatTillThis += segment + ' ';
                        });

                        keywords[0].isTopLevel = true;
                        if (keywords.length > 1) {
                            for (let i = 0; i < keywords.length - 1; i++) {
                                keywords[i].rules.push(new Rule(1, [keywords[i + 1]]));
                            }
                        }
                        keywords[keywords.length - 1].completion.detail = format[0];
                        keywords[keywords.length - 1].completion.documentation = description[0];
                        keywords[keywords.length - 1].completion.kind = type == 'action' ? vscode.CompletionItemKind.Function : vscode.CompletionItemKind.Event;
                        for (let i = 0; i < params.length; i++) {
                            const param = params[i];
                            keywords[keywords.length - 1].rules.push(new Rule(i + 1, [param]));
                        }

                        keywords.forEach(keyword => {
                            tokens = pushOrMergeToken(tokens, keyword);
                        });
                    }
                });
            });
            Database.docTokens = tokens;
            console.log('READY');
        });
}

function pushOrMergeToken(tokens: Token[], token: Token): Token[] {
    const similarToken = tokens.find(t => t.id == token.id);
    if (similarToken) {
        const newRules: Rule[] = [];
        const allRules = similarToken.rules.concat(token.rules);
        allRules.forEach(rule => {
            const similarRule = newRules.find(r => r.offset == rule.offset);
            if (similarRule) {
                let newTokens: Token[] = [];
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