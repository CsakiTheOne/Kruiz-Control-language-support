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
                                completion.documentation = description[0];
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
                        keywords[keywords.length - 1].completion.kind = vscode.CompletionItemKind.Function;
                        for (let i = 0; i < params.length; i++) {
                            const param = params[i];
                            keywords[keywords.length - 1].rules.push(new Rule(i + 1, [param]));
                        }

                        keywords.forEach(keyword => {
                            const similarToken = tokens.find(t => t.id == keyword.id);
                            if (similarToken) {
                                similarToken.rules = similarToken.rules.concat(keyword.rules);
                            }
                            else {
                                tokens.push(keyword);
                            }
                        });

                        // add last name part as function
                        /*const completionItem = new vscode.CompletionItem(name);
                        completionItem.kind = type == 'trigger' ? vscode.CompletionItemKind.Event : vscode.CompletionItemKind.Function;
                        if (format != undefined) {
                            completionItem.detail = format[0];
                            console.log(format[0]);
                        }
                        completionItem.documentation = description[0];
                        const mainToken = new Token(name.replace(' ', '.'), new RegExp(`^${name}`, 'i'), completionItem, true);
                        if (format != undefined) mainToken.setRulesByFormat(format[0]);
                        tokens.push(mainToken);*/
                    }
                });
            });
            Database.docTokens = tokens;
            console.log('READY');
        });
}
