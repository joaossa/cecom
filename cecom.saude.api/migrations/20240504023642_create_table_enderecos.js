// Migration for table: enderecos
exports.up = function(knex) {
  return knex.schema.createTable('enderecos', table => {
    table.increments('codigo'); // Handles the int4 GENERATED BY DEFAULT AS IDENTITY
    table.string('enderecoresidencia', 125).nullable();
    table.string('nr_residencia', 10).nullable();
    table.string('complementoresidencia', 100).nullable();
    table.string('bairroresidencia', 100).nullable();
    table.string('cep_residencia', 10).nullable();
    table.integer('cdCidadeResidencia').notNullable().references('codigo').inTable('cidades'); // Foreign key reference to cidades
    table.timestamp('dtAtualizacao').defaultTo(knex.fn.now()).nullable();
    table.string('telefone', 10).notNullable();
    table.char('tp_pessoalcontato', 1).nullable();
    table.integer('ddd').nullable();
    table.string('nm_contato', 100).nullable();
    table.char('tp_fone', 1).nullable().check('tp_fone IN (\'R\', \'T\', \'C\', \'P\')'); // Check constraint for phone type
    table.primary(['codigo']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enderecos');
};
