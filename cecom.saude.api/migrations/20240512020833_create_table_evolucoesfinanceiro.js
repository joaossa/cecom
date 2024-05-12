exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('evolucoesfinanceiro', table => {
      table.integer('codigo').notNullable().primary(); // Define 'codigo' como uma coluna inteira que será preenchida por uma sequência personalizada
      table.integer('cd_financeiro').notNullable().references('codigo').inTable('cecom.financeiro');
      table.integer('cd_evolucao').notNullable();
      table.integer('codigoprof').notNullable();
      table.integer('codigomasterpac').notNullable();
      table.integer('codigopaciente').notNullable();
      table.unique(['cd_evolucao', 'codigoprof', 'cd_financeiro', 'codigomasterpac', 'codigopaciente']); // Unique constraint on multiple fields
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.evolucoesfinanceiro_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoesfinanceiro ALTER COLUMN codigo SET DEFAULT nextval('cecom.evolucoesfinanceiro_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_evolucoesfinanceiro()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.evolucoesfinanceiro_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_evolucoesfinanceiro
      BEFORE INSERT ON cecom.evolucoesfinanceiro
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_evolucoesfinanceiro();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoesfinanceiro ADD CONSTRAINT fk_evolfinan_evol_foreign FOREIGN KEY (cd_evolucao, codigoprof) REFERENCES cecom.evolucoes(cd_evolucao, codigoprof);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoesfinanceiro ADD CONSTRAINT fk_evolfinan_finan_foreign FOREIGN KEY (cd_financeiro) REFERENCES cecom.financeiro(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.evolucoesfinanceiro ADD CONSTRAINT fk_evolfinan_pac_foreign FOREIGN KEY (codigomasterpac, codigopaciente) REFERENCES cecom.pacientes(codigomaster, codigopaciente);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('evolucoesfinanceiro')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_evolucoesfinanceiro();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.evolucoesfinanceiro_codigo_seq;"));
};
