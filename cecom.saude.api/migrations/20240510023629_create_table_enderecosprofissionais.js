exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('enderecosprofissionais', table => {
      table.integer('codigoprof').notNullable(); // Primary key component and foreign key
      table.integer('codigoendereco').notNullable(); // Primary key component and foreign key
      table.timestamp('dtAtualizacao', { useTz: true }).defaultTo(knex.fn.now()); // Default to current timestamp
      table.primary(['codigoprof', 'codigoendereco']); // Composite primary key
      table.foreign('codigoprof').references('codigo').inTable('cecom.profissionais'); // Foreign key to profissionais
      table.foreign('codigoendereco').references('codigo').inTable('cecom.enderecos'); // Foreign key to enderecos
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('enderecosprofissionais');
};
