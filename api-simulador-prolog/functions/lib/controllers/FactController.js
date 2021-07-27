"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const Fact_1 = require("../models/Fact");
// Models
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create", async (req, res) => {
    let fact = new Fact_1.Fact();
    fact = req.body;
    const newFactRef = db.collection('facts').doc();
    newFactRef.set(JSON.parse(JSON.stringify(fact))).then(response => {
        res.json({
            success: true,
            message: 'Registro de nuevo Hecho Exitoso',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en registro de nuevo Hecho'
        });
    });
});
router.put("/update", async (req, res) => {
    let fact = new Fact_1.Fact();
    fact = req.body;
    const updateFactRef = db.collection('facts').doc(fact.id);
    updateFactRef.update(JSON.parse(JSON.stringify(fact)))
        .then(response => {
        res.json({
            success: true,
            message: 'Actualización de Hecho exitoso',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en actualización de Hecho'
        });
    });
});
router.get("/all", async (req, res) => {
    const ref = db.collection("facts");
    const doc = await ref.get();
    let factlist = [];
    doc.docs.map(doc => {
        let hecho = doc.data();
        factlist.push(hecho);
    });
    res.json({
        success: true,
        data: factlist
    });
});
router.get("/:id", async (req, res) => {
    const ref = db.collection("facts");
    const doc = await ref.get();
    doc.docs.map(doc => {
        let fact = doc.data();
        if (fact.id == req.params.id) {
            res.json({
                success: true,
                data: fact
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún Hecho con el ID' + req.params.id
    });
});
router.delete("/delete/:id", async (req, res) => {
    const ref = db.collection("facts").doc(req.params.id);
    ref.delete().then(response => {
        res.json({
            success: true,
            message: 'El Hecho ha sido eliminado definitivamente del sistema',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error al eliminar el Hecho'
        });
    });
});
module.exports = router;
//# sourceMappingURL=FactController.js.map