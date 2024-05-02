exports.up = function (knex) {
    return knex.schema.createTable('eleitores', table => {
        table.integer('cdEleitor').notNull();
        table.foreign('cdEleitor').references('users.codigo');
        table.integer('cdCedula').notNull();
        table.foreign('cdCedula').references('cedulas.codigo');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('eleitores');
};
