import { FirebaseOptions, initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCfOGRCwfXFGuSITt_hli7uGk1raQ9MMj0",
  authDomain: "mapmystery-13bef.firebaseapp.com",
  projectId: "mapmystery-13bef",
  storageBucket: "mapmystery-13bef.firebasestorage.app",
  messagingSenderId: "353542148646",
  appId: "1:353542148646:web:e8835ee815292581ff0ce7",
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default db;
