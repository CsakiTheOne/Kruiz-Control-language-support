"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSimulator = void 0;
const vscode = require("vscode");
const simulatorExecutionLimit = 500;
let simulatorCurrentExecutionDepth = 0;
let chat = [];
let variables = {};
let currentLinesIndex = [];
let outputChannel = null;
let doc;
function startSimulator(document, input) {
    doc = document;
    simulatorCurrentExecutionDepth = 0;
    variables = {};
    chat = [];
    chat.push(`- - - SIMULATOR SESSION STARTED - - -`);
    chat.push(`Document: ${doc.fileName}`);
    chat.push(`Input: ${input}`);
    chat.push(`- - - - - - - - - - - - - - - - - - -`);
    showChat();
    simulateInput(input, false);
    chat.push(`- - -  SIMULATOR SESSION ENDED  - - -`);
    showChat();
}
exports.startSimulator = startSimulator;
function showChat() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Kruiz-Control Simulator');
    }
    outputChannel.clear();
    outputChannel.appendLine(chat.join('\n'));
    outputChannel.show();
}
function simulateInput(input, fromBot = false) {
    const lines = doc.getText().split('\n').map((text, index) => ({ text: text.trim(), index }));
    const triggeredLines = [];
    const onEveryChatLines = lines
        .filter(line => line.text.toLowerCase().startsWith('oneverychatmessage'));
    triggeredLines.push(...onEveryChatLines);
    const inputIsCommand = input.startsWith('!');
    if (inputIsCommand) {
        const onCommandLines = lines
            .filter(line => line.text.toLowerCase().startsWith('oncommand'))
            .map(line => ({ ...line, commands: line.text.split(' ').slice(3).map(command => command.trim()) }))
            .filter(({ commands }) => commands.includes(input));
        triggeredLines.push(...onCommandLines);
    }
    const onKeywordLines = lines
        .filter(line => line.text.toLowerCase().startsWith('onkeyword'))
        .map(line => ({ ...line, keywords: line.text.split(' ').slice(3).map(keyword => keyword.trim()) }))
        .filter(({ keywords }) => keywords.some(keyword => input.toLowerCase().includes(keyword.toLowerCase())));
    triggeredLines.push(...onKeywordLines);
    currentLinesIndex = triggeredLines.map(({ index }) => index + 1);
    executeLines();
}
function executeLines() {
    simulatorCurrentExecutionDepth++;
    if (simulatorCurrentExecutionDepth > simulatorExecutionLimit) {
        chat.push(`Simulator execution limit reached! Stopped simulator to prevent infinite loop.`);
        showChat();
        return;
    }
    const lines = doc.getText().split('\n').map((text, index) => ({ text: text.trim(), index }));
    const linesToExecute = lines.filter(({ index }) => currentLinesIndex.includes(index));
    linesToExecute.forEach(line => {
        const nextLineIndex = executeLine(line);
        currentLinesIndex = currentLinesIndex.filter(index => index !== line.index);
        if (nextLineIndex) {
            currentLinesIndex.push(nextLineIndex);
        }
    });
    if (currentLinesIndex.length > 0)
        executeLines();
}
function populateVariables(text) {
    return text.replace(/\{([a-zA-Z0-9]+?)\}/g, (match, variableName) => {
        return variables[variableName] || match;
    });
}
function executeLine(line) {
    const { text, index } = line;
    if (text.startsWith('#'))
        return index + 1;
    const [command, ...args] = text.split(' ').map(text => text.trim());
    switch (command.toLowerCase()) {
        case 'chat':
            if (args[0].toLowerCase() === 'send') {
                const message = populateVariables(args.slice(1).join(' '));
                chat.push(`Bot: ${message}`);
                simulateInput(message, true);
            }
            else if (args[0].toLowerCase() === 'whisper') {
                const message = populateVariables(args.slice(2).join(' '));
                chat.push(`Bot whispers to ${args[1]}: ${message}`);
            }
            return index + 1;
        case 'exit':
            return null;
        case 'if':
            const lineSkip = parseInt(args[0]);
            const result = eval(`${populateVariables(args[1])} ${args[2]} ${populateVariables(args[3])}`);
            if (result) {
                return index + 1;
            }
            return index + lineSkip + 1;
        case 'random':
            if (args[0].toLowerCase() === 'number') {
                const min = parseInt(args[1]);
                const max = parseInt(args[2]);
                const random = Math.floor(Math.random() * (max - min + 1)) + min;
                variables['number'] = random;
            }
            return index + 1;
    }
    return null;
}
//# sourceMappingURL=simulator.js.map