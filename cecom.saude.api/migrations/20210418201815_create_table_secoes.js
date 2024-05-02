exports.up = function (knex) {
    return knex.schema.createTable('secoes', table => {
        table.increments('codigo').primary();
        table.string('descricao', 500).notNull();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.string('nomemaquina', 100).notNull();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('secoes');
};