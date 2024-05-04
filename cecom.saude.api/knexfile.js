// const { db } = require('./.env')
module.exports = {
  client: 'pg',
  connection: {
    database: 'cecom_saude',
    user: 'postgres',
    password: 'Superacaojc01',
    timezone: 'America/Sao_Paulo'
  },
  searchPath: ['cecom'],
  pool: {
    min: 2,
    max: 10,
    afterCreate: function (connection, callback) {
      connection.query('SET TIMEZONE="America/Sao_Paulo";', function (err) {
        callback(err, connection);
      });
    }
  },
  migrations: {
    tableName: 'cecom.knex_migrations'
  }
};