exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('locaisatendimentos', table => {
      table.integer('codigo').notNullable().primary();
      table.string('descricao', 100).notNullable();
      table.string('siglaUnidade', 10).nullable();
      table.string('endereco', 150).nullable();
      table.string('telefone', 50).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.locaisatendimentos_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.locaisatendimentos ALTER COLUMN codigo SET DEFAULT nextval('cecom.locaisatendimentos_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.set_codigo_locaisatendimento()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.locaisatendimentos_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_locaisatendimento
      BEFORE INSERT ON cecom.locaisatendimentos
      FOR EACH ROW
      EXECUTE FUNCTION cecom.set_codigo_locaisatendimento();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('locaisatendimentos')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.set_codigo_locaisatendimento();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.locaisatendimentos_codigo_seq;"));
};
