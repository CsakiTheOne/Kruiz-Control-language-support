import * as vscode from 'vscode';
import fetch from 'node-fetch';
import Token from './Token';
import Database from './Database';

export function loadDoc() {
    const tokens: Token[] = [];

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
                    if (subName) {
                        const name = subName[0];
                        const type = name.startsWith('On') ? 'trigger' : 'action';
                        const description = sub.match(/(?<=\*{2}Info\*{2} \| ).+/);
                        const format = sub.match(/(?<=\*{2}Format\*{2} \| `).+(?=`)/);
                        
                        const completionItem = new vscode.CompletionItem(name);
                        completionItem.kind = type == 'trigger' ? vscode.CompletionItemKind.Event : vscode.CompletionItemKind.Function;
                        if (format != undefined) {
                            completionItem.detail = format[0];
                        }
                        if (description != undefined) {
                            completionItem.documentation = description[0];
                            const token = new Token(name, new RegExp(`^${name}$`, 'i'), completionItem, true);
                            if (format != undefined) token.setRulesByFormat(format[0]);
                            tokens.push(token);
                        }
                    }
                });
            });
            console.table(tokens);
            Database.docTokens = tokens;
        });
}
