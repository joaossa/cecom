exports.up = function (knex) {
    return knex.schema.createTable('voto', table => {
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('numero').notNull();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('voto');
};