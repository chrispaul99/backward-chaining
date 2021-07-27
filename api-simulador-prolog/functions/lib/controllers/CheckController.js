"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as admin from 'firebase-admin';
// Models
//import { Fact } from '../models/Fact';
const Check_1 = require("../models/Check");
//const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/checking-action", async (req, res) => {
    //let checkFact:Fact = new Fact();
    let checking = new Check_1.Check();
    res.json({
        success: true,
        message: checking.imprimir(["chris"], "HOMBRE"),
    });
});
module.exports = router;
//# sourceMappingURL=CheckController.js.map