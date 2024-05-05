// Migration for table: prontuariospacientes
exports.up = function(knex) {
  return knex.schema.createTable('prontuariospacientes', table => {
    table.integer('codigomaster').notNull().references('codigo').inTable('master'); // Foreign key to master table
    table.integer('codigopaciente').notNull().references('codigopaciente').inTable('pacientes'); // Foreign key to pacientes table
    table.string('prontuario', 20).notNull().unique();
    table.timestamp('datacadastro').defaultTo(knex.fn.now());
    table.primary(['codigomaster', 'codigopaciente']); // Composite primary key
    table.unique(['prontuario']); // Ensuring uniqueness for prontuario number
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('prontuariospacientes');
};