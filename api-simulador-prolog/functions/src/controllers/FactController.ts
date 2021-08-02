import * as admin from 'firebase-admin';
import { Fact } from '../models/Fact';
// Models
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create",async (req:any, res:any) => {
    let facts:Fact[] = [];
    facts = req.body as Fact[];
    for (const fact of facts) {
        const newFactRef = db.collection('facts').doc();
        newFactRef.set(JSON.parse(JSON.stringify(fact))).then(response => { // Fact created
            res.json({
                success: true,
                message: 'Registro de nuevo Hecho Exitoso',
            })
        }).catch(e => { // error creating Fact
            res.json({
                success: false,
                message: 'Error en registro de nuevo Hecho'
            })
        });
    }
});
router.put("/update",async (req:any, res:any) => {
    let fact:Fact= new Fact();
    fact= req.body as Fact;
    const updateFactRef = db.collection('facts').doc(fact.id);
        updateFactRef.update(JSON.parse(JSON.stringify(fact)))
        .then(response => { // Factcreated
            res.json({
                success: true,
                message: 'Actualización de Hecho exitoso',
            })
        }).catch(e => { // error creating Fact
            res.json({
                success: false,
                message: 'Error en actualización de Hecho'
            })
        });
});
router.get("/all",async (req:any, res:any) => {
    const ref = db.collection("facts");
    const doc = await ref.get();
    let factlist:Fact[]=[];
    doc.docs.map(doc=>{
        let hecho = doc.data() as Fact;
        factlist.push(hecho);
    });
    res.json({
        success: true,
        data: factlist
    });
});
router.get("/:id", async (req:any, res:any) => {
    const ref = db.collection("facts");
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let fact = doc.data() as Fact;
        if(fact.id==req.params.id){
            res.json({
                success: true,
                data: fact
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún Hecho con el ID'+req.params.id
    });
    
});

router.delete("/delete/:id",async (req:any, res:any) => {
    const ref = db.collection("facts").doc(req.params.id);
    ref.delete().then(response => { // Fact delete forever
        res.json({
            success: true,
            message: 'El Hecho ha sido eliminado definitivamente del sistema',
        })
    }).catch(e => { // error delete Fact forever
        res.json({
            success: false,
            message: 'Error al eliminar el Hecho'
        })
    });
});


module.exports = router;
