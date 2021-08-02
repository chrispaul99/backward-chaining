"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const Fact_1 = require("./Fact");
class Rule {
    constructor() {
        this.id = "";
        this.conclusion = new Fact_1.Fact();
        this.condiciones = [];
        this.operadores = [];
    }
}
exports.Rule = Rule;
//# sourceMappingURL=Rule.js.map