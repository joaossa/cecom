exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .alterTable('pacientes', table => {
      // Adicionar uma chave única composta
      table.unique(['codigomaster', 'codigopaciente']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .alterTable('pacientes', table => {
      // Remover a chave única composta
      table.dropUnique(['codigomaster', 'codigopaciente']);
    });
};