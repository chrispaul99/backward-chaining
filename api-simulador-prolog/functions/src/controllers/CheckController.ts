import * as admin from 'firebase-admin';
// Models
import { Fact } from '../models/Fact';
import { Check } from '../models/Check';
import { Rule } from '../models/Rule';
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/checking-action",async (req:any, res:any) => {
    let checkFact:Fact = new Fact();
    let checking:Check = new Check();

    checkFact = req.body;

    //base de datos de hechos
    const ref = db.collection("facts");
    const doc = await ref.get();
    let factlist:Fact[]=[];
    doc.docs.map(doc=>{
        let hecho = doc.data() as Fact;
        factlist.push(hecho);
    });

    //base de datos de reglas
    const ref1 = db.collection("rules");
    const doc1 = await ref1.get();
    let ruleslist:Rule[]=[];
    doc1.docs.map(doc=>{
        let regla = doc.data() as Rule;
        ruleslist.push(regla);
    });
    let hechosfinales:Fact[]=checking.verificadorVerdad(checkFact,factlist,ruleslist);
    if(hechosfinales.length==0){
        res.json({
            success: false,
            message: "FALSO",
        })
    }else{
        res.json({
            success: true,
            message: "VERDADERO",
            data:hechosfinales
        })
    }

   
});

module.exports = router;
