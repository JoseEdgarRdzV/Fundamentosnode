const http = require('http')
const port = 5000

const server = http.createServer((req, res) => {
    res.end('Hola')
})

server.listen(port, () => {
    console.log('Servidor Trabajando')
})