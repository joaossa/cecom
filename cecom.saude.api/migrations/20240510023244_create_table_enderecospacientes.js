exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('enderecospacientes', table => {
      table.integer('codigomaster').notNullable(); // Part of the composite primary key
      table.integer('codigopaciente').notNullable(); // Part of the composite primary key
      table.integer('codigoendereco').notNullable(); // Part of the composite primary key
      table.timestamp('dtAtualizacao', { useTz: true }).defaultTo(knex.fn.now()).nullable();

      // Define the primary key for the table
      table.primary(['codigomaster', 'codigopaciente', 'codigoendereco']);

      // Set up foreign keys
      table.foreign('codigoendereco').references('codigo').inTable('cecom.enderecos');
      table.foreign(['codigomaster', 'codigopaciente']).references(['codigomaster', 'codigopaciente']).inTable('cecom.pacientes');
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('enderecospacientes');
};
