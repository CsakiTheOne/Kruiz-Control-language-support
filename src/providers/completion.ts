import * as vscode from 'vscode';
import Database from '../Database';

export function getCompletionItemProvider() {
    function getWordIndex(text: string, charIndex: number): number {
        // Trim the text to remove any leading or trailing whitespace
        const trimmedText = text.trimStart();

        // Initialize the word index and the current index to 0
        let wordIndex = 0;
        let currentIndex = 0;

        // Loop through each word in the text
        for (const word of trimmedText.split(/\s+/)) {
            // Get the start and end indices of the current word
            const startIndex = currentIndex;
            const endIndex = startIndex + word.length;

            // If the character index is within the current word, return the word index
            if (startIndex <= charIndex && charIndex < endIndex) {
                return wordIndex;
            }

            // Increment the word index and the current index for the next word
            wordIndex++;
            currentIndex = endIndex + 1; // Add 1 for the space after the word
        }

        // If the character index is beyond the end of the text, return the last word index
        return wordIndex - 1;
    }

    return vscode.languages.registerCompletionItemProvider('kruizcontrol', {
        provideCompletionItems(document, position, token, context) {
            Database.updateSymbols(document);

            const lineSymbols = Database.symbols.filter(symbol => symbol.position.line == position.line);

            // If line has symbols, check the rules
            if (lineSymbols.length > 0) {
                const currentLine = document.lineAt(position.line).text;
                const currentWordIndex = getWordIndex(currentLine, position.character);
                // Look for relevant rules
                const relevantRules = lineSymbols.map(symbol => {
                    const wordIndex = getWordIndex(currentLine, symbol.position.character);
                    return symbol.token.rules.filter(rule => wordIndex + rule.offset == currentWordIndex);
                }).flat();

                let completions: vscode.CompletionItem[] = [];
                // Return the relevant contextual completions
                const map1 = Database.contextualCompletionsBase;
                const map2 = Database.contextualCompletions;
                const allContextualCompletion = new Map([...map1, ...map2]);
                for (const [key, value] of allContextualCompletion) {
                    if (map1.has(key) && map2.has(key)) {
                        allContextualCompletion.set(key, map1.get(key)!.concat(map2.get(key)!));
                    }
                }
                completions = completions.concat(
                    relevantRules.flatMap(rule =>
                        rule.tokens.filter(token => allContextualCompletion.has(token.id)).flatMap(token =>
                            allContextualCompletion.get(token.id)!
                        )
                    )
                );
                // Return the tokens in the rules
                completions = completions.concat(relevantRules.flatMap(rule => rule.tokens.map(token => token.completion)));
                // Return completions
                return [... new Set(completions)];
            }

            // Return top-level tokens if the line has no symbols
            return Database.getTokens().filter(token => token.isTopLevel).map(token => token.completion);
        },
    }, '', ' ');
}