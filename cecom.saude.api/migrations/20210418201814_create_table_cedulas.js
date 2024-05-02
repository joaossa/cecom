exports.up = function (knex) {
    return knex.schema.createTable('cedulas', table => {
        table.increments('codigo').primary();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.string('descricao', 500).notNull();
        table.integer('numerovotos').notNull();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('cedulas');
};