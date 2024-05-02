exports.up = function (knex) {
    return knex.schema.createTable('eleicoes', table => {
        table.increments('codigo').primary();
        table.string('descricao', 500).notNull();
        table.datetime('inicio').notNull();
        table.datetime('fim').notNull();
        table.integer('cdUnidadeOrganizacional').notNull();
        table.foreign('cdUnidadeOrganizacional').references('unidadesorganizacionais.codigo');
        table.timestamp('finalizada');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('eleicoes');
};