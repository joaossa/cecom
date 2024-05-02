exports.up = function (knex) {
    return knex.schema.createTable('indicacoes_2021', table => {
        table.increments('codigo').notNull();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('cdCargo').notNull();
        table.foreign('cdCargo').references('cargos.codigo');
        table.string('nomeIndicado').notNull();
        table.string('stContactouIndicado', 1).defaultTo('N');
        table.string('stAutoIndicacao', 1).defaultTo('N');
        table.string('email', 40).notNull();
        table.datetime("dtHoraIndicacao").notNull().defaultTo(knex.fn.now());
        table.string('ipIndicacao', 40);
        table.unique(['codigo', 'cdEleicao', 'cdCargo']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('indicacoes_2021');
};
