// Migration for table: cid_master
exports.up = function(knex) {
  return knex.schema.createTable('cid_master', function(table) {
    table.increments('codigo'); // Handles the int4 GENERATED BY DEFAULT AS IDENTITY
    table.string('descricao', 255).notNullable();
    table.string('codigo_cid', 10).notNullable().unique(); // Unique CID code
    table.integer('cd_grupocid').nullable().references('cd_grupocid').inTable('gruposcid'); // Optional foreign key to gruposcid
    table.boolean('ativo').defaultTo(true).notNullable(); // Whether the CID entry is active
    table.primary(['codigo']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cid_master');
};