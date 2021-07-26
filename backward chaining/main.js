import { Done } from "./models/Done.js";
import { Rule } from "./models/Rule.js";
import { Verificacion } from "./models/Verificacion.js";

var sujetos = [];
//Hechos

// X es MORTAL
sujetos.push("Juan");
const h7 = new Done("MORTAL", sujetos);

sujetos = [];
sujetos.push("Pedro");
const h8 = new Done("MORTAL", sujetos);

sujetos = [];
sujetos.push("Carlos");
const h9 = new Done("MORTAL", sujetos);

// X es HOMBRE
sujetos = [];
sujetos.push("Juan");
const h1 = new Done("HOMBRE", sujetos);

sujetos = [];
sujetos.push("Pedro");
const h2 = new Done("HOMBRE", sujetos);

sujetos = [];
sujetos.push("Carlos");
const h3 = new Done("HOMBRE", sujetos);

// X es PADRE DE Y
sujetos = [];
sujetos.push("Juan");
sujetos.push("Pedro");

const h4 = new Done("PADRE", sujetos);

sujetos = [];
sujetos.push("Pedro");
sujetos.push("Carlos");

const h5 = new Done("PADRE", sujetos);

// X es ABUELO DE Y
sujetos = [];
sujetos.push("Juan");
sujetos.push("Carlos");

const h6 = new Done("ABUELO", sujetos);




var sujetosreglas = [];

//Reglas


//Regla MORTAL(X)
sujetosreglas.push("X");
const r1 = new Rule(1, "MORTAL", sujetosreglas, 0);

//Regla HOMBRE(X)
sujetosreglas = [];
sujetosreglas.push("X");
const r2 = new Rule(2, "HOMBRE", sujetosreglas, 1);


//Regla PADRE(X,Y)
sujetosreglas = [];
sujetosreglas.push("X");
sujetosreglas.push("Y");
const r3 = new Rule(3, "PADRE", sujetosreglas, 2);

//Regla ABUELO(X,Y)
sujetosreglas = [];
sujetosreglas.push("X");
sujetosreglas.push("Y");
const r4 = new Rule(4, "ABUELO", sujetosreglas, 3);

const hechos = [];
hechos.push(h1);
hechos.push(h2);
hechos.push(h3);
hechos.push(h4);
hechos.push(h5);
hechos.push(h6);
hechos.push(h7);
hechos.push(h8);
hechos.push(h9);


const reglas = [];
reglas.push(r1);
reglas.push(r2);
reglas.push(r3);
reglas.push(r4);

const ver = new Verificacion();

//Ejemplo
var sujetosEvaluar = [];
sujetosEvaluar.push("Rodrigo");
//sujetosEvaluar.push("X");
ver.cumplimiento("HOMBRE", sujetosEvaluar, hechos, reglas)