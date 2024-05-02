exports.up = function (knex) {
    return knex.schema.createTable('candidatoschapas', table => {
        table.integer('cdChapa').notNull();
        table.integer('cdCandidatoChapa').notNull();
        table.foreign('cdCandidatoChapa').references('users.codigo');
        table.integer('cdCargo').notNull();
        table.foreign('cdCargo').references('cargos.codigo');
        table.primary(['cdChapa', 'cdCandidatoChapa']);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('candidatoschapas');
};
