exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('unidadesfederacao', table => {
      table.integer('codigo').notNullable().primary(); // Alterando de bpchar(2) para integer para ser compatível com a sequência
      table.string('descricao', 100).notNullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.unidadesfederacao_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 9999
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.unidadesfederacao ALTER COLUMN codigo SET DEFAULT nextval('cecom.unidadesfederacao_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_unidadesfederacao()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.unidadesfederacao_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_unidadesfederacao
      BEFORE INSERT ON cecom.unidadesfederacao
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_unidadesfederacao();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('unidadesfederacao')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_unidadesfederacao();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.unidadesfederacao_codigo_seq;"));
};
