exports.up = function (knex) {
    return knex.schema.createTable('cargos', table => {
        table.increments('codigo').primary();
        table.string('descricao', 50).notNull();
        table.integer('cdNivel');
        table.string('stInativo', 1).defaultTo('N');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('cargos');
};
