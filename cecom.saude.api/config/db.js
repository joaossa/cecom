const config = require('../knexfile.js')
const knex = require('knex')(config)

// É possível executar as migrations automaticamente quando a aplicação iniciar...
knex.migrate.latest([config])
module.exports = knex