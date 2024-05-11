exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('itensfinanceiro', table => {
      table.integer('cd_itenfinanceiro').notNullable(); // Define 'cd_itenfinanceiro' como uma coluna inteira
      table.integer('cd_financeiro').notNullable().references('codigo').inTable('cecom.financeiro'); // Foreign key reference to 'financeiro'
      table.integer('numero_parcela').notNullable();
      table.decimal('valor_parcela', 14, 2).notNullable(); // Converted from money to decimal
      table.timestamp('dt_vencimento', { useTz: true }).nullable();
      table.primary(['cd_itenfinanceiro', 'cd_financeiro']); // Composite primary key
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.itensfinanceiro_cd_itenfinanceiro_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.itensfinanceiro ALTER COLUMN cd_itenfinanceiro SET DEFAULT nextval('cecom.itensfinanceiro_cd_itenfinanceiro_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_itensfinanceiro()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.cd_itenfinanceiro IS NULL OR NEW.cd_itenfinanceiro = 0 THEN
          NEW.cd_itenfinanceiro := nextval('cecom.itensfinanceiro_cd_itenfinanceiro_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_itensfinanceiro
      BEFORE INSERT ON cecom.itensfinanceiro
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_itensfinanceiro();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('itensfinanceiro')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_itensfinanceiro();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.itensfinanceiro_cd_itenfinanceiro_seq;"));
};
