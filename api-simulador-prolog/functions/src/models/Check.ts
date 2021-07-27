export class Check{
    constructor() {} //constructor
    /*cumplimiento(predicado, sujetos, hechos, reglas) {
        var resultado = false;
        for (const r of reglas) {
            if (r.predicado == predicado) {
                if (r.condicion != 0) {
                    let reglaencontrada = reglas.find(element => element.id == r.condicion);
                    resultado = this.cumplimiento(reglaencontrada.predicado, sujetos, hechos, reglas);
                    for (const done of hechos) {
                        for (const s of sujetos) {
                            if (done.predicado == r.predicado) {
                                if (done.sujetos.find(element => element = s)) {
                                    this.imprimir(done.sujetos, predicado);
                                    resultado = true;
                                    break;
                                } else {
                                    for (var i = 0; i < done.sujetos.length(); i++) {
                                        if (done.sujetos[i] != s) {
                                            const definicion = s + "=" + done.sujetos[i] + "\n";
                                            console.log(definicion);
                                            const aux = [];
                                            aux.push(done.sujetos[i]);
                                            this.imprimir(aux, predicado);
                                            console.log("****************************\n");
                                            resultado = true;
                                            break;
                                        }
                                    }
                                }

                            }
                        }
                    }
                } else {
                    for (const done of hechos) {
                        for (const s of sujetos) {
                            if (done.predicado == r.predicado) {
                                if (done.sujetos.find(element => element = s)) {
                                    this.imprimir(done.sujetos, predicado);
                                    resultado = true;
                                    break;
                                } else {
                                    for (var i = 0; i < done.sujetos.length(); i++) {
                                        if (done.sujetos[i] != s) {
                                            const definicion = s + "=" + done.sujetos[i] + "\n";
                                            console.log(definicion);
                                            const aux = [];
                                            aux.push(done.sujetos[i]);
                                            this.imprimir(aux, predicado);
                                            console.log("****************************\n");
                                            resultado = true;
                                            break;
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        if (resultado)
            console.log("VERDADERO");
        else
            console.log("FALSO");
        return resultado;
    }*/
    imprimir(sujetos:string[], predicado:string):string {
        var oracion = "";
        oracion += predicado + " " + sujetos;
        return oracion;
    }
}