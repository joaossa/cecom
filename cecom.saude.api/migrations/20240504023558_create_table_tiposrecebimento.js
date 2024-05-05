// Migration for table: tiposrecebimento
exports.up = function(knex) {
  return knex.schema.createTable('tiposrecebimento', table => {
    table.increments('codigo'); // Handles the int2 GENERATED BY DEFAULT AS IDENTITY
    table.string('descricao', 50).notNullable();
    table.primary(['codigo']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tiposrecebimento');
};
