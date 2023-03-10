import fetch from 'node-fetch';

export function loadDoc(): Promise<{}> {
    return fetch('https://raw.githubusercontent.com/Kruiser8/Kruiz-Control/master/js/Documentation.md')
        .then(response => response.text())
        .then(documentation => {
            const triggers: string[] = [];
            const actions: string[] = [];

            const sections = documentation.split('Default Parameters')[1].split(/\n## /g);
            sections.forEach(section => {
                const sectionTitle = section.match(/.+/)![0];
                //const hasTriggers = !section.match(/\n###.+Triggers\nNone at the moment\./);
                //const hasActions = !section.match(/\n###.+Actions\nNone at the moment\./);
                const subSections = section.split(/\n#### /g);
                subSections.forEach(sub => {
                    const subName = sub.match(/.+/)![0];
                    const isTrigger = subName.startsWith('On');
                    if (isTrigger) triggers.push(subName);
                    else actions.push(subName);
                });
            });
            return {
                triggers: triggers,
                actions: actions,
            };
        });
}
