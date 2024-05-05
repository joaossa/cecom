// Migration for table: enderecosprofissionais
exports.up = function(knex) {
  return knex.schema.createTable('enderecosprofissionais', table => {
    table.integer('codigoprofissional').primary().notNull().references('codigoprof').inTable('profissionais'); // Primary key and foreign key to profissionais table
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
  return knex.schema.dropTable('enderecosprofissionais');
};