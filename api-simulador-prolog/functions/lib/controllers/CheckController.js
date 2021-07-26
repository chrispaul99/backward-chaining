"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// Models
const Fact_1 = require("../models/Fact");
const Check_1 = require("../models/Check");
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/checking-action", async (req, res) => {
    let checkFact = new Fact_1.Fact();
    let checking = new Check_1.Check();
    res.json({
        success: true,
        message: checking.imprimir(),
    });
});
module.exports = router;
//# sourceMappingURL=CheckController.js.map