exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('financeiro', table => {
      table.integer('codigo').notNullable().primary(); // Define 'codigo' como uma coluna inteira que será preenchida por uma sequência personalizada
      table.integer('codigoprof').notNullable().references('codigo').inTable('cecom.profissionais');
      table.integer('codigomasterpac').notNullable();
      table.integer('codigopaciente').notNullable();
      table.integer('qtd_parcelas').notNullable();
      table.decimal('valor_total', 14, 2).notNullable(); // Converted from money to decimal
      table.integer('qtd_evolucoes').notNullable();
      table.integer('cd_tipoprocedimento').notNullable().references('codigo').inTable('cecom.tiposprocedimentos');
      table.timestamp('dt_registro', { useTz: true }).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.financeiro_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.financeiro ALTER COLUMN codigo SET DEFAULT nextval('cecom.financeiro_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_financeiro()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.financeiro_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_financeiro
      BEFORE INSERT ON cecom.financeiro
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_financeiro();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.financeiro ADD CONSTRAINT fk_financeiro_prontpac_foreign FOREIGN KEY (codigomasterpac, codigopaciente) REFERENCES cecom.pacientes(codigomaster, codigopaciente);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('financeiro')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_financeiro();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.financeiro_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.financeiro DROP CONSTRAINT IF EXISTS fk_financeiro_prontpac_foreign;
    `));
};
