import { FirebaseOptions, initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAZnOoSOuYktW6ymO0czlIOQrjcYrOYOnY",
  authDomain: "mapmystery-13bef.firebaseapp.com",
  projectId: "mapmystery-13bef",
  storageBucket: "mapmystery-13bef.firebasestorage.app",
  messagingSenderId: "353542148646",
  appId: "1:353542148646:web:ebc6b3125646310dff0ce7"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export default db;