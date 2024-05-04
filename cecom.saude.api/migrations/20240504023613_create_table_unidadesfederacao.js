// Migration for table: unidadesfederacao
exports.up = function(knex) {
  return knex.schema.createTable('unidadesfederacao', function(table) {
    table.char('codigo', 2).notNullable().primary(); // Using char for the 2-character code, set as primary key
    table.string('descricao', 100).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('unidadesfederacao');
};