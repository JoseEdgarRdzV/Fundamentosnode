import express from 'express'
import bcrypt, { hash } from 'bcrypt'
import 'dotenv/config'
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs , getFirestore, setDoc } from "firebase/firestore"

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "crud-edgar-proyecto1.firebaseapp.com",
  projectId: "crud-edgar-proyecto1",
  storageBucket: "crud-edgar-proyecto1.appspot.com",
  messagingSenderId: "805820307299",
  appId: "1:805820307299:web:f073c46eec6d7dcd116556"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore()
const app = express()
app.use(express.json())

app.get('/', (req,res) => {
    res.send('Respuesta de Raiz')
})


app.post('/signup', (req, res) => {
    const {nombre, apaterno, amaterno, telefono, usuario, password} = req.body

    if (nombre.length < 3) {
        res.json({'alerta': 'El nombre debe de tener mínimo 3 letras'})
    } else if (!apaterno.length){
        res.json({'alerta': 'El apaterno no puede ser vacío'})
    } else if (!usuario.length){
        res.json({'alerta': 'El usuario no puede ser vacío'})
    } else if (password.length < 6){
        res.json({'alerta': 'La contraseña requiere al menos 6 caracteres'})
    } else {
        // Guardar en la base de datos
        const usuarios = collection(db, 'usuarios')
        getDoc(doc(usuarios, usuario)).then(user => {
            if(user.exists()){
                res.json({'alerta': 'Usuario ya existe' })
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;

                        setDoc(doc(usuarios, usuario), req.body).then(registered => {
                            res.json({
                                'alert': 'success',
                                'data': registered
                            })
                        })
                    })
                })
            }
        })
    }
})

app.post('/login', (req, res) => {
    const { usuario, password } = req.body 

    if (!usuario.length || !password.length) {
        return res.json({
            'alerta': 'Algunos campos están vacíos'
        })
    }
    const usuarios = collection(db,'usuarios')
    getDoc(doc(usuarios, usuario))
    .then(user => {
        if (!user.exists()) {
            res.json({
                'alerta': 'El usuario no existe'
            })
        } else {
            bcrypt.compare(password, user.data().password, (err, result) => {
                if (result){
                    let userFound = user.data()
                    res.json({
                        'alert': 'success',
                        'usuario': {
                            'nombre': userFound.nombre,
                            'apaterno': userFound.apaterno,  
                            'amaterno': userFound.amaterno,
                            'usuario': userFound.usuario,
                            'telefono': userFound.telefono
                        }
                    })
                } else {
                    res.json({
                        'alerta': 'Contraseñas no coinciden'
                    })
                }
            })
        }
    })
})


app.get('/get-all', async (req, res) => {
    const usuarios = collection(db, 'usuarios')
    const docsUsuarios = await getDocs(usuarios)
    const arrUsuarios = []

    docsUsuarios.forEach((usuario) => {
        const obj = {
            nombre: usuario.data().nombre,
            apaterno: usuario.data().apaterno,
            amaterno: usuario.data().amaterno,
            usuario: usuario.data().usuario,
            telefono: usuario.data().telefono
        }
        arrUsuarios.push(obj)
    })
    if (arrUsuarios.length > 0) {
        res.json ({
            'alerta': 'success',
            'data': arrUsuarios
        })
    } else {
        res.json ({
            'alerta': 'error',
            'message': 'No hay usuarios en la base de datos'
        })
    }
})

app.post('/delete-user', (req, res) => {
    const {usuario} = req.body
    deleteDoc(doc(collection(db, 'usuarios'), usuario))
    .then(data => {
        if (data) {
        res.json ({
            'alerta': 'Usuario fue borrado'
        })
        } else {
            res.json ({
                'alerta': 'El usuario no existe en la base de datos'
            })
        }
    }).cath(err => {
        res.json ({
            'alerta': 'Fallo',
            'message': err
        })
    })
})

const port = process.env.PORT || 6000

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
})