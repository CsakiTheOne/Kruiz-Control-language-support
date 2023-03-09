"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinToString = exports.setFoundUsers = exports.getUsers = exports.getDefaultParams = void 0;
const defaultParams = [
    "_successful_", "_unsuccessful_", "_kc_event_id_",
];
const defaultUsers = [
    'NeshyLegacy', 'CsakiTheOne',
];
let foundUsers = [];
let loadedVariables = [];
function getDefaultParams() {
    return defaultParams;
}
exports.getDefaultParams = getDefaultParams;
function getUsers() {
    return [defaultUsers, foundUsers].flat();
}
exports.getUsers = getUsers;
function setFoundUsers(users) {
    foundUsers = users;
}
exports.setFoundUsers = setFoundUsers;
function joinToString(list, separator = ', ') {
    let text = list[0];
    for (let i = 1; i < list.length; i++) {
        text += separator + list[i];
    }
    return text;
}
exports.joinToString = joinToString;
//# sourceMappingURL=declared.js.map