exports.up = function (knex) {
    return knex.schema.createTable('votantes', table => {
        table.integer('cdVotante').notNull();
        table.foreign('cdVotante').references('users.codigo');
        table.integer('cdEleicao').notNull();
        table.foreign('cdEleicao').references('eleicoes.codigo');
        table.integer('cdUrna').notNull();
        table.foreign('cdUrna').references('urnas.codigo');
        table.datetime("dtHoraVoto").notNull().defaultTo(knex.fn.now());
        table.integer('cdCedula').notNull();
        table.foreign('cdCedula').references('cedulas.codigo');
        table.string('ipVotante', 15).notNull();
        table.unique(['cdVotante', 'cdEleicao', 'cdCedula']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('votantes');
};