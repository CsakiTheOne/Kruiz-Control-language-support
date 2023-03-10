"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDoc = void 0;
const node_fetch_1 = require("node-fetch");
function loadDoc() {
    return (0, node_fetch_1.default)('https://raw.githubusercontent.com/Kruiser8/Kruiz-Control/master/js/Documentation.md')
        .then(response => response.text())
        .then(documentation => {
        const sections = documentation.split('# Default Parameters')[1].split(/\n## /g);
        sections.forEach(section => {
            const sectionTitle = section.match(/.+/)[0];
            //const hasTriggers = !section.match(/\n###.+Triggers\nNone at the moment\./);
            //const hasActions = !section.match(/\n###.+Actions\nNone at the moment\./);
            const subSections = section.split(/\n#### /g);
            subSections.forEach(sub => {
                const subName = sub.match(/.+/)[0];
                const isTrigger = subName.startsWith('On');
                if (isTrigger)
                    console.log(`Trigger found: ${subName}`);
                else
                    console.log(`Action found: ${subName}`);
            });
        });
        return {};
    });
}
exports.loadDoc = loadDoc;
//# sourceMappingURL=DocumantationReader.js.map