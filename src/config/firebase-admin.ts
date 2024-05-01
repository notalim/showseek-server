import firebase from "firebase-admin";
import firebaseConfig from "./firebaseConfig.js";


if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(
            firebaseConfig as firebase.ServiceAccount
        ),
    });
}
const db = firebase.firestore();

export default db;
