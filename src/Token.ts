import * as vscode from 'vscode';
import Rule from './Rule';
import Database from './Database';

export default class Token {
    id: string;
    completion: vscode.CompletionItem;
    rules: Rule[] = [];

    constructor(id: string, completion: vscode.CompletionItem) {
        this.id = id;
        this.completion = completion;
    }

    setInsertText(insertText: string | vscode.SnippetString | undefined): Token {
        this.completion.insertText = insertText;
        return this;
    }

    setRulesByFormat(format: string): Token {
        this.rules = [];
        const params = format.replace(this.id, '').trim().split(' ');
        for (let i = 0; i < params.length; i++) {
            const param = params[i].replace(/<|>/, '');
            const token = Database.baseTokens.find(baseToken => baseToken.id == param);
            if (token != undefined) this.rules.push(new Rule(i, token));
        }
        return this;
    }
}