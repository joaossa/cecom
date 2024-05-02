
exports.up = function (knex) {
    return knex.schema.createTable('indicacoes', table => {
        table.increments('codigo').notNull();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('cdCargo').notNull();
        table.foreign('cdCargo').references('cargos.codigo');
        table.integer('cdIndicado').notNull();
        table.foreign('cdIndicado').references('users.codigo');
        table.string('stContactouIndicado', 1).defaultTo('N');
        table.string('stAutoIndicacao', 1).defaultTo('N');
        table.unique(['codigo', 'cdEleicao', 'cdCargo']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('indicacoes');
};
