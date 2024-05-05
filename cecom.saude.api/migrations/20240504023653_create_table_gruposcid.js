// Migration for table: gruposcid
exports.up = function(knex) {
  return knex.schema.createTable('gruposcid', table => {
    table.increments('cd_grupocid'); // Handles the int4 GENERATED BY DEFAULT AS IDENTITY
    table.string('ds_grupocid', 250).notNull();
    table.integer('cd_grupocidpai').references('cd_grupocid').inTable('gruposcid'); // Recursive foreign key to the same table
    table.integer('versao').check('versao IN (9, 10)'); // Assuming 'versao' represents versions like CID-9 or CID-10
    table.primary(['cd_grupocid']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('gruposcid');
};