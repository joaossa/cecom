// Migration for table: enderecospacientes
exports.up = function(knex) {
  return knex.schema.createTable('enderecospacientes', table => {
    table.integer('codigopaciente').primary().notNull().references('codigopaciente').inTable('pacientes'); // Primary key and foreign key to pacientes table
    table.string('logradouro', 255).notNull();
    table.string('numero', 10);
    table.string('complemento', 50);
    table.string('bairro', 100).notNull();
    table.string('cidade', 100).notNull();
    table.string('estado', 2).notNull();
    table.string('cep', 8).notNull();
    table.timestamp('data_atualizacao').defaultTo(knex.fn.now()); // Timestamp for the last update
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('enderecospacientes');
};