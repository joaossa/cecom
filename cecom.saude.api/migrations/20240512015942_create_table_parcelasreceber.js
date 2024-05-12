exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('parcelasreceber', table => {
      table.integer('codigo').notNullable(); // Primary key, defined later in the composite key
      table.integer('cd_itenfinanceiro').notNullable();
      table.integer('cd_financeiro').notNullable();
      table.integer('numero_parcela').notNullable();
      table.decimal('valor_parcela', 14, 2).notNullable(); // Converted 'money' to 'decimal' for compatibility
      table.integer('cd_tiporecebimento').notNullable().references('codigo').inTable('cecom.tiposrecebimento');
      table.timestamp('dt_pagamento', { useTz: true }).nullable();
      table.string('id_confirmacaopag', 50).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.parcelasreceber_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceber ALTER COLUMN codigo SET DEFAULT nextval('cecom.parcelasreceber_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_parcelasreceber()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.parcelasreceber_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_parcelasreceber
      BEFORE INSERT ON cecom.parcelasreceber
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_parcelasreceber();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceber ADD CONSTRAINT parcelasreceber_pkey PRIMARY KEY (codigo, cd_financeiro, cd_itenfinanceiro);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceber ADD CONSTRAINT fk_parcela_itensfinan_foreign FOREIGN KEY (cd_financeiro, cd_itenfinanceiro) REFERENCES cecom.itensfinanceiro(cd_financeiro, cd_itenfinanceiro);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('parcelasreceber')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_parcelasreceber();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.parcelasreceber_codigo_seq;"));
};
