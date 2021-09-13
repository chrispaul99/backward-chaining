import { Fact } from './Fact';
import { Rule } from './Rule';
var pl = require("tau-prolog");
require("tau-prolog/modules/promises.js")(pl);
export class IA{
    constructor() {} //constructor
    async verificadorVerdad(oracion:string,hechos:Fact[],reglas:Rule[]):Promise<any[]>{
        let soluciones:any[]=[];
        const consulta = this.transformarCalculoPredicado(oracion,reglas);

        let reglasdata = this.transformarReglas(reglas);
        let hechosdata = this.transformarHechos(hechos);
       
        const program = `${reglasdata+hechosdata}`;
       
        console.log(program);
        const goal = this.transformarMeta(consulta.predicado,consulta.sujetos)+".";
        const session = pl.create();
        console.log(goal);
        if(goal!="(."){
            await session.promiseConsult(program).then(async ()=>{
                await session.promiseQuery(goal).catch((error:any)=>{soluciones.push("No puede entender lo que preguntaste")});
            }).catch((error:any)=>{ soluciones.push("No puede entender lo que preguntaste")});
            try{
                for await (let answer of session.promiseAnswers()){
                    soluciones.push(this.transformarLenguajeNatural(session.format_answer(answer),oracion,consulta));
                }
            }catch(err){
                console.log("hubo un error");
            }
        }else{
            soluciones.push("No puede entender lo que preguntaste");
        }
        if(soluciones.length==0){
            soluciones.push(this.transformarLenguajeNatural("false.",oracion,consulta));
        }
        return soluciones;
    }

    transformarMeta(predicado:String,sujetos:string[]):string{
        let goal = predicado.toLocaleLowerCase()+"(";
        for (let i = 0; i < sujetos.length; i++) {
            if(this.verificaracentos(sujetos[i])){
                sujetos[i]="'"+ sujetos[i]+"'";
            }
            goal+=sujetos[i];
            if(i+1!=sujetos.length){
                goal+=",";
            }else{
                goal+=")";
            }
        }
        return goal;
    }

    transformarHechos(hechos:Fact[]):string{
        let facts = "% hechos\n";
        for (let i = 0; i < hechos.length; i++) {
            facts+=this.transformarMeta(hechos[i].predicado,hechos[i].sujetos); 
            facts+=".\n";           
        }
        return facts;
    }
    transformarReglas(reglas:Rule[]):string{
        let rules = "% reglas\n";
        for (let i = 0; i < reglas.length; i++) {
            rules+=this.transformarMeta(reglas[i].conclusion.predicado,reglas[i].conclusion.sujetos)+":-";
            if(reglas[i].condiciones.length==0){
                rules+=this.transformarMeta(reglas[i].condiciones[0].predicado,reglas[i].condiciones[0].sujetos);
            }else{
                for (let j = 0; j < reglas[i].condiciones.length; j++) {
                    rules+=this.transformarMeta(reglas[i].condiciones[j].predicado,reglas[i].condiciones[j].sujetos);
                    if(j+1<=reglas[i].operadores.length){
                        rules+=this.transformarOperador(reglas[i].operadores[j]);
                    }
                }
                rules+=".\n";
            }          
        }
        return rules;
    }

    transformarOperador(op:string):string{
        switch(op){
            case "AND": return ",";
            case "OR": return ";";
            case "THEN":return "->";
            default : return "";
        }
    }

    transformarCalculoPredicado(oracion:string,reglas:Rule[]):Fact{
        let oracionPalabras = oracion.split(' ');
        let indice = -1;
        let goal:Fact = new Fact();
        switch(oracionPalabras.length){
            case 4:{
                indice = reglas.findIndex(e=>e.conclusion.predicado == oracionPalabras[2].toUpperCase());
                if(indice>-1){
                    goal.predicado = oracionPalabras[2];
                    if(oracionPalabras[1] == 'Quién' || oracionPalabras[1] == 'Quien' || oracionPalabras[1] == 'quién' || oracionPalabras[1] == 'quien'){
                      goal.sujetos.push('X');
                    }else{
                     goal.sujetos.push(oracionPalabras[1].toLowerCase());
                    }
                 }
                 break;  
            }
            case 5:{
                indice = reglas.findIndex(e=>e.conclusion.predicado == oracionPalabras[3].toUpperCase());
                if(indice>-1){
                   goal.predicado = oracionPalabras[3];
                   if(oracionPalabras[1] == 'Quién' || oracionPalabras[1] == 'Quien' || oracionPalabras[1] == 'quién' || oracionPalabras[1] == 'quien'){
                     goal.sujetos.push('X');
                   }else{
                    goal.sujetos.push(oracionPalabras[1].toLowerCase());
                   }
                }
                break;     
            }
            case 7:{
                indice = reglas.findIndex(e=>e.conclusion.predicado == oracionPalabras[3].toUpperCase() || e.conclusion.predicado == oracionPalabras[4].toUpperCase());
                if(indice>-1){
                   goal.predicado = oracionPalabras[3];
                   if(oracionPalabras[1] == 'Quién' || oracionPalabras[1] == 'Quien' || oracionPalabras[1] == 'quién' || oracionPalabras[1] == 'quien'){
                    goal.sujetos.push('X');
                    let index = oracionPalabras.findIndex((e:any)=>e == "de");
                    if(index>-1){
                        if(oracionPalabras[index+1]=='Quién' || oracionPalabras[index+1]=='quién' || oracionPalabras[index+1]=='Quien' || oracionPalabras[index+1]=='quien'){
                            goal.sujetos.push("Y");
                        }else{
                            goal.sujetos.push(oracionPalabras[index+1].toLowerCase());
                        }
                       
                    }
                   }else{
                    if(oracionPalabras[2] == 'Quién' || oracionPalabras[2] == 'Quien' || oracionPalabras[2] == 'quién' || oracionPalabras[2] == 'quien'){
                        goal.predicado = oracionPalabras[4];
                        goal.sujetos.push(oracionPalabras[oracionPalabras.length-1-1].toLowerCase());
                        goal.sujetos.push('X');
                    }else{
                        goal.sujetos.push(oracionPalabras[1].toLowerCase());
                        let index = oracionPalabras.findIndex((e:any)=>e == "de");
                        if(index>-1){
                            if(oracionPalabras[index+1]=='Quién' || oracionPalabras[index+1]=='quién' || oracionPalabras[index+1]=='Quien' || oracionPalabras[index+1]=='quien'){
                                goal.sujetos.push("Y");
                            }else{
                                goal.sujetos.push(oracionPalabras[index+1].toLowerCase());
                            }
                        }
                    }
                   }
                }
                break;
            }
        }
        console.log(goal);
       return goal;
    }

    transformarLenguajeNatural(resp:any,oracion:string,meta:Fact):string{
       
        let respuesta:string = "No puede entender lo que preguntaste";
        let parseresp = resp.split(" ");
        let parseoracion = oracion.split(" ");
        parseoracion.splice(0,1);
        parseoracion.splice( parseoracion.length-1,1);
        if(parseresp[0]=='X' || parseresp[3]=="Y" || parseresp[0]=="Y"){
            if(parseresp[0]=='X'){
                if(parseoracion[0]!='De' && parseoracion[0]!='de' ){
                    parseoracion[0] = parseresp[2].split(".")[0]; 
                }else{
                    respuesta = parseoracion[parseoracion.length-1]+" "+parseoracion[2]+" "+parseoracion[3]+" "+parseoracion[0]+" "+parseresp[2].split(".")[0]; 
                    return respuesta;
                }
            }
            if(parseresp[3]=='Y'){
               
                parseoracion[4] = parseresp[5].split(".")[0]; 
            }
            if(parseresp[0]=='Y'){
               
                parseoracion[4] = parseresp[2].split(".")[0]; 
            }
            respuesta = parseoracion.join(" ")+". ";
        }else{
            console.log(resp.split(" ")[0].split(".")[0].split(";")[0]);
            switch(resp.split(" ")[0].split(".")[0].split(";")[0]){
                case 'true':{
                    respuesta = "Verdadero, "+parseoracion.join(" ");
                    break;
                }
                case 'false':{
                    let indice = parseoracion.findIndex(e=>e == 'Quién' || e == 'quién' || e == 'Quien' || e == 'quien' );
                    if(indice==-1){
                        parseoracion.splice(1,0,'no');
                        respuesta = "Falso, "+parseoracion.join(" ");
                    }else{
                        respuesta = "No se encontró ninguna respuesta a tu pregunta";
                    }
                    break;
                }
            }
        }
        return respuesta;
    }
    verificaracentos(palabra:string):boolean{
        for (let i = 0; i < palabra.length; i++) {
            if(palabra[i] == 'ñ' || palabra[i] == 'Ñ' || palabra[i] == 'Á' || palabra[i] == 'É' || palabra[i] == 'Í' || palabra[i] == 'Ó' || palabra[i] == 'Ú' || palabra[i] == 'á' || palabra[i] == 'é' || palabra[i] == 'í' || palabra[i] == 'ó' || palabra[i] == 'ú'){
                return true;
            }
            
        }
        return false;
    }
}