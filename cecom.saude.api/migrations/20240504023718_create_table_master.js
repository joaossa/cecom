// Migration for table: master
exports.up = function(knex) {
  return knex.schema.createTable('master', function(table) {
    table.increments('codigo'); // Handles the int4 GENERATED BY DEFAULT AS IDENTITY
    table.integer('codigomaster').notNullable().references('codigo').inTable('master'); // Self-referencing foreign key for hierarchical relationships
    table.string('nome', 50).notNullable();
    table.string('email', 200).notNullable().unique();
    table.timestamp('dt_atualizacao').defaultTo(knex.fn.now());
    table.string('password', 255).notNullable();
    table.boolean('admin').defaultTo(false).notNullable();
    table.primary(['codigo']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('master');
};