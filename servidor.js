const express = require('express')
const app = express()
const port = 6000

app.get('/', (req,res) => {
    res.send('Respuesta de Raiz')
})

app.get('/contacto', (req,res) => {
    res.send('Respuesta de Contacto')
})

app.listen(port, () => {
    console.log('Servidor Escuchando: ', port)
})