// const { db } = require('./.env')

module.exports = {
  client: 'postgresql',
  connection: {
    database: 'ibg_eleicao',
    user: 'postgres',
    password: 'Superacaojc01',
    timezone: 'America/Sao_Paulo'
  },
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
    tableName: 'knex_migrations'
  }
};