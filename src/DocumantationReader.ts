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
                    const subName = sub.match(/.+/);
                    const description = sub.match(/(?<=\*{2}Info\*{2} \| ).+/);
                    if (subName && subName[0].split(' ').length < 5 && description) {
                        const name = subName[0];
                        const type = name.startsWith('On') ? 'trigger' : 'action';
                        const format = sub.match(/(?<=\*{2}Format\*{2} \| `).+(?=`)/);

                        // add last name part as function
                        const completionItem = new vscode.CompletionItem(name);
                        completionItem.kind = type == 'trigger' ? vscode.CompletionItemKind.Event : vscode.CompletionItemKind.Function;
                        if (format != undefined) {
                            completionItem.detail = format[0];
                        }
                        completionItem.documentation = description[0];
                        const mainToken = new Token(name.replace(' ', '.'), new RegExp(`^${name}`, 'i'), completionItem, true);
                        if (format != undefined) mainToken.setRulesByFormat(format[0]);
                        tokens.push(mainToken);
                    }
                });
            });
            console.table(tokens);
            Database.docTokens = tokens;
        });
}
