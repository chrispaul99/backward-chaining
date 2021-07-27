//import * as admin from 'firebase-admin';
// Models
//import { Fact } from '../models/Fact';
import { Check } from '../models/Check';
//const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/checking-action",async (req:any, res:any) => {
    //let checkFact:Fact = new Fact();
    let checking:Check = new Check();
    res.json({
        success: true,
        message: checking.imprimir(["chris"],"HOMBRE"),
    })
});

module.exports = router;
