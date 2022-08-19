import firebaseAdmin  from "firebase-admin";

// tslint:disable-next-line: no-var-requires
const serviceAccount: any = require("./firebaseCredentials.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

export default firebaseAdmin;
