exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('profissionais', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('nome', 50).notNullable();
      table.string('sexo', 1).notNullable().checkIn(['M', 'F', 'I']); // CHECK constraint added in Knex style
      table.timestamp('dtnascimento', { useTz: true }).notNullable();
      table.string('cpf', 11).notNullable().unique(); // UNIQUE constraint
      table.string('rg', 15).nullable();
      table.string('orgaoemissor', 10).nullable();
      table.integer('codigocargo').nullable().references('codigo').inTable('cecom.cargos'); // Foreign key to cargos
      table.string('cd_situacao', 1).nullable();
      table.timestamp('dt_admissao', { useTz: true }).nullable();
      table.timestamp('dt_demissao', { useTz: true }).nullable();
      table.string('apelido', 20).nullable();
      table.string('entidadeclasse', 100).nullable();
      table.string('conselhoprofissional', 7).nullable();
      table.string('email', 200).notNullable().unique(); // UNIQUE constraint
      table.string('nomecivil', 50).nullable();
      table.string('stNmSocial', 1).defaultTo('N').nullable();
    })
    .then(() => knex.raw(`
      ALTER TABLE cecom.profissionais ADD CONSTRAINT fk_profissionais_master_foreign FOREIGN KEY (codigo) REFERENCES cecom.master(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('profissionais');
};
