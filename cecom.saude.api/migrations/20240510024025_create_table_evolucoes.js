exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('evolucoes', table => {
      table.integer('cd_evolucao').notNullable();
      table.integer('codigoprof').notNullable();
      table.string('prontuario', 7).notNullable();
      table.integer('codigomasterpac').notNullable();
      table.integer('codigopaciente').notNullable();
      table.timestamp('dt_evolucao', { useTz: true }).nullable();
      table.integer('cd_tipoevolucao').notNullable();
      table.specificType('evolucao', 'bytea').nullable();
      table.integer('cd_pessoaautorizacao').nullable();
      table.timestamp('dt_autorizacao', { useTz: true }).nullable();
      table.timestamp('dt_impressao', { useTz: true }).nullable();
      table.integer('cd_motivoexclamacao').nullable();
      table.integer('codigomasterinvalida').notNullable();
      table.timestamp('dt_invalidacao', { useTz: true }).nullable();
      table.string('motivoinvalidacao', 2000).nullable();
      table.integer('cd_arquivoassinado').nullable();
      table.integer('codigomasterarq').notNullable();
      table.integer('codigolocalatend').notNullable();
      table.primary(['codigoprof', 'cd_evolucao']); // Composite primary key
    })
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_arquivoass_foreign FOREIGN KEY (cd_arquivoassinado, codigomasterarq) REFERENCES cecom.arquivosassinados (codigo, codigoprof);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_locatend_foreign FOREIGN KEY (codigolocalatend) REFERENCES cecom.locaisatendimentos(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_motivoexcla_foreign FOREIGN KEY (cd_motivoexclamacao) REFERENCES cecom.motivosexclamacao(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_pessinval_foreign FOREIGN KEY (codigomasterinvalida) REFERENCES cecom.profissionais(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_prof_foreign FOREIGN KEY (codigoprof) REFERENCES cecom.profissionais(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_prontpac_foreign FOREIGN KEY (codigomasterpac, codigopaciente, prontuario) REFERENCES cecom.prontuariospacientes(codigopac, codigopaciente, prontuario);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes ADD CONSTRAINT fk_evolucoes_tpevol_foreign FOREIGN KEY (cd_tipoevolucao) REFERENCES cecom.tiposevolucoes(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('evolucoes')
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_arquivoass_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_locatend_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_motivoexcla_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_pessinval_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_prof_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_prontpac_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoes DROP CONSTRAINT IF EXISTS fk_evolucoes_tpevol_foreign;
    `));
};
