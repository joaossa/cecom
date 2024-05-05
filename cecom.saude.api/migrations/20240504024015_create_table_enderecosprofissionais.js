// Migration for table: enderecosprofissionais
exports.up = function(knex) {
  return knex.schema.createTable('enderecosprofissionais', table => {
    table.integer('codigoprofissional').primary().notNullable().references('codigoprof').inTable('profissionais'); // Primary key and foreign key to profissionais table
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
  return knex.schema.dropTable('enderecosprofissionais');
};