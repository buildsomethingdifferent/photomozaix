import firebase from "firebase";
import "firebase/firestore";
/*const config = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FB_DATABASE_URL,
  projectId: process.env.VUE_APP_FB_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID
};*/
const config = {
  apiKey: process.env.VUE_APP_FB_API_KEY,
  authDomain: process.env.VUE_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FB_DATABASE_URL,
  projectId: process.env.VUE_APP_FB_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FB_MESSAGING_APP_ID,
};
firebase.initializeApp(config);

// firebase utils
const timestamp = firebase.firestore.Timestamp;
const firestore = firebase.firestore;
const db = firebase.firestore();
const auth = firebase.auth();
const st = firebase.storage();
//const confirmPasswordReset = auth.confirmPasswordReset;
const EmailAuthProvider = firebase.auth.EmailAuthProvider;
const storageRef = firebase.storage().ref();
const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
 // timestampsInSnapshots: true
};
db.settings(settings);


// firebase collections
const ordersCollection = db.collection("orders");
const projectsCollection = db.collection("projects");
const usersCollection = db.collection("users");
const couponsCollection = db.collection("coupons");
const productsCollection = db.collection("products");
const projectSharedCollection = db.collection("projectSharedInfo");
const settingsCollection = db.collection("projectSetting");

export {
  timestamp,
  db,
  auth,
  st,
  currentUser,
  ordersCollection,
  projectsCollection,
  couponsCollection,
  productsCollection,
  storageRef,
  usersCollection,
  EmailAuthProvider,
  firestore,
  projectSharedCollection,
  settingsCollection,
  //confirmPasswordReset
};
