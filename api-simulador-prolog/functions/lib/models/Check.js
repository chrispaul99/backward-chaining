"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Check = void 0;
class Check {
    constructor() { } //constructor
    verificadorVerdad(predicado, sujetos, hechos, reglas) {
        let hechoscondiciones = [];
        let pos = reglas.findIndex(e => e.conclusion.predicado == predicado && e.conclusion.sujetos.length == sujetos.length);
        if (pos > -1) {
            //Se encontro una conclusion en las reglas
            let conclusion = reglas[pos];
            //obtengo las incognitas de la regla
            let incognitas = this.obtenerIncognitas(conclusion);
            //console.log(incognitas);
            //verifico si los sujetos son constantes o variables
            if (this.verificarsujetos(sujetos)) {
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
                //reemplazar variables en condiciones 
                for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if (conclusion.condiciones[i].sujetos[j] == variablesigualadas[i][0]) {
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[i][1];
                        }
                    }
                }
                //envio a consultar si la condicion es un hecho
                for (const cond of conclusion.condiciones) {
                    let hechosvalidados = [];
                    //console.log(cond);
                    hechosvalidados = this.verificarHecho(cond, hechos);
                    if (hechosvalidados.length == 0) {
                        //Tenemos que aplicar recursividad
                        hechosvalidados = this.verificadorVerdad(cond.predicado, cond.sujetos, hechos, reglas);
                    }
                    hechoscondiciones.push(hechosvalidados);
                }
                if (hechoscondiciones.length == 0) {
                    return [];
                }
                else {
                    if (hechoscondiciones.length == 1) {
                        console.log(variablesigualadas);
                        for (let j = 0; j < conclusion.condiciones.length; j++) {
                            for (let index = 0; index < hechoscondiciones.length; index++) {
                                console.log(hechoscondiciones[0]);
                            }
                        }
                        console.log(conclusion.conclusion);
                        return hechoscondiciones[0];
                    }
                    else {
                        console.log(hechoscondiciones);
                        // Si existe más hechos;
                    }
                }
                //console.log(conclusion.condiciones);
            }
            else {
                //Existe al menos 1 variable en la conclusion ingresada
                let variablesigualadas = [];
                for (let index = 0; index < conclusion.conclusion.sujetos.length; index++) {
                    variablesigualadas.push([conclusion.conclusion.sujetos[index], sujetos[index]]);
                }
                variablesigualadas.sort();
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
                for (let i = 0; i < conclusion.condiciones.length; i++) {
                    for (let j = 0; j < conclusion.condiciones[i].sujetos.length; j++) {
                        if (conclusion.condiciones[i].sujetos[j] == variablesigualadas[j][0]) {
                            conclusion.condiciones[i].sujetos[j] = variablesigualadas[j][1];
                        }
                    }
                }
                //envio a consultar si la condicion es un hecho
                for (const cond of conclusion.condiciones) {
                    let hechosvalidados = [];
                    hechosvalidados = this.verificarHecho(cond, hechos);
                    if (hechosvalidados.length == 0) {
                        //Tenemos que aplicar recursividad
                        hechosvalidados = this.verificadorVerdad(cond.predicado, cond.sujetos, hechos, reglas);
                    }
                    hechoscondiciones.push(hechosvalidados);
                }
                if (hechoscondiciones.length == 0) {
                    return [];
                }
                else {
                    console.log(variablesigualadas);
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
                        return conclusion.conclusion;
                    }
                    else {
                        console.log(hechoscondiciones);
                        // Si existe más hechos;
                    }
                }
            }
            return [];
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
        if (sujetos.length == datos.length) {
            for (let index = 0; index < sujetos.length; index++) {
                if (sujetos[index] == datos[index]) {
                    cont++;
                }
            }
            if (cont >= 1) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
exports.Check = Check;
//# sourceMappingURL=Check.js.map