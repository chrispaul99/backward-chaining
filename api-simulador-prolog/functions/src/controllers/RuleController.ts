import * as admin from 'firebase-admin';
// Models
import { Rule } from '../models/Rule';
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create",async (req:any, res:any) => {
    let rule:Rule = new Rule();
    rule = req.body as Rule;
    const newRuleRef = db.collection('rules').doc();
    newRuleRef.set(JSON.parse(JSON.stringify(rule))).then(response => { // Rulecreated
        res.json({
            success: true,
            message: 'Registro de nueva Regla Exitoso',
        })
    }).catch(e => { // error creating rule
        res.json({
            success: false,
            message: 'Error en registro de nueva Regla'
        })
    });
});
router.put("/update",async (req:any, res:any) => {
    let rule:Rule= new Rule();
    rule= req.body as Rule;
    const updateRuleRef = db.collection('rules').doc(rule.id);
        updateRuleRef.update(JSON.parse(JSON.stringify(rule)))
        .then(()=> { // Rulecreated
            res.json({
                success: true,
                message: 'Actualización de Regla exitosa',
            })
        }).catch(() => { // error creating rule
            res.json({
                success: false,
                message: 'Error en actualización de Regla'
            })
        });
});
router.get("/all",async (req:any, res:any) => {
    const ref = db.collection("rules");
    const doc = await ref.get();
    let rulelist:Rule[]=[];
    doc.docs.map(doc=>{
        let regla = doc.data() as Rule;
        rulelist.push(regla);
    });
    res.json({
        success: true,
        data: rulelist
    });
});
router.get("/:id", async (req:any, res:any) => {
    const ref = db.collection("rules");
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let rule = doc.data() as Rule;
        if(rule.id==req.params.id){
            res.json({
                success: true,
                data: rule
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún Regla con el ID'+req.params.id
    });
    
});

router.delete("/delete/:id",async (req:any, res:any) => {
    const ref = db.collection("rules").doc(req.params.id);
    ref.delete().then(response => { // Rule delete forever
        res.json({
            success: true,
            message: 'El Regla ha sido eliminado definitivamente del sistema',
        })
    }).catch(e => { // error delete Ruleforever
        res.json({
            success: false,
            message: 'Error al eliminar al Regla'
        })
    });
});


module.exports = router;
