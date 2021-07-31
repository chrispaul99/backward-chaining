import { Fact } from './Fact';
import { Rule } from './Rule';
export class Check{
    constructor() {} //constructor
    verificadorVerdad(predicado:string,sujetos:string[],hechos:Fact[],reglas:Rule[]):Fact[]{
        console.log(sujetos);
        let hechoscondiciones:Fact[][]=[];
        let pos = reglas.findIndex(e=>e.conclusion.predicado==predicado && e.conclusion.sujetos.length==sujetos.length);
        if(pos>-1){
            //Se encontro una conclusion en las reglas
            let conclusion = reglas[pos];

            //obtengo las incognitas de la regla
            let incognitas = this.obtenerIncognitas(conclusion);
            //console.log(incognitas);

            //verifico si los sujetos son constantes o variables
            if(this.verificarsujetos(sujetos)){
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
               
                //reemplazar variables en condiciones 

                for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if(conclusion.condiciones[i].sujetos[j] == variablesigualadas[i][0]){
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[i][1];
                        }
                        
                    }
                    
                }
                //envio a consultar si la condicion es un hecho
                for (const cond of conclusion.condiciones) {
                    let hechosvalidados:Fact[]=[];
                    //console.log(cond);
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                    }
                    hechoscondiciones.push(hechosvalidados);  
                }
                
                 //console.log(conclusion.condiciones);
            }else{
                
                //Existe al menos 1 variable en la conclusion ingresada
                let variablesigualadas:string[][]=[];
                for (let index = 0; index < conclusion.conclusion.sujetos.length; index++) {
                    variablesigualadas.push([conclusion.conclusion.sujetos[index],sujetos[index]]);
                    
                }
                variablesigualadas.sort();
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
                   for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if(conclusion.condiciones[i].sujetos[j] == variablesigualadas[i][0]){
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[i][1];
                        }
                        
                    }
                    
                }
                
                //envio a consultar si la condicion es un hecho
                for (const cond of conclusion.condiciones) {
                    let hechosvalidados:Fact[]=[];
                    console.log(cond);
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                    }
                    hechoscondiciones.push(hechosvalidados);
                }
            }
            return [];
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
                return false;
            }
        }else{
            return false;
        }
    }
}