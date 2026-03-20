import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP4sx5ugr_zBnUKr2LWX1QmeNOvs4YPJs",
  authDomain: "internhelp-f59a0.firebaseapp.com",
  projectId: "internhelp-f59a0",
  storageBucket: "internhelp-f59a0.firebasestorage.app",
  messagingSenderId: "1059889367459",
  appId: "1:1059889367459:web:7d6bef0cec51fbef247216"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;