"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLaunchConfiguration = void 0;
const vscode = require("vscode");
const simulateCommand_1 = require("./simulateCommand");
function registerLaunchConfiguration(context) {
    (0, simulateCommand_1.registerSimulateCommand)(context);
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('kruizcontrol', {
        provideDebugConfigurations(folder, token) {
            return [
                {
                    type: 'kruizcontrol',
                    request: 'launch',
                    name: 'Simulate Kruiz Control Twitch Bot',
                    preLaunchTask: 'command:kruizcontrol.simulate',
                }
            ];
        }
    }));
}
exports.registerLaunchConfiguration = registerLaunchConfiguration;
//# sourceMappingURL=simulateLaunchConfig.js.map