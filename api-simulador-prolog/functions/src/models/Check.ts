import { Fact } from './Fact';
import { Rule } from './Rule';
export class Check{
    constructor() {} //constructor
    verificadorVerdad(predicado:string,sujetos:string[],hechos:Fact[],reglas:Rule[]):Fact[]{
        let hechoscondiciones:Fact[][]=[];
        let finales:Fact[]=[];
        console.log("**********************************");
        console.log(sujetos);
        console.log("**********************************");
        console.log(predicado);
        console.log("**********************************");
        let pos = reglas.findIndex(e=>e.conclusion.predicado==predicado && e.conclusion.sujetos.length==sujetos.length);
        if(pos>-1){
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
            console.log(variablesigualadas);
            //verifico si los sujetos son constantes o variables
            if(this.verificarsujetos(sujetos)){
                 
                //reemplazar variables en condiciones 

                for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if(conclusion.condiciones[i].sujetos[j] == variablesigualadas[i][0]){
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[i][1];
                        }
                        
                    }
                    
                }
                console.log(conclusion.condiciones);

                //envio a consultar si la condicion es un hecho
                for (var cond of conclusion.condiciones) {
                    let hechosvalidados:Fact[]=[];
                    //console.log(cond);
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                        console.log(hechosvalidados);
                    }
                    hechoscondiciones.push(hechosvalidados);  
                    console.log("*********************************");
                    console.log(hechoscondiciones);
                }
                if(hechoscondiciones.length==0){
                    return [];
                }else{
                    //console.log(variablesigualadas);
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
                    }else{
                        
                        for (const op of  conclusion.operadores) {
                            if(op=="OR"){
                                return hechoscondiciones[0];
                            }else{
                                if(op=="AND"){
                                    let aux = hechoscondiciones[0];
                                    for (let index = 1; index < hechoscondiciones.length; index++) {
                                        for (let j = 0; j < hechoscondiciones[index].length; j++) {
                                            for (let k = 0; k < hechoscondiciones[index][j].sujetos.length; k++) {
                                                if(aux[j].sujetos[k]==hechoscondiciones[index][j].sujetos[k]){
                                                   finales.push(hechoscondiciones[index][j]);
                                                }
                                            }
                                        }
                                }
                               
                            }
                        }
                    
                        }
                        
                    }
                }
                 //console.log(conclusion.condiciones);
            }else{
                
                //Existe al menos 1 variable en la conclusion ingresada
                variablesigualadas.sort();
                for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if(conclusion.condiciones[i].sujetos[j] == variablesigualadas[j][0]){
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[j][1];
                        }
                        
                    }
                    
                } 
                console.log(conclusion.condiciones);               
                //envio a consultar si la condicion es un hecho
                for (const cond of conclusion.condiciones) {
                    let hechosvalidados:Fact[]=[];
                    hechosvalidados = this.verificarHecho(cond,hechos);
                    console.log("**********************************");
                    console.log(hechosvalidados);
                    if(hechosvalidados.length==0){
                        //Tenemos que aplicar recursividad
                        hechosvalidados=this.verificadorVerdad(cond.predicado,cond.sujetos,hechos,reglas);
                    }
                    hechoscondiciones.push(hechosvalidados);
                }
                if(hechoscondiciones.length==0){
                    return [];
                }else{
                    //console.log(variablesigualadas);
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
                        console.log(variablesigualadas);
                        for (let k = 0; k < conclusion.conclusion.sujetos.length; k++) {
                            for (let i = 0; i < variablesigualadas.length; i++) {
                                if(variablesigualadas[i][0]==conclusion.conclusion.sujetos[k]){
                                    conclusion.conclusion.sujetos[k]=variablesigualadas[i][1];
                                }     
                            }
                            
                        }
                        console.log(conclusion.conclusion);
                        console.log("********************************");
                        finales.push(conclusion.conclusion);
                    }else{
                        let finales:Fact[]=[];
                        for (const op of  conclusion.operadores) {
                            if(op=="OR"){
                                return hechoscondiciones[0];
                            }else{
                                if(op=="AND"){
                                    let aux = hechoscondiciones[0];
                                    for (let index = 1; index < hechoscondiciones.length; index++) {
                                        for (let j = 0; j < hechoscondiciones[index].length; j++) {
                                            for (let k = 0; k < hechoscondiciones[index][j].sujetos.length; k++) {
                                                if(aux[j].sujetos[k]==hechoscondiciones[index][j].sujetos[k]){
                                                   finales.push(hechoscondiciones[index][j]);
                                                }
                                            }
                                        }
                                }
                               
                            }
                        }
                    
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
                return false;
            }
        }else{
            return false;
        }
    }
}