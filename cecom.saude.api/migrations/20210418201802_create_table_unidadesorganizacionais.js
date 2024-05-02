exports.up = function (knex) {
    return knex.schema.createTable('unidadesorganizacionais', table => {
        table.increments('codigo').primary();
        table.string('descricao', 100).notNull();
        table.string('siglaUnidade', 10);
        table.string('ipmaqbd', 15);
        table.string('stringConexao', 50);
        table.string('dbName', 30);
        table.string('endereco', 150);
        table.string('telefone', 50);
        table.string('estaUnidade', 1).defaultTo('N');
        table.integer('cdCidade').notNull();
        table.foreign('cdCidade').references('cidades.codigo');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('unidadesorganizacionais');
};