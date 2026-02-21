
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAhoHkzYBvlxVki5A0VnXt0aMLwFTsuZZg",
    authDomain: "planificador-viajes-51f2b.firebaseapp.com",
    projectId: "planificador-viajes-51f2b",
    storageBucket: "planificador-viajes-51f2b.firebasestorage.app",
    messagingSenderId: "30091707267",
    appId: "1:30091707267:web:374680f2d3a44f74db2cb6",
    measurementId: "G-XRL4LGM8GZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

