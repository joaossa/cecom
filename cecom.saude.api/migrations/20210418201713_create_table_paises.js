exports.up = function (knex) {
    return knex.schema.createTable('paises', table => {
        table.increments('codigo').primary();
        table.string('descricao', 35).notNull();
        table.string('nacionalidade', 50);
        table.integer('cdIbge');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('paises');
};