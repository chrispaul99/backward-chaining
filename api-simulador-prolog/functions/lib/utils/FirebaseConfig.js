"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependences
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://simulog.firebaseio.com"
});
const db = admin.firestore();
module.exports = db;
//# sourceMappingURL=FirebaseConfig.js.map