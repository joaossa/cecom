exports.up = function (knex) {
    return knex.schema.createTable('candidatos', table => {
        table.integer('cdCandidato').notNull();
        table.foreign('cdCandidato').references('users.codigo');
        table.integer('numero').notNull();
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('cdCedula').notNull();
        table.foreign('cdCedula').references('cedulas.codigo');
        table.string('imagem', 200);
        table.primary(['numero', 'cdEleicao']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('candidatos');
};