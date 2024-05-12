exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('itensfinanceirosassinaturas', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.integer('codigoassinante').notNullable(); // Placeholder for foreign key
      table.integer('codigoplano').notNullable(); // Placeholder for foreign key
      table.integer('codigoassinatura').notNullable(); // Placeholder for foreign key
      table.decimal('valor_parcela', 14, 2).notNullable(); // Converted 'money' to 'decimal' for compatibility
      table.timestamp('dt_vencimento', { useTz: true }).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.itensfinanceirosassinaturas_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.itensfinanceirosassinaturas ALTER COLUMN codigo SET DEFAULT nextval('cecom.itensfinanceirosassinaturas_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_itensfinanceirosassinaturas()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.itensfinanceirosassinaturas_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_itensfinanceirosassinaturas
      BEFORE INSERT ON cecom.itensfinanceirosassinaturas
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_itensfinanceirosassinaturas();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.itensfinanceirosassinaturas ADD CONSTRAINT fk_itensfinanceiro_ass_foreign FOREIGN KEY (codigoassinante, codigoplano, codigoassinatura) REFERENCES cecom.assinaturas(codigoassinante, codigoplano, codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('itensfinanceirosassinaturas')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_itensfinanceirosassinaturas();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.itensfinanceirosassinaturas_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.itensfinanceirosassinaturas DROP CONSTRAINT IF EXISTS fk_itensfinanceiro_ass_foreign;
    `));
};
