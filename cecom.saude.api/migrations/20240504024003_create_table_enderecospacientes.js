// Migration for table: enderecospacientes
exports.up = function(knex) {
  return knex.schema.createTable('enderecospacientes', table => {
    table.integer('codigopaciente').primary().notNullable().references('codigopaciente').inTable('pacientes'); // Primary key and foreign key to pacientes table
    table.string('logradouro', 255).notNullable();
    table.string('numero', 10).nullable();
    table.string('complemento', 50).nullable();
    table.string('bairro', 100).notNullable();
    table.string('cidade', 100).notNullable();
    table.string('estado', 2).notNullable();
    table.string('cep', 8).notNullable();
    table.timestamp('data_atualizacao').defaultTo(knex.fn.now()); // Timestamp for the last update
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enderecospacientes');
};