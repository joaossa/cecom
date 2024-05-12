exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('parcelasreceberassinatura', table => {
      table.integer('codigo').notNullable(); // Define 'codigo' como uma coluna inteira
      table.integer('cd_itemfinanassinatura').notNullable(); // Foreign key, parte da primary key composta
      table.integer('numero_parcela').notNullable();
      table.decimal('valor_parcela', 14, 2).notNullable(); // Converted from money to decimal
      table.integer('cd_tiporecebimento').notNullable().references('codigo').inTable('cecom.tiposrecebimento'); // Foreign key
      table.timestamp('dt_pagamento', { useTz: true }).nullable();
      table.string('id_confirmacaopag', 50).nullable();
      table.primary(['codigo', 'cd_itemfinanassinatura']); // Composite primary key
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.parcelasreceberassinatura_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceberassinatura ALTER COLUMN codigo SET DEFAULT nextval('cecom.parcelasreceberassinatura_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_parcelasreceberassinatura()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.parcelasreceberassinatura_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_parcelasreceberassinatura
      BEFORE INSERT ON cecom.parcelasreceberassinatura
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_parcelasreceberassinatura();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceberassinatura ADD CONSTRAINT fk_parcela_itensfinanass_foreign FOREIGN KEY (cd_itemfinanassinatura) REFERENCES cecom.itensfinanceirosassinaturas(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.parcelasreceberassinatura ADD CONSTRAINT fk_parcela_tiporecebass_foreign FOREIGN KEY (cd_tiporecebimento) REFERENCES cecom.tiposrecebimento(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('parcelasreceberassinatura')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_parcelasreceberassinatura();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.parcelasreceberassinatura_codigo_seq;"));
};
