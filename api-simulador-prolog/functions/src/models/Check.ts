import { Fact } from './Fact';
import { Rule } from './Rule';
export class Check{
    constructor() {} //constructor
    verificadorVerdad(consulta:Fact,hechos:Fact[],reglas:Rule[]):Fact[]{
        let hechosfinales:Fact[]=[];
        let conclusion= reglas.find(element=>element.conclusion.predicado==consulta.predicado && element.conclusion.sujetos.length==consulta.sujetos.length);
        if(conclusion!=undefined){
            let j=0;
            for (const item of conclusion.condiciones) {
                let hecho = this.verificadorHecho(item,hechos,consulta.sujetos);
                if(hecho!=undefined){
                    hechosfinales.push(hecho);
                }
                else{
                    hechosfinales.push(hecho)
                    if(conclusion.condiciones.length<2)
                        hechosfinales=this.verificadorVerdad(item,hechos,reglas);
                    else{
                        if(conclusion.operadores[j]=="AND"){
                            hechosfinales=[];
                            break;
                        }else{
                            if(conclusion.operadores[j]=="OR"){
                                hechosfinales=this.verificadorVerdad(item,hechos,reglas);
                            }else{
                                console.log("QUE PROCEDE CON EL THEN");
                            }
                        } 
                    }
                }
            }
        }
        return hechosfinales;
    }
    verificadorHecho(item:Fact,hechos:Fact[],sujetos:string[]):any{
        let h:Fact[] = [];
        hechos.forEach(element=>{
            if(element.predicado==item.predicado && item.sujetos.length==item.sujetos.length){
                h.push(element);
            }
        })
        if(h.length==0){
            return undefined;
        }else{
            for (let i= 0; i < sujetos.length; i++) {
                let cont=0;
                for (let j = 0; j < h.length; j++) {
                    if(h[j].sujetos[i]==sujetos[i]){
                        cont++;
                    }
                    if(cont==h[j].sujetos.length){
                        return h[j];
                    }
                }
            }
        }
    }
    imprimir(sujetos:string[], predicado:string):string {
        var oracion = "";
        oracion += predicado + " " + sujetos;
        return oracion;
    }
}