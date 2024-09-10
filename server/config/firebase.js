const admin = require("firebase-admin");
const serviceAccount = require("../../ServiceAccounts.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
