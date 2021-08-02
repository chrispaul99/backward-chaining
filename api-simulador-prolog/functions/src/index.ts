//Dependences
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as functions from "firebase-functions";
import * as cors from 'cors';
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://simulog.firebaseio.com"
});

//Controllers
const FactController = require("./controllers/FactController");
const RuleController = require("./controllers/RuleController");
const CheckController = require("./controllers/CheckController");

 // Express
const app = express();
app.use(cors({origin: true, methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']}));
//Imports Routers
app.use("/fact",FactController);
app.use("/rule",RuleController);
app.use("/check",CheckController);

exports.api = functions.https.onRequest(app);
