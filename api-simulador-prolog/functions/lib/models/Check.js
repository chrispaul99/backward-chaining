"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
class Check {
    constructor() { } //constructor
    verificadorVerdad(predicado, sujetos, hechos, reglas) {
        let solucionesposibles = [];
        //busco en las reglas si existe una conclusion
        let conclusion = reglas.find(element => element.conclusion.predicado == predicado && element.conclusion.sujetos.length == sujetos.length);
        if (conclusion != undefined) {
            // Si la regla existe se procede a obtener las variables de cada condicion
            let sujetoscondiciones = [];
            let predicadoscondiciones = [];
            for (const condicion of conclusion.condiciones) {
                sujetoscondiciones.push(condicion.sujetos);
                predicadoscondiciones.push(condicion.predicado);
            }
            let j = 0;
            for (const sujeto of conclusion.conclusion.sujetos) {
                for (const suj of sujetoscondiciones) {
                    if (suj.includes(sujeto)) {
                        let i = suj.findIndex(e => e == sujeto);
                        if (i > -1) {
                            suj[i] = sujetos[j];
                        }
                    }
                }
                j++;
            }
            //console.log(sujetoscondiciones);
            //console.log(predicadoscondiciones);
            let hechoscumplidos = [];
            j = 0;
            for (const pred of conclusion.condiciones) {
                let hechospredicado = [];
                if (this.verificarsujetos(sujetoscondiciones[j])) {
                    //Si no existe ninguna INCOGNITA
                    console.log("verificar sujetos");
                }
                else {
                    console.log("entre");
                    //Existe almenos 1 incognita
                    hechos.forEach(e => {
                        if (e.sujetos.length == sujetoscondiciones[j].length && e.predicado == pred.predicado) {
                            hechospredicado.push(e);
                        }
                    });
                    if (hechoscumplidos == []) {
                        //no existe algun hecho con la condicion dada
                        hechospredicado = this.verificadorVerdad(pred.predicado, sujetoscondiciones[j], hechos, reglas);
                    }
                }
                hechoscumplidos.push(hechospredicado);
                j++;
            }
            if (hechoscumplidos == []) {
                return [];
            }
            else {
                if (hechoscumplidos.length > 1) {
                    //Usar operadorea
                    /*let aux = hechoscumplidos[0];
                    hechoscumplidos.forEach(e=>{
                    if(e)
                });*/
                }
                else {
                    if (this.verificarsujetos(sujetoscondiciones[0])) {
                        // Si son sujetos
                    }
                    else {
                        solucionesposibles = hechoscumplidos[0];
                        // Son variables
                    }
                }
                console.log(solucionesposibles);
                return solucionesposibles;
            }
        }
        else {
            return [];
        }
        /*if(this.verificarsujetoiguales(consulta.sujetos)){
            
            if(conclusion!=undefined){
                if(conclusion.condiciones.length==1){
                    hechosconsultados = this.verificadorHecho(conclusion.condiciones[0],hechos,consulta.sujetos);
                    if(hechosconsultados.length==0){
                        hechosfinales=this.verificadorVerdad(conclusion.condiciones[0],hechos,reglas);
                    }else{
                        hechosfinales=hechosconsultados;
                    }
                }else{
                    let j=0;
                    for (const item of conclusion.condiciones) {
                        hechosconsultados = this.verificadorHecho(item,hechos,consulta.sujetos);
                        if(hechosconsultados.length==0){
                            if(conclusion.operadores[j]=="AND"){
                                hechosfinales=[];
                                break;
                            }else{
                                if(conclusion.operadores[j]=="OR"){
                                    hechosfinales=this.verificadorVerdad(item,hechos,reglas);
                                }
                            }
                        }else{
                            hechosfinales=this.verificadorVerdad(item,hechos,reglas);
                        }
                    }
                }
                
            }
        }*/
    }
    /*
    verificadorHecho(item:Fact,hechos:Fact[],sujetos:string[]):Fact[]{
        let h:Fact[] = [];
        let haux:Fact[]=[];
        hechos.forEach(element=>{
            if(element.predicado==item.predicado && item.sujetos.length==item.sujetos.length){
                h.push(element);
            }
        })
        if(h.length>0){
           let cont=[];
          
            for (let i= 0; i < sujetos.length; i++) {
                if(this.verificarsujeto(sujetos[i])){
                    for (let j = 0; j < h.length; j++) {
                        for(let k=0;k<h[j].sujetos.length;k++){
                            if(h[j].sujetos[k]==sujetos[i]){
                                cont.push(j);
                            }
                        }
                       
                    }
                }else{
                    for (let j = 0; j < h.length; j++) {
                        if(!this.existe(h[j],haux))
                            haux.push(h[j]);
                            
                    }
                }
            }
            for (let index = 0; index < cont.length; index++) {
                haux.push(h[cont[index]]);
            }
        }
        return haux;
    }
    */
    //Verificar si existe alguna incognita dentro de los sujetos de la conclusion recibida
    verificarsujetos(sujetos) {
        for (let index = 0; index < sujetos.length; index++) {
            let letra = sujetos[0].charAt(index);
            if (letra == letra.toUpperCase()) {
                return false;
            }
        }
        return true;
    }
}
exports.Check = Check;
//# sourceMappingURL=Check.js.map