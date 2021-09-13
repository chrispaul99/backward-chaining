import * as admin from 'firebase-admin';
// Models
import { Fact } from "../models/Fact";
import { IA } from "../models/IA";
import { Rule } from '../models/Rule';

const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/checking",async (req:any, res:any) => {
    let checking:IA = new IA();
    let checkFact:string = req.body.message;

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
    let resultado:any[]=[];
    checking.verificadorVerdad(checkFact,factlist,ruleslist).then((value)=>{
        resultado = value;
        res.status(200).json({
            message: resultado,
        });
       
    });
    
    
});

module.exports = router;
