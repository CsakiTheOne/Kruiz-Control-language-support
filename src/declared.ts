const defaultParams: string[] = [
    "_successful_", "_unsuccessful_", "_kc_event_id_",
];
const defaultUsers: string[] = [
    'NeshyLegacy', 'CsakiTheOne',
];

let foundUsers: string[] = [];
let foundWebhooks: string[] = [];
let foundVariables: string[] = [];

//
// GET
//
export function getDefaultParams(): string[] {
    return defaultParams;
}

export function getFoundUsers(): string[] {
    return [defaultUsers, foundUsers].flat();
}

export function getFoundWebhooks(): string[] {
    return foundWebhooks;
}

export function getFoundVariables(): string[] {
    return foundVariables;
}

//
// SET
//
export function setFoundUsers(values: string[]) {
    foundUsers = values;
}

export function setFoundWebhooks(values: string[]) {
    foundWebhooks = values;
}

export function setFoundVariables(values: string[]) {
    foundVariables = values;
}

//
// UTIL
//
export function joinToString(list: string[], separator: string = ', ', prefix: string = ''): string {
    if (list.length < 1) return '';

    let text = prefix + list[0];

    for (let i = 1; i < list.length; i++) {
        text += separator + list[i];
    }

    return text;
}
