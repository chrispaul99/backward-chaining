"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
const Fact_1 = require("./Fact");
class Check {
    constructor() { } //constructor
    verificadorVerdad(predicado, sujetos, hechos, reglas, visitados) {
        let hechoscondiciones = [];
        let finales = [];
        let posiblesconclusiones = [];
        let verdades = [];
        console.log("************PREDICADO***************");
        console.log(predicado);
        console.log("************SUJETOS***************");
        console.log(sujetos);
        posiblesconclusiones = this.consultarconclusion(reglas, predicado, sujetos);
        if (posiblesconclusiones.length > 0) {
            console.log("************SI EXISTE UNA CONCLUSION***************");
            //Se encontro una conclusion en las reglas
            for (const regla of posiblesconclusiones) {
                console.log(posiblesconclusiones[0].condiciones);
                let conclusion = regla;
                if (!this.verificarconclusionconsultada(conclusion, visitados)) {
                    visitados.push(conclusion);
                    console.log(conclusion);
                    //obtengo las incognitas de la regla
                    let incognitas = this.obtenerIncognitas(conclusion);
                    //igualo las incognitas
                    //crear matriz con incognita y su equivalencia
                    let variablesigualadas = [];
                    for (let index = 0; index < conclusion.conclusion.sujetos.length; index++) {
                        variablesigualadas.push([conclusion.conclusion.sujetos[index], sujetos[index]]);
                    }
                    //verifico que variable me falta
                    incognitas.forEach(el => {
                        let cont = 0;
                        for (let index = 0; index < variablesigualadas.length; index++) {
                            if (el == variablesigualadas[index][0]) {
                                cont++;
                            }
                        }
                        if (cont == 0) {
                            variablesigualadas.push([el, "I"]);
                        }
                    });
                    console.log("************IGUALDAD DE VARIABLES***************");
                    console.log(variablesigualadas);
                    //verifico si los sujetos son constantes o variables
                    if (this.verificarsujetos(sujetos)) {
                        console.log("************SOMOS SUJETOS***************");
                        //reemplazar variables en condiciones 
                        //Igualar condiciones
                        conclusion.condiciones = this.igualarcondiciones(conclusion.condiciones, variablesigualadas);
                        console.log("************LAS CONDICIONES IGUALADAS SON***************");
                        console.log(conclusion.condiciones);
                        //envio a consultar si la condicion es un hecho
                        console.log("************VERIFICACION DE HECHOS***************");
                        for (let cond of conclusion.condiciones) {
                            console.log("************ESTOY EVALUANDO***************");
                            console.log(cond.predicado);
                            let hechosvalidados = [];
                            //console.log(cond);
                            hechosvalidados = this.verificarHecho(cond, hechos);
                            console.log(hechosvalidados);
                            if (hechosvalidados.length == 0) {
                                //Tenemos que aplicar recursividad
                                console.log("************NECESITAMOS VERIFICAR SI EXISTE UN CONCLUSION CON ESA CONDICION***************");
                                hechosvalidados = this.verificadorVerdad(cond.predicado, cond.sujetos, hechos, reglas, visitados);
                                if (hechosvalidados.length == 0) {
                                    console.log("************NO SE PUDO VALIDAR LA TESIS***************");
                                    break;
                                }
                            }
                            hechoscondiciones.push(hechosvalidados);
                        }
                        if (hechoscondiciones.length == 0) {
                            finales = [];
                        }
                        else {
                            //Solo tiene una condicion con hechos
                            if (hechoscondiciones.length == 1) {
                                for (let j = 0; j < conclusion.condiciones.length; j++) {
                                    for (let index = 0; index < conclusion.condiciones[j].sujetos.length; index++) {
                                        conclusion.condiciones[j].sujetos[index] = hechoscondiciones[0][0].sujetos[index];
                                    }
                                }
                                for (let index = 0; index < conclusion.condiciones.length; index++) {
                                    for (let i = 0; i < variablesigualadas.length; i++) {
                                        variablesigualadas[i][1] = conclusion.condiciones[index].sujetos[i];
                                    }
                                }
                                for (let k = 0; k < conclusion.conclusion.sujetos.length; k++) {
                                    for (let i = 0; i < variablesigualadas.length; i++) {
                                        if (variablesigualadas[i][0] == conclusion.conclusion.sujetos[k]) {
                                            conclusion.conclusion.sujetos[k] = variablesigualadas[i][1];
                                        }
                                    }
                                }
                                finales = hechoscondiciones[0];
                            }
                            else {
                                // validar condiciones
                                let validaciones = [];
                                for (let index = 0; index < conclusion.condiciones.length; index++) {
                                    validaciones.push(this.validarcondiciones(index, 0, hechoscondiciones, conclusion.condiciones[index]));
                                }
                                for (let index = 0; index < validaciones.length; index++) {
                                    if (validaciones[index].sujetos.length > 0) {
                                        verdades.push(true);
                                    }
                                    else {
                                        verdades.push(false);
                                    }
                                }
                                let oracionfinal = [];
                                let op = 0;
                                for (const v of verdades) {
                                    oracionfinal.push(v);
                                    if (op < conclusion.operadores.length) {
                                        oracionfinal.push(conclusion.operadores[op]);
                                        op++;
                                    }
                                }
                                console.log(oracionfinal);
                                let aux = oracionfinal[0];
                                let cont = 0;
                                let ban = false;
                                for (let i = 0; i < oracionfinal.length; i = i + 2) {
                                    let val = oracionfinal[i + 2];
                                    switch (oracionfinal[i + 1]) {
                                        case "AND": {
                                            ;
                                            if (aux && val) {
                                                cont++;
                                            }
                                            break;
                                        }
                                        case "0R": {
                                            if (aux || val) {
                                                ban = true;
                                                break;
                                            }
                                            break;
                                        }
                                    }
                                }
                                console.log(cont);
                                if (!ban) {
                                    if (cont == conclusion.operadores.length) {
                                        ban = true;
                                        finales.push(this.reemplazoconclusion(validaciones, conclusion));
                                    }
                                }
                                else {
                                    finales.push(this.reemplazoconclusion(validaciones, conclusion));
                                }
                            }
                            if (finales.length > 0) {
                                break;
                            }
                        }
                        //console.log(conclusion.condiciones);
                    }
                    else {
                        console.log("************TENEMOS INCOGNITAS***************");
                        //Existe al menos 1 variable en la conclusion ingresada
                        variablesigualadas.sort();
                        //Igualar condiciones
                        conclusion.condiciones = this.igualarcondiciones(conclusion.condiciones, variablesigualadas);
                        console.log("************LAS CONDICIONES IGUALADAS SON***************");
                        console.log(conclusion.condiciones);
                        //envio a consultar si la condicion es un hecho
                        console.log("************VERIFICACION DE HECHOS***************");
                        for (let cond of conclusion.condiciones) {
                            let hechosvalidados = [];
                            console.log("************ESTOY VERIFICANDO***************");
                            console.log(cond.predicado);
                            hechosvalidados = this.verificarHecho(cond, hechos);
                            if (hechosvalidados.length == 0) {
                                //Tenemos que aplicar recursividad
                                console.log("************NECESITAMOS VERIFICAR SI EXISTE UN CONCLUSION CON ESA CONDICION***************");
                                hechosvalidados = this.verificadorVerdad(cond.predicado, cond.sujetos, hechos, reglas, visitados);
                                if (hechosvalidados.length == 0) {
                                    console.log("************NO SE PUDO VALIDAR LA TESIS***************");
                                    break;
                                }
                            }
                            hechoscondiciones.push(hechosvalidados);
                        }
                        if (hechoscondiciones.length == 0) {
                            finales = [];
                        }
                        else {
                            //console.log(hechoscondiciones);
                            //Solo tiene una condicion con hechos
                            if (hechoscondiciones.length == 1) {
                                console.log("SOLO TENEMOS UNA CONDICION");
                                let m = 0;
                                let j = 0;
                                let index = 0;
                                let i = 0;
                                let k = 0;
                                let l = 0;
                                for (m = 0; m < hechoscondiciones[0].length; m++) {
                                    for (j = 0; j < conclusion.condiciones.length; j++) {
                                        for (index = 0; index < conclusion.condiciones[j].sujetos.length; index++) {
                                            conclusion.condiciones[j].sujetos[index] = hechoscondiciones[0][m].sujetos[index];
                                        }
                                    }
                                    console.log("REEMPLAZO EN CONDICIONES");
                                    for (index = 0; index < conclusion.condiciones.length; index++) {
                                        for (i = 0; i < variablesigualadas.length; i++) {
                                            variablesigualadas[i][1] = conclusion.condiciones[index].sujetos[i];
                                        }
                                    }
                                    console.log(conclusion.condiciones);
                                    console.log("VERIFICACION CON CONCLUSION");
                                    let cumplido = new Fact_1.Fact();
                                    for (k = 0; k < conclusion.conclusion.sujetos.length; k++) {
                                        for (l = 0; l < variablesigualadas.length; l++) {
                                            let posicion = conclusion.conclusion.sujetos.findIndex(e => e == variablesigualadas[l][0]);
                                            if (posicion > -1) {
                                                cumplido.predicado = conclusion.conclusion.predicado;
                                                cumplido.sujetos[posicion] = variablesigualadas[l][1];
                                            }
                                        }
                                    }
                                    //Verifica si se cumple la condicion
                                    finales.push(cumplido);
                                }
                            }
                            else {
                                let validaciones = [];
                                for (let index = 0; index < conclusion.condiciones.length; index++) {
                                    validaciones.push(this.validarcondiciones(index, 0, hechoscondiciones, conclusion.condiciones[index]));
                                }
                                console.log(validaciones);
                                for (let index = 0; index < validaciones.length; index++) {
                                    if (validaciones[index].sujetos.length > 0) {
                                        verdades.push(true);
                                    }
                                    else {
                                        verdades.push(false);
                                    }
                                }
                                let oracionfinal = [];
                                let op = 0;
                                for (const v of verdades) {
                                    oracionfinal.push(v);
                                    if (op < conclusion.operadores.length) {
                                        oracionfinal.push(conclusion.operadores[op]);
                                        op++;
                                    }
                                }
                                console.log(oracionfinal);
                                let aux = oracionfinal[0];
                                let cont = 0;
                                let ban = false;
                                for (let i = 0; i < oracionfinal.length; i = i + 2) {
                                    let val = oracionfinal[i + 2];
                                    switch (oracionfinal[i + 1]) {
                                        case "AND": {
                                            ;
                                            if (aux && val) {
                                                cont++;
                                            }
                                            break;
                                        }
                                        case "0R": {
                                            if (aux || val) {
                                                ban = true;
                                                break;
                                            }
                                            break;
                                        }
                                    }
                                }
                                console.log(cont);
                                if (!ban) {
                                    if (cont == conclusion.operadores.length) {
                                        ban = true;
                                        finales.push(this.reemplazoconclusion(validaciones, conclusion));
                                    }
                                }
                                else {
                                    finales.push(this.reemplazoconclusion(validaciones, conclusion));
                                }
                            }
                        }
                    }
                    hechoscondiciones = [];
                }
            }
            return finales;
        }
        else {
            return [];
        }
    }
    obtenerIncognitas(conclusion) {
        let incognitas = [];
        conclusion.condiciones.forEach(condicion => {
            condicion.sujetos.forEach(sujeto => {
                if (!incognitas.includes(sujeto)) {
                    incognitas.push(sujeto);
                }
            });
        });
        return incognitas;
    }
    verificarsujetos(sujetos) {
        let ban = true;
        sujetos.forEach(s => {
            if (s == s.toUpperCase()) {
                ban = false;
            }
        });
        return ban;
    }
    verificarHecho(h, hechos) {
        let hechosbd = [];
        for (const item of hechos) {
            if (h.predicado == item.predicado && this.validacionsujetohecho(item.sujetos, h.sujetos)) {
                hechosbd.push(item);
            }
        }
        return hechosbd;
    }
    validacionsujetohecho(sujetos, datos) {
        let cont = 0;
        console.log("************************");
        console.log(sujetos);
        console.log("************************");
        console.log(datos);
        if (sujetos.length == datos.length) {
            for (let index = 0; index < sujetos.length; index++) {
                if (sujetos[index] == datos[index]) {
                    cont++;
                }
            }
            if (this.verificarsujetos(datos)) {
                if (cont == datos.length) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                let sum = 0;
                for (let index = 0; index < datos.length; index++) {
                    if (datos[index] == datos[index].toUpperCase()) {
                        sum++;
                    }
                }
                if (sum == datos.length) {
                    console.log("entre");
                    //todo el sujeto recibido son Variables
                    return true;
                }
                else {
                    let pos = datos.findIndex(e => e.toUpperCase() != e);
                    if (pos > -1) {
                        //existe sujetos
                        for (let s = 0; s < datos.length; s++) {
                            if (datos[pos] == sujetos[pos]) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }
        }
        else {
            return false;
        }
    }
    consultarconclusion(reglas, predicado, sujetos) {
        let posconclu = [];
        reglas.forEach(element => {
            if (element.conclusion.predicado == predicado && sujetos.length == element.conclusion.sujetos.length) {
                posconclu.push(element);
            }
        });
        return posconclu;
    }
    validarcondiciones(icondi, ihecho, hechos, condicion) {
        let pos = -1;
        let hechofinal = new Fact_1.Fact();
        console.log(condicion);
        let sum = 0;
        for (let n = 0; n < hechos[icondi][ihecho].sujetos.length; n++) {
            pos = hechos[icondi][ihecho].sujetos.findIndex(e => e == condicion.sujetos[n]);
            if (pos > -1) {
                hechofinal = hechos[icondi][ihecho];
                break;
            }
            else {
                console.log(condicion.sujetos[n]);
                if (condicion.sujetos[n] == condicion.sujetos[n].toUpperCase()) {
                    sum++;
                    //variable
                }
                if (sum == condicion.sujetos.length) {
                    hechofinal = hechos[icondi][ihecho];
                    break;
                }
            }
        }
        return hechofinal;
    }
    igualarcondiciones(condiciones, variablesigualadas) {
        for (let i = 0; i < condiciones.length; i++) {
            for (let j = 0; j < condiciones[i].sujetos.length; j++) {
                console.log(condiciones[i].sujetos[j]);
                console.log(variablesigualadas[i][0]);
                if (condiciones[i].sujetos[j] == variablesigualadas[j][0]) {
                    condiciones[i].sujetos[j] = variablesigualadas[j][1];
                }
            }
        }
        return condiciones;
    }
    reemplazoconclusion(validaciones, conclusion) {
        let variables = [];
        for (let index = 0; index < validaciones.length; index++) {
            for (let j = 0; j < conclusion.condiciones[index].sujetos.length; j++) {
                let variable = [];
                variable.push(conclusion.condiciones[index].sujetos[j]);
                variable.push(validaciones[index].sujetos[j]);
                variables.push(variable);
            }
        }
        for (let i = 0; i < variables.length; i++) {
            conclusion.conclusion.sujetos[i] = variables[i][1];
        }
        let result = conclusion.conclusion.sujetos.filter((item, index) => {
            return conclusion.conclusion.sujetos.indexOf(item) === index;
        });
        conclusion.conclusion.sujetos = result;
        return conclusion.conclusion;
    }
    verificarconclusionconsultada(conclusion, rulesconsultadas) {
        let pos = rulesconsultadas.findIndex(e => e == conclusion);
        if (pos > -1) {
            return true;
        }
        return false;
    }
}
exports.Check = Check;
//# sourceMappingURL=Check.js.map