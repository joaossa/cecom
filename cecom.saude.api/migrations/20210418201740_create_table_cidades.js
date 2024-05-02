exports.up = function (knex) {
    return knex.schema.createTable('cidades', table => {
        table.increments('codigo').primary();
        table.string('descricao', 100).notNull();
        table.string('cdUf', 2).notNull();
        table.integer('cdPais').notNull();
        table.foreign('cdPais').references('paises.codigo');
        table.string('cepGeral', 9).notNull();
        table.integer('cdIbge');
        table.string('stInativo', 1).defaultTo('N');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('cidades');
};