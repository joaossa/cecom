// Migration for table: arquivosassinados
exports.up = function(knex) {
  return knex.schema.createTable('arquivosassinados', table => {
    table.increments('codigo'); // Handles the int4 GENERATED BY DEFAULT AS IDENTITY
    table.integer('codigomaster').notNull().references('codigo').inTable('master'); // Foreign key to master table
    table.integer('codigoprofissional').notNull().references('codigoprof').inTable('profissionais'); // Foreign key to profissionais table
    table.integer('codigoarquivo').notNull(); // Assume it references another table's primary key, adjust as needed
    table.timestamp('dataassinatura').defaultTo(knex.fn.now()); // Timestamp of when the file was signed
    table.boolean('ativo').defaultTo(true).notNull(); // Whether the signed file is active
    table.string('hashassinatura', 255).notNull(); // Store the hash of the signature for verification purposes
    table.primary(['codigo']); // Sets the primary key
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('arquivosassinados');
};