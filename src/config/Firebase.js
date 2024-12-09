import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD5QKvPCqKM0k4TxwuVsDoVsIZZ76zHp8w",
  authDomain: "monitoring-cb3cd.firebaseapp.com",
  databaseURL:
    "https://monitoring-cb3cd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monitoring-cb3cd",
  storageBucket: "monitoring-cb3cd.firebasestorage.app",
  messagingSenderId: "1049095327304",
  appId: "1:1049095327304:web:ef6ceef11d7113d5d8927d",
  measurementId: "G-D35PHTCFL3",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
