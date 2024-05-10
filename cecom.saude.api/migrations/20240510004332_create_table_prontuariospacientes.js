exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('prontuariospacientes', table => {
      table.string('prontuario', 7).notNullable();
      table.integer('codigopac').notNullable();
      table.integer('codigopaciente').notNullable();
      table.timestamp('dt_aberturaprontuario', { useTz: true }).nullable();
      table.string('st_inativo', 1).nullable().checkIn(['S', 'N']); // Simples CHECK constraint no Knex
      table.primary(['codigopac', 'codigopaciente', 'prontuario']); // Definindo chave primária composta
    })
    .then(() => knex.raw(`
      ALTER TABLE cecom.prontuariospacientes ADD CONSTRAINT fk_prontpac_foreign FOREIGN KEY (codigopac, codigopaciente) REFERENCES cecom.pacientes(codigomaster, codigopaciente);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('prontuariospacientes');
};
