exports.up = function (knex) {
    return knex.schema.createTable('urnas', table => {
        table.increments('codigo').primary();
        table.string('descricao', 500).notNull();
        table.string('nomeMaquina', 100).notNull();
        table.integer('cdSecao').notNull();
        table.foreign('cdSecao').references('secoes.codigo');
        table.integer('cdCedulaLiberada');
        table.foreign('cdCedulaLiberada').references('cedulas.codigo');
        table.datetime('ultimoUso').defaultTo(knex.fn.now());
        table.integer('quantidadeParcial').notNull().defaultTo(0);
        table.integer('cdPessoaEmUso').notNull();
        table.foreign('cdPessoaEmUso').references('users.codigo');

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('urnas');
};