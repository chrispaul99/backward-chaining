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
    checkFact = req.body;
    //base de datos de hechos
    const ref = db.collection("facts");
    const doc = await ref.get();
    let factlist = [];
    doc.docs.map(doc => {
        let hecho = doc.data();
        factlist.push(hecho);
    });
    //base de datos de reglas
    const ref1 = db.collection("rules");
    const doc1 = await ref1.get();
    let ruleslist = [];
    doc1.docs.map(doc => {
        let regla = doc.data();
        ruleslist.push(regla);
    });
    let hechosfinales = checking.verificadorVerdad(checkFact.predicado, checkFact.sujetos, factlist, ruleslist);
    if (hechosfinales.length == 0) {
        res.json({
            success: false,
            message: "FALSO",
        });
    }
    else {
        res.json({
            success: true,
            message: "VERDADERO",
            data: hechosfinales
        });
    }
});
module.exports = router;
//# sourceMappingURL=CheckController.js.map