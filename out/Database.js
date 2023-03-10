"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Database {
    static getTokens() {
        return this.baseTokens.concat(this.docTokens);
    }
}
exports.default = Database;
Database.baseTokens = [];
Database.docTokens = [];
//# sourceMappingURL=Database.js.map