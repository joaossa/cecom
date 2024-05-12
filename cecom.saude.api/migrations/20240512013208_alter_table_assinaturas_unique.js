exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .alterTable('assinaturas', table => {
      // Essa chamada assegura que a chave única será adicionada cobrindo as três colunas
      table.unique(['codigoassinante', 'codigoplano', 'codigo'], 'unique_assinaturas');
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .alterTable('assinaturas', table => {
      // Remove a restrição de chave única no rollback
      table.dropUnique(['codigoassinante', 'codigoplano', 'codigo'], 'unique_assinaturas');
    });
};
