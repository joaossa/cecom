const app = require('express')()
const https = require('https')
// const path = require('path')
const fs = require('fs')
const consign = require('consign')
const db = require('./config/db')
const nodemailer = require('nodemailer')

// const mailTransporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'joao.ssa@gmail.com',
//         pass: 'obfuguvpkvogvpgh'
//     }
// })
const mailTransporter = nodemailer.createTransport({
    host: 'mail.select.eti.br',
    port: 465,
    auth: {
        user: 'joao@select.eti.br',
        pass: 'Superacaojc01'
    }
})

app.db = db
app.ibgmail = mailTransporter

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api') // Melhor carregar todas as api´s antes de carregar as rotas.
    .then('./config/routes.js') // carregar as rotas
    .into(app)

const sslServer = https.createServer(
    {
        key: fs.readFileSync('./cert/key.pem', 'utf8'),
        cert: fs.readFileSync('./cert/select.eti.br.pem', 'utf8'),
    },
    app)

sslServer.listen(3000, () => console.log('Backend executando IBG... Secure server on port 3000'))