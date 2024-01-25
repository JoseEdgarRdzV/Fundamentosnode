const express = require('express')
import { initializeApp } from "firebase/app";
const app = express()
const port = 6000

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByZ1aNcE0jEgpamL4DrcbfKcFSuqaS63k",
  authDomain: "crud-edgar-proyecto1.firebaseapp.com",
  projectId: "crud-edgar-proyecto1",
  storageBucket: "crud-edgar-proyecto1.appspot.com",
  messagingSenderId: "805820307299",
  appId: "1:805820307299:web:f073c46eec6d7dcd116556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

app.get('/', (req,res) => {
    res.send('Respuesta de Raiz')
})

app.get('/contacto', (req,res) => {
    res.send('Respuesta de Contacto')
})

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
})