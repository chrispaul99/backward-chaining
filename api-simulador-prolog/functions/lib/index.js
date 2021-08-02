"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Dependences
const admin = require("firebase-admin");
const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");
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
app.use(cors({ origin: true, methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }));
//Imports Routers
app.use("/fact", FactController);
app.use("/rule", RuleController);
app.use("/check", CheckController);
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map