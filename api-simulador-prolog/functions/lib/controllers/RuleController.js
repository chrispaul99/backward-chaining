"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
// Models
const Rule_1 = require("../models/Rule");
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create", async (req, res) => {
    let rule = new Rule_1.Rule();
    rule = req.body;
    const newRuleRef = db.collection('rules').doc();
    newRuleRef.set(JSON.parse(JSON.stringify(rule))).then(response => {
        res.json({
            success: true,
            message: 'Registro de nueva Regla Exitoso',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en registro de nueva Regla'
        });
    });
});
router.put("/update", async (req, res) => {
    let rule = new Rule_1.Rule();
    rule = req.body;
    const updateRuleRef = db.collection('rules').doc(rule.id);
    updateRuleRef.update(JSON.parse(JSON.stringify(rule)))
        .then(() => {
        res.json({
            success: true,
            message: 'Actualización de Regla exitosa',
        });
    }).catch(() => {
        res.json({
            success: false,
            message: 'Error en actualización de Regla'
        });
    });
});
router.get("/all", async (req, res) => {
    const ref = db.collection("rules");
    const doc = await ref.get();
    let rulelist = [];
    doc.docs.map(doc => {
        let regla = doc.data();
        rulelist.push(regla);
    });
    res.json({
        success: true,
        data: rulelist
    });
});
router.get("/:id", async (req, res) => {
    const ref = db.collection("rules");
    const doc = await ref.get();
    doc.docs.map(doc => {
        let rule = doc.data();
        if (rule.id == req.params.id) {
            res.json({
                success: true,
                data: rule
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún Regla con el ID' + req.params.id
    });
});
router.delete("/delete/:id", async (req, res) => {
    const ref = db.collection("rules").doc(req.params.id);
    ref.delete().then(response => {
        res.json({
            success: true,
            message: 'El Regla ha sido eliminado definitivamente del sistema',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error al eliminar al Regla'
        });
    });
});
module.exports = router;
//# sourceMappingURL=RuleController.js.map