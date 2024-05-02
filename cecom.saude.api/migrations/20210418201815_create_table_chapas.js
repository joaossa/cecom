exports.up = function (knex) {
    return knex.schema.createTable('chapas', table => {
        table.increments('codigo').primary();
        table.string('descricao', 200).notNull();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('numero').notNull();
        table.integer('cdCedula').notNull();
        table.foreign('cdCedula').references('cedulas.codigo');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('chapas');
};