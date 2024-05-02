const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const nodemailer = require('nodemailer')

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'joao.ssa@gmail.com',
        pass: 'obfuguvpkvogvpgh'
    }
})
// const mailTransporter = nodemailer.createTransport({
//     host: 'mail.select.eti.br',
//     port: 465,
//     auth: {
//         user: 'joao@select.eti.br',
//         pass: 'Superacaojc01'
//     }
// })

app.db = db
app.ibgmail = mailTransporter

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api') // Melhor carregar todas as api´s antes de carregar as rotas.
    .then('./config/routes.js') // carregar as rotas
    .into(app)

app.listen(3000, () => {
    console.log('Backend executando IBG...')
})