import { Fact } from './Fact';
export class Rule{
    id:string = "";
    conclusion:Fact = new Fact();
    condiciones:Fact[]=[];
    operadores:string[]=[];
}