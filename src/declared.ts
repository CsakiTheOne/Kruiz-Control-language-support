const defaultParams: string[] = [
    "_successful_", "_unsuccessful_", "_kc_event_id_",
];
const defaultUsers: string[] = [
    'NeshyLegacy', 'CsakiTheOne',
];

let foundUsers: string[] = [];
let loadedVariables: string[] = [];

export function getDefaultParams(): string[] {
    return defaultParams;
}

export function getUsers(): string[] {
    return [defaultUsers, foundUsers].flat();
}

export function getLoadedVariables(): string[] {
    return loadedVariables;
}

export function setFoundUsers(users: string[]) {
    foundUsers = users;
}

export function joinToString(list: string[], separator: string = ', '): string {
    let text = list[0];

    for (let i = 1; i < list.length; i++) {
        text += separator + list[i];
    }

    return text;
}
