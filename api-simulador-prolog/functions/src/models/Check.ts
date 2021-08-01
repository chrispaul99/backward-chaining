import { Fact } from './Fact';
import { Rule } from './Rule';
export class Check{
    constructor() {} //constructor
    verificadorVerdad(predicado:string,sujetos:string[],hechos:Fact[],reglas:Rule[]):Fact[]{
        let hechoscondiciones:Fact[][]=[];
        let finales:Fact[]=[];
        console.log("************PREDICADO***************");
        console.log(predicado);
        console.log("************SUJETOS***************");
        console.log(sujetos);
        let pos = reglas.findIndex(e=>e.conclusion.predicado==predicado && e.conclusion.sujetos.length==sujetos.length);
        if(pos>-1){
            console.log("************SI EXISTE UNA CONCLUSION***************");
            //Se encontro una conclusion en las reglas
            let conclusion = reglas[pos];
            //obtengo las incognitas de la regla
            let incognitas = this.obtenerIncognitas(conclusion);
            
            //igualo las incognitas
            //crear matriz con incognita y su equivalencia
            let variablesigualadas:string[][]=[];
                 
                 for (let index = 0; index < conclusion.conclusion.sujetos.length; index++) {
                     variablesigualadas.push([conclusion.conclusion.sujetos[index],sujetos[index]]);
                     
                 }
                

            //verifico que variable me falta
            incognitas.forEach(el=>{
                let cont=0;
                for (let index = 0; index < variablesigualadas.length; index++) {
                    if(el==variablesigualadas[index][0]){
                       cont++
                    }
                }
                if(cont==0){
                    variablesigualadas.push([el,"I"]);
                }

                
            });
            console.log("************IGUALDAD DE VARIABLES***************");
            console.log(variablesigualadas);
            //verifico si los sujetos son constantes o variables
            if(this.verificarsujetos(sujetos)){
                 
                console.log("************SOMOS SUJETOS***************");
                //reemplazar variables en condiciones 
                //Igualar condiciones
                conclusion.condiciones = this.igualarcondiciones(conclusion.condiciones,variablesigualadas);
                
                console.log("************LAS CONDICIONES IGUALADAS SON***************");
                console.log(conclusion.condiciones);
                
                //envio a consultar si la condicion es un hecho
                console.log("************VERIFICACION DE HECHOS***************");
                for (let cond of conclusion.condiciones) {
                    console.log("************ESTOY EVALUANDO***************");
                    console.log(cond.predicado);
                    let hechosvalidados:Fact[]=[];
                    //console.log(cond);
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    console.log(hechosvalidados);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        console.log("************NECESITAMOS VERIFICAR SI EXISTE UN CONCLUSION CON ESA CONDICION***************");
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                        if(hechosvalidados.length==0){
                            console.log("************NO SE PUDO VALIDAR LA TESIS***************");
                            return [];
                        }
                    }
                    hechoscondiciones.push(hechosvalidados); 
                }
                if(hechoscondiciones.length==0){
                    return [];
                }else{
                     //Solo tiene una condicion con hechos
                    if(hechoscondiciones.length==1){
                        for (let j = 0; j < conclusion.condiciones.length; j++) {
                            for (let index = 0; index <conclusion.condiciones[j].sujetos.length; index++) {
                                conclusion.condiciones[j].sujetos[index]=hechoscondiciones[0][0].sujetos[index];
                            }
                        }
                        for (let index = 0; index < conclusion.condiciones.length; index++) {
                            for (let i = 0; i < variablesigualadas.length; i++) {
                                variablesigualadas[i][1]=conclusion.condiciones[index].sujetos[i];
                                
                            } 
                        }
                        for (let k = 0; k < conclusion.conclusion.sujetos.length; k++) {
                            for (let i = 0; i < variablesigualadas.length; i++) {
                                if(variablesigualadas[i][0]==conclusion.conclusion.sujetos[k]){
                                    conclusion.conclusion.sujetos[k]=variablesigualadas[i][1];
                                }     
                            } 
                        }
                        finales = hechoscondiciones[0];
                    }else{
                        // validar condiciones
                        let validaciones:Fact[]=[];
                        for (let index = 0; index < conclusion.condiciones.length; index++) {
                            validaciones.push(this.validarcondiciones(index,0,hechoscondiciones,conclusion.condiciones[index]));
                            
                        }
                        let verdades:boolean[]=[];
                        for (let index = 0; index < validaciones.length; index++) {
                            if(validaciones[index].sujetos.length>0){
                                verdades.push(true);
                            }else{
                                verdades.push(false);
                            }
                        }
                        let oracionfinal = [];
                        let op = 0;
                        for (const v of verdades) {
                            oracionfinal.push(v);
                            if(op<conclusion.operadores.length){
                                oracionfinal.push(conclusion.operadores[op]);
                                op++;
                            }
                        }
                        console.log(oracionfinal);
                        let aux = oracionfinal[0] as boolean;
                        let cont=0;
                        let ban=false;
                        for(let i=0;i<oracionfinal.length;i=i+2){
                            let val = oracionfinal[i+2] as boolean;
                            switch(oracionfinal[i+1]){
                                case "AND":{;
                                    if(aux && val){
                                        cont++;
                                    }
                                    break;
                                }
                                case "0R":{
                                    if(aux||val){
                                        ban=true;
                                        break;
                                    }
                                    break;
                                }
                            }
                        }
                        console.log(cont);
                        if(!ban){
                            if(cont==conclusion.operadores.length){
                                ban=true;
                                finales=validaciones;
                            }
                        }else{
                            finales = validaciones;
                        }
                    }
                }
                 //console.log(conclusion.condiciones);
            }else{
                console.log("************TENEMOS INCOGNITAS***************");
                //Existe al menos 1 variable en la conclusion ingresada
                variablesigualadas.sort();
                //Igualar condiciones
                conclusion.condiciones = this.igualarcondiciones(conclusion.condiciones,variablesigualadas);


                console.log("************LAS CONDICIONES IGUALADAS SON***************");  
                console.log(conclusion.condiciones);           
                //envio a consultar si la condicion es un hecho
                console.log("************VERIFICACION DE HECHOS***************");
                for (let cond of conclusion.condiciones) {
                    let hechosvalidados:Fact[]=[];
                    console.log("************ESTOY VERIFICANDO***************");
                    console.log(cond.predicado);
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    console.log(hechosvalidados);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        console.log("************NECESITAMOS VERIFICAR SI EXISTE UN CONCLUSION CON ESA CONDICION***************");
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                        if(hechosvalidados.length==0){
                            console.log("************NO SE PUDO VALIDAR LA TESIS***************");
                            return [];
                        }
                    }
                    hechoscondiciones.push(hechosvalidados);
                }
                if(hechoscondiciones.length==0){
                    return [];
                }else{
                    console.log(hechoscondiciones);
                    //Solo tiene una condicion con hechos
                    if(hechoscondiciones.length==1){
                        console.log("SOLO TENEMOS UNA CONDICION");
                        let m=0;
                        let j=0;
                        let index=0;
                        let i = 0;
                        let k=0;
                        let l=0;
                        for (m = 0; m < hechoscondiciones[0].length; m++) {
                            for (j = 0; j < conclusion.condiciones.length; j++) {
                                for (index = 0; index <conclusion.condiciones[j].sujetos.length; index++) {
                                    conclusion.condiciones[j].sujetos[index]=hechoscondiciones[0][m].sujetos[index];
                                }
                            }
                            console.log("REEMPLAZO EN CONDICIONES");
                            for (index = 0; index < conclusion.condiciones.length; index++) {
                                for (i = 0; i < variablesigualadas.length; i++) {
                                    variablesigualadas[i][1]=conclusion.condiciones[index].sujetos[i];
                                }
                            }
                            console.log(conclusion.condiciones);
                            console.log("VERIFICACION CON CONCLUSION");
                            let cumplido:Fact = new Fact();
                            for (k = 0; k < conclusion.conclusion.sujetos.length; k++) {
                                for (l = 0; l < variablesigualadas.length; l++) {
                                    let posicion = conclusion.conclusion.sujetos.findIndex(e=>e==variablesigualadas[l][0]);
                                    if(posicion>-1){
                                        cumplido.predicado = conclusion.conclusion.predicado;
                                        cumplido.sujetos[posicion]=variablesigualadas[l][1];
                                       
                                    }
                                } 
                            }
                            //Verifica si se cumple la condicion
                            finales.push(cumplido);

                            
                        }
                       
                    }else{
                        let validaciones:Fact[]=[];
                        for (let index = 0; index < conclusion.condiciones.length; index++) {
                            validaciones.push(this.validarcondiciones(index,0,hechoscondiciones,conclusion.condiciones[index]));
                            
                        }
                        let verdades:boolean[]=[];
                        for (let index = 0; index < validaciones.length; index++) {
                            if(validaciones[index].sujetos.length>0){
                                verdades.push(true);
                            }else{
                                verdades.push(false);
                            }
                        }
                        let oracionfinal = [];
                        let op = 0;
                        for (const v of verdades) {
                            oracionfinal.push(v);
                            if(op<conclusion.operadores.length){
                                oracionfinal.push(conclusion.operadores[op]);
                                op++;
                            }
                        }
                        console.log(oracionfinal);
                        let aux = oracionfinal[0] as boolean;
                        let cont=0;
                        let ban=false;
                        for(let i=0;i<oracionfinal.length;i=i+2){
                            let val = oracionfinal[i+2] as boolean;
                            switch(oracionfinal[i+1]){
                                case "AND":{;
                                    if(aux && val){
                                        cont++;
                                    }
                                    break;
                                }
                                case "0R":{
                                    if(aux||val){
                                        ban=true;
                                        break;
                                    }
                                    break;
                                }
                            }
                        }
                        console.log(cont);
                        if(!ban){
                            if(cont==conclusion.operadores.length){
                                ban=true;
                                finales=validaciones;
                            }
                        }else{
                            finales = validaciones;
                        }
                    }
                   
                }
            }
            return finales;
        }else{
            return [];
        }

    }

    obtenerIncognitas(conclusion:Rule):string[]{
        let incognitas:string[] = [];
        conclusion.condiciones.forEach(condicion=> {
            condicion.sujetos.forEach(sujeto => {
                if(!incognitas.includes(sujeto)){
                    incognitas.push(sujeto);
                }
            });
        });
        return incognitas;
    }

    verificarsujetos(sujetos:string[]):boolean{
        let ban=true;
        sujetos.forEach(s => {
            if(s == s.toUpperCase()){
                ban=false;
            }  
        });
        return ban;
    }

    verificarHecho(h:Fact,hechos:Fact[]):Fact[]{
        let hechosbd:Fact[]=[];
        for (const item of hechos) {
            if(h.predicado==item.predicado && this.validacionsujetohecho(item.sujetos,h.sujetos)){
                hechosbd.push(item);
            }
        }
        return hechosbd;

    }

    validacionsujetohecho(sujetos:string[],datos:string[]):boolean{
        let cont=0;
        if(sujetos.length==datos.length){
            for (let index = 0; index < sujetos.length; index++) {
                if(sujetos[index]==datos[index]){
                    cont++;
                }
                
            }
            if(cont>=1){
                return true;
            }
            else{
                for(let s=0;s<datos.length;s++){
                    if(datos[s]==datos[s].toUpperCase()){
                        return true;
                    }
                }
                return false;
            }
        }else{
            return false;
        }
    }

    validarcondiciones(icondi:number,ihecho:number,hechos:Fact[][],condicion:Fact):Fact{
        let pos = -1;
        let hechofinal:Fact = new Fact();
        for (let n = 0; n < hechos[icondi][ihecho].sujetos.length; n++) {
            pos=hechos[icondi][ihecho].sujetos.findIndex(e=>e==condicion.sujetos[n]);
            if(pos>-1){
                hechofinal = hechos[icondi][ihecho];
                break;
            }else{
                if(ihecho<hechos[icondi].length-1){
                    hechofinal = this.validarcondiciones(icondi,ihecho+1,hechos,condicion);
                }
                
            }
        }
        return hechofinal;
    }

    igualarcondiciones(condiciones:Fact[],variablesigualadas:string[][]):Fact[]{
        for (let i = 0; i < condiciones.length; i++) {
            for (let j = 0; j < condiciones[i].sujetos.length; j++) {
                if(condiciones[i].sujetos[j] == variablesigualadas[i][0]){
                    condiciones[i].sujetos[j] = variablesigualadas[i][1];
                }
            }
        }
        return condiciones;
    }
}