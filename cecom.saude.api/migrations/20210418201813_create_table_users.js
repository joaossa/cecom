exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('codigo').primary();
        table.string('nome', 50).notNull();
        table.enu('sexo', ['M', 'F', 'I']).notNull();
        table.datetime('dtnascimento').notNull();
        table.string('cpf', 11).notNull().unique();
        table.string('enderecoresidencia', 125);
        table.string('nrResidencia', 10);
        table.string('complementoresidencia', 100);
        table.string('bairroresidencia', 100);
        table.string('cepResidencia', 10);
        table.integer('cdCidadeResidencia').notNull();
        table.foreign('cdCidadeResidencia').references('cidades.codigo');
        table.string('email', 200).notNull().unique();
        table.datetime('dtAtualizacao').defaultTo(knex.fn.now());
        table.string('nmMae', 100);
        table.string('nmPai', 100);
        table.string('rg', 15);
        table.string('orgaoemissor', 10);
        table.string('stInativo', 1).defaultTo('N');
        table.string('password').notNull();
        table.integer('cdUnidadeOrganizacional').notNull();
        table.foreign('cdUnidadeOrganizacional').references('unidadesorganizacionais.codigo');
        table.string('nmCivil', 50);
        table.string('stNmSocial', 1).defaultTo('N');
        table.boolean('admin').notNull().defaultTo(false);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};