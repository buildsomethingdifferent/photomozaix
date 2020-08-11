import firebase from "firebase";
import "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyDlLSjWQqTZhRhsHnZuwBRgOx-GHLLeMsw",
    authDomain: "photomozaix-testing.firebaseapp.com",
    databaseURL: "https://photomozaix-testing.firebaseio.com",
    projectId: "photomozaix-testing",
    storageBucket: "photomozaix-testing.appspot.com",
    messagingSenderId: "142865639117",
    appId: "1:142865639117:web:716d185297fc8c67"
};

firebase.initializeApp(firebaseConfig);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const st = firebase.storage();
//const confirmPasswordReset = auth.confirmPasswordReset;
const EmailAuthProvider = firebase.auth.EmailAuthProvider;
const storageRef = firebase.storage().ref();
const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
};
db.settings(settings);

// firebase collections
const ordersCollection = db.collection("orders");
const projectsCollection = db.collection("projects");
const usersCollection = db.collection("users");

export {
    db,
    auth,
    st,
    currentUser,
    ordersCollection,
    projectsCollection,
    storageRef,
    usersCollection,
    EmailAuthProvider,
    //confirmPasswordReset
};

