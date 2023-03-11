import * as vscode from 'vscode';
import Rule from './Rule';
import Database from './Database';

export default class Token {
    id: string;
    regex: RegExp;
    completion: vscode.CompletionItem;
    isTopLevel: boolean;
    rules: Rule[] = [];
    parameters: string[] = [];
    definition: Token | undefined;

    constructor(id: string, regex: RegExp, completion: vscode.CompletionItem, isTopLevel: boolean = false) {
        this.id = id;
        this.regex = regex;
        this.completion = completion;
        this.isTopLevel = isTopLevel;
    }

    merge(other: Token): Token {
        this.rules = [... new Set(this.rules.concat(other.rules))];
        return this;
    }

    setInsertText(insertText: string | vscode.SnippetString | undefined): Token {
        this.completion.insertText = insertText;
        return this;
    }

    setRulesByFormat(format: string): Token {
        this.rules = [];
        const params = format.trim().split(' ');
        for (let i = 0; i < params.length; i++) {
            const param = params[i].replace(/<|>/g, '');
            const token = Database.baseTokens.find(baseToken => baseToken.id == param);
            const fallbackToken = new Token(param, /^fallback$/, new vscode.CompletionItem(param));
            this.rules.push(new Rule(i, [token ? token : fallbackToken, Database.baseTokens.find(baseToken => baseToken.id == 'variable')!]));
        }
        return this;
    }

    setParameters(parameters: string[]): Token {
        this.parameters = parameters;
        return this;
    }

    setDefinition(regex: RegExp): Token {
        this.definition = new Token(`${this.id}.definition`, regex, new vscode.CompletionItem(`${this.completion.label} definition`));
        return this;
    }
}