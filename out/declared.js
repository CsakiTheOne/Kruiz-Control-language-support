"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinToString = exports.toSuggestions = exports.setFoundVariables = exports.setFoundWebhooks = exports.setFoundUsers = exports.getFoundVariables = exports.getFoundWebhooks = exports.getFoundUsers = exports.getDefaultParams = void 0;
const defaultParams = [
    "_successful_", "_unsuccessful_", "_kc_event_id_",
];
const defaultUsers = [
    'CsakiTheOne', 'LenaTheNPC', 'Lightfall_23', 'NeshyLegacy',
];
let foundUsers = [];
let foundWebhooks = [];
let foundVariables = [];
//
// GET
//
function getDefaultParams() {
    return defaultParams;
}
exports.getDefaultParams = getDefaultParams;
function getFoundUsers() {
    return [defaultUsers, foundUsers].flat();
}
exports.getFoundUsers = getFoundUsers;
function getFoundWebhooks() {
    return foundWebhooks;
}
exports.getFoundWebhooks = getFoundWebhooks;
function getFoundVariables() {
    return foundVariables;
}
exports.getFoundVariables = getFoundVariables;
//
// SET
//
function setFoundUsers(values) {
    foundUsers = values;
}
exports.setFoundUsers = setFoundUsers;
function setFoundWebhooks(values) {
    foundWebhooks = values;
}
exports.setFoundWebhooks = setFoundWebhooks;
function setFoundVariables(values) {
    foundVariables = values;
}
exports.setFoundVariables = setFoundVariables;
//
// UTIL
//
function toSuggestions(list, prefix = '', suffix = '') {
    return joinToString(list.map(item => `${prefix}${item}${suffix}`), ',', ',');
}
exports.toSuggestions = toSuggestions;
function joinToString(list, separator = ', ', prefix = '') {
    if (list.length < 1)
        return '';
    let text = prefix + list[0];
    for (let i = 1; i < list.length; i++) {
        text += separator + list[i];
    }
    return text;
}
exports.joinToString = joinToString;
//# sourceMappingURL=declared.js.map